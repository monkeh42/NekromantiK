//misc info functions

function hasPrereqTUpg(t) {
    if (t==11 || t==21 || t==31 || t==41 || t==51) { return true; }
    else { return player.timeUpgs[DATA.tu.upgrades[t].requires[0]]; }
}

function isDisplayEffectT(t) {
    return DATA.tu.upgrades[t].displayEffect;
}

function isDisplayTooltipT(t) {
    return DATA.tu.upgrades[t].displayTooltip;
}

function hasTUpgrade(t) {
    return player.timeUpgs[t];
}

function getTUpgName(t) {
    return DATA.tu.upgrades[t].title;
}

function getTUpgDesc(t) {
    return DATA.tu.upgrades[t].desc;
}

function getTUpgCost(t) {
    return DATA.tu.upgrades[t].cost();
}

function getTUpgEffect(t) {
    return DATA.tu.upgrades[t].effect();
}

function canAffordTUpg(t) {
    return (player.crystals.gte(getTUpgCost(t)) && hasPrereqTUpg(t) && !hasTUpgrade(t));
}

function canAffordTime(tier) {
    return (player.crystals.gte(DATA.td[tier].cost())&&DATA.ul.dimensions[tier]());
}

//production/calculation

function calculateCrystalGain() {
    if (canTimePrestige()) {
        var div = isResearchCompleted(5) ? 15 : 20
        var ret = Decimal.floor(Decimal.pow(10, (player.stats['thisSacStats'].bestCorpses.e/div) - 0.65));
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

function getTimeDimProdPerSecond(tier, disp=false) {
    if (tier > NUM_TIMEDIMS) { return new Decimal(0); }
    var p = player.timeDims[tier].amount.times(DATA.td[tier].mult());
    if (player.isInResearch) { p = p.pow(0.9); }
    if (disp && player.displayRealTime) { return p.times(getRealTimeDimMultiplier()); }
    else { return p; }
}

function getEssenceProdPerSecond(disp=false) {
    var p = player.timeDims[1].amount.times(DATA.td[1].mult());
    if (hasUpgrade(2, 22)) { p = p.times(getUpgEffect(2, 22)); }
    if (hasGUpgrade(4, 11)) { p = p.times(getGUpgEffect(4, 11)); }
    if (player.isInResearch) { p = p.pow(0.9); }
    if (disp && player.displayRealTime) { return p.times(getRealTimeDimMultiplier()); }
    else { return p; }
}

function getEssenceProdAfterSlider(t, disp=false) {
    return (t=='true' ? getEssenceProdPerSecond(disp).times(player.truePercent/100) : getEssenceProdPerSecond(disp).times(player.antiPercent/100))
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
        player.crystals = player.crystals.minus(DATA.td[tier].cost());
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(1);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(1);
    }
}

function buyMaxTime(tier) {
    if (canAffordTime(tier)) {
        var totalBought = calculateMaxTime(tier);
        player.crystals = player.crystals.minus(calculateMaxTimeCost(tier));
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(totalBought);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(totalBought);
    }
}

function calculateMaxTime(tier) {
    var count = 0;
    if (canAffordTime(tier)) {    
        var leftoverCrystals = player.crystals;
        var newCost = DATA.td[tier].cost();
        while (leftoverCrystals.gte(newCost)) {
            leftoverCrystals = leftoverCrystals.minus(newCost);
            newCost = newCost.times(DATA.td[tier].baseCostMult);
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
            total = total.plus(DATA.td[tier].cost().times(DATA.td[tier].baseCostMult.pow(i)));
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
    }
}

//prestige related

function canTimePrestige() {
    return isResearchCompleted(5) ? player.corpses.gte(new Decimal(1e15)) : player.corpses.gte(new Decimal(1e20))
}

function timeLockRespec() {
    if (player.timeLocked) { respecTimeClick(); }
    else { lockInTime(); }
}

function respecTimeClick() {
    if (player.timeLocked) {
        if (player.confirmations['timeRespec']['click']) { confirmation(DATA.td.prestige.confirmPopText, 'respecTime'); }
        else { respecTime() }
    }
}

function respecTimeKey() {
    if (player.timeLocked) {
        if (player.confirmations['timeRespec']['key']) { confirmation(DATA.td.prestige.confirmPopText, 'respecTime'); }
        else { respecTime() }
    }
}

function respecTime() {
    player.timeLocked = false;
    if (canTimePrestige()) { timePrestigeNoConfirm(); }
    else { timePrestigeReset(); }
}

function timePrestigeClick() {
    if (canTimePrestige()) {
        if (player.confirmations['timePrestige']['click']) { confirmation(DATA.td.prestige.confirmPopText, 'timePrestigeNoConfirm'); }
        else { timePrestigeNoConfirm(); }
    }
}

function timePrestigeKey() {
    if (canTimePrestige()) {
        if (player.confirmations['timePrestige']['key']) { confirmation(DATA.td.prestige.confirmPopText, 'timePrestigeNoConfirm'); }
        else { timePrestigeNoConfirm(); }
    }
}

function timePrestige() {
    if (canTimePrestige()) {
        if (player.bricks.gt(player.corpses) && !hasAchievement(54)) { unlockAchievement(54) }
        if (!confirm('Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.<br>(These confirmations can be disabled in options)')) return
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.stats['thisAscStats'].totalCrystals = player.stats['thisAscStats'].totalCrystals.plus(calculateCrystalGain());
        player.stats['allTimeStats'].totalCrystals = player.stats['allTimeStats'].totalCrystals.plus(calculateCrystalGain());
        if (player.crystals.gt(player.stats['thisAscStats'].bestCrystals)) { player.stats['thisAscStats'].bestCrystals = new Decimal(player.crystals); }
        if (player.stats['thisAscStats'].bestCrystals.gt(player.stats['allTimeStats'].bestCrystals)) { player.stats['allTimeStats'].bestCrystals = new Decimal(player.stats['thisAscStats'].bestCrystals); }
        player.timeResets = player.timeResets.plus(1);
        player.stats['thisAscStats'].totalTimeResets = player.stats['thisAscStats'].totalTimeResets.plus(1);
        player.stats['allTimeStats'].totalTimeResets = player.stats['allTimeStats'].totalTimeResets.plus(1);
        if (app.respecNextSac) {
            player.timeLocked = false;
            app.respecNextSac = false;
        }
        timePrestigeReset();
    }
}

function timePrestigeNoConfirm() {
    if (canTimePrestige()) {
        if (player.bricks.gt(player.corpses) && !hasAchievement(54)) { unlockAchievement(54) }
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.stats['thisAscStats'].totalCrystals = player.stats['thisAscStats'].totalCrystals.plus(calculateCrystalGain());
        player.stats['allTimeStats'].totalCrystals = player.stats['allTimeStats'].totalCrystals.plus(calculateCrystalGain());
        if (player.crystals.gt(player.stats['thisAscStats'].bestCrystals)) { player.stats['thisAscStats'].bestCrystals = new Decimal(player.crystals); }
        if (player.stats['thisAscStats'].bestCrystals.gt(player.stats['allTimeStats'].bestCrystals)) { player.stats['allTimeStats'].bestCrystals = new Decimal(player.stats['thisAscStats'].bestCrystals); }
        player.timeResets = player.timeResets.plus(1);
        player.stats['thisAscStats'].totalTimeResets = player.stats['thisAscStats'].totalTimeResets.plus(1);
        player.stats['allTimeStats'].totalTimeResets = player.stats['allTimeStats'].totalTimeResets.plus(1);
        if (app.respecNextSac) {
            player.timeLocked = false;
            app.respecNextSac = false;
        }
        timePrestigeReset();
    }
}

function lockInTime() {
    if (!player.timeLocked) {
        player.timeLocked = true;

    }
}

function timePrestigeReset() {
    var timeUpgUnlocked = hasUpgrade(3, 13) ? true : false
    if (player.astralFlag) { toggleAstral(); }
    clearInterval(mainLoop);
    player.pastRuns.lastRun.crystalGain = calculateCrystalGain();
    player.pastRuns.lastRun.timeSpent = new Date()-player.pastRuns.lastRun.timeSacrificed;
    player.pastRuns.lastRun.timeSacrificed = new Date();
    if (player.pastRuns.lastRun.crystalGain.gt(player.stats['thisAscStats'].bestCrystalGain)) { player.stats['thisAscStats'].bestCrystalGain = new Decimal(player.pastRuns.lastRun.crystalGain) }
    if (player.stats['thisAscStats'].bestCrystalGain.gt(player.stats['allTimeStats'].bestCrystalGain)) { player.stats['allTimeStats'].bestCrystalGain = new Decimal(player.stats['thisAscStats'].bestCrystalGain) }
    if (player.pastRuns.lastRun.crystalGain.div(player.pastRuns.lastRun.timeSpent/60000).gt(player.stats['thisAscStats'].bestCrystalRate)) { player.stats['thisAscStats'].bestCrystalRate = new Decimal(player.pastRuns.lastRun.crystalGain.div(player.pastRuns.lastRun.timeSpent/60000)) }
    if (player.stats['thisAscStats'].bestCrystalRate.gt(player.stats['allTimeStats'].bestCrystalRate)) { player.stats['allTimeStats'].bestCrystalRate = new Decimal(player.stats['thisAscStats'].bestCrystalRate) }
    for (var i=9; i>0; i--) { copyData(player.pastRuns.lastTen[i], player.pastRuns.lastTen[i-1]); }
    copyData(player.pastRuns.lastTen[0], player.pastRuns.lastRun);
    if (!hasTUpgrade(54) || player.isInResearch) {
        player.trueEssence = new Decimal(DATA.sp.trueEssence);
        player.antiEssence = new Decimal(DATA.sp.antiEssence);
    }
    player.corpses = hasAchievement(41) ? new Decimal(DATA.sp.corpsesAch41) : (hasAchievement(13) ? new Decimal(DATA.sp.corpsesAch13) : new Decimal(DATA.sp.corpses))
    resetUnits();
    resetBuildingResources(true);
    resetBuildings();
    if (!hasTUpgrade(12)) { player.subTabs['b'] = 'buildingsSubTab'; }
    for (var i=1; i<=NUM_TIMEDIMS; i++) { player.timeDims[i].amount = player.timeDims[i].bought; }
    if (timeUpgUnlocked) { player.buildings[3].upgrades[13] = true; }
    save();
    startInterval()
}

function resetTime(startingResearch=false) {
    let firstColumn = new Array(4);
    let newColumns = {};
    let rapidFire = player.timeUpgs[24];
    for (let i=1; i<=4; i++) {
        firstColumn[i] = player.timeUpgs['1' + i.toString()];
        newColumns['4' + i.toString()] = player.timeUpgs['4' + i.toString()];
        newColumns['5' + i.toString()] = player.timeUpgs['5' + i.toString()];
    }
    copyData(player.timeUpgs, DATA.sp.timeUpgs);
    if (hasMilestone(2)&&!startingResearch) {
        for (let i=1; i<=4; i++) { player.timeUpgs['1' + i.toString()] = firstColumn[i]; }
    }
    if (hasMilestone(3)&&!startingResearch) { player.timeUpgs[24] = rapidFire; }
    if (hasMilestone(6)) {
        for (let i=1; i<=4; i++) {
            player.timeUpgs['4' + i.toString()] = newColumns['4' + i.toString()];
            player.timeUpgs['5' + i.toString()] = newColumns['5' + i.toString()];
        }
    }

    for (var i=NUM_TIMEDIMS; i>=1; i--) {
        player.timeDims[i].bought = new Decimal(DATA.sp.timeDims[i].bought);
        player.timeDims[i].amount = new Decimal(DATA.sp.timeDims[i].amount);
        if(!player.unlocks['timeDims2']) { player.timeDims[i].unlocked = DATA.sp.timeDims[i].unlocked; }
    }
    
}

function resetTimeDims() {
    for (var i=NUM_TIMEDIMS; i>=1; i--) {
        player.timeDims[i].bought = new Decimal(DATA.sp.timeDims[i].bought);
        player.timeDims[i].amount = new Decimal(DATA.sp.timeDims[i].amount);
        player.timeDims[i].unlocked = DATA.sp.timeDims[i].unlocked;
    }
}

//data

var TIME_DATA = {
    notify: false,
    indirect: false,
}

var TIME_DIMENSIONS = {
    layerDisplay: {
        numClass: 'timeNum',
        layerButtonClass: 'timeBut',
    },
    prestige: {
        className: 'timePrestige',
        heading: 'sacrifice your empire',
        desc: 'Perform a dark ritual to transmute all you have achieved into time crystals. This will reset all your corpses, units, worlds, bricks, buildings, upgrades, earned time dimensions, and time essence, but you will gain time crystals based on your corpses.',
        confirmPopText: 'This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.<br><span style="font-size: 11pt;">(These confirmations can be disabled in options)</span>',
        displayDesc: function() { return !player.stats['thisAscStats'].totalCrystals.gt(2000); },
        displayTooltip: true,
        displayFormula: function() { return (isResearchCompleted(5) ? 'floor(10^(corpses_exponent/15 - 0.65))' : 'floor(10^(corpses_exponent/20 - 0.65))') },
        canReset: function() { return canTimePrestige(); },
        getGain: function() { return calculateCrystalGain(); },
        gainResource: 'time crystals',
        getReqAmount: function() { return 'at least ' + (isResearchCompleted(5) ? '1e15' : '1e20'); },
        getReqResource: function() { return 'corpses' },
        doReset: function() { timePrestigeClick(); },
        showNextAt: false,
        getNextAt: function() {
            return;
        }
    },
    numTiers: 8,
    resource: 'time crystals',
    className: 'unitButT',
    getMax: function(tier) { return calculateMaxTime(tier); },
    buySingle: function(tier) { buySingleTime(tier); },
    buyMax: function(tier) { buyMaxTime(tier); },
    buyMaxA: function() { buyMaxAllTime(); },
    1: {
        name: 'Time Dimension 1',
        single: "first time dimension",
        plural: "first time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(1),
        baseCostMult: new Decimal(10),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 2',
        single: "second time dimension",
        plural: "second time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(100),
        baseCostMult: new Decimal(100),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 3',
        single: "third time dimension",
        plural: "third time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(1000),
        baseCostMult: new Decimal(100),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 4',
        single: "fourth time dimension",
        plural: "fourth time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(10000),
        baseCostMult: new Decimal(1000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 5',
        single: "fifth time dimension",
        plural: "fifth time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(1e20),
        baseCostMult: new Decimal(1000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 6',
        single: "sixth time dimension",
        plural: "sixth time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(1e25),
        baseCostMult: new Decimal(10000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 7',
        single: "seventh time dimension",
        plural: "seventh time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(1e30),
        baseCostMult: new Decimal(100000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
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
        name: 'Time Dimension 8',
        single: "eighth time dimension",
        plural: "eighth time dimensions",
        unlocked: function() { return player.timeDims[this.tier].unlocked; },
        baseCost: new Decimal(1e40),
        baseCostMult: new Decimal(100000),
        baseMult: new Decimal(0),
        cost: function() {
            var c = this.baseCost;
            c = c.times(this.baseCostMult.pow(player.timeDims[this.tier].bought));
            return c;
        },
        canAfford() {
            return player.crystals.gte(this.cost());
        },
        mult: function() {
            var m = (hasTUpgrade(51) && (!player.isInResearch || hasEUpgrade(11))) ? new Decimal(2.5) : new Decimal(2)
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        gainPercent: function() { return getTimeDimProdPerSecond(this.tier+1, true).div(this.amount()).times(100); },
        bought: function() { return player.timeDims[this.tier].bought; },
        amount: function() { return player.timeDims[this.tier].amount; },
        tier: 8,
        buttonID: "timeBut8",
        maxID: "timeMax8",
        maxAmtID: 'dim8Max',
        costID: 'dim8Cost',
        amountID: "timeAmount8",
        multID: "timeMult8",
        rowID: "timeRow8",
    },
}

var TIME_UPGRADES = {
    unlocked: function() { return true; },
    buyUpg: function(data, id) {
        buyTUpg(id);
    },
    upgrades: {
        rows: 4,
        cols: 5,
        className: 'timeUpg',
        11: {
            id: 11,
            title: 'World Stasis 1',
            desc: function() { return 'Start every sacrifice with one exterminated world, and Buildings and Behemoths unlocked.' },
            cost: function() { return new Decimal(100) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [],
            locked: function() { return false; },
            buttonID: 'timeUpg11',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        12: {
            id: 12,
            title: 'World Stasis 2',
            desc: function() { return 'Start every sacrifice with two exterminated worlds, and Construction and Ancient Ones unlocked.' },
            cost: function() { return new Decimal(250) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [11],
            locked: function() { return false; },
            buttonID: 'timeUpg12',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        13: {
            id: 13,
            title: 'World Stasis 3',
            desc: function() { return 'Start every sacrifice with three exterminated worlds and Sun Eaters unlocked, and unlock autobuyers.' },
            cost: function() { return new Decimal(500) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [12],
            locked: function() { return false; },
            buttonID: 'timeUpg13',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        14: {
            id: 14,
            title: 'Star Stasis',
            desc: function() { return 'Start every sacrifice with four exterminated worlds, and the dead sun does not reset on sacrifice.' },
            cost: function() { return new Decimal(1000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [13],
            locked: function() { return false; },
            buttonID: 'timeUpg14',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        21: {
            id: 21,
            title: 'Recrystallization',
            desc: function() { return 'Double your time crystal gain.' },
            cost: function() { return new Decimal(1000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [],
            locked: function() { return false; },
            buttonID: 'timeUpg21',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        22: {
            id: 22,
            title: 'Unit Boost',
            desc: function() { return 'Unit tier corpse multipliers get a boost based on unspent time crystals.' },
            cost: function() { return new Decimal(2500) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [21],
            locked: function() { return false; },
            buttonID: 'timeUpg22',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? '1 + 7.5*ln(x)' : '1 + 7.5*log(x)' },
            effect: function() {
                var e = player.crystals;
                e = (player.crystals.eq(0) ? player.crystals : (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(e.ln()*7.5) : new Decimal(e.log10()*7.5));
                return e.plus(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        23: {
            id: 23,
            title: 'Building Boost',
            desc: function() { return 'The first three building resources get a production boost based on unspent time crystals.' },
            cost: function() { return new Decimal(10000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [22],
            locked: function() { return false; },
            buttonID: 'timeUpg23',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? '1 + ln(x)' : '1 + log(x)' },
            effect: function() {
                var e = player.crystals;
                e = (player.crystals.eq(0) ? player.crystals : (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(e.ln()) : new Decimal(e.log10()));
                return e.plus(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        24: {
            id: 24,
            title: 'Rapid Fire',
            desc: function() { return 'Unlock fast autobuyers permanently, and the buildings/construction tabs are never reset on sacrifice (except bricks and resources).' },
            cost: function() { return new Decimal(20000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [23],
            locked: function() { return false; },
            buttonID: 'timeUpg24',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        31: {
            id: 31,
            title: 'Time Boost',
            desc: function() { return 'Time dimension multipliers get a boost based on unspent time crystals.' },
            cost: function() { return new Decimal(20000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [],
            locked: function() { return false; },
            buttonID: 'timeUpg31',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return hasUpgrade(4, 13) ? '1 + 10*ln(x)' : '1 + 10*log(x)' },
            effect: function() {
                var e = player.crystals;
                e = (player.crystals.eq(0) ? player.crystals : (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? new Decimal(e.ln()*10) : new Decimal(e.log10()*10))
                return e.plus(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        32: {
            id: 32,
            title: 'Forgotten Worlds',
            desc: function() { return 'The corpse production multiplier from exterminated worlds is 1.5x stronger.' },
            cost: function() { return new Decimal(50000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [31],
            locked: function() { return false; },
            buttonID: 'timeUpg32',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1.5);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        33: {
            id: 33,
            title: 'Lightspeed',
            desc: function() { return 'Unlock bulk autobuyers permanently, and crystal gain is boosted based on your nekro-photons.' },
            cost: function() { return new Decimal(150000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [32],
            locked: function() { return false; },
            buttonID: 'timeUpg33',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + 2*(x^0.2)' },
            effect: function() {
                let e = new Decimal(player.buildings[3].amount);
                e = Decimal.pow(e, 0.2).times(2);
                return e.plus(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        34: {
            id: 34,
            title: 'Supernova',
            desc: function() { return 'Unlock the world prestige autobuyer permanently and the second row of Dead Sun upgrades.' },
            cost: function() { return new Decimal(1000000) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [33],
            locked: function() { return false; },
            buttonID: 'timeUpg34',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return true },
            effectString: function() {
                return '';
            },
        },
        41: {
            id: 41,
            title: 'Unholy Paradox, Manbat',
            desc: function() { return 'The True Time Essence effect applies directly to corpse production.' },
            cost: function() { return new Decimal(1e12) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [],
            locked: function() { return false; },
            buttonID: 'timeUpg41',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                if (player.isInResearch && !hasEUpgrade(11)) { return new Decimal(1); }
                else { return getTrueTimeBuff() }
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        42: {
            id: 42,
            title: 'Corpse Boost',
            desc: function() { return 'Unspent galaxies multiply corpse production.' },
            cost: function() { return new Decimal(1e15) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [41],
            locked: function() { return false; },
            buttonID: 'timeUpg42',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        43: {
            id: 43,
            title: 'Armament Boost',
            desc: function() { return 'Unspent galaxies multiply the Industrialize effect.' },
            cost: function() { return new Decimal(1e20) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [42],
            locked: function() { return false; },
            buttonID: 'timeUpg43',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        44: {
            id: 44,
            title: 'Prestigious',
            desc: function() { return 'World Prestige no longer resets your corpses.' },
            cost: function() { return new Decimal(1e30) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [43],
            locked: function() { return false; },
            buttonID: 'timeUpg44',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return '';
            },
        },
        51: {
            id: 51,
            title: 'Buy More',
            desc: function() { return 'Increase the base multiplier per bought time dimension from 2x -> 2.5x.' },
            cost: function() { return new Decimal(1e12) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [],
            locked: function() { return false; },
            buttonID: 'timeUpg51',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return '';
            },
        },
        52: {
            id: 52,
            title: 'Brick Boost',
            desc: function() { return 'Unspent galaxies multiply astral brick production.' },
            cost: function() { return new Decimal(1e15) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [51],
            locked: function() { return false; },
            buttonID: 'timeUpg52',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        53: {
            id: 53,
            title: 'Crystal Boost',
            desc: function() { return 'Unspent galaxies multiply time crystal gain.' },
            cost: function() { return new Decimal(1e20) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [52],
            locked: function() { return false; },
            buttonID: 'timeUpg53',
            displaySuffix: 'x',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: function() { return '1 + x' },
            effect: function() {
                if (player.isInResearch) { return new Decimal(1); }
                else { 
                    let e = player.galaxies;
                    return e.plus(1);
                }
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        54: {
            id: 54,
            title: 'Sacrificial',
            desc: function() { return 'Sacrifice no longer resets your time essence.' },
            cost: function() { return new Decimal(1e30) },
            resource: 'time crystals',
            isBought: function() {
                return player.timeUpgs[this.id];
            },
            canAfford: function() {
                return player.crystals.gte(this.cost())&&(this.requires.length>0 ? hasTUpgrade(this.requires[0]) : true);
            },
            requires: [53],
            locked: function() { return false; },
            buttonID: 'timeUpg54',
            displaySuffix: '',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return '' },
            effect: function() {
                return new Decimal(1);
            },
            unlocked: function() { return hasMilestone(6) },
            effectString: function() {
                return '';
            },
        },
    }
}