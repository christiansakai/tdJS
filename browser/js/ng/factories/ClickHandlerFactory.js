app.factory('ClickHandlerFactory', function($rootScope) {
    let selectedTower = null;
    let selectedGrid = null;
    let selectedTowerRemover = () => {
        if(selectedTower) {
            selectedTower.imgContainer.removeChild(selectedTower.baseRangeCircle);
            $rootScope.$broadcast('setEditing', false);
        }
    };

    let towerClickHandler = function(mouseData) {
        selectedTowerRemover();
        $rootScope.$broadcast('towerClicked', this);
        this.imgContainer.addChildAt(this.baseRangeCircle, 0);
        selectedTower = this;
    }
    let gridClickHandler = function(mouseData) {
        if(selectedGrid) {
            selectedGrid = this;
        }
        selectedTowerRemover();
    }


    return {
        towerClickHandler,
        gridClickHandler
    }
});
