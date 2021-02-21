//misc info functions

function hasPrereqTUpg(t) {
    if (t==11 || t==21 || t==31) { return true; }
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
        var div = 20;
        var ret = Decimal.floor(Decimal.pow(10, (player.thisSacStats.bestCorpses.e/div) - 0.65));
        if (hasTUpgrade(21)) { ret = ret.times(2); }
        if (hasTUpgrade(33)) { ret = ret.times(getTUpgEffect(33)); }
        return ret;
    } else {
        return new Decimal(0);
    }
}

function calculateCrystalsPerMin() {
    let gain = calculateCrystalGain();
    let time = ((new Date).getTime() - player.pastRuns.lastRun.timeSacrificed)/60000;

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
            return player.autobuyers[9].amount.lt(((new Date).getTime()-player.pastRuns.lastRun.timeSacrificed)/1000);

        default: return false;
    }
}

function getTimeDimProdPerSecond(tier) {
    if (tier > NUM_TIMEDIMS) { return new Decimal(0); }
    var p = player.timeDims[tier].amount.times(TIME_DATA[tier].mult());
    return p;
}

function getEssenceProdPerSecond() {
    var p = player.timeDims[1].amount.times(TIME_DATA[1].mult());
    if (hasUpgrade(2, 22)) { p = p.times(getUpgEffect(2, 22)); }
    return p;
}

function getTrueTimeBuff() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.trueEssence, 1).log10());
    b = b.div(getAntiTimeNerf());
    b = Decimal.add(b, 1);
    return b;
}

function getAntiTimeBuff() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.antiEssence, 1).log10());
    b = b.div(getTrueTimeNerf()).times(2);
    b = Decimal.add(b, 1);
    return b;
}

function getTrueTimeNerf() {
    if (!player.timeLocked) { return new Decimal(1); }
    var b = new Decimal(Decimal.max(player.trueEssence, 1).log10());
    b = Decimal.pow(b, 0.2);
    return b.max(1);
}

function getAntiTimeNerf() {
    if (!player.timeLocked) { return new Decimal(1); }
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
        //allDisplay();
    }
}

function buyMaxTime(tier) {
    if (canAffordTime(tier)) {
        var totalBought = calculateMaxTime(tier);
        player.crystals = player.crystals.minus(calculateMaxTimeCost(tier));
        player.timeDims[tier].amount = player.timeDims[tier].amount.plus(totalBought);
        player.timeDims[tier].bought = player.timeDims[tier].bought.plus(totalBought);
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
    for (var i=NUM_TIMEDIMS; i>0; i--) {
        buyMaxTime(i);
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
    return player.corpses.gte(new Decimal(1e20));
}

function respecTimeClick() {
    if (player.timeResets.gte(1)) {
        if (player.timeLocked) {
            if (player.confirmations['timeRespec']['click']) {
                if (!confirm("Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.")) return
            }

            player.timeLocked = false;
            toggleTimeLockDisplay();
            document.getElementById('timeSlider').disabled = false;
            if (canTimePrestige()) { timePrestigeNoConfirm(); }
            else { timePrestigeReset(); }
        }
    }
}

function respecTimeKey() {
    if (player.timeResets.gte(1)) {
        if (player.timeLocked) {
            if (player.confirmations['timeRespec']['key']) {
                if (!confirm("Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.")) return
            }

            player.timeLocked = false;
            toggleTimeLockDisplay();
            document.getElementById('timeSlider').disabled = false;
            if (canTimePrestige()) { timePrestigeNoConfirm(); }
            else { timePrestigeReset(); }
        }
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
        if (!confirm("Are you sure? This will reset ALL of your progress before unlocking Time Warp, and all of your time essense.")) return
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.allTimeStats.totalCrystals = player.allTimeStats.totalCrystals.plus(calculateCrystalGain());
        if (player.crystals.gt(player.allTimeStats.bestCrystals)) { player.allTimeStats.bestCrystals = new Decimal(player.crystals); }
        player.timeResets = player.timeResets.plus(1);
        player.allTimeStats.totalTimeResets = player.allTimeStats.totalTimeResets.plus(1);
        if (document.getElementById('respecOnSac').checked) {
            player.timeLocked = false;
            toggleTimeLockDisplay();
            document.getElementById('timeSlider').disabled = false;
            document.getElementById('respecOnSac').checked = false;
        }
        timePrestigeReset();
    }
}

function timePrestigeNoConfirm() {
    if (canTimePrestige()) {
        player.crystals = player.crystals.plus(calculateCrystalGain());
        player.allTimeStats.totalCrystals = player.allTimeStats.totalCrystals.plus(calculateCrystalGain());
        if (player.crystals.gt(player.allTimeStats.bestCrystals)) { player.allTimeStats.bestCrystals = new Decimal(player.crystals); }
        player.timeResets = player.timeResets.plus(1);
        player.allTimeStats.totalTimeResets = player.allTimeStats.totalTimeResets.plus(1);
        if (document.getElementById('respecOnSac').checked) {
            player.timeLocked = false;
            toggleTimeLockDisplay();
            document.getElementById('timeSlider').disabled = false;
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
    }
}

function timePrestigeReset() {
    var timeUpgUnlocked = hasUpgrade(3, 13) ? true : false
    if (player.astralFlag) { toggleAstral(); }
    clearInterval(mainLoop);
    player.pastRuns.lastRun.crystalGain = calculateCrystalGain();
    player.pastRuns.lastRun.timeSpent = (new Date).getTime()-player.pastRuns.lastRun.timeSacrificed;
    player.pastRuns.lastRun.timeSacrificed = (new Date).getTime();
    if (player.pastRuns.lastRun.crystalGain.gt(player.allTimeStats.bestCrystalGain)) { player.allTimeStats.bestCrystalGain = new Decimal(player.pastRuns.lastRun.crystalGain) }
    if (player.pastRuns.lastRun.crystalGain.div(player.pastRuns.lastRun.timeSpent/60000).gt(player.allTimeStats.bestCrystalRate)) { player.allTimeStats.bestCrystalRate = new Decimal(player.pastRuns.lastRun.crystalGain.div(player.pastRuns.lastRun.timeSpent/60000)) }
    for (var i=9; i>0; i--) { copyData(player.pastRuns.lastTen[i], player.pastRuns.lastTen[i-1]); }
    copyData(player.pastRuns.lastTen[0], player.pastRuns.lastRun);
    player.trueEssence = new Decimal(START_PLAYER.trueEssence);
    player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    player.corpses = new Decimal(START_PLAYER.corpses)
    resetUnits();
    resetSpaceCounts();
    if (!hasTUpgrade(24)) { resetBuildings(); }
    resetBuildingResources(true);
    for (var i=1; i<=NUM_TIMEDIMS; i++) { player.timeDims[i].amount = player.timeDims[i].bought; }
    lockTab('unitsTab');
    if (timeUpgUnlocked) { player.buildings[3].upgrades[13] = true; }
    showBuildingSubTab('buildingsSubTab');
    save();
    loadStyles();
    startInterval();
}

function resetSpaceCounts() {
    if (hasTUpgrade(14)) {
        player.worlds = new Decimal(4);
        player.spaceResets = new Decimal(4);
        player.nextSpaceReset = [3, 8];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
    } else if (hasTUpgrade(13)) {
        player.worlds = new Decimal(3);
        player.spaceResets = new Decimal(3);
        player.nextSpaceReset = [1, 8];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
        lockElements('buildingsTab', 'sun');
        lockElements('buildingsTab', 'sunRow2');
    } else if (hasTUpgrade(12)) {
        player.worlds = new Decimal(2);
        player.spaceResets = new Decimal(2);
        player.nextSpaceReset = [1, 7];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
        lockElements('buildingsTab', 'sun');
        lockElements('buildingsTab', 'sunRow2');
    } else if (hasTUpgrade(11)) {
        player.worlds = new Decimal(1);
        player.spaceResets = new Decimal(1);
        player.nextSpaceReset = [1, 6];
        lockElements('buildingsTab', 'factory');
        lockElements('buildingsTab', 'factoryRow2');
        lockElements('buildingsTab', 'necropolis');
        lockElements('buildingsTab', 'necropolisRow2');
        lockElements('buildingsTab', 'sun');
        lockElements('buildingsTab', 'sunRow2');
        lockElements('buildingsTab', 'construction');
    } else {
        player.spaceResets = new Decimal(START_PLAYER.spaceResets);
        player.worlds = new Decimal(START_PLAYER.worlds);
        player.nextSpaceReset = START_PLAYER.nextSpaceReset.slice();
        lockTab('buildingsTab');
    }
    copyData(player.thisSacStats, START_PLAYER.thisSacStats);
    player.thisSacStats.totalWorlds = player.worlds;
    player.thisSacStats.bestWorlds = player.worlds;
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
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
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
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
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
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
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
            var m = new Decimal(2);
            if (player.timeDims[this.tier].bought.eq(0)) { return new Decimal(1); }
            m = m.pow(player.timeDims[this.tier].bought-1);
            if (hasTUpgrade(31)) { m = m.times(getTUpgEffect(31)); }
            return m;
        },
        tier: 4,
        buttonID: "timeBut4",
        maxID: "timeMax4",
        amountID: "timeAmount4",
        multID: "timeMult4",
        rowID: "timeRow4",
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
            displayFormula: '',
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
            displayFormula: '',
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
            displayFormula: '',
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
            displayFormula: '',
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
            displayFormula: '',
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
            displayFormula: '1 + 7.5*log(x)',
            effect: function() {
                var e = player.crystals;
                e = e.log10()*7.5;
                return 1 + e;
            }
        },
        23: {
            title: 'Building Boost',
            desc: 'All building resources get a production boost based on unspent time crystals.',
            cost: new Decimal(10000),
            preReq: 22,
            buttonID: 'timeUpg23',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: '1 + log(x)',
            effect: function() {
                var e = player.crystals;
                e = e.log10();
                return 1 + e;
            }
        },
        24: {
            title: 'Rapid Fire',
            desc: 'Unlock fast autobuyers, and the buildings/construction tabs are never reset on sacrifice (except bricks and resources).',
            cost: new Decimal(20000),
            preReq: 23,
            buttonID: 'timeUpg24',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: '',
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
            displayFormula: '1 + 10*log(x)',
            effect: function() {
                var e = player.crystals;
                e = e.log10()*10
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
            displayFormula: '',
            effect: function() {
                return new Decimal(1.5);
            }
        },
        33: {
            title: 'Lightspeed',
            desc: 'Unlock bulk autobuyers, and crystal gain is boosted based on your nekro-photons.',
            cost: new Decimal(150000),
            preReq: 32,
            buttonID: 'timeUpg33',
            displayEffect: true,
            displayTooltip: true,
            displayFormula: '1 + 2*(x^0.2)',
            effect: function() {
                let e = new Decimal(player.buildings[3].amount);
                e = Decimal.pow(e, 0.2).times(2);
                return e.plus(1);
            }
        },
        34: {
            title: 'Supernova',
            desc: 'Unlock the world prestige autobuyer and the second row of Dead Sun upgrades.',
            cost: new Decimal(1000000),
            preReq: 33,
            buttonID: 'timeUpg34',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: '',
            effect: function() {
                return new Decimal(1);
            }
        },
    }
}