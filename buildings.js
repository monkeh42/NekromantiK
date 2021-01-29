const START_BUILDS = {
    1: {
        id: 'death factory',
        tier: 1,
        built: false,
        resource: 'armaments',
        amount: new Decimal(0),
        cost: new Decimal(1000),
        pBase: function()  {
            var b = units[1].amount.plus(1).log10();
            return b;
        },
        pExp: function() {
            var e = 0.5;
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
                displayEffect: true,
                effect: function() {
                    var b = Decimal.max(buildings[1].amount, 1).log10();
                    var e = new Decimal(0.5);
                    return Decimal.pow(b, e);
                }
            },
            12: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'factoryUpg12',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'factoryUpg13',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            }
        }
    },
    2: {
        id: 'necropolis',
        tier: 2,
        built: false,
        resource: 'acolytes',
        amount: new Decimal(0),
        cost: new Decimal(1e1000),
        pBase: function()  {
            var b = units[1].amount.plus(1).log10();
            return b;
        },
        pExp: function() {
            var e = 0.5;
            return e;
        },
        buildingRowID: 'necropolisBuildRow',
        upgradesRowID: 'necropolisUpgradesRow',
        upgradeBtnClass: 'necropolisUpg',
        upgradeBtnUnclick: 'unclickNecropolisUpg',
        upgradeBtnBought: 'boughtNecropolisUpg',
        upgrades: {
            11: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'necropolisUpg11',
                displayEffect: true,
                effect: function() {
                    return new Decimal(1);
                }
            },
            12: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'necropolisUpg12',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'necropolisUpg13',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            }
        }
    },
    3: {
        id: 'dead sun',
        tier: 3,
        built: false,
        resource: 'necro-photons',
        amount: new Decimal(0),
        cost: new Decimal(1e1000),
        pBase: function()  {
            var b = units[1].amount.plus(1).log10();
            return b;
        },
        pExp: function() {
            var e = 0.5;
            return e;
        },
        buildingRowID: 'sunBuildRow',
        upgradesRowID: 'sunUpgradesRow',
        upgradeBtnClass: 'sunUpg',
        upgradeBtnUnclick: 'unclickSunUpg',
        upgradeBtnBought: 'boughtSunUpg',
        upgrades: {
            11: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'sunUpg11',
                displayEffect: true,
                effect: function() {
                    return new Decimal(1);
                }
            },
            12: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'sunUpg12',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'TBD',
                desc: 'perma-locked',
                cost: new Decimal(1e1000),
                bought: false,
                buttonID: 'sunUpg13',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            }
        }
    },
}

const START_CONST = {
    1: {
        title: 'Stronger Forges',
        desc: 'Increases per-zombie multiplier multiplier by 5% per level.',
        cost: new Decimal(100),
        costMult: 5,
        level: 0,
        buttonID: 'constrUpg1',
        displayEffect: true,
        onBuy: function() {
            units[1].multPer = START_UNITS[1].multPer.times(1+(0.05*this.level));
            units[1].corpseMult = START_UNITS[1].corpseMult.times(Decimal.pow(units[1].multPer, units[1].bought.minus(1)));
            units[1].prodMult = units[1].corpseMult.sqrt();
        },
        effect: function() {
            return Decimal.max(1+(0.05*this.level), 1);
        }
    },
    2: {
        title: 'TBD',
        desc: 'perma-locked',
        cost: new Decimal(1e1000),
        costMult: 10,
        level: 0,
        buttonID: 'constrUpg2',
        displayEffect: true,
        effect: function() {
            return new Decimal(1);
        }
    },
    3: {
        title: 'TBD',
        desc: 'perma-locked',
        cost: new Decimal(1e1000),
        costMult: 10,
        level: 0,
        buttonID: 'constrUpg3',
        displayEffect: true,
        effect: function() {
            return new Decimal(1);
        }
    },
    4: {
        title: 'TBD',
        desc: 'perma-locked',
        cost: new Decimal(1e1000),
        costMult: 10,
        level: 0,
        buttonID: 'constrUpg4',
        displayEffect: true,
        effect: function() {
            return new Decimal(1);
        }
    },
}

function isDisplayEffect(b, u) {
    return buildings[b].upgrades[u].displayEffect;
}

function isDisplayEffectC(c) {
    return construction[c].displayEffect;
}

function getLevel(c) {
    return construction[c].level;
}

function canAffordCUpg(c) {
    return player.bricks.gte(construction[c].cost);
}

function getCUpgName(c) {
    return construction[c].title;
}

function getCUpgDesc(c) {
    return construction[c].desc;
}

function getCUpgCost(c) {
    return construction[c].cost;
}

function getCUpgEffect(c) {
    return construction[c].effect();
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
    return buildings[b].upgrades[u].effect();
}

function canAffordBUpg(b, u) {
    return getBuildAmt(b).gte(getUpgCost(b, u));
}

function canAffordBuilding(b) {
    return player.bricks.gte(buildings[b].cost);
}

function getBuildingProdPerSec(b) {
    return Decimal.pow(buildings[b].pBase(), buildings[b].pExp());
}

var astralFlag = false;

function buyBuilding(b) {
    if (canAffordBuilding(b)) {
        buildings[b].built = true;
        player.bricks = player.bricks.minus(buildings[b].cost);
    }
}

function buyBUpg(b, u) {
    if (canAffordBUpg(b, u) && !hasUpgrade(b, u)) {
        buildings[b].upgrades[u].bought = true;
        buildings[b].amount = buildings[b].amount.minus(getUpgCost(b, u));
    }
}

function buyCUpg(c) {
    if (canAffordCUpg(c)) {
        construction[c].bought = true;
        player.bricks = player.bricks.minus(getCUpgCost(c));
        construction[c].level += 1;
        construction[c].cost = construction[c].cost.times(construction[c].costMult);
        if (construction[c].onBuy !== undefined) { construction[c].onBuy() }
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
        document.getElementById('astralNotice').style.display = 'block';
    } else {
        astralFlag = false;
        document.getElementById('brickGainDiv').style.display = 'none';
        document.getElementById('astralToggle').className = 'astralBut';
        document.getElementById('astralText').innerHTML = 'enable';
        document.getElementById('astralNotice').style.display = 'none';
    }
}