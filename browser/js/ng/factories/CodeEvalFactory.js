app.factory('CodeEvalFactory', function() {
    let assignObjForContext = function(obj) {
        let keys = Object.keys(obj);
        console.log('keys' , keys);
        let newObj = {};
        for(let i = 0; i < keys.length; i++) {
            newObj[keys[i]] = {};
            obj[keys[i]].forEach(el => {
                if(el.purchased) {
                    newObj[keys[i]][el.name] = el.functionToRun;
                }
            })
        }
        return newObj;
    };

    let bindObjToContext = function(obj, context) {
        let outerKeys = Object.keys(obj);
        let innerKeys;
        //console.log('newKeys', outerKeys);
        for(let i = 0; i < outerKeys.length; i++) {
            console.log('innerKey', Object.keys(obj[outerKeys[i]]));
            innerKeys = Object.keys(obj[outerKeys[i]]);
            for(let j = 0; j < innerKeys.length; j++) {
                //console.log('obj', obj);
                if(typeof obj[outerKeys[i]][innerKeys[j]] === 'function') {
                    obj[outerKeys[i]][innerKeys[j]] =  obj[outerKeys[i]][innerKeys[j]].bind(context);
                }
            }
        }
    };

    let evalSnippet = function(tower) {
        if(!tower.codeSnippet) return;
        let funcStr = tower.codeSnippet.replace(/^function\s*\((\w+,\s*)*\w*\)\s*\{/, '').replace(/\}$/, '');
        let newFunc = new Function(funcStr);
        //console.log(newFunc);
        let objProvided = assignObjForContext(tower.mods);
        objProvided.surroundings.getCurrentTarget = tower.getCurrentTarget;
        objProvided.surroundings.setTarget = tower.setTargetBasedOnIndex;
        //console.log('objProvided', objProvided);
        bindObjToContext(objProvided, tower);
        tower.towerControlFunction = () => {
            console.log('in the tower control function');
            return newFunc.call(objProvided);
        };
    };

    return {
        evalSnippet
    }
})
