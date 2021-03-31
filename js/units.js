//misc info functions

function canAffordUnit(tier) {
    return (player.corpses.gte(DATA.u[tier].cost())&&DATA.ul.units[tier]());
}

function canUnlock(tier) {
    return player.spaceResets.plus(5).gte(tier);
}

//production/calculation

function zap() {
    player.corpses = player.corpses.plus(getZapGain());
}

function getZapGain() {
    let z = Decimal.floor(player.units[1].amount.sqrt());
    return Decimal.max(z, 1);
}

function getCorpsesPerSecond(disp=false) {
    let c = player.units[1].amount.gt(0) ? player.units[1].amount.times(getTotalCorpseMult()) : new Decimal(0);
    if (hasTUpgrade(41)) { c = c.times(getTUpgEffect(41)); }
    if (hasTUpgrade(42)) { c = c.times(getTUpgEffect(42)); }
    if (hasEUpgrade(12)) { c = c.times(getEUpgEffect(12)); }
    if (player.isInResearch) {
        c = c.pow(0.9);
        if (isResearchActive(7)) { c = c.pow(0.9); }
    }
    if (disp && player.displayRealTime) { return c.times(getRealTimeMultiplier()); }
    else { return c; }
}

function getUnitProdPerSecond(tier, disp=false) {
    if (tier == NUM_UNITS) { return (hasGUpgrade(2, 41)) ? new Decimal(Decimal.max(getEssenceProdPerSecond(), 1).log10()) : new Decimal(0); }
    let p = player.units[tier+1].amount;
    if (!hasGUpgrade(2, 21)) { p = p.div(tier+1); }
    p = p.times(DATA.u[tier+1].prodMult());
    if (player.isInResearch) { p = p.pow(0.9); }
    if (disp && player.displayRealTime) { return p.times(getRealTimeMultiplier()); }
    else { return p; }
}

function getCorpseMultFromUnits() {
    var mult = new Decimal(0);
    for (var i=1; i<=NUM_UNITS; i++) {
        if ((i==8) && hasUpgrade(1, 22) && DATA.u[8].mult().gt(1)) { mult = mult.times(DATA.u[i].mult()); }
        else { mult = mult.plus(DATA.u[i].mult()); }
    }
    return Decimal.max(mult, 1);
}

function getTotalCorpseMult() {
    var mult = getCorpseMultFromUnits();
    mult = mult.times(getWorldsBonus());
    if (player.stats['allTimeStats'].totalGalaxies.gt(0)) { mult = mult.times(getGalaxiesBonus()); }
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
    if (isResearchCompleted(6)) { boost = boost.pow(getTheoremBoostW()); }
    return boost;
}

//buy functions

function buySingleUnit(tier) {
    if (canAffordUnit(tier)) {
        player.corpses = player.corpses.minus(DATA.u[tier].cost());
        player.units[tier].amount = player.units[tier].amount.plus(1);
        player.units[tier].bought = player.units[tier].bought.plus(1);
    }
}

function buyMaxUnits(tier) {
    if (canAffordUnit(tier)) {
        var totalBought = calculateMaxUnits(tier)[0];
        player.corpses = player.corpses.minus(calculateMaxUnits(tier)[1]);
        player.units[tier].amount = player.units[tier].amount.plus(totalBought);
        player.units[tier].bought = player.units[tier].bought.plus(totalBought);
    }
}

function calculateMaxUnits(tier) {
    var count = 0;
    var totalCost = new Decimal(0);
    var newCost = DATA.u[tier].cost();
    if (canAffordUnit(tier)) {    
        while (player.corpses.gte(totalCost.plus(newCost))) {
            totalCost = totalCost.plus(newCost);
            count++;
            newCost = DATA.u[tier].costFuture(player.units[tier].bought.plus(count));
        }
    }
    return new Array(new Decimal(count), totalCost);
}

function calculateMaxUnitsCost(tier) {
    var count = calculateMaxUnits(tier);
    var total = new Decimal(0);
    if (count > 0) {
        for (var i=0; i<count; i++) {
            total = total.plus(DATA.u[tier].cost().times(DATA.u[tier].baseCostMult.pow(i)));
            if (player.units[tier].bought.plus(count).gte(DATA.u[tier].expCostStart)) { total = total.times(Decimal.pow(DATA.u[tier].expCostMult, addFactorial(player.units[tier].bought.minus(DATA.u[tier].expCostStart)))); }
            if (player.units[tier].bought.plus(count).gte(DATA.u[tier].superExpCostStart)) { total = total.times(Decimal.pow(DATA.u[tier].superExpCostMult, addFactorial(player.units[tier].bought.minus(DATA.u[tier].superExpCostStart)))); }
        }
    }
    return total;
}

function buyMaxAll() {
    for (var i=NUM_UNITS; i>0; i--) {
        if (DATA.ul.units[i]()) {
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
    if (canSpacePrestige()) {
        if (player.confirmations['worldPrestige']['click']) { confirmation(DATA.u.prestige.confirmPopText, 'spacePrestigeNoConfirm'); }
        else { spacePrestigeNoConfirm(); }
    }
}

function spacePrestigeKey() {
    if (canSpacePrestige()) {
        if (player.confirmations['worldPrestige']['key']) { confirmation(DATA.u.prestige.confirmPopText, 'spacePrestigeNoConfirm'); }
        else { spacePrestigeNoConfirm(); }
    }
}

function spacePrestige() {
    if (canSpacePrestige()) {
        if (player.confirmations['worldPrestige']) {
            if (!confirm('Are you sure? This will reset ALL of your corpses, units, and astral bricks.<br>(These confirmations can be disabled in options)')) return
        }
        let worldsGain = calculateWorldsGain();
        player.spaceResets = player.spaceResets.plus(worldsGain);
        player.worlds = player.worlds.plus(worldsGain);
        if (player.worlds.gt(player.stats['thisSacStats'].bestWorlds)) { player.stats['thisSacStats'].bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.stats['thisAscStats'].bestWorlds)) { player.stats['thisAscStats'].bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.stats['allTimeStats'].bestWorlds)) { player.stats['allTimeStats'].bestWorlds = new Decimal(player.worlds); }
        player.stats['thisSacStats'].totalSpaceResets = player.stats['thisSacStats'].totalSpaceResets.plus(worldsGain);
        player.stats['thisSacStats'].totalWorlds = player.stats['thisSacStats'].totalWorlds.plus(worldsGain);
        player.stats['thisAscStats'].totalSpaceResets = player.stats['thisAscStats'].totalSpaceResets.plus(worldsGain);
        player.stats['thisAscStats'].totalWorlds = player.stats['thisAscStats'].totalWorlds.plus(worldsGain);
        player.stats['allTimeStats'].totalSpaceResets = player.stats['allTimeStats'].totalSpaceResets.plus(worldsGain);
        player.stats['allTimeStats'].totalWorlds = player.stats['allTimeStats'].totalWorlds.plus(worldsGain);
        spacePrestigeReset();
    }
}

function spacePrestigeNoConfirm() {
    if (canSpacePrestige()) {
        let worldsGain = calculateWorldsGain();
        player.spaceResets = player.spaceResets.plus(worldsGain);
        player.worlds = player.worlds.plus(worldsGain);
        if (player.worlds.gt(player.stats['thisSacStats'].bestWorlds)) { player.stats['thisSacStats'].bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.stats['thisAscStats'].bestWorlds)) { player.stats['thisAscStats'].bestWorlds = new Decimal(player.worlds); }
        if (player.worlds.gt(player.stats['allTimeStats'].bestWorlds)) { player.stats['allTimeStats'].bestWorlds = new Decimal(player.worlds); }
        player.stats['thisSacStats'].totalSpaceResets = player.stats['thisSacStats'].totalSpaceResets.plus(worldsGain);
        player.stats['thisSacStats'].totalWorlds = player.stats['thisSacStats'].totalWorlds.plus(worldsGain);
        player.stats['thisAscStats'].totalSpaceResets = player.stats['thisAscStats'].totalSpaceResets.plus(worldsGain);
        player.stats['thisAscStats'].totalWorlds = player.stats['thisAscStats'].totalWorlds.plus(worldsGain);
        player.stats['allTimeStats'].totalSpaceResets = player.stats['allTimeStats'].totalSpaceResets.plus(worldsGain);
        player.stats['allTimeStats'].totalWorlds = player.stats['allTimeStats'].totalWorlds.plus(worldsGain);
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
    //unitSetup(DATA.sp);
    if (!hasTUpgrade(44) || player.isInResearch) { player.corpses = hasAchievement(41) ? new Decimal(DATA.sp.corpsesAch41) : (hasAchievement(13) ? new Decimal(DATA.sp.corpsesAch13) : new Decimal(DATA.sp.corpses)) }
    //allDisplay();
    
    if (!player.unlocks['buildings']) {
        player.tab = 'unitsTab';
        player.subTabs['b'] = 'buildingsSubTab';
    } else if (!player.unlocks['construction']) { player.subTabs['b'] = 'buildingsSubTab'; }
    save();
    //loadStyles();
    startInterval();
}

function resetUnits(ascension=false) {
    for (var z=NUM_UNITS; z>0; z--) {
        player.units[z].bought = new Decimal(DATA.sp.units[z].bought);
        player.units[z].amount = new Decimal(DATA.sp.units[z].amount);
        if ((!player.stats['allTimeStats'].totalAscensions.gt(0))&&!ascension) { player.units[z].unlocked = DATA.sp.units[z].unlocked; }
    }
}

//data

var UNITS_DATA = {
    notify:  false,
    indirect: false,
    layerDisplay: {
        layerButtonClass: 'unitBut',
        numClass: 'corpseNum',
    },
    multi: {
        rows: 3,
        cols: 4,
        idPre: 'research',
        klass: function() { return 'researchDiv' },
        numBoxes: 6,
        numElsByBox: function(i) {
            return Object.keys(this.dataLists[i]).length;
        },
        boxUnlocked: function(i) {
            let boxid=this.dataLists[i].boxID;
            if (boxid<=10) { return true; }
            else if (boxid==11) { return player.unlocks['timeDimBuyer']; }
            else if (boxid==12) { return player.unlocks['ascensionBuyer']; }
        },
        dataLists: {
            11: {
                1: {
                    id: 1,
                    boxID: 1,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Project 1`; }
                },
                2: {
                    id: 2,
                    boxID: 1,
                    tag: 'div',
                    klass: function() { return `resConds`; },
                    htm: function() { return `The <strong>Triangulum</strong> galaxy tree is locked.<br>All unit tier corpse multipliers are raised to the ^0.9.`; }
                },
                3: {
                    id: 3,
                    boxID: 1,
                    tag: 'hr',
                    klass: function() { return `resHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 1,
                    tag: 'h6',
                    klass: function() { return ``; },
                    htm: function() { return `Reward:`; }
                },
                5: {
                    id: 5,
                    boxID: 1,
                    tag: 'div',
                    klass: function() { return `resReward`; },
                    htm: function() { return `All unit tier corpse multipliers are raised to the ^1.1.`; }
                },
                6: {
                    id: 6,
                    boxID: 1,
                    tag: 'h6',
                    klass: function() { return ''; },
                    htm: function() { return `Goal: 1e6 Void Research`; }
                },
                7: {
                    id: 7,
                    boxID: 1,
                    tag: 'button',
                    klass: function() { return `${isResearchCompleted(this.boxID) ? 'completedResearchBut' : (player.isInResearch ? (isResearchActive(this.boxID) ? 'progressResearchButton' : 'unclickResearchBut') : 'researchButton')}`; },
                    htm: function() { return `${isResearchActive(this.boxID) ? 'IN PROGRESS' : (isResearchCompleted(this.boxID) ? 'COMPLETED' : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
            12: {
                1: {
                    id: 1,
                    boxID: 2,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Project 2`; }
                },
                2: {
                    id: 2,
                    boxID: 2,
                    tag: 'div',
                    klass: function() { return `resConds`; },
                    htm: function() { return `The <strong>Andromeda</strong> galaxy tree is locked.<br>The Death Factory is disabled.`; }
                },
                3: {
                    id: 3,
                    boxID: 2,
                    tag: 'hr',
                    klass: function() { return `resHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 2,
                    tag: 'h6',
                    klass: function() { return ``; },
                    htm: function() { return `Reward:`; }
                },
                5: {
                    id: 5,
                    boxID: 2,
                    tag: 'div',
                    klass: function() { return `resReward`; },
                    htm: function() { return `The Death Factory's first upgrade row is never reset.`; }
                },
                6: {
                    id: 6,
                    boxID: 2,
                    tag: 'h6',
                    klass: function() { return ''; },
                    htm: function() { return `Goal: 1e9 Void Research`; }
                },
                7: {
                    id: 7,
                    boxID: 2,
                    tag: 'button',
                    klass: function() { return `${isResearchCompleted(this.boxID) ? 'completedResearchBut' : (player.isInResearch ? (isResearchActive(this.boxID) ? 'progressResearchButton' : 'unclickResearchBut') : 'researchButton')}`; },
                    htm: function() { return `${isResearchActive(this.boxID) ? 'IN PROGRESS' : (isResearchCompleted(this.boxID) ? 'COMPLETED' : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
            13: {
                1: {
                    id: 1,
                    boxID: 3,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Project 3`; }
                },
                2: {
                    id: 2,
                    boxID: 3,
                    tag: 'div',
                    klass: function() { return `resConds`; },
                    htm: function() { return `The <strong>Circinus</strong> galaxy tree is locked.<br>Exponential cost scaling for all construction upgrades starts at level 1.`; }
                },
                3: {
                    id: 3,
                    boxID: 3,
                    tag: 'hr',
                    klass: function() { return `resHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 3,
                    tag: 'h6',
                    klass: function() { return ``; },
                    htm: function() { return `Reward:`; }
                },
                5: {
                    id: 5,
                    boxID: 3,
                    tag: 'div',
                    klass: function() { return `resReward`; },
                    htm: function() { return `Exp. cost scaling for all construction upgrades starts 10 levels later (after 3.22).`; }
                },
                6: {
                    id: 6,
                    boxID: 3,
                    tag: 'h6',
                    klass: function() { return ''; },
                    htm: function() { return `Goal: 1e12 Void Research`; }
                },
                7: {
                    id: 7,
                    boxID: 3,
                    tag: 'button',
                    klass: function() { return `${isResearchCompleted(this.boxID) ? 'completedResearchBut' : (player.isInResearch ? (isResearchActive(this.boxID) ? 'progressResearchButton' : 'unclickResearchBut') : 'researchButton')}`; },
                    htm: function() { return `${isResearchActive(this.boxID) ? 'IN PROGRESS' : (isResearchCompleted(this.boxID) ? 'COMPLETED' : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
            21: {
                1: {
                    id: 1,
                    boxID: 4,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Project 4`; }
                },
                2: {
                    id: 2,
                    boxID: 4,
                    tag: 'div',
                    klass: function() { return `resConds`; },
                    htm: function() { return `The <strong>Sculptor Dwarf</strong> galaxy tree is locked.<br>The anti time essence effect is disabled.`; }
                },
                3: {
                    id: 3,
                    boxID: 4,
                    tag: 'hr',
                    klass: function() { return `resHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 4,
                    tag: 'h6',
                    klass: function() { return ``; },
                    htm: function() { return `Reward:`; }
                },
                5: {
                    id: 5,
                    boxID: 4,
                    tag: 'div',
                    klass: function() { return `resReward`; },
                    htm: function() { return `The anti time effect is equal to the true time effect whenever it would be 1x.`; }
                },
                6: {
                    id: 6,
                    boxID: 4,
                    tag: 'h6',
                    klass: function() { return ''; },
                    htm: function() { return `Goal: 1e14 Void Research`; }
                },
                7: {
                    id: 7,
                    boxID: 4,
                    tag: 'button',
                    klass: function() { return `${isResearchCompleted(this.boxID) ? 'completedResearchBut' : (player.isInResearch ? (isResearchActive(this.boxID) ? 'progressResearchButton' : 'unclickResearchBut') : 'researchButton')}`; },
                    htm: function() { return `${isResearchActive(this.boxID) ? 'IN PROGRESS' : (isResearchCompleted(this.boxID) ? 'COMPLETED' : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
            22: {
                1: {
                    id: 1,
                    boxID: 5,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Project 5`; }
                },
                2: {
                    id: 2,
                    boxID: 5,
                    tag: 'div',
                    klass: function() { return `resConds`; },
                    htm: function() { return `You can only use one galaxy tree.`; }
                },
                3: {
                    id: 3,
                    boxID: 5,
                    tag: 'hr',
                    klass: function() { return `resHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 5,
                    tag: 'h6',
                    klass: function() { return ``; },
                    htm: function() { return `Reward:`; }
                },
                5: {
                    id: 5,
                    boxID: 5,
                    tag: 'div',
                    klass: function() { return `resReward`; },
                    htm: function() { return `The sacrifice threshold and crystal gain formula are based on 1e20 -> 1e15 corpses.`; }
                },
                6: {
                    id: 6,
                    boxID: 5,
                    tag: 'h6',
                    klass: function() { return ''; },
                    htm: function() { return `Goal: 1e10 Void Research`; }
                },
                7: {
                    id: 7,
                    boxID: 5,
                    tag: 'button',
                    klass: function() { return `${isResearchCompleted(this.boxID) ? 'completedResearchBut' : (player.isInResearch ? (isResearchActive(this.boxID) ? 'progressResearchButton' : 'unclickResearchBut') : 'researchButton')}`; },
                    htm: function() { return `${isResearchActive(this.boxID) ? 'IN PROGRESS' : (isResearchCompleted(this.boxID) ? 'COMPLETED' : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
            23: {
                1: {
                    id: 1,
                    boxID: 6,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Project 6`; }
                },
                2: {
                    id: 2,
                    boxID: 6,
                    tag: 'div',
                    klass: function() { return `resConds`; },
                    htm: function() { return `You can only buy one galaxy upgrade from each tree and from each row (the normal upgrade requirements are suspended).`; }
                },
                3: {
                    id: 3,
                    boxID: 6,
                    tag: 'hr',
                    klass: function() { return `resHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 6,
                    tag: 'h6',
                    klass: function() { return ``; },
                    htm: function() { return `Reward:`; }
                },
                5: {
                    id: 5,
                    boxID: 6,
                    tag: 'div',
                    klass: function() { return `resReward`; },
                    htm: function() { return `Unlock the second row of Galactic Vortex upgrades.`; }
                },
                6: {
                    id: 6,
                    boxID: 6,
                    tag: 'h6',
                    klass: function() { return ''; },
                    htm: function() { return `Goal: 1e15 Void Research`; }
                },
                7: {
                    id: 7,
                    boxID: 6,
                    tag: 'button',
                    klass: function() { return `${isResearchCompleted(this.boxID) ? 'completedResearchBut' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'researchButton' : 'progressResearchButton') : 'unclickResearchBut') : 'researchButton')}`; },
                    htm: function() { return `${isResearchCompleted(this.boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
        },
    },
    prestige: {
        className: 'spacePrestige',
        heading: 'This world is dead and empty...',
        desc: 'Give up all your units and corpses to exterminate a new world. You gain a boost to corpse gain based on total exterminated worlds.',
        confirmPopText: 'This will reset ALL of your corpses, units, and astral bricks.<br><span style="font-size: 11pt;">(These confirmations can be disabled in options)</span>',
        displayDesc: function() { return !player.spaceResets.gt(2); },
        displayTooltip: false,
        displayFormula: function() { return '' },
        canReset: function() { return canSpacePrestige(); },
        getGain: function() { return calculateWorldsGain(); },
        gainResource: 'exterminated worlds',
        getReqAmount: function() { return formatWhole(player.nextSpaceReset[0]); },
        getReqResource: function() {
            switch (player.nextSpaceReset[1]) {
                case 8: 
                    return (player.nextSpaceReset[0]>1 ? 'sun eaters' : 'sun eater'); 
                case 7: 
                    return 'ancient one'; 
                case 6: 
                    return 'behemoth'; 
                default: 
                    return 'lich'; 
            }
        },
        doReset: function() { spacePrestigeClick(); },
        showNextAt: false,
        getNextAt: function() {
            return;
        }
    },
    numTiers: 8,
    resource: 'corpses',
    className: 'unitBut',
    getMax: function(tier) { return calculateMaxUnits(tier)[0]; },
    buySingle: function(tier) { buySingleUnit(tier); },
    buyMax: function(tier) { buyMaxUnits(tier); },
    buyMaxA: function() { buyMaxAll(); },
    1: {
        single: "zombie",
        name: "zombies",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(10),
        baseMultPer: function() {
            if (hasGUpgrade(2, 11)) { return new Decimal(2.5); }
            else { return new Decimal(1.75); }
        },
        baseCostMult: new Decimal(100),
        expCostMult: 10,
        expCostStart: 10,
        superExpCostMult: 100000000000,
        superExpCostStart: 40,
        expCostStartCost: new Decimal(1e21),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer();
            m = m.times(getCUpgEffect(1));
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasUpgrade(1, 11)) m = m.times(getUpgEffect(1, 11));
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "abominations",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(100),
        baseMultPer: new Decimal(2),
        baseCostMult: new Decimal(10000),
        expCostMult: 10,
        expCostStart: 7,
        superExpCostMult: 100000000000,
        superExpCostStart: 37,
        expCostStartCost: new Decimal(1e30),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            m = m.times(getCUpgEffect(3));
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "skeleton mages",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(10000),
        baseMultPer: new Decimal(2),
        baseCostMult: new Decimal(10000),
        expCostMult: 10,
        expCostStart: 7,
        superExpCostMult: 100000000000,
        superExpCostStart: 37,
        expCostStartCost: new Decimal(1e32),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "banshees",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(1000000),
        baseMultPer: new Decimal(2),
        baseCostMult: new Decimal(1000000),
        expCostMult: 10,
        expCostStart: 5,
        superExpCostMult: 100000000000,
        superExpCostStart: 35,
        expCostStartCost: new Decimal(1e36),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "liches",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(1e9),
        baseMultPer: new Decimal(2.2),
        baseCostMult: new Decimal(1e10),
        expCostMult: 10,
        expCostStart: 4,
        superExpCostMult: 100000000000,
        superExpCostStart: 34,
        expCostStartCost: new Decimal(1e49),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "behemoths",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(1e13),
        baseMultPer: new Decimal(2.2),
        baseCostMult: new Decimal(1e11),
        expCostMult: 10,
        expCostStart: 4,
        superExpCostMult: 100000000000,
        superExpCostStart: 34,
        expCostStartCost: new Decimal(1e58),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "ancient ones",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(1e19),
        baseMultPer: new Decimal(2.5),
        baseCostMult: new Decimal(1e12),
        expCostMult: 10,
        expCostStart: 3,
        superExpCostMult: 100000000000,
        superExpCostStart: 33,
        expCostStartCost: new Decimal(1e55),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            c = c.times(this.baseCostMult.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m.plus(DATA.u[this.tier+1].prodMult());
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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
        name: "sun eaters",
        unlocked: function() { return player.units[this.tier].unlocked; },
        baseCost: new Decimal(1e25),
        baseMultPer: new Decimal(2.5),
        baseCostMult: new Decimal(1e15),
        expCostMult: 10,
        expCostStart: 3,
        superExpCostMult: 100000000000,
        superExpCostStart: 33,
        expCostStartCost: new Decimal(1e70),
        canAfford() {
            return player.corpses.gte(this.cost());
        },
        cost: function() {
            var c = this.baseCost;
            var m = this.baseCostMult;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            if (hasUpgrade(3, 22)) { m = Decimal.pow(m, getUpgEffect(3, 22)); }
            c = c.times(m.pow(player.units[this.tier].bought));
            if (player.units[this.tier].bought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(player.units[this.tier].bought.minus(e)))); }
            return c;
        },
        costFuture: function(numBought) {
            var c = this.baseCost;
            var m = this.baseCostMult;
            var e = hasGUpgrade(2, 32) ? this.expCostStart*2 : this.expCostStart
            if (hasUpgrade(3, 22)) { m = Decimal.pow(m, getUpgEffect(3, 22)); }
            c = c.times(m.pow(numBought));
            if (numBought.gte(e)) { c = c.times(Decimal.pow(this.expCostMult, addFactorial(numBought.minus(e)))); }
            return c;
        },
        mult: function() {
            var m = this.baseMultPer;
            if (hasUpgrade(1, 12)) { m = m.times(getUpgEffect(1, 12)); }
            if (player.units[this.tier].bought.eq(0)) { return new Decimal(0); }
            m = m.pow(player.units[this.tier].bought-1);
            if (hasTUpgrade(22)) { m = m.times(getTUpgEffect(22)); }
            if (hasAchievement(31)) { m = m.times(getAchievementEffect(31)); }
            if (hasAchievement(73)) { m = m.times(getAchievementEffect(73)); }
            m = m.times(getAchievementBoost());
            if (isResearchActive(1)) { m = m.pow(0.9); }
            else if (isResearchCompleted(1)) { m = m.pow(1.1); }
            return m;
        },
        prodMult: function() {
            var m = this.mult();
            if (!hasUpgrade(1, 13)) { m = m.sqrt(); }
            if (hasGUpgrade(2, 31)) { m = m.times(getGUpgEffect(2, 31)); }
            return m;
        },
        gainPercent: function() { return getUnitProdPerSecond(this.tier, true).div(this.amount()).times(100); },
        bought: function() { return player.units[this.tier].bought; },
        amount: function() { return player.units[this.tier].amount; },
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