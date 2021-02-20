//misc info functions

function getResourceEff(b) {
    return BUILDS_DATA[b].resourceEff();
}

function getDisplaySymbol(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayEffect[1];
}

function isDisplayEffect(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayEffect;
}

function isDisplayTooltip(b, u) {
    return BUILDS_DATA[b].upgrades[u].displayTooltip;
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
    return BUILDS_DATA[b].upgrades[u].desc();
}

function getUpgCost(b, u) {
    return BUILDS_DATA[b].upgrades[u].cost;
}

function getUpgEffect(b, u) {
    return BUILDS_DATA[b].upgrades[u].effect();
}

function canAffordBUpg(b, u) {
    return BUILDS_DATA[b].canAffordUpg(u) && !hasUpgrade(b, u);
}

function canAffordBuilding(b) {
    return player.bricks.gte(BUILDS_DATA[b].cost);
}

function getBuildingProdPerSec(b) {
    return BUILDS_DATA[b].prod();
}

//production/calculation

function getBricksPerSecond() {
    var b = getCorpsesPerSecond().pow(player.brickGainExp);
    if (isBuilt(2)) { b = b.times(getResourceEff(2)) }
    if (hasUpgrade(2, 11)) { b = b.times(getUpgEffect(2, 11)); }
    if (hasUpgrade(2, 21)) { b = b.times(getUpgEffect(2, 21)); }
    return b;
}

//buy functions

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
        remBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnClass);
        addBUpgClass(b, u, BUILDS_DATA[b].upgradeBtnBought);
        if (BUILDS_DATA[b].upgrades[u].onBuy !== undefined) { BUILDS_DATA[b].upgrades[u].onBuy() }
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
}

function buyMaxAllConstr() {
    for (var i=4; i>0; i--) {
        buyMaxConstr(i);
    }
}

//prestige related

function toggleAstral() {
    if (player.unlocks['buildingsTab']['mainTab']) {
        player.astralFlag = !player.astralFlag;
        toggleAstralDisplay();
    }
    if (player.astralFlag) { player.thisSacStats.hasGoneAstral = true; }
}

function resetBuildingResources(sacrifice=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (!hasAchievement(15)) { player.bricks = new Decimal(START_PLAYER.bricks); }
    else if (sacrifice) { player.bricks = new Decimal(getAchievementEffect(15)); } 
    for (var b in BUILDS_DATA) {
        player.buildings[b].amount = new Decimal(START_PLAYER.buildings[b].amount);
    }
}

function resetBuildings() {
    if (player.astralFlag) { toggleAstral(); }
    var tempSun = {};
    var tempSunUnlock = { 'sun': false, 'sunRow2': false };
    tempSunUnlock['sun'] = player.unlocks['buildingsTab']['sun'];
    tempSunUnlock['sunRow2'] = player.unlocks['buildingsTab']['sunRow2'];
    copyData(tempSun, player.buildings[3]);
    copyData(player.buildings, START_PLAYER.buildings);
    copyData(player.construction, START_PLAYER.construction);
    lockTab('buildingsTab');
    
    for (var b in BUILDS_DATA) {
        displayData.push(['setProp', BUILDS_DATA[b].buildingRowID, 'display', 'table-row']);
        displayData.push(['setProp', BUILDS_DATA[b].buildingHeaderID, 'display', 'none']);
        displayData.push(['setProp', BUILDS_DATA[b].upgradesRow1ID, 'display', 'none']);
        displayData.push(['setProp', BUILDS_DATA[b].upgradesRow2ID, 'display', 'none']);
    }
    if (hasTUpgrade(14)) {
        copyData(player.buildings[3], tempSun);
        if (tempSunUnlock['sun']) { unlockElements('buildingsTab', 'sun') }
        if (tempSunUnlock['sunRow2']) { unlockElements('buildingsTab', 'sunRow2') }
    }
    else { player.buildings[3].upgrades[33] = tempSun.upgrades[33]; }
    player.buildings[3].amount = new Decimal(0);
}

//data

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
            if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
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
        buildingHeaderID: 'factoryHeaderRow',
        upgradesRow1ID: 'factoryUpgradesRow1',
        upgradesRow2ID: 'factoryUpgradesRow2',
        upgradeBtnClass: 'factoryUpg',
        upgradeBtnUnclick: 'unclickFactoryUpg',
        upgradeBtnBought: 'boughtFactoryUpg',
        upgrades: {
            11: {
                title: 'Industrialize',
                desc: function() { return 'Arm your zombies, giving a boost to their corpse multiplier based on armaments.'; },
                cost: new Decimal(1000),
                buttonID: 'factoryUpg11',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + 2*log(x)' : '1 + 2*sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = new Decimal(Decimal.max(player.buildings[1].amount, 1).log10());
                        return b.times(2).plus(1);
                    } else {
                        var b = Decimal.max(player.buildings[1].amount, 1).log10();
                        var e = new Decimal(0.5);
                        return Decimal.pow(b, e).times(2).plus(1);
                    }
                }
            },
            12: {
                title: 'Militarize',
                desc: function() { return 'Increase the base corpse multiplier of unit tiers 2 through 8 by 25%.'; },
                cost: new Decimal(5000),
                buttonID: 'factoryUpg12',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    var e = new Decimal(1.25);
                    return e;
                }
            },
            13: {
                title: 'Digitize',
                desc: function() { return 'Each unit tier\'s base unit multiplier is equal to its corpse multiplier, instead of the square root.'; },
                cost: new Decimal(10000),
                buttonID: 'factoryUpg13',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            21: {
                title: 'Part Time Jobs',
                desc: function() { return 'Armament production is boosted based on abominations.'; },
                cost: new Decimal(100000),
                buttonID: 'factoryUpg21',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = new Decimal(Decimal.max(player.units[2].amount, 1).log10());
                        return b.plus(1);
                    } else {
                        var b = Decimal.max(player.units[2].amount, 1).log10();
                        var e = new Decimal(0.5);
                        return Decimal.pow(b, e).plus(1);
                    }
                }
            },
            22: {
                title: 'Galactic Armaments',
                desc: function() { return 'The sun eater corpse multiplier is multiplicative instead of additive when it\'s greater than 1x.'; },
                cost: new Decimal(250000),
                buttonID: 'factoryUpg22',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return UNITS_DATA[8].corpseMult().gt(1);
                }
            },
            23: {
                title: 'Arm The Dead',
                desc: function() { return 'Corpse production is boosted based on corpses.'; },
                cost: new Decimal(500000),
                buttonID: 'factoryUpg23',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = Decimal.max(player.corpses, 1);
                        b = Decimal.pow(b.log10(), 4);
                        return b.plus(1);
                    } else {
                        var b = Decimal.max(player.corpses, 1);
                        b = Decimal.pow(b.log10(), 2);
                        return b.plus(1);
                    }
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
            if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
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
        buildingHeaderID: 'necropolisHeaderRow',
        upgradesRow1ID: 'necropolisUpgradesRow1',
        upgradesRow2ID: 'necropolisUpgradesRow2',
        upgradeBtnClass: 'necropolisUpg',
        upgradeBtnUnclick: 'unclickNecropolisUpg',
        upgradeBtnBought: 'boughtNecropolisUpg',
        upgrades: {
            11: {
                title: 'Astral Kilns',
                desc: function() { return 'Gain 20% more astral bricks for each OoM (order of magnitude) of astral bricks owned.'; },
                cost: new Decimal(100000),
                buttonID: 'necropolisUpg11',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return '1.2^x'; },
                effect: function() {
                    var e = Decimal.floor(player.bricks.e);
                    return Decimal.pow(1.2, e);
                }
            },
            12: {
                title: 'Astral Forges',
                desc: function() { return 'Boost armament production based on astral bricks.'; },
                cost: new Decimal(500000),
                buttonID: 'necropolisUpg12',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var e = new Decimal(Decimal.max(player.bricks, 1).log10()).plus(1);
                        return e;
                    } else {
                        var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10()).plus(1);
                        return e;
                    }
                }
            },
            13: {
                title: 'Astral Siege Engines',
                desc: function() { return 'Boost corpse production based on astral bricks.'; },
                cost: new Decimal(1000000),
                buttonID: 'necropolisUpg13',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var e = new Decimal(Decimal.max(player.bricks, 1).log10()).plus(1);
                        return e;
                    } else {
                        var e = Decimal.sqrt(Decimal.max(player.bricks, 1).log10()).plus(1);
                        return e;
                    }
                }
            },
            21: {
                title: 'Astral Kiln Kilns',
                desc: function() { return 'Boost astral brick production based on astral bricks.'; },
                cost: new Decimal(1e9),
                buttonID: 'necropolisUpg21',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 4);
                        return b.plus(1);
                    } else {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 2);
                        return b.plus(1);
                    }
                }
            },
            22: {
                title: 'Astral Time Machine',
                desc: function() { return 'Boost time essence production based on astral bricks.'; },
                cost: new Decimal(1e12),
                buttonID: 'necropolisUpg22',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 4);
                        return b.plus(1);
                    } else {
                        var b = Decimal.max(player.bricks, 1);
                        b = Decimal.pow(b.log10(), 2);
                        return b.plus(1);
                    }
                }
            },
            23: {
                title: 'Astral Magnifying Glass',
                desc: function() { return 'Boost nekro-photon production based on astral bricks.'; },
                cost: new Decimal(1e15),
                buttonID: 'necropolisUpg23',
                displayEffect: true,
                displayTooltip: true,
                displayFormula: function() { return hasUpgrade(3, 21) ? '1 + (log(x)^2)/4' : '1 + log(x)/4'; },
                effect: function() {
                    if (hasUpgrade(3, 21)) {
                        var e = Decimal.div(Decimal.pow(Decimal.max(player.bricks, 1).log10(), 2), 4).plus(1);
                        return e;
                    } else {
                        var e = Decimal.div(Decimal.max(player.bricks, 1).log10(), 4).plus(1);
                        return e;
                    }
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
            if (hasAchievement(25)) { p = p.times(getAchievementEffect(25)) }
            if (hasUpgrade(2, 23)) { p = p.times(getUpgEffect(2, 23)); }
            if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
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
        buildingHeaderID: 'sunHeaderRow',
        upgradesRow1ID: 'sunUpgradesRow',
        upgradesRow2ID: 'sunUpgradesRow2',
        upgradeBtnClass: 'sunUpg',
        upgradeBtnUnclick: 'unclickSunUpg',
        upgradeBtnBought: 'boughtSunUpg',
        upgrades: {
            11: {
                title: 'Death Factory Expansion',
                desc: function() { return 'Unlock a new row of Death Factory upgrades.'; },
                cost: new Decimal(1000),
                buttonID: 'sunUpg11',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            12: {
                title: 'Necropolis Expansion',
                desc: function() { return 'Unlock a new row of Necropolis upgrades.'; },
                cost: new Decimal(1000),
                buttonID: 'sunUpg12',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            13: {
                title: 'Nekro-Time',
                desc: function() { return 'Unlock time upgrades.<br>(This upgrade is never reset on sacrifice.)'; },
                cost: new Decimal(10000),
                buttonID: 'sunUpg13',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
            21: {
                title: 'Solar Flares',
                desc: function() { return 'All building upgrade formulas based on log(x) are now based on log(x)^2.'; },
                cost: new Decimal(100000),
                buttonID: 'sunUpg21',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                onBuy: function() {
                    loadStyles();
                },
                effect: function() {
                    return new Decimal(1);
                }
            },
            22: {
                title: 'Menagerie of Worlds',
                desc: function() { return `Unlock advanced sacrifice autobuyer options, and raise the sun eater base cost multiplier to ^0.67${hasAchievement(35) ? ' (0.333 after Galactic Angst).' : '.'}`; },
                cost: new Decimal(2500000),
                buttonID: 'sunUpg22',
                displayEffect: false,
                displayTooltip: true,
                displayFormula: function() { return hasAchievement(35) ? '(1e15x -> 1e5x)' : '(1e15x -> 1e10x)' },
                effect: function() {
                    if (hasAchievement(35)) { return 0.333; }
                    else { return 0.67; }
                }
            },
            23: {
                title: 'Cosmogenesis',
                desc: 'Unlock <strong>Depleted Galaxies</strong>.<br>(COMING SOON)',
                cost: new Decimal("Infinity"),
                buttonID: 'sunUpg23',
                displayEffect: false,
                displayTooltip: false,
                displayFormula: function() { return ''; },
                effect: function() {
                    return new Decimal(1);
                }
            },
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
        title: 'Abominable Steroids',
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
        desc: 'Add .02 per level to the exponent of the exterminated worlds boost to corpse gain.',
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