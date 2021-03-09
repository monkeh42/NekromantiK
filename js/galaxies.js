



function arkIsUnlocked(a) {
    return player.ark[a].unlocked;
}

function getAUpgCost(a) {
    return ARK_DATA[a].cost;
}

function getAUpgDesc(a) {
    return ARK_DATA[a].desc;
}

function getAUpgName(a) {
    return ARK_DATA[a].title;
}

function getAUpgEffect(a) {
    return ARK_DATA[a].effect();
}

function hasAUpgrade(a) {
    return player.ark[a].bought;
}

function canAffordAUpg(a) {
    return (player.bricks.gte(ARK_DATA[a].cost) && player.ark[a].unlocked);
}

function isDisplayEffectA(a) {
    return ARK_DATA[a].displayEffect;
}

function isDisplayTooltipA(a) {
    return ARK_DATA[a].displayTooltip;
}

function getGUpgCost(g, u) {
    return GALAXIES_DATA[g].upgrades[u].cost();
}

function getGUpgDesc(g, u) {
    return GALAXIES_DATA[g].upgrades[u].desc;
}

function getGUpgName(g, u) {
    return GALAXIES_DATA[g].upgrades[u].title;
}

function getGUpgEffect(g, u) {
    return GALAXIES_DATA[g].upgrades[u].effect();
}

function hasGUpgrade(g, u) {
    return player.galaxyUpgs[g][u].bought;
}

function isDisplayEffectG(g, u) {
    return GALAXIES_DATA[g].upgrades[u].displayEffect;
}

function isDisplayTooltipG(g, u) {
    return GALAXIES_DATA[g].upgrades[u].displayTooltip;
}

function hasPrereqGUpg(g, u) {
    if (u==11) { return true; }
    else {
        var reqs = GALAXIES_DATA[g].upgrades[u].requires;
        for (var i=0; i<reqs.length; i++) {
            if (hasGUpgrade(g, reqs[i])) { return true; }
        }
        return false;
    }
}

function getGUpgsByRow(row) {
    var upgsByRow = new Array();
    if (row==1 || row == 4) {
        for (let i=1; i<=4; i++) { upgsByRow.push([i.toString(), row.toString() + '1']) }
    } else {
        for (let i=1; i<=4; i++) {
            upgsByRow.push([i.toString(), row.toString() + '1'])
            upgsByRow.push([i.toString(), row.toString() + '2'])
        }
    }
    return upgsByRow;
}

function canAffordGUpg(g, u) {
    if (player.galaxies.gte(GALAXIES_DATA[g].upgrades[u].cost())) {
        return hasPrereqGUpg(g, u) && !hasGUpgrade(g, u);
    } else { return false; }
}

function buyGUpg(g, u) {
    if (canAffordGUpg(g, u)) {
        let thisRow = GALAXIES_DATA[g].upgrades[u].row;
        player.galaxies = player.galaxies.minus(GALAXIES_DATA[g].upgrades[u].cost());
        player.spentGalaxies = player.spentGalaxies.plus(GALAXIES_DATA[g].upgrades[u].cost());
        player.galaxyUpgs[g][u].bought = true;
        GALAXIES_DATA[g].upgrades[u].onBuy();
        addGUpgClass(g, u, 'boughtGalaxyUpg');
        remGUpgClass(g, u, 'galaxyUpg');

        if (u == 21) {
            player.galaxyUpgs[g][22].locked = true;
            addGUpgClass(g, 22, 'lockedGalaxyUpg');
            remGUpgClass(g, 22, 'galaxyUpg')
            remGUpgClass(g, 22, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[22].textID).style.display = 'none';
            player.galaxyUpgs[g][32].locked = true;
            addGUpgClass(g, 32, 'lockedGalaxyUpg');
            remGUpgClass(g, 32, 'galaxyUpg')
            remGUpgClass(g, 32, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[32].textID).style.display = 'none';
        } else if (u == 22) {
            player.galaxyUpgs[g][21].locked = true;
            addGUpgClass(g, 21, 'lockedGalaxyUpg');
            remGUpgClass(g, 21, 'galaxyUpg')
            remGUpgClass(g, 21, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[21].textID).style.display = 'none';
            player.galaxyUpgs[g][31].locked = true;
            addGUpgClass(g, 31, 'lockedGalaxyUpg');
            remGUpgClass(g, 31, 'galaxyUpg')
            remGUpgClass(g, 31, 'unclickGalaxyUpg')
            document.getElementById(GALAXIES_DATA[g].upgrades[31].textID).style.display = 'none';
        }

        for (let gg in GALAXIES_DATA) {
            for (let uu in GALAXIES_DATA[gg].upgrades) {
                if (GALAXIES_DATA[gg].upgrades[uu].row>thisRow || (GALAXIES_DATA[gg].upgrades[uu].row==1 && thisRow==4)) {
                    document.getElementById('gUpgCost' + gg.toString() + '.' + uu.toString()).innerHTML = formatWhole(getGUpgCost(gg, uu)) + ' ' + galaxyTextSingulizer(getGUpgCost(gg, uu));
                }
            }
        }

        /*if (thisRow>1) {
            if (!player.galaxyRowsLocked[thisRow-1]) { rowLock(thisRow-1); }
        }
        if (thisRow==4) {
            unlockRows();
        }*/
    }
}

/*function rowLock(row) {
    let lockedRows = getGUpgsByRow(row);
    let g, u;
    for (let i=0; i<lockedRows.length; i++) {
        g = lockedRows[i][0];
        u = lockedRows[i][1];
        if (!player.galaxyUpgs[g][u].locked && !player.galaxyUpgs[g][u].bought) {
            displayData.push(['addClass', 'galaxyUpg'+g+'.'+u, 'lockedGalaxyRow']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'galaxyUpg']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'unclickGalaxyUpg']);
            displayData.push(['togClass', 'text'+g+'.'+u, 'lockedGalaxySpan']);
            player.galaxyUpgs[g][u].rowLocked = true;
        }
    }
    player.galaxyRowsLocked[row] = true;
}

function unlockRows() {
    for (r=1; r<=4; r++) {
        unlockRow(r);
    }
}

function unlockRow(r) {
    let lockedRows = getGUpgsByRow(r);
    for (let i=0; i<lockedRows.length; i++) {
        g = lockedRows[i][0];
        u = lockedRows[i][1];
        if (player.galaxyUpgs[g][u].rowLocked) {
            displayData.push(['addClass', 'galaxyUpg'+g+'.'+u, 'galaxyUpg']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'lockedGalaxyRow']);
            displayData.push(['remClass', 'galaxyUpg'+g+'.'+u, 'unclickGalaxyUpg']);
            displayData.push(['togClass', 'text'+g+'.'+u, 'lockedGalaxySpan']);
            player.galaxyUpgs[g][u].rowLocked = false;
        }
    }
    player.galaxyRowsLocked[r] = false;
}*/

function buyArkUpgrade(a) {
    if (!player.ark[a].bought && canAffordAUpg(a)) {
        player.bricks = player.bricks.minus(getAUpgCost(a));
        player.ark[a].bought = true;
        player.push(['togDisplay', a]);
        addAUpgClass(a, 'boughtArkUpg');
        remAUpgClass(a, 'arkUpg');
    }
}

function respecGalaxiesClick() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['click']) {
            if (!confirm('Are you sure? This will reset ALL of your progress up to unlocking Galaxies.<br>(These confirmations can be disabled in options)')) return
        }
        if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
        else { galaxyPrestigeReset(true); }
    }
}

function respecGalaxiesKey() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['key']) {
            if (!confirm('Are you sure? This will reset ALL of your progress up to unlocking Galaxies.<br>(These confirmations can be disabled in options)')) return
        }
        if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
        else { galaxyPrestigeReset(true); }
    }
}

function respecGalaxies() {
    if (getBoughtGUpgs() == 0 && !hasAchievement(52)) { unlockAchievement(52); }
    player.galaxies = player.galaxies.plus(player.spentGalaxies);
    player.spentGalaxies = new Decimal(0);
    //unlockRows();
    copyData(player.galaxyUpgs, START_PLAYER.galaxyUpgs);
    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
    //copyData(player.galaxyRowsLocked, START_PLAYER.galaxyRowsLocked);
    loadStyles();
}

function galaxyPrestigeClick() {
    if (player.confirmations['galaxyPrestige']['click']) { galaxyPrestige(); }
    else { galaxyPrestigeNoConfirm(); }
}

function galaxyPrestigeKey() {
    if (player.confirmations['galaxyPrestige']['key']) { galaxyPrestige(); }
    else { galaxyPrestigeNoConfirm(); }
}

function canGalaxyPrestige() {
    return player.worlds.gte(10);
}

function calculateGalaxyGain() {
    if (player.worlds.lt(10)) { return new Decimal(0); }
    let g = new Decimal(player.worlds).div(10);
    let d = new Decimal(g.sqrt());
    let gals = Decimal.floor(player.worlds.pow(g.minus(d).plus(isBuilt(4) ? BUILDS_DATA[4].resourceEff() : 0)));
    return gals.plus(getCUpgEffect(6));
}

function calculateGalaxyGainFuture(w) {
    if (w.lt(10)) { return new Decimal(0); }
    let g = new Decimal(w).div(10);
    let d = new Decimal(g.sqrt());
    let gals = Decimal.floor(w.pow(g.minus(d).plus(isBuilt(4) ? BUILDS_DATA[4].resourceEff() : 0)));
    return gals.plus(getCUpgEffect(6));
}

function calculateNextGalaxy() {
    let gain = calculateGalaxyGain();
    if (gain.gte(1)) {
        let next = gain.plus(1);
        let nextW = new Decimal(player.worlds);
        let newGain = new Decimal(0);
        let g = new Decimal(0);
        let d = new Decimal(0)
        while (newGain.lt(next)) {
            nextW = nextW.plus(1);
            g = new Decimal(nextW).div(10);
            d = new Decimal(g.sqrt());
            newGain = calculateGalaxyGainFuture(nextW);
        }
        return nextW;
    }
}

function galaxyPrestige(respec=false) {
    if (canGalaxyPrestige()) {
        if (getBoughtGUpgs()==0 && player.ascensions.gt(0) && !hasAchievement(55)) { unlockAchievement(55); }
        if (!confirm('Are you sure? This will reset ALL of your progress up to unlocking Galaxies.<br>(These confirmations can be disabled in options)')) return
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.allTimeStats.totalGalaxies = player.allTimeStats.totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.allTimeStats.bestGalaxies)) { player.allTimeStats.bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.allTimeStats.totalAscensions = player.allTimeStats.totalAscensions.plus(1);
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeNoConfirm(respec=false) {
    if (canGalaxyPrestige()) {
        if (getBoughtGUpgs()==0 && player.ascensions.gt(0) && !hasAchievement(55)) { unlockAchievement(55); }
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.allTimeStats.totalGalaxies = player.allTimeStats.totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.allTimeStats.bestGalaxies)) { player.allTimeStats.bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.allTimeStats.totalAscensions = player.allTimeStats.totalAscensions.plus(1);
        if (document.getElementById('respecOnAsc').checked) {
            document.getElementById('respecOnAsc').checked = false;
        }
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeReset(respec=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (player.timeLocked && !player.dontResetSlider) {
        player.timeLocked = false;
        toggleTimeLockDisplay();
        document.getElementById('timeSlider').disabled = false;
    }
    clearInterval(mainLoop);
    
    if (!hasAchievement(42)) {
        copyData(player.autobuyers, START_PLAYER.autobuyers);
        updateAutobuyersDisplay();
    }

    player.pastAscRuns.lastRun.galaxyGain = calculateGalaxyGain();
    player.pastAscRuns.lastRun.timeSpent = new Date()-player.pastAscRuns.lastRun.timeAscended;
    player.pastAscRuns.lastRun.timeAscended = new Date();
    if (player.pastAscRuns.lastRun.galaxyGain.gt(player.allTimeStats.bestGalaxyGain)) { player.allTimeStats.bestGalaxyGain = new Decimal(player.pastAscRuns.lastRun.galaxyGain) }
    for (var i=9; i>=0; i--) { copyData(player.pastAscRuns.lastTen[i], player.pastAscRuns.lastTen[i-1]); }
    copyData(player.pastAscRuns.lastTen[0], player.pastAscRuns.lastRun);
    copyData(player.pastRuns, START_PLAYER.pastRuns);

    resetTime();
    resetTimeCounts();
    resetUnits();
    resetBuildingResources(false, true);
    resetBuildings(true);
    if (!hasAchievement(42)) { lockElements('unitsTab', 'autobuyers'); }
    if (!hasAchievement(43)) { lockTab('timeTab'); }
    else { lockElements('timeTab', 'mainTab'); }
    
    
    if (document.getElementById('respecOnAsc').checked || respec) {
        respecGalaxies();
    }
    document.getElementById('respecOnAsc').checked = false;

    player.corpses = hasAchievement(41) ? new Decimal(START_PLAYER.corpsesAch41) : new Decimal(START_PLAYER.corpses)
    if (!hasAchievement(42)) { showUnitSubTab('unitsSubTab'); }
    if (!hasMilestone(1)) { showBuildingSubTab('buildingsSubTab'); }
    if (!hasAchievement(43)) { showTimeSubTab('timeDimSubTab'); }
    save();
    loadStyles();
    startInterval();
}

function resetTimeCounts() {
    player.timeResets = new Decimal(START_PLAYER.timeResets);
    player.crystals = new Decimal(hasMilestone(4) ? START_PLAYER.milesCrystals : START_PLAYER.crystals);
    player.trueEssence = new Decimal(START_PLAYER.trueEssence);
    player.antiEssence = new Decimal(START_PLAYER.antiEssence);
    if (!player.dontResetSlider) {
        player.truePercent = new Decimal(START_PLAYER.truePercent);
        player.antiPercent = new Decimal(START_PLAYER.antiPercent);
    }
    copyData(player.thisAscStats, START_PLAYER.thisAscStats);
    player.thisAscStats.bestCrystals = player.crystals;
    player.thisAscStats.totalCrystals = player.crystals;
}

function getGalaxiesBonus() {
    var b = new Decimal(player.allTimeStats.totalGalaxies)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return boost;
}

function getBoughtGUpgs() {
    let count = 0;
    for (let g in GALAXIES_DATA) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            if (hasGUpgrade(g, u)) { count++; }
        }
    }
    return count;
}

function getBoughtGUpgsByRow(row) {
    let count = 0;
    for (let g in GALAXIES_DATA) {
        for (let u in GALAXIES_DATA[g].upgrades) {
            if (hasGUpgrade(g, u) && GALAXIES_DATA[g].upgrades[u].row == row) { count++; }
        }
    }
    return count;
}

const ARK_DATA = {
    'navigation': {
        name: 'navigation',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'navigationBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'torpedos': {
        name: 'torpedos',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'torpedosBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'railguns': {
        name: 'railguns',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'railgunsBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'engines': {
        name: 'engines',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'enginesBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'thrusters': {
        name: 'thrusters',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'thrustersBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
    'support': {
        name: 'support',
        desc: '',
        cost: new Decimal(0),
        buttonID: 'supportBut',
        displayEffect: false,
        displayTooltip: false,
        displayFormula: '',
        effect: function() {
            return;
        }
    },
}

const GALAXIES_DATA = {
    1: {
        name: 'andromeda',
        id: 1,
        upgrades: {
            11: {
                title: '1.11',
                desc: 'Decrease the astral enslavement time nerf from 10x -> 5x.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg1.11',
                lockImageID: '',
                textID: 'text1.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
                },
            },
            21: {
                title: '1.21',
                desc: 'Increase the exponent on the astral brick production formula from ^0.2 -> ^0.3.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg1.21',
                lockImageID: 'skull1.21',
                textID: 'text1.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '1.22',
                desc: 'You produce 1% of your corpse production while in astral enslavement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: true,
                displaySuffix: '/sec',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg1.22',
                lockImageID: 'skull1.22',
                textID: 'text1.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return player.astralFlag ? getCorpsesPerSecond().times(.01) : new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '1.31',
                desc: 'The astral time nerf doesn\'t apply to nekro-photon production (but you still only produce them during astral).',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg1.31',
                lockImageID: 'skull1.31',
                textID: 'text1.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '1.32',
                desc: 'The square root of the anti time essence boost affects time dimensions while in astral enslavement.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg1.32',
                lockImageID: 'skull1.32',
                textID: 'text1.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return player.astralFlag ? getAntiTimeBuff().sqrt() : new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '1.41',
                desc: 'Decrease the astral enslavement time nerf even more, 5x -> 2x.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg1.41',
                lockImageID: '',
                textID: 'text1.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
                },
            },
        },
    },
    2: {
        name: 'circinus',
        id: 2,
        upgrades: {
            11: {
                title: '2.11',
                desc: 'The base zombie corpse multiplier is increased, 1.75 -> 2.5.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg2.11',
                lockImageID: '',
                textID: 'text2.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            21: {
                title: '2.21',
                desc: 'Each unit tier produces the tier below it at a rate of 1/unit/sec instead of (1/tier)/unit/sec.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg2.21',
                lockImageID: 'skull2.21',
                textID: 'text2.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '2.22',
                desc: 'Start every sacrifice with one free exterminated world that doesn\'t increase the world prestige requirement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg2.22',
                lockImageID: 'skull2.22',
                textID: 'text2.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '2.31',
                desc: 'Your total galaxies multiply unit production multipliers.',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: true,
                displayFormula: function() { return '1 + x' },
                buttonID: 'galaxyUpg2.31',
                lockImageID: 'skull2.31',
                textID: 'text2.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                    return e.plus(1);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '2.32',
                desc: 'Exponential cost scaling for all units starts after twice as many bought.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg2.32',
                lockImageID: 'skull2.32',
                textID: 'text2.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '2.41',
                desc: 'First time dimensions also produce Sun Eaters at a greatly reduced rate.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: true,
                displaySuffix: '/sec',
                displayTooltip: true,
                displayFormula: function() { return `${hasUpgrade(4, 13) ? "ln(x)" : "log(x)"}` },
                buttonID: 'galaxyUpg2.41',
                lockImageID: '',
                textID: 'text2.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return hasUpgrade(4, 13) ? getEssenceProdPerSecond().ln() : getEssenceProdPerSecond().log10();
                },
                onBuy: function() {
                    return;
                },
            },
        },
    },
    3: {
        name: 'sculptor dwarf',
        id: 3,
        upgrades: {
            11: {
                title: '3.11',
                desc: 'Cube the <span style=\"font-weight: 800;\">Industrialize</span> effect.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg3.11',
                lockImageID: '',
                textID: 'text3.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return c;
                },
                effect: function() {
                    return new Decimal(3);
                },
                onBuy: function() {
                    return;
                },
            },
            21: {
                title: '3.21',
                desc: 'The effect of each second row Necropolis upgrade directly applies to the effect of the upgrade above it.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg3.21',
                lockImageID: 'skull3.21',
                textID: 'text3.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '3.22',
                desc: 'Exponential cost scaling for the first four construction upgrades starts after twice as many levels.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg3.22',
                lockImageID: 'skull3.22',
                textID: 'text3.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '3.31',
                desc: 'Square your acolyte gain.',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg3.31',
                lockImageID: 'skull3.31',
                textID: 'text3.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '3.32',
                desc: 'The effects of the first four construction upgrades are each 20% stronger.',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg3.32',
                lockImageID: 'skull3.32',
                textID: 'text3.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1.2);
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '3.41',
                desc: 'The <span style=\"font-weight: 800;\">Lightspeed</span> effect squared also applies to the production of corpses and astral bricks.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg3.41',
                lockImageID: '',
                textID: 'text3.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return hasTUpgrade(23) ? getTUpgEffect(33).pow(2) : new Decimal(1)
                },
                onBuy: function() {
                    return;
                },
            },
        },
    },
    4: {
        name: 'triangulum',
        id: 4,
        upgrades: {
            11: {
                title: '4.11',
                desc: 'Your total galaxies multiply time essence production.',
                requires: [],
                bought: false,
                row: 1,
                position: 0,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: true,
                displayFormula: function() { return '1 + x' },
                buttonID: 'galaxyUpg4.11',
                lockImageID: '',
                textID: 'text4.11',
                cost: function() {
                    let c = 1;
                    c += getBoughtGUpgsByRow(4);
                    return c;
                },
                effect: function() {
                    let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                    return e.plus(1);
                },
                onBuy: function() {
                    return;
                },
            },
            21: {
                title: '4.21',
                desc: 'Quadruple your time crystal gain.',
                requires: [11],
                bought: false,
                row: 2,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg4.21',
                lockImageID: 'skull4.21',
                textID: 'text4.21',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(4);
                },
                onBuy: function() {
                    return;
                },
            },
            22: {
                title: '4.22',
                desc: 'The square root of the true time essence boost affects time dimensions outside of astral enslavement.',
                requires: [11],
                bought: false,
                row: 2,
                position: 1,
                displayEffect: true,
                displaySuffix: 'x',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg4.22',
                lockImageID: 'skull4.22',
                textID: 'text4.22',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return player.astralFlag ? new Decimal(1) : getTrueTimeBuff().sqrt()
                },
                onBuy: function() {
                    return;
                },
            },
            31: {
                title: '4.31',
                desc: 'Both time essence boosts are based on log(x)^2 instead of log(x).',
                requires: [21],
                bought: false,
                row: 3,
                position: -1,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg4.31',
                lockImageID: 'skull4.31',
                textID: 'text4.31',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(2);
                },
                onBuy: function() {
                    return;
                },
            },
            32: {
                title: '4.32',
                desc: 'You passively produce your astral brick production ^0.9 outside of astral enslavement (still affected by the astral time nerf).',
                requires: [22],
                bought: false,
                row: 3,
                position: 1,
                displayEffect: true,
                displaySuffix: '/sec (real time)',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg4.32',
                lockImageID: 'skull4.32',
                textID: 'text4.32',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return player.astralFlag ? new Decimal(0) : getBricksPerSecond().pow(0.9).div(getAstralNerf())
                },
                onBuy: function() {
                    return;
                },
            },
            41: {
                title: '4.41',
                desc: 'True and anti time essence no longer nerf the other\'s effect.',
                requires: [31, 32],
                bought: false,
                row: 4,
                position: 0,
                displayEffect: false,
                displaySuffix: '',
                displayTooltip: false,
                displayFormula: function() { return '' },
                buttonID: 'galaxyUpg4.41',
                lockImageID: '',
                textID: 'text4.41',
                cost: function() {
                    let c = 1;
                    for (let i=1; i<this.row; i++) {
                        c += getBoughtGUpgsByRow(i);
                    }
                    return c;
                },
                effect: function() {
                    return new Decimal(1);
                },
                onBuy: function() {
                    displayData.push(['html', 'astralNerf', formatWhole(getAstralNerf())]);
                },
            },
        },
    },
}