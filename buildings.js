const BUILDS_DATA = {
    1: {
        id: 'death factory',
        tier: 1,
        resource: 'armaments',
        cost: new Decimal(1000),
        upgResource: 'armaments',
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
            if (hasUpgrade(2, 12)) { p = p.times(getUpgEffect(2, 12)); }
            if (hasUpgrade(1, 21)) { p = p.times(getUpgEffect(1, 21)); }
            return p;
        },
        resourceEff: function() {
            var r = new Decimal(1);
            return r;
        },
        canAffordUpg: function(upg) {
            return player.buildings[this.tier].amount.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'factoryBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'factoryBuildRow',
        upgradesRow1ID: 'factoryUpgradesRow1',
        upgradesRow2ID: 'factoryUpgradesRow2',
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
                displayTooltip: true,
                effect: function() {
                    var b = Decimal.max(player.buildings[1].amount, 1).log10();
                    var e = new Decimal(0.5);
                    return Decimal.pow(b, e).times(2).plus(1);
                }
            },
            12: {
                title: 'Militarize',
                desc: 'Increase the base corpse multiplier of unit tiers 2 through 8 by 25%.',
                cost: new Decimal(5000),
                buttonID: 'factoryUpg12',
                displayEffect: false,
                displayTooltip: false,
                effect: function() {
                    var e = new Decimal(1.25);
                    return e;
                }
            },
            13: {
                title: 'Digitize',
                desc: 'Improve the unit multiplier formula<br>(corpse mult ^0.5 -> ^0.9)',
                cost: new Decimal(10000),
                buttonID: 'factoryUpg13',
                displayEffect: false,
                displayTooltip: false,
                effect: function() {
                    return new Decimal(1);
                }
            },
            21: {
                title: 'Part Time Jobs',
                desc: 'Armament production is boosted based on abominations.',
                cost: new Decimal(100000),
                buttonID: 'factoryUpg21',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var b = Decimal.max(player.units[2].amount, 1).log10();
                    var e = new Decimal(0.5);
                    return Decimal.pow(b, e).plus(1);
                }
            },
            22: {
                title: 'Galactic Armaments',
                desc: 'The sun eater corpse multiplier is multiplicative instead of additive when it\'s greater than 1x.',
                cost: new Decimal(250000),
                buttonID: 'factoryUpg22',
                displayEffect: false,
                displayTooltip: false,
                effect: function() {
                    return UNITS_DATA[8].corpseMult().gt(1);
                }
            },
            23: {
                title: 'Arm The Dead',
                desc: 'Corpse production is boosted based on corpses.',
                cost: new Decimal(500000),
                buttonID: 'factoryUpg23',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var b = Decimal.max(player.corpses, 1);
                    b = Decimal.pow(b.log10(), 2);
                    return b.plus(1);
                }
            },
        }
    },
    2: {
        id: 'necropolis',
        tier: 2,
        resource: 'acolytes',
        cost: new Decimal(1e5),
        upgResource: 'astral bricks',
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
            if (player.buildings[2].amount.gte(1)) { r = r.plus(player.buildings[2].amount.log10()); }
            return r;
        },
        canAffordUpg: function(upg) {
            return player.bricks.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'necropolisBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'necropolisBuildRow',
        upgradesRow1ID: 'necropolisUpgradesRow1',
        upgradesRow2ID: 'necropolisUpgradesRow2',
        upgradeBtnClass: 'necropolisUpg',
        upgradeBtnUnclick: 'unclickNecropolisUpg',
        upgradeBtnBought: 'boughtNecropolisUpg',
        upgrades: {
            11: {
                title: 'Astral Kilns',
                desc: 'Gain 20% more astral bricks for each OoM (order of magnitude) of astral bricks owned.',
                cost: new Decimal(100000),
                buttonID: 'necropolisUpg11',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var e = Decimal.floor(player.bricks.e);
                    return Decimal.pow(1.2, e);
                }
            },
            12: {
                title: 'Astral Forges',
                desc: 'Boost armament production based on astral bricks.',
                cost: new Decimal(500000),
                buttonID: 'necropolisUpg12',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10()).plus(1);
                    return e;
                }
            },
            13: {
                title: 'Astral Siege Engines',
                desc: 'Boost corpse production based on astral bricks.',
                cost: new Decimal(1000000),
                buttonID: 'necropolisUpg13',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10()).plus(1);
                    return e;
                }
            },
            21: {
                title: 'Astral Kiln Kilns',
                desc: 'Boost astral brick production based on astral bricks.',
                cost: new Decimal(1e9),
                buttonID: 'necropolisUpg21',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var b = Decimal.max(player.bricks, 1);
                    b = Decimal.pow(b.log10(), 2);
                    return b.plus(1);
                }
            },
            22: {
                title: 'Astral Time Machine',
                desc: 'Boost time essence production based on astral bricks.',
                cost: new Decimal(1e12),
                buttonID: 'necropolisUpg22',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var b = Decimal.max(player.bricks, 1);
                    b = Decimal.pow(b.log10(), 2);
                    return b.plus(1);
                }
            },
            23: {
                title: 'Astral Magnifying Glass',
                desc: 'Boost nekro-photon production based on astral bricks.',
                cost: new Decimal(1e15),
                buttonID: 'necropolisUpg23',
                displayEffect: true,
                displayTooltip: true,
                effect: function() {
                    var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10()).plus(1);
                    return e;
                }
            }
        }
    },
    3: {
        id: 'dead sun',
        tier: 3,
        resource: 'nekro-photons',
        cost: new Decimal(1e8),
        upgResource: 'nekro-photons',
        pBase: function()  {
            var b = new Decimal(2);
            return b;
        },
        pExp: function() {
            var e = 1;
            return e;
        },
        prod: function() {
            var p = Decimal.pow(this.pBase(), this.pExp());
            if (hasUpgrade(2, 23)) { p = p.times(getUpgEffect(2, 23)); }
            if (player.astralFlag) { return p; }
            else { return new Decimal(0); }
        },
        resourceEff: function() {
            var r = new Decimal(1);
            return r;
        },
        canAffordUpg: function(upg) {
            return player.buildings[3].amount.gte(this.upgrades[upg].cost);
        },
        buildingButtonID: 'sunBuild',
        buildingButtonClass: 'buildBut',
        buildingButtonUnclick: 'unclickableBuildBut',
        buildingRowID: 'sunBuildRow',
        upgradesRow1ID: 'sunUpgradesRow',
        upgradesRow2ID: 'sunUpgradesRow2',
        upgradeBtnClass: 'sunUpg',
        upgradeBtnUnclick: 'unclickSunUpg',
        upgradeBtnBought: 'boughtSunUpg',
        upgrades: {
            11: {
                title: 'Death Factory Expansion',
                desc: 'Unlock a new row of Death Factory upgrades.',
                cost: new Decimal(1000),
                buttonID: 'sunUpg11',
                displayEffect: false,
                displayTooltip: false,
                effect: function() {
                    return new Decimal(1);
                }
            },
            12: {
                title: 'Necropolis Expansion',
                desc: 'Unlock a new row of Necropolis upgrades.',
                cost: new Decimal(1000),
                buttonID: 'sunUpg12',
                displayEffect: false,
                displayTooltip: false,
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'Nekro-Time',
                desc: 'Unlock Time Upgrades (You keep this upgrade when you sacrifice.)<br>COMING SOON',
                cost: new Decimal("Infinity"),
                buttonID: 'sunUpg13',
                displayEffect: false,
                displayTooltip: false,
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
        isTimes: true,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            return c;
        },
        baseCostMult: 5,
        expCostMult: 10,
        buttonID: 'constrUpg1',
        displayEffect: true,
        effect: function() {
            return Decimal.max(1+(0.05*player.construction[this.tier]), 1);
        }
    },
    2: {
        title: 'Factory Expansion',
        desc: 'Add .02 per level to the armament gain exponent.',
        tier: 2,
        baseCost: new Decimal(250),
        isTimes: false,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            return c;
        },
        baseCostMult: 5,
        expCostMult: 10,
        buttonID: 'constrUpg2',
        displayEffect: true,
        effect: function() {
            return .02*player.construction[this.tier];
        }
    },
    3: {
        title: 'Abomination Steroids',
        desc: 'Boosts the abomination unit multiplier by 10% per level.',
        tier: 3,
        baseCost: new Decimal(500),
        isTimes: true,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            return c;
        },
        baseCostMult: 5,
        expCostMult: 10,
        buttonID: 'constrUpg3',
        displayEffect: true,
        effect: function() {
            return Decimal.max(1+(0.1*player.construction[this.tier]), 1);
        }
    },
    4: {
        title: 'World Refiner',
        desc: 'Add .02 per level to the exponent of the conquered worlds boost to corpse gain.',
        tier: 4,
        baseCost: new Decimal(1000),
        isTimes: false,
        cost: function() {
            var c = this.baseCost;
            c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
            if (player.construction[this.tier].gte(25)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(24)))); }
            return c;
        },
        baseCostMult: 10,
        expCostMult: 10,
        buttonID: 'constrUpg4',
        displayEffect: true,
        effect: function() {
            return .02*player.construction[this.tier];
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
    return BUILDS_DATA[b].canAffordUpg(u);
}

function canAffordBuilding(b) {
    return player.bricks.gte(BUILDS_DATA[b].cost);
}

function getBuildingProdPerSec(b) {
    return BUILDS_DATA[b].prod();
}

function buyBuilding(b) {
    if (canAffordBuilding(b)) {
        player.buildings[b].built = true;
        player.bricks = player.bricks.minus(BUILDS_DATA[b].cost);
    }
}

function buyBUpg(b, u) {
    if (canAffordBUpg(b, u) && !hasUpgrade(b, u)) {
        player.buildings[b].upgrades[u] = true;
        if (b==2) { player.bricks = player.bricks.minus(getUpgCost(b, u)); }
        else { player.buildings[b].amount = player.buildings[b].amount.minus(getUpgCost(b, u)); }
    }
}

function buyCUpg(c) {
    if (canAffordCUpg(c)) {
        player.bricks = player.bricks.minus(getCUpgCost(c));
        player.construction[c] = player.construction[c].plus(1);
        if (CONSTR_DATA[c].onBuy !== undefined) { CONSTR_DATA[c].onBuy() }
    }
}

function buyMaxConstr(upg) {
    while (canAffordCUpg(upg)) {
        buyCUpg(upg);
    }
    allDisplay();
}

function buyMaxAllConstr() {
    for (var i=4; i>0; i--) {
        buyMaxConstr(i);
    }
}

function resetBuildingResources() {
    if (player.astralFlag) { toggleAstral(); }
    player.bricks = new Decimal(START_PLAYER.bricks);
    for (var b in BUILDS_DATA) {
        player.buildings[b].amount = new Decimal(START_PLAYER.buildings[b].amount);
    }
}

function resetBuildings() {
    if (player.astralFlag) { toggleAstral(); }
    player.buildings = Object.assign({}, START_PLAYER.buildings);
    fixData(player.buildings, START_PLAYER.buildings);
    player.construction = Object.assign({}, START_PLAYER.construction);
    fixData(player.construction, START_PLAYER.construction);
    for (var b in BUILDS_DATA) {
        document.getElementById(BUILDS_DATA[b].buildingRowID).style.display = 'table-row';
        document.getElementById(BUILDS_DATA[b].upgradesRow1ID).style.display = 'none';
        document.getElementById(BUILDS_DATA[b].upgradesRow2ID).style.display = 'none';
    }
}

function toggleAstral() {
    if (!player.astralFlag) {
        player.astralFlag = true;
        document.getElementById('brickGainDiv').style.display = 'block';
        document.getElementById('astralToggle').className = 'astralOn';
        document.getElementById('astralText').innerHTML = 'disable';
        document.getElementById('astralNotice').style.display = 'block';
    } else {
        player.astralFlag = false;
        document.getElementById('brickGainDiv').style.display = 'none';
        document.getElementById('astralToggle').className = 'astralBut';
        document.getElementById('astralText').innerHTML = 'enable';
        document.getElementById('astralNotice').style.display = 'none';
    }
}

function buildingSingulizer(id) {
    var firstFour = id.slice(0,4);
    var gain = (id.slice(-1) == 'n');
    switch (firstFour) {
        case 'astr':
            if (gain) {
                if (getBricksPerSecond().eq(1)) { return "astral brick"; }
                else { return "astral bricks"; }
            } else {
                if (player.bricks.eq(1)) { return "astral brick"; }
                else { return "astral bricks"; }
            }
        case 'arma':
            if (gain) {
                if (BUILDS_DATA[1].prod().eq(1)) { return "armament"; }
                else { return "armaments"; }
            } else {
                if (player.buildings[1].amount.eq(1)) { return "armament"; }
                else { return "armaments"; }
            }
        case 'acol':
            if (gain) {
                if (BUILDS_DATA[2].prod().eq(1)) { return "acolyte"; }
                else { return "acolytes"; }
            } else {
                if (player.buildings[2].amount.eq(1)) { return "acolyte"; }
                else { return "acolytes"; }
            }
        case 'phot':
            if (gain) {
                if (BUILDS_DATA[3].prod().eq(1)) { return "nekro-photon"; }
                else { return "nekro-photons"; }
            } else {
                if (player.buildings[3].amount.eq(1)) { return "nekro-photon"; }
                else { return "nekro-photons"; }
            }      
        case 'bric':
            if (gain) {
                if (getBricksPerSecond().eq(1)) { return "brick"; }
                else { return "bricks"; }
            } else {
                if (player.bricks.eq(1)) { return "brick"; }
                else { return "bricks"; }
            }
    }
}