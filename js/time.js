//misc info functions

function hasPrereqTUpg(t) {
    if (t==11 || t==21 || t==31 || t==41 || t==51) { return true; }
    else { return player.timeUpgs[TIME_DATA.upgrades[t].preReq]; }
}

function isDisplayEffectT(t) {
    return TIME_DATA.upgrades[t].displayEffect;
}

function isDisplayTooltipT(t) {
    return TIME_DATA.upgrades[t].displayTooltip;
}

function hasTUpgrade(t) {
    return player.timeUpgs[t];
}

function getTUpgName(t) {
    return TIME_DATA.upgrades[t].title;
}

function getTUpgDesc(t) {
    return TIME_DATA.upgrades[t].desc;
}

function getTUpgCost(t) {
    return TIME_DATA.upgrades[t].cost;
}

function getTUpgEffect(t) {
    return TIME_DATA.upgrades[t].effect();
}

function canAffordTUpg(t) {
    return (player.crystals.gte(getTUpgCost(t)) && hasPrereqTUpg(t) && !hasTUpgrade(t));
}

function canAffordTime(tier) {
    return player.crystals.gte(TIME_DATA[tier].cost());
}

//production/calculation

function calculateCrystalGain() {
    if (canTimePrestige()) {
        var div = isResearchCompleted(5) ? 15 : 20
        var ret = Decimal.floor(Decimal.pow(10, (player.thisSacStats.bestCorpses.e/div) - 0.65));
        if (hasTUpgrade(21)) { ret = ret.times(2); }
        if (hasTUpgrade(33)) { ret = ret.times(getTUpgEffect(33)); }
        if (hasGUpgrade(4, 21)) { ret = ret.times(getGUpgEffect(4, 21)); }
        if (hasTUpgrade(53)) { ret = ret.times(getTUpgEffect(53)); }
        if (hasUpgrade(4, 23) && !player.isInResearch && player.corpses.gt("2.5e309")) { ret = ret.pow(1.2); }
        if (isResearchCompleted(6)) { ret = ret.pow(getTheoremBoostC()); }
        return ret;
    } else {
        return new Decimal(0);
    }
}

function calculateCrystalsPerMin() {
    let gain = calculateCrystalGain();
    let time = (new Date() - player.pastRuns.lastRun.timeSacrificed)/60000;

    return gain.div(time);
}

function isAutoSacTriggered() {
    if (!canTimePrestige()) { return false; }
    switch (player.autobuyers[9].type) {
        case 'atx':
            return (calculateCrystalGain().gte(player.autobuyers[9].amount));

        case 'xtimes':
            return calculateCrystalGain().gte(player.pastRuns.lastRun.crystalGain.times(player.autobuyers[9].amount));

        case 'afterx':
            return player.autobuyers[9].amount.lt((new Date()-player.pastRuns.lastRun.timeSacrificed)/1000);

        default: return false;
    }
}

function getTimeDimProdPerSecond(tier) {
    if (tier > NUM_TIMEDIMS) { return new Decimal(0); }
    var p = player.timeDims[tier].amount.times(TIME_DATA[tier].mult());
    if (player.isInResearch) { p = p.pow(0.9); }
    return p;
}

function getEssenceProdPerSecond() {
    var p = player.timeDims[1].amount.times(TIME_DATA[1].mult());
    if (hasUpgrade(2, 22)) { p = p.times(getUpgEffect(2, 22)); }
    if (hasGUpgrade(4, 11)) { p = p.times(getGUpgEffect(4, 11)); }
    if (player.isInResearch) { p = p.pow(0.9); }
    return p;
}

function getTrueTimeBuff() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.trueEssence, 1).log10());
    if (hasGUpgrade(4, 31)) { b = b.pow(getGUpgEffect(4, 31)); }
    if (hasGUpgrade(4, 41) && hasUpgrade(4, 22) && !player.isInResearch) { b = b.times(getAntiTimeNerf()).times(hasAchievement(71) ? 2 : 1); }
    else { b = b.div(getAntiTimeNerf()).times(hasAchievement(71) ? 2 : 1); }
    b = Decimal.add(b, 1);
    return b;
}

function getAntiTimeBuff() {
    if (!player.timeLocked || isResearchActive(4)) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.antiEssence, 1).log10());
    if (hasGUpgrade(4, 31)) { b = b.pow(getGUpgEffect(4, 31)); }
    if (hasGUpgrade(4, 41) && hasUpgrade(4, 22) && !player.isInResearch) { b = b.times(getTrueTimeNerf()).times(2); }
    else { b = b.div(getTrueTimeNerf()).times(2); }
    b = Decimal.add(b, 1);
    if (isResearchCompleted(4) && b.eq(1)) { b = getTrueTimeBuff(); }
    return b;
}

function getTrueTimeNerf() {
    if (!player.timeLocked || (hasGUpgrade(4, 41) && (!hasUpgrade(4, 22) || player.isInResearch))) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.trueEssence, 1).log10());
    b = Decimal.pow(b, 0.2);
    return b.max(1);
}

function getAntiTimeNerf() {
    if (!player.timeLocked || (hasGUpgrade(4, 41) && (!hasUpgrade(4, 22) || player.isInResearch))) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.antiEssence, 1).log10());
    b = Decimal.pow(b, 0.2);
    return b.max(1);
}

//buy functions

function buySingleTime(tier) {
    if (canAffordTime(tier)) {
        player.crystals = player.crystals.minus(TIME_DATA[tier].cost());
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(1);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(1);
        document.getElementById(TIME_DATA[tier].costID).innerHTML = formatWhole(TIME_DATA[tier].cost());
        //allDisplay();
    }
}

function buyMaxTime(tier) {
    if (canAffordTime(tier)) {
        var totalBought = calculateMaxTime(tier);
        player.crystals = player.crystals.minus(calculateMaxTimeCost(tier));
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(totalBought);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(totalBought);
        document.getElementById(TIME_DATA[tier].costID).innerHTML = formatWhole(TIME_DATA[tier].cost());
        //allDisplay();
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
    if (hasUpgrade(4, 23)) {
        for (var i=NUM_TIMEDIMS; i>0; i--) {
            buyMaxTime(i);
        }
    } else {
        for (var i=4; i>0; i--) {
            buyMaxTime(i);
        }
    }
}

function buyTUpg(t) {
    if (canAffordTUpg(t) && !hasTUpgrade(t)) {
        player.timeUpgs[t] = true;
        player.crystals = player.crystals.minus(getTUpgCost(t));
        remTUpgClass(t, 'timeUpg');
        addTUpgClass(t, 'boughtTimeUpg');
    }
}

//prestige related

function canTimePrestige() {
    return isResearchCompleted(5) ? player.corpses.gte(new Decimal(1e15)) : player.corpses.gte(new Decimal(1e20))
}

function respecTimeClick() {
    if (player.timeLocked) {
        if (player.confirmations['timeRespec']['click']) {
            if (!confirm('Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.<br>(These confirmations can be disabled in options)')) return
        }

        player.timeLocked = false;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').removeAttribute('disabled')
        document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
        document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
        document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
        if (canTimePrestige()) { timePrestigeNoConfirm(); }
        else { timePrestigeReset(); }
    }
}

function respecTimeKey() {
    if (player.timeLocked) {
        if (player.confirmations['timeRespec']['key']) {
            if (!confirm('Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.<br>(These confirmations can be disabled in options)')) return
        }

        player.timeLocked = false;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').removeAttribute('disabled')
        document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
        document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
        document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
        if (canTimePrestige()) { timePrestigeNoConfirm(); }
        else { timePrestigeReset(); }
    }
}

function timePrestigeClick() {
    if (player.confirmations['timePrestige']['click']) { timePrestige(); }
    else { timePrestigeNoConfirm(); }
}

function timePrestigeKey() {
    if (player.confirmations['timePrestige']['key']) { timePrestige(); }
    else { timePrestigeNoConfirm(); }
}

function timePrestige() {
    if (canTimePrestige()) {
        if (player.bricks.gt(player.corpses) && !hasAchievement(54)) { unlockAchievement(54) }
        if (!confirm('Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.<br>(These confirmations can be disabled in options)')) return
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.thisAscStats.totalCrystals = player.thisAscStats.totalCrystals.plus(calculateCrystalGain());
        player.allTimeStats.totalCrystals = player.allTimeStats.totalCrystals.plus(calculateCrystalGain());
        if (player.crystals.gt(player.thisAscStats.bestCrystals)) { player.thisAscStats.bestCrystals = new Decimal(player.crystals); }
        if (player.thisAscStats.bestCrystals.gt(player.allTimeStats.bestCrystals)) { player.allTimeStats.bestCrystals = new Decimal(player.thisAscStats.bestCrystals); }
        player.timeResets = player.timeResets.plus(1);
        player.thisAscStats.totalTimeResets = player.thisAscStats.totalTimeResets.plus(1);
        player.allTimeStats.totalTimeResets = player.allTimeStats.totalTimeResets.plus(1);
        if (document.getElementById('respecOnSac').checked) {
            player.timeLocked = false;
            toggleTimeLockDisplay();
            document.getElementById('timeSlider').removeAttribute('disabled')
            document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
            document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
            document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
            document.getElementById('respecOnSac').checked = false;
        }
        timePrestigeReset();
    }
}

function timePrestigeNoConfirm() {
    if (canTimePrestige()) {
        if (player.bricks.gt(player.corpses) && !hasAchievement(54)) { unlockAchievement(54) }
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.thisAscStats.totalCrystals = player.thisAscStats.totalCrystals.plus(calculateCrystalGain());
        player.allTimeStats.totalCrystals = player.allTimeStats.totalCrystals.plus(calculateCrystalGain());
        if (player.crystals.gt(player.thisAscStats.bestCrystals)) { player.thisAscStats.bestCrystals = new Decimal(player.crystals); }
        if (player.thisAscStats.bestCrystals.gt(player.allTimeStats.bestCrystals)) { player.allTimeStats.bestCrystals = new Decimal(player.thisAscStats.bestCrystals); }
        player.timeResets = player.timeResets.plus(1);
        player.thisAscStats.totalTimeResets = player.thisAscStats.totalTimeResets.plus(1);
        player.allTimeStats.totalTimeResets = player.allTimeStats.totalTimeResets.plus(1);
        if (document.getElementById('respecOnSac').checked) {
            player.timeLocked = false;
            toggleTimeLockDisplay();
            document.getElementById('timeSlider').removeAttribute('disabled')
            document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
            document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
            document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
            document.getElementById('respecOnSac').checked = false;
        }
        timePrestigeReset();
    }
}

function lockInTime() {
    if (!player.timeLocked) {
        player.timeLocked = true;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').disabled = true;
        document.getElementById('timeTabBut').classList.remove('timeUnlockedNotify')
        document.getElementById('timeTabButMid').classList.remove('timeUnlockedNotify')
        document.getElementById('timeDimSubTabBut').classList.remove('timeUnlockedNotify')
    }
}

function timePrestigeReset() {
    var timeUpgUnlocked = hasUpgrade(3, 13) ? true : false
    if (player.astralFlag) { toggleAstral(); }
    clearInterval(mainLoop);
    player.pastRuns.lastRun.crystalGain = calculateCrystalGain();
    player.pastRuns.lastRun.timeSpent = new Date()-player.pastRuns.lastRun.timeSacrificed;
    player.pastRuns.lastRun.timeSacrificed = new Date();
    if (player.pastRuns.lastRun.crystalGain.gt(player.thisAscStats.bestCrystalGain)) { player.thisAscStats.bestCrystalGain = new Decimal(player.pastRuns.lastRun.crystalGain) }
    if (player.thisAscStats.bestCrystalGain.gt(player.allTimeStats.bestCrystalGain)) { player.allTimeStats.bestCrystalGain = new Decimal(player.thisAscStats.bestCrystalGain) }
    if (player.pastRuns.lastRun.crystalGain.div(player.pastRuns.lastRun.timeSpent/60000).gt(player.thisAscStats.bestCrystalRate)) { player.thisAscStats.bestCrystalRate = new Decimal(player.pastRuns.lastRun.crystalGain.div(player.pastRuns.lastRun.timeSpent/60000)) }
    if (player.thisAscStats.bestCrystalRate.gt(player.allTimeStats.bestCrystalRate)) { player.allTimeStats.bestCrystalRate = new Decimal(player.thisAscStats.bestCrystalRate) }
    for (var i=9; i>0; i--) { copyData(player.pastRuns.lastTen[i], player.pastRuns.lastTen[i-1]); }
    copyData(player.pastRuns.lastTen[0], player.pastRuns.lastRun);
    if (!hasTUpgrade(54) || player.isInResearch) {
        player.trueEssence = new Decimal(START_PLAYER.trueEssence);
        player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    }
    player.corpses = hasAchievement(41) ? new Decimal(START_PLAYER.corpsesAch41) : new Decimal(START_PLAYER.corpses)
    resetUnits();
    resetBuildingResources(true);
    resetBuildings();
    if (!hasTUpgrade(12)) { showBuildingSubTab('buildingsSubTab'); }
    for (var i=1; i<=NUM_TIMEDIMS; i++) { player.timeDims[i].amount = player.timeDims[i].bought; }
    if (timeUpgUnlocked) { player.buildings[3].upgrades[13] = true; }
    save();
    loadStyles();
    startInterval()
}

function resetTime() {
    let firstColumn = new Array(4);
    let newColumns = {};
    let rapidFire = player.timeUpgs[24];
    for (let i=1; i<=4; i++) {
        firstColumn[i] = player.timeUpgs['1' + i.toString()];
        newColumns['4' + i.toString()] = player.timeUpgs['4' + i.toString()];
        newColumns['5' + i.toString()] = player.timeUpgs['5' + i.toString()];
    }
    copyData(player.timeUpgs, START_PLAYER.timeUpgs);
    if (hasMilestone(2)) {
        for (let i=1; i<=4; i++) { player.timeUpgs['1' + i.toString()] = firstColumn[i]; }
    }
    if (hasMilestone(3)) { player.timeUpgs[24] = rapidFire; }
    if (hasMilestone(6)) {
        for (let i=1; i<=4; i++) {
            player.timeUpgs['4' + i.toString()] = newColumns['4' + i.toString()];
            player.timeUpgs['5' + i.toString()] = newColumns['5' + i.toString()];
        }
    }

    for (var i=NUM_TIMEDIMS; i>=1; i--) {
        player.timeDims[i].amount = new Decimal(0);
        player.timeDims[i].bought = new Decimal(0);
        player.timeDims[i].unlocked = false;
    }
    copyData(player.timeDims, START_PLAYER.timeDims);
}

//data

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
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 1,
        buttonID: "timeBut1",
        maxID: "timeMax1",
        maxAmtID: 'dim1Max',
        costID: 'dim1Cost',
        amountID: "timeAmount1",
        multID: "timeMult1",
        rowID: "timeRow1",
    },
    2: {
        single: "second time dimension",
        plural: "second time dimensions",
        baseCost: new Decimal(100),
        baseCostMult: new Decimal(100),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 2,
        buttonID: "timeBut2",
        maxID: "timeMax2",
        maxAmtID: 'dim2Max',
        costID: 'dim2Cost',
        amountID: "timeAmount2",
        multID: "timeMult2",
        rowID: "timeRow2",
    },
    3: {
        single: "third time dimension",
        plural: "third time dimensions",
        baseCost: new Decimal(1000),
        baseCostMult: new Decimal(100),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 3,
        buttonID: "timeBut3",
        maxID: "timeMax3",
        maxAmtID: 'dim3Max',
        costID: 'dim3Cost',
        amountID: "timeAmount3",
        multID: "timeMult3",
        rowID: "timeRow3",
    },
    4: {
        single: "fourth time dimension",
        plural: "fourth time dimensions",
        baseCost: new Decimal(10000),
        baseCostMult: new Decimal(1000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 4,
        buttonID: "timeBut4",
        maxID: "timeMax4",
        maxAmtID: 'dim4Max',
        costID: 'dim4Cost',
        amountID: "timeAmount4",
        multID: "timeMult4",
        rowID: "timeRow4",
    },
    5: {
        single: "fifth time dimension",
        plural: "fifth time dimensions",
        baseCost: new Decimal(1e20),
        baseCostMult: new Decimal(1000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 5,
        buttonID: "timeBut5",
        maxID: "timeMax5",
        maxAmtID: 'dim5Max',
        costID: 'dim5Cost',
        amountID: "timeAmount5",
        multID: "timeMult5",
        rowID: "timeRow5",
    },
    6: {
        single: "sixth time dimension",
        plural: "sixth time dimensions",
        baseCost: new Decimal(1e25),
        baseCostMult: new Decimal(10000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 6,
        buttonID: "timeBut6",
        maxID: "timeMax6",
        maxAmtID: 'dim6Max',
        costID: 'dim6Cost',
        amountID: "timeAmount6",
        multID: "timeMult6",
        rowID: "timeRow6",
    },
    7: {
        single: "seventh time dimension",
        plural: "seventh time dimensions",
        baseCost: new Decimal(1e30),
        baseCostMult: new Decimal(100000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 7,
        buttonID: "timeBut7",
        maxID: "timeMax7",
        maxAmtID: 'dim7Max',
        costID: 'dim7Cost',
        amountID: "timeAmount7",
        multID: "timeMult7",
        rowID: "timeRow7",
    },
    8: {
        single: "eighth time dimension",
        plural: "eighth time dimensions",
        baseCost: new Decimal(1e40),
        baseCostMult: new Decimal(100000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 8,
        buttonID: "timeBut8",
        maxID: "timeMax8",
        maxAmtID: 'dim8Max',
        costID: 'dim8Cost',
        amountID: "timeAmount8",
        multID: "timeMult8",
        rowID: "timeRow8",
    },
    upgrades: {
        11: {
            title: 'World Stasis 1',
            desc: 'Start every sacrifice with one exterminated world, and Buildings and Behemoths unlocked.',
            cost: new Decimal(100),
            preReq: null,
            buttonID: 'timeUpg11',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        12: {
            title: 'World Stasis 2',
            desc: 'Start every sacrifice with two exterminated worlds, and Construction and Ancient Ones unlocked.',
            cost: new Decimal(250),
            preReq: 11,
            buttonID: 'timeUpg12',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        13: {
            title: 'World Stasis 3',
            desc: 'Start every sacrifice with three exterminated worlds and Sun Eaters unlocked, and unlock autobuyers.',
            cost: new Decimal(500),
            preReq: 12,
            buttonID: 'timeUpg13',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        14: {
            title: 'Star Stasis',
            desc: 'Start every sacrifice with four exterminated worlds, and the dead sun does not reset on sacrifice.',
            cost: new Decimal(1000),
            preReq: 13,
            buttonID: 'timeUpg14',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        21: {
            title: 'Recrystallization',
            desc: 'Double your time crystal gain.',
            cost: new Decimal(1000),
            preReq: null,
            buttonID: 'timeUpg21',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        22: {
            title: 'Unit Boost',
            desc: 'Unit tier corpse multipliers get a boost based on unspent time crystals.',
            cost: new Decimal(2500),
            preReq: 21,
            buttonID: 'timeUpg22',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? '1 + 7.5*ln(x)' : '1 + 7.5*log(x)' },
            effect: function() {
                var e = player.crystals;
                e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? e.ln()*7.5 : e.log10()*7.5;
                return 1 + e;
            }
        },
        23: {
            title: 'Building Boost',
            desc: 'The first three building resources get a production boost based on unspent time crystals.',
            cost: new Decimal(10000),
            preReq: 22,
            buttonID: 'timeUpg23',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? '1 + ln(x)' : '1 + log(x)' },
            effect: function() {
                var e = player.crystals;
                e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? e.ln() : e.log10();
                return 1 + e;
            }
        },
        24: {
            title: 'Rapid Fire',
            desc: 'Unlock fast autobuyers permanently, and the buildings/construction tabs are never reset on sacrifice (except bricks and resources).',
            cost: new Decimal(20000),
            preReq: 23,
            buttonID: 'timeUpg24',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        31: {
            title: 'Time Boost',
            desc: 'Time dimension multipliers get a boost based on unspent time crystals.',
            cost: new Decimal(20000),
            preReq: null,
            buttonID: 'timeUpg31',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? '1 + 10*ln(x)' : '1 + 10*log(x)' },
            effect: function() {
                var e = player.crystals;
                e = (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? e.ln()*10 : e.log10()*10
                return 1 + e;
            }
        },
        32: {
            title: 'Forgotten Worlds',
            desc: 'The corpse production multiplier from exterminated worlds is 1.5x stronger.',
            cost: new Decimal(50000),
            preReq: 31,
            buttonID: 'timeUpg32',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1.5);
            }
        },
        33: {
            title: 'Lightspeed',
            desc: 'Unlock bulk autobuyers permanently, and crystal gain is boosted based on your nekro-photons.',
            cost: new Decimal(150000),
            preReq: 32,
            buttonID: 'timeUpg33',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + 2*(x^0.2)' },
            effect: function() {
                let e = new Decimal(player.buildings[3].amount);
                e = Decimal.pow(e, 0.2).times(2);
                return e.plus(1);
            }
        },
        34: {
            title: 'Supernova',
            desc: 'Unlock the world prestige autobuyer permanently and the second row of Dead Sun upgrades.',
            cost: new Decimal(1000000),
            preReq: 33,
            buttonID: 'timeUpg34',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        41: {
            title: 'Unholy Paradox, Manbat',
            desc: 'The True Time Essence effect applies directly to corpse production.',
            cost: new Decimal(1e12),
            preReq: null,
            buttonID: 'timeUpg41',
            displayEffect: true,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                if (player.isInResearch && !hasEUpgrade(11)) { return new Decimal(1); }
                else { return getTrueTimeBuff() }
            }
        },
        42: {
            title: 'Corpse Boost',
            desc: 'Unspent galaxies multiply corpse production.',
            cost: new Decimal(1e15),
            preReq: 41,
            buttonID: 'timeUpg42',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            }
        },
        43: {
            title: 'Armament Boost',
            desc: 'Unspent galaxies multiply the Industrialize effect.',
            cost: new Decimal(1e20),
            preReq: 42,
            buttonID: 'timeUpg43',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            }
        },
        44: {
            title: 'Prestigious',
            desc: 'World Prestige no longer resets your corpses.',
            cost: new Decimal(1e30),
            preReq: 43,
            buttonID: 'timeUpg44',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        51: {
            title: 'Buy More',
            desc: 'Increase the base multiplier per bought time dimension from 2x -> 2.5x.',
            cost: new Decimal(1e12),
            preReq: null,
            buttonID: 'timeUpg51',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
        52: {
            title: 'Brick Boost',
            desc: 'Unspent galaxies multiply astral brick production.',
            cost: new Decimal(1e15),
            preReq: 51,
            buttonID: 'timeUpg52',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            }
        },
        53: {
            title: 'Crystal Boost',
            desc: 'Unspent galaxies multiply time crystal gain.',
            cost: new Decimal(1e20),
            preReq: 52,
            buttonID: 'timeUpg53',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            }
        },
        54: {
            title: 'Sacrificial',
            desc: 'Sacrifice no longer resets your time essence.',
            cost: new Decimal(1e30),
            preReq: 53,
            buttonID: 'timeUpg54',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            }
        },
    }
}