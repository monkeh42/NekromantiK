const START_BUILDS = {
    1: {
        id: 'death factory',
        tier: 1,
        built: false,
        resource: 'armaments',
        amount: new Decimal(0),
        cost: new Decimal(1000),
        pBase: function()  {
            var b = new Decimal(2);
            return b;
        },
        pExp: function() {
            var e = Decimal.pow(units[1].amount.log10(), 0.2);
            return e;
        },
        buildingRowID: 'factoryBuildRow',
        upgradesRowID: 'factoryUpgradesRow',
        upgradeBtnClass: 'factoryUpg',
        upgradeBtnUnclick: 'unclickFactoryUpg',
        upgradeBtnBought: 'boughtFactoryUpg',
        upgrades: {
            11: {
                title: 'Industrialize',
                desc: 'Arm your zombies, giving a boost to their corpse multiplier based on armaments.',
                cost: new Decimal(1000),
                bought: false,
                buttonID: 'factoryUpg11',
                effect: function() {
                    var b = buildings[1].amount.log10().pow(0.5);
                    var e = new Decimal(1/3);
                    return Decimal.pow(b, e);
                }
            },
            12: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'factoryUpg12',
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'TBD',
                desc: 'perma-locked',
                buttonID: 'factoryUpg13',
                cost: new Decimal(1e1000),
                bought: false,
                effect: function() {
                    return new Decimal(1);
                }
            }
        }
    },
    2: {
        id: 'necropolis',
        built: false,
        cost: new Decimal(1e1000),
        buildingRowID: 'necropolisBuildRow',
        upgradesRowID: 'necropolisUpgradesRow',
        upgradeBtnClass: 'necropolisUpg',
        upgradeBtnUnclick: 'unclickNecropolisUpg',
        upgradeBtnBought: 'boughtNecropolisUpg',
    },
}

function isBuilt(b) {
    return buildings[b].built;
}

function hasUpgrade(b, u) {
    return buildings[b].upgrades[u].bought;
}

function getBuildAmt(b) {
    return buildings[b].amount;
}

function getUpgName(b, u) {
    return buildings[b].upgrades[u].title;
}

function getUpgDesc(b, u) {
    return buildings[b].upgrades[u].desc;
}

function getUpgCost(b, u) {
    return buildings[b].upgrades[u].cost;
}

function getUpgEffect(b, u) {
    return buildings[b].upgrades[u].effect;
}

function canAffordBUpg(b, u) {
    return getBuildAmt(b).gte(getUpgCost(b, u));
}

function canAffordBuilding(b) {
    return player.bricks.gte(buildings[b].cost);
}

function getBuilingProdPerSec(b) {
    return buildings[b].pBase().pow(buildings[b].pExp());
}

var astralFlag = false;

function buyBuilding(b) {
    if (canAffordBuilding(b)) {
        buildings[b].built = true;
        player.bricks.minus(buildings[b].cost);
    }
}

function buyBUpg(b, u) {
    if (canAffordBUpg(b, u) && !hasUpgrade(b, u)) {
        buildings[b].upgrades[u].bought = true;
        player.bricks.minus(getUpgCost(b, u));
    }
}

function resetBuildingResources() {
    if (astralFlag) { toggleAstral(); }
    player.bricks = new Decimal(0);
    for (var b in buildings) {
        buildings[b].amount = new Decimal(0);
    }
}

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