const BUILDS_DATA = {
    1: {
        id: 'death factory',
        tier: 1,
        resource: 'armaments',
        cost: new Decimal(1000),
        pBase: function()  {
            var b = player.units[1].amount.plus(1).log10();
            return b;
        },
        pExp: function() {
            var e = new Decimal(0.5);
            e = e.plus(getCUpgEffect(2));
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            return p;
        },
        resourceEff: function() {
            var r = new Decimal(1);
            return r;
        },
        buildingButtonID: 'factoryBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
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
                buttonID: 'factoryUpg11',
                displayEffect: true,
                effect: function() {
                    var b = Decimal.max(player.buildings[1].amount, 1).log10();
                    var e = new Decimal(0.5);
                    return Decimal.max(Decimal.pow(b, e), 1);
                }
            },
            12: {
                title: 'Militarize',
                desc: 'Increase the base corpse multiplier of unit tiers 2 through 8 by 25%.',
                cost: new Decimal(5000),
                buttonID: 'factoryUpg12',
                displayEffect: false,
                effect: function() {
                    var e = new Decimal(1.25);
                    return e;
                }
            },
            13: {
                title: 'Digitize',
                desc: 'Raise the Sun Eater corpse multiplier to the 1.5 power.',
                cost: new Decimal(1e6),
                buttonID: 'factoryUpg13',
                displayEffect: false,
                effect: function() {
                    var e = new Decimal(1.5);
                    return e;
                }
            }
        }
    },
    2: {
        id: 'necropolis',
        tier: 2,
        resource: 'acolytes',
        cost: new Decimal(1e5),
        pBase: function()  {
            var b = player.units[8].amount;
            return b;
        },
        pExp: function() {
            var e = 0.2;
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            return p;
        },
        resourceEff: function() {
            var r = new Decimal(1);
            if (player.buildings[2].amount.gt(0)) { r = r.plus(player.buildings[2].amount.log10()); }
            return r;
        },
        buildingButtonID: 'necropolisBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
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
        resource: 'necro-photons',
        cost: new Decimal(1e1000),
        pBase: function()  {
            var b = player.units[1].amount.plus(1).log10();
            return b;
        },
        pExp: function() {
            var e = 0.5;
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            return p;
        },
        resourceEff: function() {
            var r = new Decimal(1);
            return r;
        },
        buildingButtonID: 'sunBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
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
                buttonID: 'sunUpg13',
                displayEffect: false,
                effect: function() {
                    return new Decimal(1);
                }
            }
        }
    },
}

const CONSTR_DATA = {
    1: {
        title: 'Stronger Forges',
        desc: 'Increases the base corpse multiplier of zombies by 5% per level.',
        tier: 1,
        baseCost: new Decimal(100),
        cost: function() {
            var c = this.baseCost;
            return c.times(Decimal.pow(this.costMult, player.construction[this.tier]));
        },
        costMult: 5,
        buttonID: 'constrUpg1',
        displayEffect: true,
        effect: function() {
            return Decimal.max(1+(0.05*player.construction[this.tier]), 1);
        }
    },
    2: {
        title: 'Factory Expansion',
        desc: 'Add .02 to the armament gain exponent per level.',
        tier: 2,
        baseCost: new Decimal(500),
        cost: function() {
            var c = this.baseCost;
            return c.times(Decimal.pow(this.costMult, player.construction[this.tier]));
        },
        costMult: 10,
        buttonID: 'constrUpg2',
        displayEffect: true,
        effect: function() {
            return .02*player.construction[this.tier];
        }
    },
    3: {
        title: 'TBD',
        desc: 'perma-locked',
        tier: 3,
        baseCost: new Decimal(1e1000),
        cost: function() {
            var c = this.baseCost;
            return c.times(Decimal.pow(this.costMult, player.construction[this.tier]));
        },
        costMult: 10,
        buttonID: 'constrUpg3',
        displayEffect: true,
        effect: function() {
            return new Decimal(1);
        }
    },
    4: {
        title: 'TBD',
        desc: 'perma-locked',
        tier: 4,
        baseCost: new Decimal(1e1000),
        cost: function() {
            var c = this.baseCost;
            return c.times(Decimal.pow(this.costMult, player.construction[this.tier]));
        },
        costMult: 10,
        buttonID: 'constrUpg4',
        displayEffect: true,
        effect: function() {
            return new Decimal(1);
        }
    },
}

function getResourceEff(b) {
    return BUILDS_DATA[b].resourceEff();
}

function getDisplaySymbol(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayEffect[1];
}

function isDisplayEffect(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayEffect;
}

function isDisplayEffectC(c) {
    return CONSTR_DATA[c].displayEffect;
}

function getCLevel(c) {
    return player.construction[c];
}

function canAffordCUpg(c) {
    return player.bricks.gte(CONSTR_DATA[c].cost());
}

function getCUpgName(c) {
    return CONSTR_DATA[c].title;
}

function getCUpgDesc(c) {
    return CONSTR_DATA[c].desc;
}

function getCUpgCost(c) {
    return CONSTR_DATA[c].cost();
}

function getCUpgEffect(c) {
    return CONSTR_DATA[c].effect();
}

function isBuilt(b) {
    return player.buildings[b].built;
}

function hasUpgrade(b, u) {
    return player.buildings[b].upgrades[u];
}

function getUpgName(b, u) {
    return BUILDS_DATA[b].upgrades[u].title;
}

function getUpgDesc(b, u) {
    return BUILDS_DATA[b].upgrades[u].desc;
}

function getUpgCost(b, u) {
    return BUILDS_DATA[b].upgrades[u].cost;
}

function getUpgEffect(b, u) {
    return BUILDS_DATA[b].upgrades[u].effect();
}

function canAffordBUpg(b, u) {
    return player.buildings[b].amount.gte(getUpgCost(b, u));
}

function canAffordBuilding(b) {
    return player.bricks.gte(BUILDS_DATA[b].cost);
}

function getBuildingProdPerSec(b) {
    return BUILDS_DATA[b].prod();
}

var astralFlag = false;

function buyBuilding(b) {
    if (canAffordBuilding(b)) {
        player.buildings[b].built = true;
        player.bricks = player.bricks.minus(BUILDS_DATA[b].cost);
    }
}

function buyBUpg(b, u) {
    if (canAffordBUpg(b, u) && !hasUpgrade(b, u)) {
        player.buildings[b].upgrades[u] = true;
        player.buildings[b].amount = player.buildings[b].amount.minus(getUpgCost(b, u));
    }
}

function buyCUpg(c) {
    if (canAffordCUpg(c)) {
        player.bricks = player.bricks.minus(getCUpgCost(c));
        player.construction[c] = player.construction[c].plus(1);
        if (CONSTR_DATA[c].onBuy !== undefined) { CONSTR_DATA[c].onBuy() }
    }
}

function resetBuildingResources() {
    if (astralFlag) { toggleAstral(); }
    player.bricks = new Decimal(0);
    for (var b in BUILDS_DATA) {
        player.buildings[b].amount = new Decimal(0);
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