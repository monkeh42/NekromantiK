const NUM_TIMEDIMS = 4;

const TIME_DATA = {
    1: {
        single: "first time dimension",
        plural: "first time dimensions",
        baseCost: new Decimal(1),
        baseCostMult: new Decimal(10),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            return m;
        },
        tier: 1,
        buttonID: "timeBut1",
        maxID: "timeMax1",
        amountID: "timeAmount1",
        multID: "timeMult1",
        rowID: "timeRow1",
    },
    2: {
        single: "first time dimension",
        plural: "first time dimensions",
        baseCost: new Decimal(100),
        baseCostMult: new Decimal(100),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            return m;
        },
        tier: 2,
        buttonID: "timeBut2",
        maxID: "timeMax2",
        amountID: "timeAmount2",
        multID: "timeMult2",
        rowID: "timeRow2",
    },
    3: {
        single: "first time dimension",
        plural: "first time dimensions",
        baseCost: new Decimal(1000),
        baseCostMult: new Decimal(100),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            return m;
        },
        tier: 3,
        buttonID: "timeBut3",
        maxID: "timeMax3",
        amountID: "timeAmount3",
        multID: "timeMult3",
        rowID: "timeRow3",
    },
    4: {
        single: "first time dimension",
        plural: "first time dimensions",
        baseCost: new Decimal(10000),
        baseCostMult: new Decimal(1000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            return m;
        },
        tier: 4,
        buttonID: "timeBut4",
        maxID: "timeMax4",
        amountID: "timeAmount4",
        multID: "timeMult4",
        rowID: "timeRow4",
    },
}

function canAffordTime(tier) {
    return player.crystals.gte(TIME_DATA[tier].cost());
}

function buySingleTime(tier) {
    if (canAffordTime(tier)) {
        player.crystals = player.crystals.minus(TIME_DATA[tier].cost());
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(1);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(1);
        allDisplay();
    }
}

function buyMaxTime(tier) {
    if (canAffordTime(tier)) {
        var totalBought = calculateMaxTime(tier);
        player.crystals = player.crystals.minus(calculateMaxTimeCost(tier));
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(totalBought);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(totalBought);
        allDisplay();
    }
}

function calculateMaxTime(tier) {
    var count = 0;
    if (canAffordTime(tier)) {    
        var leftoverCrystals = player.crystals;
        var newCost = TIME_DATA[tier].cost();
        while (leftoverCrystals.gte(newCost)) {
            leftoverCrystals = leftoverCrystals.minus(newCost);
            newCost = newCost.times(TIME_DATA[tier].baseCostMult);
            count++;
        }
    }
    return count;
}

function calculateMaxTimeCost(tier) {
    var count = calculateMaxTime(tier);
    var total = new Decimal(0);
    if (count > 0) {
        for (var i=0; i<count; i++) {
            total = total.plus(TIME_DATA[tier].cost().times(TIME_DATA[tier].baseCostMult.pow(i)));
        }
    }
    return total;
}

function buyMaxAllTime() {
    for (var i=NUM_TIMEDIMS; i>0; i--) {
        buyMaxTime(i);
    }
}

function getTimeDimProdPerSecond(tier) {
    if (tier >= NUM_TIMEDIMS) { return new Decimal(0); }
    var p = player.timeDims[tier].amount.times(TIME_DATA[tier].mult())
    return p;
}

function getTrueTimeBuff() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.trueEssence, 1).log10());
    b = b.div(2).div(getAntiTimeNerf());
    b = Decimal.add(b, 1);
    return b;
}

function getAntiTimeBuff() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.antiEssence, 1).log10());
    b = b.div(getTrueTimeNerf());
    b = Decimal.add(b, 1);
    return b;
}

function getTrueTimeNerf() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.trueEssence, 1).log10());
    b = Decimal.sqrt(b).div(2);
    return b.plus(1);
}

function getAntiTimeNerf() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.antiEssence, 1).log10());
    b = Decimal.sqrt(b).div(2);
    return b.plus(1);
}

function canTimePrestige() {
    return player.corpses.gte(new Decimal(1e20));
}

function respecTime() {
    if (player.timeLocked) {
        if (!confirm("Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.")) return
        timePrestigeReset();
    }
}

function lockInTime() {
    player.timeLocked = true;
}

function timePrestigeReset() {
    if (player.astralFlag) { toggleAstral(); }
    clearInterval(mainLoop);
    resetUnits();
    resetBuildingResources();
    resetBuildings();
    resetSpaceCounts();
    player.trueEssence = new Decimal(START_PLAYER.trueEssence);
    player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    player.corpses = new Decimal(START_PLAYER.corpses);
    player.timeLocked = false;
    player.unlocks['unitsTab'] = Object.assign({}, START_PLAYER.unlocks['unitsTab']);
    player.unlocks['buildingsTab'] = Object.assign({}, START_PLAYER.unlocks['buildingsTab']);
    fixData(player.unlocks['unitsTab'], START_PLAYER.unlocks['unitsTab']);
    fixData(player.unlocks['buildingsTab'], START_PLAYER.unlocks['buildingsTab']);
    document.getElementById('timeSlider').removeAttribute('disabled');
    allDisplay();
    save();
    startInterval();
}

function resetSpaceCounts() {
    player.spaceResets = new Decimal(START_PLAYER.spaceResets);
    player.worlds = new Decimal(START_PLAYER.worlds);
    player.nextSpaceReset = START_PLAYER.nextSpaceReset;
    fixData(player.nextSpaceReset, START_PLAYER.nextSpaceReset);
}

function timePrestige() {
    if (canTimePrestige()) {
        if (!confirm("Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.")) return
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.totalCrystals = player.totalCrystals.plus(calculateCrystalGain());
        player.timeResets = player.timeResets.plus(1);
        player.totalTimeResets = player.totalSpaceResets.plus(1);
        timePrestigeReset();
    }
}

function calculateCrystalGain() {
    if (canTimePrestige()) {
        var div = 20;
        var ret = Decimal.pow(10, (player.corpses.e/div) - 0.45);
        return Decimal.floor(ret);
    } else {
        return new Decimal(0);
    }
}