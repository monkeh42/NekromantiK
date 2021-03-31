//misc info functions

function getResourceEff(b) {
    return DATA['b'+b.toString()].resourceEff();
}

function getUpgResourceName(b) {
    return DATA['b'+b.toString()].upgResource;
}

function getDisplaySymbol(b, u) {
    return DATA['b'+b.toString()].upgrades[u].displayEffect[1];
}

function isDisplayEffect(b, u) {
    return DATA['b'+b.toString()].upgrades[u].displayEffect;
}

function isDisplayTooltip(b, u) {
    return DATA['b'+b.toString()].upgrades[u].displayTooltip;
}

function isDisplayEffectC(c) {
    return DATA.c.upgrades[c].displayEffect;
}

function getCLevel(c) {
    return player.construction[c];
}

function canAffordCUpg(c) {
    return player.bricks.gte(DATA.c.upgrades[c].cost());
}

function getCUpgName(c) {
    return DATA.c.upgrades[c].title;
}

function getCUpgDesc(c) {
    return DATA.c.upgrades[c].desc;
}

function getCUpgCost(c) {
    return DATA.c.upgrades[c].cost();
}

function getCUpgEffect(c) {
    return DATA.c.upgrades[c].effect();
}

function getExtraLevels(c) {
    return DATA.c.upgrades[c].extraLevels();
}

function isBuilt(b) {
    return player.buildings[b].built;
}

function hasUpgrade(b, u) {
    return player.buildings[b].upgrades[u];
}

function getUpgName(b, u) {
    return DATA['b'+b.toString()].upgrades[u].title;
}

function getUpgDesc(b, u) {
    return DATA['b'+b.toString()].upgrades[u].desc();
}

function getUpgCost(b, u) {
    return DATA['b'+b.toString()].upgrades[u].cost();
}

function getUpgEffect(b, u) {
    return DATA['b'+b.toString()].upgrades[u].effect();
}

function canAffordBUpg(b, u) {
    return DATA['b'+b.toString()].canAffordUpg(u) && !hasUpgrade(b, u);
}

function canAffordBuilding(b) {
    if (b=='b1' && (isResearchActive(2))) { return false; }
    else { return player.bricks.gte(DATA[b].cost); }
}

function getBuildingProdPerSec(b) {
    return DATA['b'+b.toString()].prod();
}

//production/calculation

function getBricksPerSecond(disp=false) {
    var e = hasGUpgrade(1, 21) ? 0.3 : 0.2
    if (hasUpgrade(4, 21)) { e = new Decimal(getResourceEff(4).plus(e)) }
    var b = getCorpsesPerSecond().pow(e);
    if (player.isInResearch) { b = b.sqrt(); }
    if (isBuilt(2)) { b = b.times(getResourceEff(2)) }
    if (hasUpgrade(2, 11)) { b = b.times(getUpgEffect(2, 11)); }
    if (hasUpgrade(2, 21)) { b = b.times(getUpgEffect(2, 21)); }
    if (hasGUpgrade(3, 41)) { b = b.times(getGUpgEffect(3, 41)); }
    if (hasTUpgrade(52)) { b = b.times(getTUpgEffect(52)); }
    if (hasUpgrade(4, 23) && !player.isInResearch && player.corpses.gt("2.5e309")) { b = b.pow(1.2); }
    if (disp && player.displayRealTime) { return b.times(getRealTimeMultiplier()); }
    else { return b; }
}

//buy functions

function buyBuilding(b) {
    if (canAffordBuilding(b)) {
        player.buildings[b.slice(-1)].built = true;
        player.bricks = player.bricks.minus(DATA[b].cost);
    }
}

function buyBUpg(b, u) {
    if (canAffordBUpg(b, u) && !hasUpgrade(b, u)) {
        player.buildings[b].upgrades[u] = true;
        if (b==2) { player.bricks = player.bricks.minus(getUpgCost(b, u)); }
        else { player.buildings[b].amount = player.buildings[b].amount.minus(getUpgCost(b, u)); }
        if (DATA['b'+b.toString()].upgrades[u].onBuy !== undefined) { DATA['b'+b.toString()].upgrades[u].onBuy() }
    }
}

function buyCUpg(c) {
    if (canAffordCUpg(c)) {
        player.bricks = player.bricks.minus(getCUpgCost(c));
        player.construction[c] = player.construction[c].plus(1);
        if (DATA.c.upgrades[c].onBuy !== undefined) { DATA.c.upgrades[c].onBuy() }
    }
}

function buyMaxConstr(upg) {
    while (canAffordCUpg(upg)) {
        buyCUpg(upg);
    }
}

function buyMaxAllConstr() {
    if (!hasMilestone(1)) {
        for (var i=4; i>0; i--) {
            buyMaxConstr(i);
        }
    } else {
        for (var i=6; i>0; i--) {
            buyMaxConstr(i);
        }
    }
}

//prestige related

function getAstralNerf() {
    if (hasGUpgrade(1, 41)) { return 2; }
    else if (hasGUpgrade(1, 11)) { return 5; }
    else { return 10; }
}

function toggleAstral() {
    if (player.unlocks) {
        player.astralFlag = !player.astralFlag;
        updateShadow();
    }
    if (player.astralFlag) {
        player.stats['thisAscStats'].wentAstral = true;
        player.stats['thisSacStats'].wentAstral = true;
    }
}

function resetBuildingResources(sacrifice=false, ascension=false, startingResearch=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (!hasAchievement(15) || ascension || startingResearch) { player.bricks = new Decimal(DATA.sp.bricks); }
    else if (sacrifice) { player.bricks = new Decimal(getAchievementEffect(15)); } 
    for (let b=1; b<4; b++) {
        if (b!=3 || !hasAchievement(51)) { player.buildings[b].amount = new Decimal(DATA.sp.buildings[b].amount); }
    }
}

function resetBuildings(ascension=false, startingResearch=false) {
    if (player.astralFlag) { toggleAstral(); }
    
    if (((hasTUpgrade(24) && !ascension) || (hasAchievement(53) && !player.isInResearch))&&!startingResearch) {
        player.worlds = new Decimal(4);
        player.spaceResets = new Decimal(4);
        player.nextSpaceReset = [3, 8];
        copyData(player.stats['thisSacStats'], DATA.sp.stats['thisSacStats']);
        if (hasGUpgrade(2, 22)) { player.worlds = player.worlds.plus(1); }
        player.stats['thisSacStats'].totalWorlds = player.worlds;
        player.stats['thisSacStats'].bestWorlds = player.worlds;
        if (ascension) {
            player.stats['thisAscStats'].totalWorlds = player.worlds;
            player.stats['thisAscStats'].bestWorlds = player.worlds;
        }
        return;
    }

    let tempSun = {};
    let tempVortex = {};
    let tempFactory = {};
    let factory = player.unlocks['factory'];
    let sun = player.unlocks['sun'];
    let sunRow2 = player.unlocks['sunRow2'];
    copyData(tempVortex, player.buildings[4]);
    copyData(tempSun, player.buildings[3]);
    copyData(tempFactory, player.buildings[1]);
    tempFactory.upgrades[21] = false;
    tempFactory.upgrades[22] = false;
    tempFactory.upgrades[23] = false;
    tempFactory.amount = new Decimal(0);
    copyBuildings();
    if (!hasMilestone(1)||startingResearch) { copyData(player.construction, DATA.sp.construction); }
    player.unlocks['buildings'] = false;
    player.unlocks['factory'] = false;
    player.unlocks['factoryRow2'] = false;
    player.unlocks['necropolis'] = false;
    player.unlocks['necropolisRow2'] = false;
    player.unlocks['sun'] = false;
    player.unlocks['sunRow2'] = false;
    player.unlocks['construction'] = false;
    player.unlocks['constructionRow2'] = false;

    if (player.isInResearch) {
        player.unlocks['buildings'] = true;;
        player.unlocks['construction'] = true;
        player.unlocks['constructionRow2'] = true;
        player.unlocks['time'] = true;
        player.unlocks['timeUpgrades'] = true;
    }
    if (hasMilestone(1)&&!startingResearch) {
        player.unlocks['construction'] = true;
        player.unlocks['constructionRow2'] = true;
    }
    if (isResearchCompleted(2)&&!startingResearch) {
        copyData(player.buildings[1], tempFactory);
        player.unlocks['factory'] = factory;
    }

    if (hasTUpgrade(14)) {
        player.worlds = new Decimal(4);
        player.spaceResets = new Decimal(4);
        player.nextSpaceReset = [3, 8];
        if (!ascension) {
            copyData(player.buildings[3].upgrades, tempSun.upgrades);
            player.buildings[3].amount = new Decimal(tempSun.amount);
            player.buildings[3].built = tempSun.built;
            player.unlocks['sun'] = sun;
            player.unlocks['sunRow2'] = sunRow2;
        }
        if (!hasAchievement(51)) { player.buildings[3].amount = new Decimal(0); }
        player.unlocks['buildings'] = true;
        player.unlocks['construction'] = true;
    } else if (hasTUpgrade(13)) {
        player.worlds = new Decimal(3);
        player.spaceResets = new Decimal(3);
        player.nextSpaceReset = [1, 8];
        player.unlocks['buildings'] = true;
        player.unlocks['construction'] = true;
    } else if (hasTUpgrade(12)) {
        player.worlds = new Decimal(2);
        player.spaceResets = new Decimal(2);
        player.nextSpaceReset = [1, 7];
        player.unlocks['buildings'] = true;
        player.unlocks['construction'] = true;
    } else if (hasTUpgrade(11)) {
        player.worlds = new Decimal(1);
        player.spaceResets = new Decimal(1);
        player.nextSpaceReset = [1, 6];
        player.unlocks['buildings'] = true;
    } else {
        player.spaceResets = new Decimal(DATA.sp.spaceResets);
        player.worlds = new Decimal(DATA.sp.worlds);
        player.nextSpaceReset = DATA.sp.nextSpaceReset.slice();
    }

    copyData(player.stats['thisSacStats'], DATA.sp.stats['thisSacStats']);
    if (hasGUpgrade(2, 22)) { player.worlds = player.worlds.plus(1); }
    player.stats['thisSacStats'].totalWorlds = player.worlds;
    player.stats['thisSacStats'].bestWorlds = player.worlds;
    if (ascension) {
        player.stats['thisAscStats'].totalWorlds = player.worlds;
        player.stats['thisAscStats'].bestWorlds = player.worlds;
    }

    if (tempSun.upgrades[13] && (!ascension || hasAchievement(43)) && !startingResearch) { player.buildings[3].upgrades[13] = tempSun.upgrades[13]; }
    if (tempSun.upgrades[23] && !startingResearch) { player.buildings[3].upgrades[23] = tempSun.upgrades[23]; }
}

function copyBuildings() {
    for (let i=1; i<4; i++) {
        copyData(player.buildings[i].upgrades, DATA.sp.buildings[i].upgrades);
        player.buildings[i].amount = new Decimal(DATA.sp.buildings[i].amount);
        player.buildings[i].built = DATA.sp.buildings[i].built;
    }
}

//data
var BUILDS_DATA = new Array(5);
BUILDS_DATA[0] = {
    notify:  false,
    indirect: false,
    layerDisplay: {
        numClass: 'brickNum',
    }
};

BUILDS_DATA[1] = {
    id: 'death factory',
    tier: 1,
    resource: 'armaments',
    displayResourceGain: true,
    gainTooltip: 'sqrt(log(x))',
    basedOn: 'zombies',
    hasExtraText: false,
    extraText: function() { return '' },
    cost: new Decimal(1000),
    upgResource: 'armaments',
    unlocked: function() { return true; },
    pBase: function()  {
        var b = player.units[1].amount.plus(1).log10();
        return b;
    },
    pExp: function() {
        var e = new Decimal(0.5);
        e = e.plus(getCUpgEffect(2));
        return e;
    },
    prod: function(disp=false) {
        var p = Decimal.pow(this.pBase(), this.pExp());
        if (hasUpgrade(2, 12)) { p = p.times(getUpgEffect(2, 12)); }
        if (hasUpgrade(1, 21)) { p = p.times(getUpgEffect(1, 21)); }
        if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
        if (player.isInResearch) { p = p.pow(0.9); }
        if (disp && player.displayRealTime) { return p.times(getRealTimeMultiplier()); }
        else { return p; }
    },
    resourceEff: function() {
        var r = new Decimal(1);
        return r;
    },
    canAffordUpg: function(upg) {
        return player.buildings[this.tier].amount.gte(this.upgrades[upg].cost());
    },
    canAffordBuild: function() {
        return player.bricks.gte(this.cost);
    },
    secondRowUnlocked: function() {
        return hasUpgrade(3, 11);
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
    buyUpg: function(data, id) {
        buyBUpg(data.slice(-1), id);
    },
    upgrades: {
        rows: 2,
        cols: 3,
        className: 'buildingUpg',
        11: {
            id: 11,
            tier: 1,
            title: 'Industrialize',
            desc: function() { return 'Arm your zombies, giving a boost to their corpse multiplier based on armaments.'; },
            cost: function() { return new Decimal(1000) },
            resource: 'armaments',
            isBought: function() {
                return player.buildings[1].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[1].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'factoryUpg11',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + 2*ln(x)' : '1 + 2*sqrt(ln(x))') : (hasUpgrade(3, 21) ? '1 + 2*log(x)' : '1 + 2*sqrt(log(x))') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(Decimal.max(player.buildings[1].amount, 1).ln()) : new Decimal(Decimal.max(player.buildings[1].amount, 1).log10());
                    b = b.times(2);
                } else {
                    var b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.max(player.buildings[1].amount, 1).ln() : Decimal.max(player.buildings[1].amount, 1).log10();
                    var e = new Decimal(0.5);
                    b = Decimal.pow(b, e).times(2);
                }
                if (hasGUpgrade(3, 11)) { b = b.pow(getGUpgEffect(3, 11)); }
                if (hasTUpgrade(43)) { b = b.times(getTUpgEffect(43)); }
                return b.plus(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        12: {
            id: 12,
            tier: 1,
            title: 'Militarize',
            desc: function() { return 'Increase the base corpse multiplier of unit tiers 2 through 8 by 25%.'; },
            cost: function() { return new Decimal(5000) },
            resource: 'armaments',
            isBought: function() {
                return player.buildings[1].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[1].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'factoryUpg12',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                var e = new Decimal(1.25);
                return e;
            },
            effectString: function() {
                return '';
            },
        },
        13: {
            id: 13,
            tier: 1,
            title: 'Digitize',
            desc: function() { return 'Each unit tier\'s base unit multiplier is equal to its corpse multiplier, instead of the square root.'; },
            cost: function() { return new Decimal(10000) },
            resource: 'armaments',
            isBought: function() {
                return player.buildings[1].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[1].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'factoryUpg13',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        21: {
            id: 21,
            tier: 1,
            title: 'Part Time Jobs',
            desc: function() { return 'Armament production is boosted based on abominations.'; },
            cost: function() { return new Decimal(100000) },
            resource: 'armaments',
            isBought: function() {
                return player.buildings[1].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[1].amount.gte(this.cost());
            },
            unlocked: function() {
                return DATA['b'+this.tier.toString()].secondRowUnlocked();
            },
            locked: function() { return false; },
            buttonID: 'factoryUpg21',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + ln(x)' : '1 + sqrt(ln(x))') : (hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(Decimal.max(player.units[2].amount, 1).ln()) : new Decimal(Decimal.max(player.units[2].amount, 1).log10());
                    return b.plus(1);
                } else {
                    var b = Decimal.max(player.units[2].amount, 1).log10();
                    var e = new Decimal(0.5);
                    return Decimal.pow(b, e).plus(1);
                }
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        22: {
            id: 22,
            tier: 1,
            title: 'Galactic Armaments',
            desc: function() { return 'The sun eater corpse multiplier is multiplicative instead of additive when it\'s greater than 1x.'; },
            cost: function() { return new Decimal(250000) },
            resource: 'armaments',
            isBought: function() {
                return player.buildings[1].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[1].amount.gte(this.cost());
            },
            unlocked: function() {
                return DATA['b'+this.tier.toString()].secondRowUnlocked();
            },
            locked: function() { return false; },
            buttonID: 'factoryUpg22',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        23: {
            id: 23,
            tier: 1,
            title: 'Arm The Dead',
            desc: function() { return 'Corpse production is boosted based on corpses.'; },
            cost: function() { return new Decimal(500000) },
            resource: 'armaments',
            isBought: function() {
                return player.buildings[1].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[1].amount.gte(this.cost());
            },
            unlocked: function() {
                return DATA['b'+this.tier.toString()].secondRowUnlocked();
            },
            locked: function() { return false; },
            buttonID: 'factoryUpg23',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + ln(x)^4' : '1 + ln(x)^2') : (hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var b = Decimal.max(player.corpses, 1);
                    b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.pow(b.ln(), 4) : Decimal.pow(b.log10(), 4);
                    return b.plus(1);
                } else {
                    var b = Decimal.max(player.corpses, 1);
                    b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.pow(b.ln(), 2) : Decimal.pow(b.log10(), 2);
                    return b.plus(1);
                }
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
    }
}
BUILDS_DATA[2] = {
    id: 'necropolis',
    tier: 2,
    resource: 'acolytes',
    displayResourceGain: true,
    gainTooltip: 'x^0.2',
    basedOn: 'bought sun eaters',
    hasExtraText: true,
    extraText: function() { return `your acolytes chant into the astral abyss, boosting your astral brick gain by <span style="font-weight: bold; font-size: 15pt;">${formatDefault(this.resourceEff())}x</span>` },
    cost: new Decimal(1e5),
    upgResource: 'astral bricks',
    unlocked: function() { return true; },
    pBase: function()  {
        var b = player.units[8].bought;
        return b;
    },
    pExp: function() {
        var e = 0.2;
        return e;
    },
    prod: function(disp=false) {
        var p = Decimal.pow(this.pBase(), this.pExp());
        if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
        if (hasGUpgrade(3, 31)) { p = p.pow(2); }
        if (player.isInResearch) { p = p.pow(0.9); }
        if (disp && player.displayRealTime) { return p.times(getRealTimeMultiplier()); }
        else { return p; }
    },
    resourceEff: function() {
        var r = new Decimal(1);
        if (player.buildings[2].amount.gte(1)) { r = r.plus(player.buildings[2].amount.log10()); }
        return r;
    },
    canAffordUpg: function(upg) {
        return player.bricks.gte(this.upgrades[upg].cost());
    },
    canAffordBuild: function() {
        return player.bricks.gte(this.cost);
    },
    secondRowUnlocked: function() {
        return hasUpgrade(3, 12);
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
    buyUpg: function(data, id) {
        buyBUpg(data.slice(-1), id);
    },
    upgrades: {
        rows: 2,
        cols: 3,
        className: 'buildingUpg',
        11: {
            id: 11,
            tier: 2,
            title: 'Astral Kilns',
            desc: function() { return 'Gain 20% more astral bricks for each OoM (order of magnitude) of astral bricks owned.'; },
            cost: function() { return new Decimal(100000) },
            resource: 'astral bricks',
            isBought: function() {
                return player.buildings[2].upgrades[this.id]
            },
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'necropolisUpg11',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return '1.2^x'; },
            effect: function() {
                var e = Decimal.floor(player.bricks.e);
                var b = Decimal.pow(1.2, e);
                if (hasGUpgrade(3, 21) && hasUpgrade(2, 21)) { b = b.times(getUpgEffect(2, 21)); }
                return b;
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        12: {
            id: 12,
            tier: 2,
            title: 'Astral Forges',
            desc: function() { return 'Boost armament production based on astral bricks.'; },
            cost: function() { return new Decimal(500000) },
            resource: 'astral bricks',
            isBought: function() {
                return player.buildings[2].upgrades[this.id]
            },
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'necropolisUpg12',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + ln(x)' : '1 + sqrt(ln(x))') : (hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(Decimal.max(player.bricks, 1).ln()) : new Decimal(Decimal.max(player.bricks, 1).log10());
                } else {
                    var e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.sqrt(Decimal.max(player.bricks, 1).ln()) : Decimal.sqrt(Decimal.max(player.bricks, 1).log10());
                }
                if (hasGUpgrade(3, 21) && hasUpgrade(2, 22)) { e = e.times(getUpgEffect(2, 22)); }

                return e.plus(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        13: {
            id: 13,
            tier: 2,
            title: 'Astral Siege Engines',
            desc: function() { return 'Boost corpse production based on astral bricks.'; },
            cost: function() { return new Decimal(1000000) },
            resource: 'astral bricks',
            isBought: function() {
                return player.buildings[2].upgrades[this.id]
            },
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'necropolisUpg13',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + ln(x)' : '1 + sqrt(ln(x))') : (hasUpgrade(3, 21) ? '1 + log(x)' : '1 + sqrt(log(x))') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(Decimal.max(player.bricks, 1).ln()) : new Decimal(Decimal.max(player.bricks, 1).log10());
                } else {
                    var e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.sqrt(Decimal.max(player.bricks, 1).ln()) : Decimal.sqrt(Decimal.max(player.bricks, 1).log10());
                }
                if (hasGUpgrade(3, 21) && hasUpgrade(2, 23)) { e = e.times(getUpgEffect(2, 23)); }

                return e.plus(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        21: {
            id: 21,
            tier: 2,
            title: 'Astral Kiln Kilns',
            desc: function() { return 'Boost astral brick production based on astral bricks.'; },
            cost: function() { return new Decimal(1e9) },
            resource: 'astral bricks',
            isBought: function() {
                return player.buildings[2].upgrades[this.id]
            },
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'necropolisUpg21',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + ln(x)^4' : '1 + ln(x)^2') : (hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var b = Decimal.max(player.bricks, 1);
                    b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.pow(b.ln(), 4) : Decimal.pow(b.log10(), 4);
                } else {
                    var b = Decimal.max(player.bricks, 1);
                    b = hasUpgrade ? Decimal.pow(b.ln(), 2) : Decimal.pow(b.log10(), 2);
                }

                return b.plus(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        22: {
            id: 22,
            tier: 2,
            title: 'Astral Time Machine',
            desc: function() { return 'Boost time essence production based on astral bricks.'; },
            cost: function() { return new Decimal(1e12) },
            resource: 'astral bricks',
            isBought: function() {
                return player.buildings[2].upgrades[this.id]
            },
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'necropolisUpg22',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + ln(x)^4' : '1 + ln(x)^2') : (hasUpgrade(3, 21) ? '1 + log(x)^4' : '1 + log(x)^2') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var b = Decimal.max(player.bricks, 1);
                    b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.pow(b.ln(), 4) : Decimal.pow(b.log10(), 4);
                } else {
                    var b = Decimal.max(player.bricks, 1);
                    b = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.pow(b.ln(), 2) : Decimal.pow(b.log10(), 2);
                }

                return b.plus(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        23: {
            id: 23,
            tier: 2,
            title: 'Astral Magnifying Glass',
            desc: function() { return 'Boost nekro-photon production based on astral bricks.'; },
            cost: function() { return new Decimal(1e15) },
            resource: 'astral bricks',
            isBought: function() {
                return player.buildings[2].upgrades[this.id]
            },
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'necropolisUpg23',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? (hasUpgrade(3, 21) ? '1 + (ln(x)^2)/4' : '1 + ln(x)/4') : (hasUpgrade(3, 21) ? '1 + (log(x)^2)/4' : '1 + log(x)/4') },
            effect: function() {
                if (hasUpgrade(3, 21)) {
                    var e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.div(Decimal.pow(Decimal.max(player.bricks, 1).ln(), 2), 4) : Decimal.div(Decimal.pow(Decimal.max(player.bricks, 1).log10(), 2), 4)
                } else {
                    var e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? Decimal.div(Decimal.max(player.bricks, 1).ln(), 4) : Decimal.div(Decimal.max(player.bricks, 1).log10(), 4)
                }

                return e.plus(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
    }
}
BUILDS_DATA[3] = {
    id: 'dead sun',
    tier: 3,
    resource: 'nekro-photons',
    displayResourceGain: false,
    gainTooltip: '2/sec',
    hasExtraText: true,
    extraText: function() { return 'Nekro-photon production is disabled outside of astral enslavement.' },
    cost: new Decimal(1e8),
    upgResource: 'nekro-photons',
    unlocked: function() { return true; },
    pBase: function()  {
        var b = new Decimal(2);
        return b;
    },
    pExp: function() {
        var e = 1;
        return e;
    },
    prod: function(disp=false) {
        var p = Decimal.pow(this.pBase(), this.pExp());
        if (hasAchievement(25)) { p = p.times(getAchievementEffect(25)) }
        if (hasUpgrade(2, 23)) { p = p.times(getUpgEffect(2, 23)); }
        if (hasTUpgrade(23)) { p = p.times(getTUpgEffect(23)) }
        if (player.isInResearch) { p = p.pow(0.9); }
        if (player.astralFlag) {
            if (disp && player.displayRealTime) { return p.times(getRealTimeMultiplier()); }
            else { return p; }
        }
        else { return new Decimal(0); }
    },
    resourceEff: function() {
        var r = new Decimal(1);
        return r;
    },
    canAffordUpg: function(upg) {
        return player.buildings[3].amount.gte(this.upgrades[upg].cost());
    },
    canAffordBuild: function() {
        return player.bricks.gte(this.cost);
    },
    secondRowUnlocked: function() {
        return hasTUpgrade(34);
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
    buyUpg: function(data, id) {
        buyBUpg(data.slice(-1), id);
    },
    upgrades: {
        rows: 2,
        cols: 3,
        className: 'buildingUpg',
        11: {
            id: 11,
            tier: 3,
            title: 'Death Factory Expansion',
            desc: function() { return 'Unlock a new row of Death Factory upgrades.'; },
            cost: function() { return new Decimal(1000) },
            resource: 'nekro-photons',
            isBought: function() {
                return player.buildings[3].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[3].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'sunUpg11',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        12: {
            id: 12,
            tier: 3,
            title: 'Necropolis Expansion',
            desc: function() { return 'Unlock a new row of Necropolis upgrades.'; },
            cost: function() { return new Decimal(1000) },
            resource: 'nekro-photons',
            isBought: function() {
                return player.buildings[3].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[3].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'sunUpg12',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        13: {
            id: 13,
            tier: 3,
            title: 'Nekro-Time',
            desc: function() { return 'Unlock time upgrades.<br>(This upgrade is never reset on sacrifice.)'; },
            cost: function() { return new Decimal(10000) },
            resource: 'nekro-photons',
            isBought: function() {
                return player.buildings[3].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[3].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'sunUpg13',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        21: {
            id: 21,
            tier: 3,
            title: 'Solar Flares',
            desc: function() { return 'All building upgrade formulas based on log(x) are now based on log(x)^2.'; },
            cost: function() { return new Decimal(100000) },
            resource: 'nekro-photons',
            isBought: function() {
                return player.buildings[3].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[3].amount.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'sunUpg21',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            onBuy: function() {
                if (player.astralFlag) {
                    toggleAstral();
                    //loadStyles();
                    toggleAstral();
                } //else { loadStyles(); }
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        22: {
            id: 22,
            tier: 3,
            title: 'Menagerie of Worlds',
            desc: function() { return `Unlock advanced sacrifice autobuyer options permanently, and raise the sun eater base cost multiplier to ^0.67${hasAchievement(35) ? ' (0.333 after Galactic Angst).' : '.'}`; },
            cost: function() { return new Decimal(2500000) },
            resource: 'nekro-photons',
            isBought: function() {
                return player.buildings[3].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[3].amount.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'sunUpg22',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: true,
            displayFormula: function() { return hasAchievement(35) ? '(1e15x -> 1e5x)' : '(1e15x -> 1e10x)' },
            effect: function() {
                if (hasAchievement(35)) { return 0.333; }
                else { return 0.67; }
            },
            effectString: function() {
                return '';
            },
        },
        23: {
            id: 23,
            tier: 3,
            title: 'Cosmogenesis',
            desc: function() { return 'Unlock <strong>Depleted Galaxies</strong>.<br>(This upgrade is never reset.)'; },
            cost: function() { return new Decimal(25000000) },
            resource: 'nekro-photons',
            isBought: function() {
                return player.buildings[3].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[3].amount.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'sunUpg23',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
    }
}
BUILDS_DATA[4] = {
    id: 'galactic vortex',
    tier: 4,
    resource: 'black holes',
    displayResourceGain: false,
    gainTooltip: '.001*(total_galaxies - black_holes)%/sec',
    hasExtraText: true,
    extraText: function() { return `your next black hole is <span style="font-weight: bold; font-size: 15pt;">${formatUnitRow(player.buildings[4].progress)}%</span> complete.<br>
                                    ${player.isInResearch ? 'progress is halted during research.' : 'progress is based on your total depleted galaxies minus your black holes.'}<br>
                                    your black holes add to the depleted galaxy gain exponent. currently: <span style="font-weight: bold; font-size: 15pt;">+${formatDefault2(this.resourceEff())}</span><br>
                                    the galactic vortex, black holes, and black hole production progress are never reset.`},
    cost: new Decimal(1e60),
    upgResource: 'black holes',
    unlocked: function() { return hasMilestone(5); },
    pBase: function()  {
        var b = new Decimal(.001);
        return b;
    },
    prod: function() {
        if (player.isInResearch) { return new Decimal(0); }
        else {
            var p = player.stats['allTimeStats'].totalGalaxies.minus(player.buildings[this.tier].amount).times(this.pBase());
            return Decimal.max(p, 0); 
        }
    },
    resourceEff: function() {
        if (player.isInResearch) { return new Decimal(0) }
        else { return player.buildings[this.tier].amount.gt(0) ? Decimal.max(player.buildings[this.tier].amount.log10()/10, .02) : new Decimal(0); }
    },
    canAffordUpg: function(upg) {
        return player.buildings[4].amount.gte(this.upgrades[upg].cost());
    },
    canAffordBuild: function() {
        return player.bricks.gte(this.cost);
    },
    secondRowUnlocked: function() {
        return player.unlocks['vortexRow2'];
    },
    buildingButtonID: 'vortexBuild',
    buildingButtonClass: 'buildBut',
    buildingButtonUnclick: 'unclickableBuildBut',
    buildingRowID: 'vortexBuildRow',
    buildingHeaderID: 'vortexHeaderRow',
    upgradesRow1ID: 'vortexUpgradesRow',
    upgradesRow2ID: 'vortexUpgradesRow2',
    upgradeBtnClass: 'vortexUpg',
    upgradeBtnUnclick: 'unclickVortexUpg',
    upgradeBtnBought: 'boughtVortexUpg',
    buyUpg: function(data, id) {
        buyBUpg(data.slice(-1), id);
    },
    upgrades: {
        rows: 2,
        cols: 3,
        className: 'buildingUpg',
        11: {
            id: 11,
            tier: 4,
            title: 'Parallel Universes',
            desc: function() { return 'You get extra exterminated worlds on prestige equal to your current exterminated worlds divided by 10 (rounded down).'; },
            cost: function() { return new Decimal(5) },
            resource: 'black holes',
            isBought: function() {
                return player.buildings[4].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[4].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'vortexUpg11',
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {  },
            effect: function() {
                if (player.isInResearch) { return new Decimal(0) }
                else { return Decimal.floor(player.worlds.div(10)); }
            },
            effectString: function() {
                return '+' + formatWhole(this.effect());
            },
        },
        12: {
            id: 12,
            tier: 4,
            title: 'Trickle-Down Nekronomiks',
            desc: function() { return 'The first three construction upgrades get sqrt(x) extra levels, where x is the level of the upgrade to the right (rounded down).'; },
            cost: function() { return new Decimal(25) },
            resource: 'black holes',
            isBought: function() {
                return player.buildings[4].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[4].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'vortexUpg12',
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return (player.isInResearch ? '[+0/+0/+0]' : `[+${Decimal.floor(player.construction[1].sqrt())}/+${Decimal.floor(player.construction[2].sqrt())}/+${Decimal.floor(player.construction[3].sqrt())}]`);
            },
        },
        13: {
            id: 13,
            tier: 4,
            title: 'Ultra-Solar',
            desc: function() { return `ALL upgrade formulas based on log(x) are now based on ln(x) (<span style="font-weight: 800;">Solar Flares</span> still applies to building upgrades).`; },
            cost: function() { return new Decimal(100) },
            resource: 'black holes',
            isBought: function() {
                return player.buildings[4].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[4].amount.gte(this.cost());
            },
            unlocked: function() { return true; },
            locked: function() { return false; },
            buttonID: 'vortexUpg13',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        21: {
            id: 21,
            tier: 4,
            title: 'Astral Wormhole',
            desc: function() { return 'The black hole effect also adds to the astral brick gain exponent.'; },
            cost: function() { return new Decimal(500) },
            resource: 'black holes',
            isBought: function() {
                return player.buildings[4].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[4].amount.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'vortexUpg21',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        22: {
            id: 22,
            tier: 4,
            title: 'Evil Particle Collider',
            desc: function() { return 'If you have galaxy upgrade 4.41, true and anti time essence boost each other\'s effects instead of nerfing them.'; },
            cost: function() { return new Decimal(1000) },
            resource: 'black holes',
            isBought: function() {
                return player.buildings[4].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[4].amount.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'vortexUpg22',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return '' },
            onBuy: function() {
                return;
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        23: {
            id: 23,
            tier: 4,
            title: 'Break Arbitrary',
            desc: function() { return 'Unlock the next four time dimensions, and crystal gain and brick production are raised ^1.2 while you have more than 2.5e309 corpses.'; },
            cost: function() { return new Decimal(5000) },
            resource: 'black holes',
            isBought: function() {
                return player.buildings[4].upgrades[this.id]
            },
            canAfford: function() {
                return player.buildings[4].amount.gte(this.cost());
            },
            unlocked: function() { return DATA['b'+this.tier.toString()].secondRowUnlocked(); },
            locked: function() { return false; },
            buttonID: 'vortexUpg23',
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() { return ''; },
            effect: function() {
                return new Decimal(1.2);
            },
            effectString: function() {
                return '';
            },
        },
    }
}

var CONSTR_DATA = {
    layerDisplay: {
        layerButtonClass: 'constrBut',
    },
    buyUpg: function(data, id) {
        buyCUpg(id);
    },
    upgrades: {
        className: 'constrUpg',
        rows: 2,
        cols: 4,
        1: {
            title: 'Stronger Forges',
            desc: function() { return 'Increases the base corpse multiplier of zombies by 5% per level.' },
            resource: 'astral bricks',
            tier: 1,
            baseCost: new Decimal(100),
            isTimes: true,
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            cost: function() {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
                if (player.construction[this.tier].gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(s-1)))); }
                return c;
            },
            costFuture: function(numBought) {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, numBought));
                if (numBought.gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(s-1)))); }
                return c;
            },
            baseCostMult: 5,
            expCostMult: 10,
            buttonID: 'constrUpg1',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: false,
            displayFormula: function() {
                return '';
            },
            isBought: function() {
                return false;
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            extraLevels: function() {
                let e = parseInt(DATA.c.upgrades[5].effect()[this.tier-1]);
                if (hasUpgrade(4, 12) && !player.isInResearch) { e = Decimal.floor(player.construction[this.tier+1].sqrt().plus(e)) }
                return e;
            },
            effect: function() {
                let e = Decimal.max(1+(0.05*(player.construction[this.tier].plus(this.extraLevels()))), 1);
                if (hasGUpgrade(3, 32)) { e = e.times(getGUpgEffect(3, 32)); }
                return e;
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        2: {
            title: 'Factory Expansion',
            desc: function() { return 'Add .02 per level to the armament gain exponent.' },
            resource: 'astral bricks',
            tier: 2,
            baseCost: new Decimal(250),
            isTimes: false,
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            cost: function() {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
                if (player.construction[this.tier].gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(s-1)))); }
                return c;
            },
            costFuture: function(numBought) {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, numBought));
                if (numBought.gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(s-1)))); }
                return c;
            },
            baseCostMult: 5,
            expCostMult: 10,
            buttonID: 'constrUpg2',
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {
                return '';
            },
            isBought: function() {
                return false;
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            extraLevels: function() {
                let e = parseInt(DATA.c.upgrades[5].effect()[this.tier-1]);
                if (hasUpgrade(4, 12) && !player.isInResearch) { e = Decimal.floor(player.construction[this.tier+1].sqrt().plus(e)) }
                return e;
            },
            effect: function() {
                let e = .02*(player.construction[this.tier].plus(this.extraLevels()));
                if (hasGUpgrade(3, 32)) { e = e*getGUpgEffect(3, 32); }
                return e;
            },
            effectString: function() {
                return '+' + formatDefault2(this.effect());
            },
        },
        3: {
            title: 'Abominable Steroids',
            desc: function() { return 'Boosts the abomination unit multiplier by 10% per level.' },
            resource: 'astral bricks',
            tier: 3,
            baseCost: new Decimal(500),
            isTimes: true,
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            cost: function() {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
                if (player.construction[this.tier].gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(s-1)))); }
                return c;
            },
            costFuture: function(numBought) {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, numBought));
                if (numBought.gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(s-1)))); }
                return c;
            },
            baseCostMult: 5,
            expCostMult: 10,
            buttonID: 'constrUpg3',
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: false,
            displayFormula: function() {
                return '';
            },
            isBought: function() {
                return false;
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            extraLevels: function() {
                let e = parseInt(DATA.c.upgrades[5].effect()[this.tier-1]);
                if (hasUpgrade(4, 12) && !player.isInResearch) { e = Decimal.floor(player.construction[this.tier+1].sqrt().plus(e)) }
                return e;
            },
            effect: function() {
                let e = Decimal.max(1+(0.1*(player.construction[this.tier].plus(this.extraLevels()))), 1);
                if (hasGUpgrade(3, 32)) { e = e.times(getGUpgEffect(3, 32)); }
                return e;
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        4: {
            title: 'World Refiner',
            desc: function() { return 'Add .02 per level to the exponent of the exterminated worlds boost to corpse gain.' },
            resource: 'astral bricks',
            tier: 4,
            baseCost: new Decimal(1000),
            isTimes: false,
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            cost: function() {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
                if (player.construction[this.tier].gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(s-1)))); }
                return c;
            },
            costFuture: function(numBought) {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, numBought));
                if (numBought.gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(s-1)))); }
                return c;
            },
            baseCostMult: 10,
            expCostMult: 10,
            buttonID: 'constrUpg4',
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {
                return '';
            },
            isBought: function() {
                return false;
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            extraLevels: function() {
                let e = parseInt(DATA.c.upgrades[5].effect()[this.tier-1]);
                return e;
            },
            effect: function() {
                let e = .02*(player.construction[this.tier].plus(this.extraLevels()));
                if (hasGUpgrade(3, 32)) { e = e*getGUpgEffect(3, 32); }
                return e;
            },
            effectString: function() {
                return '+' + formatDefault2(this.effect());
            },
        },
        5: {
            title: 'Putrid Renovations',
            desc: function() { return 'Starting at level 1, the first four upgrades get one extra level for every [1/2/3/4] levels.' },
            resource: 'astral bricks',
            tier: 5,
            baseCost: new Decimal(1e40),
            isTimes: true,
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            cost: function() {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
                if (player.construction[this.tier].gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(s-1)))); }
                return c;
            },
            costFuture: function(numBought) {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, numBought));
                if (numBought.gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(s-1)))); }
                return c;
            },
            baseCostMult: 1000,
            expCostMult: 10,
            buttonID: 'constrUpg5',
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {
                return '';
            },
            isBought: function() {
                return false;
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            extraLevels: function() { return 0; },
            effect: function() {
                let k = player.construction[this.tier];
                if (k==0) { return [0, 0, 0, 0]; }
                let e = new Array(4);
                for (let i=0; i<4; i++) { e[i] = Math.floor((k-1)/(i+1))+1}
                return e;
            },
            effectString: function() {
                return `[+${formatWhole(player.construction[5])}/+${formatWhole(player.construction[5].gt(0) ? Decimal.floor(player.construction[5].minus(1).div(2).plus(1)) : '0')}/+${formatWhole(player.construction[5].gt(0) ? Decimal.floor(player.construction[5].minus(1).div(3).plus(1)) : '0')}/+${formatWhole(player.construction[5].gt(0) ? Decimal.floor(player.construction[5].minus(1).div(4).plus(1)) : '0')}]`;
            },
        },
        6: {
            title: 'Siege Nebulas',
            desc: function() { return 'You get sqrt(x) extra galaxies on ascension (rounded down), where x = this upgrade\'s level.' },
            resource: 'astral bricks',
            tier: 6,
            baseCost: new Decimal(1e50),
            isTimes: false,
            canAfford: function() {
                return player.bricks.gte(this.cost());
            },
            cost: function() {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, player.construction[this.tier]));
                if (player.construction[this.tier].gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.construction[this.tier].minus(s-1)))); }
                return c;
            },
            costFuture: function(numBought) {
                var c = this.baseCost;
                var s = isResearchActive(3) ? 1 : 25
                if (hasGUpgrade(3, 22)) { s = 2*s; }
                if (isResearchCompleted(3)) { s += 10; }
                c = c.times(Decimal.pow(this.baseCostMult, numBought));
                if (numBought.gte(s)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(s-1)))); }
                return c;
            },
            baseCostMult: new Decimal(1e6),
            expCostMult: 10,
            buttonID: 'constrUpg6',
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {
                return '';
            },
            isBought: function() {
                return false;
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            extraLevels: function() { return 0; },
            effect: function() {
                let g = Math.floor(player.construction[this.tier].sqrt());
                return g;
            },
            effectString: function() {
                return '+' + formatDefault2(this.effect());
            },
        },
    }
}