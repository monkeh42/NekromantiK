const START_BUILDS = {
    1: {
        id: 'death factory',
        built: false,
        cost: new Decimal(1000),
        buildingRowID: 'factoryBuildRow',
        upgradesRowID: 'factoryUpgradesRow',
    },
    2: {
        id: 'necropolis',
        built: false,
        cost: new Decimal(1000),
        buildingRowID: 'factoryBuildRow',
        upgradesRowID: 'factoryUpgradesRow',
    },
}

var astralFlag = false;

function toggleAstral() {
    if (!astralFlag) {
        astralFlag = true;
        document.getElementById('brickGainDiv').style.display = 'block';
        document.getElementById('astralToggle').className = 'astralOn';
        document.getElementById('astralText').innerHTML = 'disable';
    } else {
        astralFlag = false;
        document.getElementById('brickGainDiv').style.display = 'none';
        document.getElementById('astralToggle').className = 'astralBut';
        document.getElementById('astralText').innerHTML = 'enable';
    }
}