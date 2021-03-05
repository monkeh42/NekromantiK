//misc info functions

function canAffordUnit(tier) {
    return player.corpses.gte(UNITS_DATA[tier].cost());
}

function canUnlock(tier) {
    return player.spaceResets.plus(5).gte(tier);
}

//production/calculation

function getCorpsesPerSecond() {
    let c = player.units[1].amount.gt(0) ? player.units[1].amount.times(getTotalCorpseMult()) : new Decimal(0);
    if (hasTUpgrade(41)) { c = c.times(getTUpgEffect(41)); }
    
    if (hasTUpgrade(42)) { c = c.times(getTUpgEffect(42)); }
    return c;
}

function getUnitProdPerSecond(tier) {
    if (tier == NUM_UNITS) { return (hasGUpgrade(2, 41)) ? new Decimal(Decimal.max(getEssenceProdPerSecond(), 1).log10()) : new Decimal(0); }
    let p = player.units[tier+1].amount;
    if (!hasGUpgrade(2, 21)) { p = p.div(tier+1); }
    return p.times(UNITS_DATA[tier+1].prodMult());
}

function getCorpseMultFromUnits() {
    var mult = new Decimal(0);
    for (var i=1; i<=NUM_UNITS; i++) {
        if ((i==8) && hasUpgrade(1, 22) && getUpgEffect(1, 22)) { mult = mult.times(UNITS_DATA[i].corpseMult()); }
        else { mult = mult.plus(UNITS_DATA[i].corpseMult()); }
    }
    return Decimal.max(mult, 1);
}

function getTotalCorpseMult() {
    var mult = getCorpseMultFromUnits();
    mult = mult.times(getWorldsBonus());
    if (player.allTimeStats.totalGalaxies.gt(0)) { mult = mult.times(getGalaxiesBonus()); }
    if (hasUpgrade(2, 13)) { mult = mult.times(getUpgEffect(2, 13)); }
    if (hasUpgrade(1, 23)) { mult = mult.times(getUpgEffect(1, 23)); }
    if (hasGUpgrade(3, 41)) { mult = mult.times(getGUpgEffect(3, 41)); }
    return Decimal.max(mult, 1);
}

function getWorldsBonus() {
    var b = new Decimal(player.worlds)
    var e = 1.5 + getCUpgEffect(4);
    var boost = Decimal.max(b.div(1.5).pow(e).plus(1), 1);
    if (hasTUpgrade(32)) { boost = boost.times(getTUpgEffect(32)); }
    return boost;
}

//buy functions

function buySingleUnit(tier) {
    if (canAffordUnit(tier)) {
        player.corpses = player.corpses.minus(UNITS_DATA[tier].cost());
        player.units[tier].amount = player.units[tier].amount.plus(1);
        player.units[tier].bought = player.units[tier].bought.plus(1);
        document.getElementById(UNITS_DATA[tier].costID).innerHTML = formatWhole(UNITS_DATA[tier].cost())
        //allDisplay();
    }
}

function buyMaxUnits(tier) {
    if (canAffordUnit(tier)) {
        var totalBought = calculateMaxUnits(tier);
        player.corpses = player.corpses.minus(calculateMaxUnitsCost(tier));
        player.units[tier].amount = player.units[tier].amount.plus(totalBought);
        player.units[tier].bought = player.units[tier].bought.plus(totalBought);
        document.getElementById(UNITS_DATA[tier].costID).innerHTML = formatWhole(UNITS_DATA[tier].cost())
        //allDisplay();
    }
}

function calculateMaxUnits(tier) {
    var count = 0;
    if (canAffordUnit(tier)) {    
        var leftoverCorpses = player.corpses;
        var newCost = UNITS_DATA[tier].cost();
        while (leftoverCorpses.gte(newCost)) {
            leftoverCorpses = leftoverCorpses.minus(newCost);
            newCost = newCost.times(UNITS_DATA[tier].baseCostMult);
            count++;
        }
    }
    return count;
}

function calculateMaxUnitsCost(tier) {
    var count = calculateMaxUnits(tier);
    var total = new Decimal(0);
    if (count > 0) {
        for (var i=0; i<count; i++) {
            total = total.plus(UNITS_DATA[tier].cost().times(UNITS_DATA[tier].baseCostMult.pow(i)));
        }
    }
    return total;
}

function buyMaxAll() {
    for (var i=NUM_UNITS; i>0; i--) {
        if (player.units[i].unlocked) {
            buyMaxUnits(i);
        }
    }
}

//prestige related

function calculateWorldsGain() {
    if (canSpacePrestige) { return hasUpgrade(4, 11) ? getUpgEffect(4, 11).plus(1) : new Decimal(1) }
    else { return new Decimal(0) }
}

function canSpacePrestige() {
    return player.units[player.nextSpaceReset[1]].bought.gte(player.nextSpaceReset[0]);
}

function spacePrestigeClick() {
    if (player.confirmations['worldPrestige']['click']) { spacePrestige(); }
    else { spacePrestigeNoConfirm(); }
}

function spacePrestigeKey() {
    if (player.confirmations['worldPrestige']['key']) { spacePrestige(); }
    else { spacePrestigeNoConfirm(); }
}

function spacePrestige() {
    if (canSpacePrestige()) {
        if (player.confirmations['worldPrestige']) {
            if (!confirm('Are you sure? This will reset ALL of your corpses, units, and astral bricks.<br>(These confirmations can be disabled in options)')) return
        }
        let worldsGain = calculateWorldsGain();
        player.spaceResets = player.spaceResets.plus(worldsGain);
        player.worlds = player.worlds.plus(worldsGain);
        if (player.worlds.gt(player.thisSacStats.bestWorlds)) { player.thisSacStats.bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.thisAscStats.bestWorlds)) { player.thisAscStats.bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.allTimeStats.bestWorlds)) { player.allTimeStats.bestWorlds = new Decimal(player.worlds); }
        player.thisSacStats.totalSpaceResets = player.thisSacStats.totalSpaceResets.plus(worldsGain);
        player.thisSacStats.totalWorlds = player.thisSacStats.totalWorlds.plus(worldsGain);
        player.thisAscStats.totalSpaceResets = player.thisAscStats.totalSpaceResets.plus(worldsGain);
        player.thisAscStats.totalWorlds = player.thisAscStats.totalWorlds.plus(worldsGain);
        player.allTimeStats.totalSpaceResets = player.allTimeStats.totalSpaceResets.plus(worldsGain);
        player.allTimeStats.totalWorlds = player.allTimeStats.totalWorlds.plus(worldsGain);
        spacePrestigeReset();
    }
}

function spacePrestigeNoConfirm() {
    if (canSpacePrestige()) {
        let worldsGain = calculateWorldsGain();
        player.spaceResets = player.spaceResets.plus(worldsGain);
        player.worlds = player.worlds.plus(worldsGain);
        if (player.worlds.gt(player.thisSacStats.bestWorlds)) { player.thisSacStats.bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.thisAscStats.bestWorlds)) { player.thisAscStats.bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.allTimeStats.bestWorlds)) { player.allTimeStats.bestWorlds = new Decimal(player.worlds); }
        player.thisSacStats.totalSpaceResets = player.thisSacStats.totalSpaceResets.plus(worldsGain);
        player.thisSacStats.totalWorlds = player.thisSacStats.totalWorlds.plus(worldsGain);
        player.thisAscStats.totalSpaceResets = player.thisAscStats.totalSpaceResets.plus(worldsGain);
        player.thisAscStats.totalWorlds = player.thisAscStats.totalWorlds.plus(worldsGain);
        player.allTimeStats.totalSpaceResets = player.allTimeStats.totalSpaceResets.plus(worldsGain);
        player.allTimeStats.totalWorlds = player.allTimeStats.totalWorlds.plus(worldsGain);
        spacePrestigeReset();
    }
}

function spacePrestigeReset() {
    if (player.astralFlag) { toggleAstral(); }
    clearInterval(mainLoop);
    if (player.nextSpaceReset[1] < NUM_UNITS) { player.nextSpaceReset[1] += 1; }
    else { player.nextSpaceReset[0] += 2; }
    resetUnits();
    resetBuildingResources();
    //unitSetup(START_PLAYER);
    if (!hasTUpgrade(44)) { player.corpses = hasAchievement(41) ? new Decimal(START_PLAYER.corpsesAch41) : new Decimal(START_PLAYER.corpses) }
    //allDisplay();
    
    save();
    loadStyles();
    startInterval();
}

function resetUnits() {
    for (var z=NUM_UNITS; z>0; z--) {
        copyData(player.units[z], START_PLAYER.units[z]);
    }
    copyData(player.units, START_PLAYER.units);
    for (var zz=2; zz<=NUM_UNITS; zz++) {
        displayData.push(['setProp', UNITS_DATA[zz].rowID, 'display', 'none']);
    }
}

//data

const UNITS_DATA = {
    1: {
        single: "zombie",
        plural: "zombies",
        baseCost: new Decimal(10),
        baseMultPer: function() {
            if (hasGUpgrade(2, 11)) { return new Decimal(2.5); }
            else { return new Decimal(1.75); }
        },
        baseCostMult: new Decimal(100),
        expCostMult: 10,
        expCostStart: 10,
        expCostStartCost: new Decimal(1e21),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer();
            m = m.times(getCUpgEffect(1));
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasUpgrade(1, 11)) m = m.times(getUpgEffect(1, 11));
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 1,
        buttonID: "zombieBut",
        maxID: "zombieMax",
        costID: "zombieCost",
        maxCostID: "zombieMaxCost",
        maxNumID: "zombieMaxNum",
        amountID: "zombieAmount",
        boughtID: "zombieBought",
        CMultID: "zombieCMult",
        UMultID: "zombieUMult",
        gainID: "zombieGain",
        multID: "zombieMult",
        rowID: "zombieRow",
    },
    2: {
        single: "abomination",
        plural: "abominations",
        baseCost: new Decimal(100),
        baseMultPer: new Decimal(2),
        baseCostMult: new Decimal(10000),
        expCostMult: 10,
        expCostStart: 7,
        expCostStartCost: new Decimal(1e30),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            m = m.times(getCUpgEffect(3));
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 2,
        buttonID: "abomBut",
        maxID: "abomMax",
        costID: "abomCost",
        maxCostID: "abomMaxCost",
        maxNumID: "abomMaxNum",
        amountID: "abomAmount",
        boughtID: "abomBought",
        CMultID: "abomCMult",
        UMultID: "abomUMult",
        gainID: "abomGain",
        multID: "abomMult",
        rowID: "abomRow",
    },
    3: {
        single: "skeleton mage",
        plural: "skeleton mages",
        baseCost: new Decimal(10000),
        baseMultPer: new Decimal(2),
        baseCostMult: new Decimal(10000),
        expCostMult: 10,
        expCostStart: 7,
        expCostStartCost: new Decimal(1e32),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 3,
        buttonID: "mageBut",
        maxID: "mageMax",
        costID: "mageCost",
        maxCostID: "mageMaxCost",
        maxNumID: "mageMaxNum",
        amountID: "mageAmount",
        boughtID: "mageBought",
        CMultID: "mageCMult",
        UMultID: "mageUMult",
        gainID: "mageGain",
        multID: "mageMult",
        rowID: "mageRow",
    },
    4: {
        single: "banshee",
        plural: "banshees",
        baseCost: new Decimal(1000000),
        baseMultPer: new Decimal(2),
        baseCostMult: new Decimal(1000000),
        expCostMult: 10,
        expCostStart: 5,
        expCostStartCost: new Decimal(1e36),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 4,
        buttonID: "bansheeBut",
        maxID: "bansheeMax",
        costID: "bansheeCost",
        maxCostID: "bansheeMaxCost",
        maxNumID: "bansheeMaxNum",
        amountID: "bansheeAmount",
        boughtID: "bansheeBought",
        CMultID: "bansheeCMult",
        UMultID: "bansheeUMult",
        gainID: "bansheeGain",
        multID: "bansheeMult",
        rowID: "bansheeRow",
    },
    5: {
        single: "lich",
        plural: "liches",
        baseCost: new Decimal(1e9),
        baseMultPer: new Decimal(2.2),
        baseCostMult: new Decimal(1e10),
        expCostMult: 10,
        expCostStart: 4,
        expCostStartCost: new Decimal(1e49),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 5,
        buttonID: "lichBut",
        maxID: "lichMax",
        costID: "lichCost",
        maxCostID: "lichMaxCost",
        maxNumID: "lichMaxNum",
        amountID: "lichAmount",
        boughtID: "lichBought",
        CMultID: "lichCMult",
        UMultID: "lichUMult",
        gainID: "lichGain",
        multID: "lichMult",
        rowID: "lichRow",
    },
    6: {
        single: "behemoth",
        plural: "behemoths",
        baseCost: new Decimal(1e13),
        baseMultPer: new Decimal(2.2),
        baseCostMult: new Decimal(1e11),
        expCostMult: 10,
        expCostStart: 4,
        expCostStartCost: new Decimal(1e58),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 6,
        buttonID: "beheBut",
        maxID: "beheMax",
        costID: "beheCost",
        maxCostID: "beheMaxCost",
        maxNumID: "beheMaxNum",
        amountID: "beheAmount",
        boughtID: "beheBought",
        CMultID: "beheCMult",
        UMultID: "beheUMult",
        gainID: "beheGain",
        multID: "beheMult",
        rowID: "beheRow",
    },
    7: {
        single: "ancient one",
        plural: "ancient ones",
        baseCost: new Decimal(1e19),
        baseMultPer: new Decimal(2.5),
        baseCostMult: new Decimal(1e12),
        expCostMult: 10,
        expCostStart: 3,
        expCostStartCost: new Decimal(1e55),
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(UNITS_DATA[this.tier+1].prodMult());
        },
        tier: 7,
        buttonID: "oneBut",
        maxID: "oneMax",
        costID: "oneCost",
        maxCostID: "oneMaxCost",
        maxNumID: "oneMaxNum",
        amountID: "oneAmount",
        boughtID: "oneBought",
        CMultID: "oneCMult",
        UMultID: "oneUMult",
        gainID: "oneGain",
        multID: "oneMult",
        rowID: "oneRow",
    },
    8: {
        single: "sun eater",
        plural: "sun eaters",
        baseCost: new Decimal(1e25),
        baseMultPer: new Decimal(2.5),
        baseCostMult: new Decimal(1e15),
        expCostMult: 10,
        expCostStart: 3,
        expCostStartCost: new Decimal(1e70),
        cost: function() {
            var c = this.baseCost;
            var m = this.baseCostMult;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            if (hasUpgrade(3, 22)) { m = Decimal.pow(m, getUpgEffect(3, 22)); }
            c = c.times(m.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        corpseMult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            return m.times(getAchievementBoost());
        },
        prodMult: function() {
            var m = this.corpseMult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m;
        },
        tier: 8,
        buttonID: "sunBut",
        maxID: "sunMax",
        costID: "sunCost",
        maxCostID: "sunMaxCost",
        maxNumID: "sunMaxNum",
        amountID: "sunAmount",
        boughtID: "sunBought",
        CMultID: "sunCMult",
        UMultID: "sunUMult",
        gainID: "sunGain",
        multID: "sunMult",
        rowID: "sunRow",
    },
}