'use strict'
app.factory('TowerFactory', function ($rootScope, EnemyFactory, ProjectileFactory, GameFactory, GridFactory, ParticleFactory) {
    var allTowers = [];

    class Tower {
        constructor(x, y, options) {
            //this.grid = grid;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            this.session = null;
            //this.options = options ? options : {};
            this.powerUps = [];
            this.codeSnippets = [];
            if (options) {
                var array = [];
                for(var i=1; i < 4; i++){
                    var img = PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + i + ".png");
                    array.push(img)
                }
                this.img = new PIXI.extras.MovieClip(array);
                // if (options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.rank + ".png"));
                this.img.position.x = this.position.x * GameFactory.cellSize + .5 * GameFactory.cellSize;
                this.img.anchor.x = .5;
                this.img.anchor.y = .5;
                this.img.animationSpeed = .1;
                
                this.img.position.y = this.position.y * GameFactory.cellSize + .5 * GameFactory.cellSize;
                if (options.power) this.power = options.power;
                if (options.cost) this.cost = options.cost;
                if (options.range) this.range = options.range;
                this.price = options.price;
                GameFactory.stages.play.addChild(this.img);
            }
            allTowers.push(this);
        }

        addKill() {
            this.kills++;
            if (this.kills === 20) this.rank = 2;
            else if (this.kills === 60) this.rank = 3;
        }

        terminate() {
          GameFactory.stages.play.removeChild(this.img);
          allTowers.splice(allTowers.indexOf(this), 1);
        }

        countPowerUps() {
            return this.powerUps.length + this.codeSnippets.length;
        }

        acquireTarget(){
            for(var i = EnemyFactory.enemies.length - 1; i >= 0; i--){
                if(this.isEnemyInRange(EnemyFactory.enemies[i])){
                    this.target = EnemyFactory.enemies[i];
                    return true;
                }
            }
            return false;
        }

        isEnemyInRange(enemy){
            return((Math.pow(enemy.position.x - this.img.position.x, 2) + Math.pow(enemy.position.y - this.img.position.y, 2) <= Math.pow(this.range, 2)));
        }
    }

    function createTower(x, y, type) {
        let towerConstructor = towers[type];
        let newTower;
        let currentGridNode = GridFactory.grid[y][x];
        if (currentGridNode.canPlaceTower) {
            newTower = new towerConstructor(x, y);
            currentGridNode.contains.tower = newTower;
            currentGridNode.canPlaceTower = false;
            return newTower;
        } else {
            console.log("Can't play");
        }
    }

    class IceTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '4', power: 2, price: 50});

            ParticleFactory.createIce(GameFactory.stages.play, function(emitter){
                this.ice = emitter;
                this.ice.updateOwnerPos(this.img.position.x, this.img.position.y);
            }.bind(this));

        }

        update(delta){
            if(this.ice) this.ice.update(delta);
            if(this.ice) this.ice.emit = true;
            this.ice.rotate(this.ice.rotation + 1);
        }
    }

    class FireTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '7', power: 5, price:50});
            this.range = 200;
            this.reloadTime = 400;
            this.reloading = false;
            $rootScope.$on('deadEnemy', function(event, deadEnemy){
                if(deadEnemy == this.target) this.target = null;
                console.log('got event', this.target, deadEnemy);
            }.bind(this));
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.HomingProjectile({x: this.img.position.x, y: this.img.position.y, speed: 4, radius: 8, enemy: enemy});
        }

        update(){
            if(!this.target){
                this.acquireTarget();
                this.img.stop();
                //this.target = EnemyFactory.enemies[0];
            }
            if(this.target){
                if(!this.reloading){
                    this.shoot(this.target);
                    this.reloading = true;
                    window.setTimeout(function(){
                        this.reloading = false;
                    }.bind(this), this.reloadTime);
                }
                if(!this.isEnemyInRange(this.target)) this.target = null;
            }
        }
    }

    class ThunderTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '5', power: 8, price: 50});
        }
    }

    class PoisonTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '6', power: 8, price: 50});
        }
    }

    let towers = {IceTower, ThunderTower, FireTower, PoisonTower};
    let prices = {"Ice": 50,"Fire": 50, "Poison": 50, "Thunder": 50 }

    var updateAll = function(delta){
        allTowers.forEach(function(tower){
            if(tower.update) tower.update(delta);
        });

        // if(ice) ice.update(delta);
        // if(ice) ice.emit = true;
    };



    return {
        createTower,
        updateAll,
        prices
    };
});
