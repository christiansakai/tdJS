'use strict'
app.factory('TowerFactory', function (GameFactory) {
    class Tower {
        constructor(x, y, options) {
            //this.grid = grid;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            //this.options = options ? options : {};
            this.powerUps = [];
            this.codeSnippets = [];
            if (options) {
                if (options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.rank + ".png"));
                this.img.position.x = this.position.x * GameFactory.cellSize + .5 * GameFactory.cellSize;
                this.img.anchor.x = .5;
                this.img.anchor.y = .5;
                this.img.position.y = this.position.y * GameFactory.cellSize + .5 * GameFactory.cellSize;
                if (options.power) this.power = options.power;
                if (options.cost) this.cost = options.cost;
                GameFactory.stages["play"].addChild(this.img);
            }
        }

        addKill() {
            this.kills++;
            if (this.kills === 20) this.rank = 2;
            else if (this.kills === 60) this.rank = 3;
        }

        setImage() {

        }

        addCodeSnippet() {

        }

        countPowerUps() {
            return this.powerUps.length + this.codeSnippets.length;
        }

    }

    function createTower(x, y, type) {
        let towerConstructor = towers[type];
        let newTower;
        let currentGridNode = GameFactory.grid[y][x];
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
            super(x, y, {img: '4', power: 2});
        }
    }

    class LaserTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '6', power: 8});
        }
    }

//class LightningTower extends Tower {
//    constructor(x, y) {
//        super(x, y, {img:})
//    }
//}

    let towers = {IceTower, LaserTower};

    return {createTower};
});