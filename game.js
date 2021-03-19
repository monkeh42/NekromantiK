//consts and such

const GAME_DATA = {
    author: 'monkeh42',
    version: 'v1.0.0',
}

const NUM_UNITS = 8;

const NUM_TIMEDIMS = 8;

const NUM_ACHS = 25;

const NUM_GALAXY_ROWS = 4;

const TIERS = {
    1: 'zombie',
    2: 'abomination',
    3: 'skeletons mage',
    4: 'banshee',
    5: 'lich',
    6: 'behemoth',
    7: 'ancient one',
    8: 'sun eater',
}

var DEV_SPEED = 1;

var mainLoop;

var popupShownTime;

var mPopupShownTime;

var sPopupShownTime;

var asPopupShownTime;

var hidden, visibilityChange, isHidden;

var displayData = new Array(0);

var player = {};

//initialize

function init() {
    loadGame();

    startGame();
}

//load stuff

function loadGame() {
    player = {};
    var savePlayer = localStorage.getItem('nekrosave');
    if (savePlayer === null || savePlayer === undefined) {
        copyData(player, START_PLAYER);
    } else {
        copyData(player, JSON.parse(window.atob(savePlayer)));
        if (Object.keys(player).length == 0) { copyData(player, START_PLAYER); }
    }
    fixData(player, START_PLAYER); 
    if (player.version != GAME_DATA.version) { updateVersion(); }

    if (player.nextSpaceReset[0] == null) {
        var num = 2*(Math.round(player.spaceResets)-3)
        switch (Math.round(player.spaceResets)) {
            case 0:
                player.nextSpaceReset = new Array(1, 5);
                break;
            case 1:
                player.nextSpaceReset = new Array(1, 6);
                break;
            case 2:
                player.nextSpaceReset = new Array(1, 7);
                break;
            case 3:
                player.nextSpaceReset = new Array(1, 8);
                break;
            default:
                player.nextSpaceReset = new Array(1+num, 8);
    
        }
    }

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    var element = document.getElementById('hotkeysList');
    var count = 0;
    element.innerHTML = 'Number Keys 1-8: Buy Single Unit; shift+(1-8): Buy Max Units;<br>';
    for (var k in HOTKEYS) {
        if ((count == 4 || k=='q') && k!='f') {
            count = 0;
            element.innerHTML += '<br>';
        }
        if (isNaN(k)) {
            element.innerHTML += k + ': ' + HOTKEYS[k].desc + '; ';
            count++;
        }
    }
    element.innerHTML = element.innerHTML.slice(0, -2);
    element.innerHTML += '<br>hotkeys do not trigger if ctrl or command (Mac) is pressed.'

    updateAutobuyersDisplay();

    if (player.tooltipsEnabled) {
        player.tooltipsEnabled = false;
        toggleTooltips();
    }
}

function loadStyles() {
    showTab(player.activeTabs[0], true);
    showUnitSubTab(player.activeTabs[1]);
    showBuildingSubTab(player.activeTabs[2]);
    if (player.unlocks['timeTab']['timeUpgrades']) { showTimeSubTab(player.activeTabs[3]); }
    else { showTimeSubTab('timeDimSubTab'); }
    if (player.unlocks['galaxyTab']['arkTab']) { showGalaxySubTab(player.activeTabs[4]); }
    else { showGalaxySubTab('galaxiesSubTab'); }
    if (player.activeTabs[0] == 'statsTab' && player.activeTabs[5] != 'achSubTab') { statsSubTabClick(player.activeTabs[5], player.activeTabs[5] + 'But'); }
    else { showStatsSubTab(player.activeTabs[5]); }
    if (screen.width < 1280 && screen.width > 600 && player.activeGalaxies[0] == 4) {
        updateGalaxiesDisplayed(2, 'gal1', 'gal2');
        document.getElementById('2gal').selected = true;
    } else if (screen.width <= 600 && player.activeGalaxies[0] > 0) {
        updateGalaxiesDisplayed(1, 'gal1', 'gal2');
        document.getElementById('1gal').selected = true;
    } else {
        updateGalaxiesDisplayed(player.activeGalaxies[0], player.activeGalaxies[1], player.activeGalaxies[2]);
        document.getElementById(player.activeGalaxies[0].toString() + 'gal').selected = true;
    }

    document.documentElement.style.boxShadow = (player.isInResearch ? (getActiveResearch()==7 ? 'inset 0px 0px 20px 10px #613227' : 'inset 0px 0px 20px 10px #e34805') : '') + (player.isInResearch && player.astralFlag ? ', ' : '') + (player.astralFlag ? 'inset 0px 0px 30px 20px #1c8a2e' : '');

    document.getElementById('realTimeDisplayBut').innerHTML = player.displayRealTime ? 'toggle time displays: REAL TIME' : 'toggle time displays: GAME TIME'
    let elements = document.getElementsByClassName('secDisplay');
    let el;
    for (let i=0; i<elements.length; i++) {
        el = elements.item(i);
        el.innerHTML = player.displayRealTime ? 'real sec' : 'sec'
    }

    document.getElementById('versionNumber').innerHTML = GAME_DATA.version;
    if (!hasMilestone(5)) { player.unlocks['buildingsTab']['vortexTable'] = false; }
    for (let tab in UNLOCKS_DATA) {
        for (let key in UNLOCKS_DATA[tab]) {
            if (player.unlocks[tab][key]) { unlockElementsOnLoad(tab, key) }
        }
    }

    for (let i=1; i<=NUM_UNITS; i++) {
        if (player.units[i].unlocked) { document.getElementById(UNITS_DATA[i].rowID).style.display = 'table-row'; }
        if (!canAffordUnit(i)) {
            document.getElementById(UNITS_DATA[i].buttonID).classList.add('unclickableUnit');
            document.getElementById(UNITS_DATA[i].buttonID).classList.remove('unitBut');
            document.getElementById(UNITS_DATA[i].maxID).classList.add('unclickableMax');
            document.getElementById(UNITS_DATA[i].maxID).classList.remove('unitMax');
        }
        document.getElementById(UNITS_DATA[i].costID).innerHTML = formatWhole(UNITS_DATA[i].cost());
    }
    for (let i=1; i<=NUM_TIMEDIMS; i++) {
        if (player.timeDims[i].unlocked) { document.getElementById(TIME_DATA[i].rowID).style.display = 'table-row'; }
        if (!canAffordTime(i)) {
            document.getElementById(TIME_DATA[i].buttonID).classList.add('unclickableUnitT');
            document.getElementById(TIME_DATA[i].buttonID).classList.remove('unitButT');
            document.getElementById(TIME_DATA[i].maxID).classList.add('unclickableMaxT');
            document.getElementById(TIME_DATA[i].maxID).classList.remove('unitMaxT');
        }
        document.getElementById(TIME_DATA[i].costID).innerHTML = formatWhole(TIME_DATA[i].cost());
    } 

    updateHeaderDisplay();
    document.getElementById('upgSoftcapNum1').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    document.getElementById('upgSoftcapNum2').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    document.getElementById('mainSoftcapStart').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    document.getElementById('softcapNum').innerHTML =  `${formatWhole(1000*(2**getNumCompletedProj()))}`;
    if (hasAchievement(64)) {
        document.getElementById('upgSoftcapNotice1').style.display = 'none';
        document.getElementById('upgSoftcapNotice2').style.display = 'none';
        document.getElementById('softcapNotice').style.display = 'none';
        document.getElementById('softcapMainDisplay').style.display = 'none';
    }

    if (canTimePrestige()) {
        document.getElementById('timePrestigeReq').style.display = 'none';
        document.getElementById('timePrestigeGainDesc').style.display = 'block';
    } 
    if (canGalaxyPrestige()) {
        document.getElementById('galaxyPrestigeReq').style.display = 'none';
        document.getElementById('galaxyPrestigeGainDesc').style.display = 'block';
        document.getElementById('galaxyPrestigeNextDesc').style.display = 'block';
    } 

    for (var b in BUILDS_DATA) {
        if (isResearchActive(2)) { document.getElementById('factoryBuild').style.textDecoration = 'line-through'; }
        else { document.getElementById('factoryBuild').style.textDecoration = ''; }
        for (var u in BUILDS_DATA[b].upgrades) {
            if (BUILDS_DATA[b].upgrades[u].displayTooltip) { document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).setAttribute('data-title', BUILDS_DATA[b].upgrades[u].displayFormula()) }
            if (hasUpgrade(b, u)) {
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.add(BUILDS_DATA[b].upgradeBtnBought);
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.remove(BUILDS_DATA[b].upgradeBtnClass);
            } else {
                document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.remove(BUILDS_DATA[b].upgradeBtnBought);
                if (!canAffordBUpg(b, u)) {
                    document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.add(BUILDS_DATA[b].upgradeBtnUnclick);
                    document.getElementById(BUILDS_DATA[b].upgrades[u].buttonID).classList.remove(BUILDS_DATA[b].upgradeBtnClass);
                }
            }
            document.getElementById('bUpgName' + b.toString() + '.' + u.toString()).innerHTML = getUpgName(b, u);
            document.getElementById('bUpgDesc' + b.toString() + '.' + u.toString()).innerHTML = getUpgDesc(b, u);
            document.getElementById('bUpgCost' + b.toString() + '.' + u.toString()).innerHTML = formatDefault2(getUpgCost(b, u)) + ' ' + getUpgResourceName(b);
            if (isDisplayEffect(b, u)) { document.getElementById(b.toString() + '.' + u.toString() + 'Effect').style.display = '' }
        }
    }

    if (hasAchievement(15)) { document.getElementById('keptBricks').style.display = 'block'; }
    
    for (var t in TIME_DATA.upgrades) {
        if (TIME_DATA.upgrades[t].displayTooltip) { document.getElementById(TIME_DATA.upgrades[t].buttonID).setAttribute('data-title', TIME_DATA.upgrades[t].displayFormula()) }
        if (player.timeUpgs[t]) {
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.add('boughtTimeUpg');
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.remove('timeUpg');
        } else {
            document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.remove('boughtTimeUpg');
            if (!canAffordTUpg(t)) {
                document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.add('unclickableTimeUpg');
                document.getElementById(TIME_DATA.upgrades[t].buttonID).classList.remove('timeUpg');
            }
        }
        document.getElementById('tUpgName' + t.toString()).innerHTML = getTUpgName(t);
        document.getElementById('tUpgDesc' + t.toString()).innerHTML = getTUpgDesc(t);
        document.getElementById('tUpgCost' + t.toString()).innerHTML = formatDefault2(getTUpgCost(t)) + ' time crystals';
        if (isDisplayEffectT(t)) { document.getElementById(t.toString() + 'TEffect').style.display = '' }
        if (TIME_DATA.upgrades[t].preReq != null) { document.getElementById('tUpgRequires' + t.toString()).innerHTML = TIME_DATA.upgrades[TIME_DATA.upgrades[t].preReq].title; }
    }

    document.getElementById('timeUpgBuyerBut').innerHTML = player.autobuyers['time']['on'] ? 'Time Upgrade Cols 1-3 Autobuyer: ON' : 'Time Upgrade Cols 1-3 Autobuyer: OFF'
    if (hasMilestone(6)) { document.getElementById('extraColsNotice').style.display = ''; }

    for (var c in CONSTR_DATA) {
        if (!canAffordCUpg(c)) {
            document.getElementById(CONSTR_DATA[c].buttonID).classList.add('unclickableConstrUpg');
            document.getElementById(CONSTR_DATA[c].buttonID).classList.remove('constrUpg');
        }
        document.getElementById('cUpgName' + c.toString()).innerHTML = getCUpgName(c);
        document.getElementById('cUpgDesc' + c.toString()).innerHTML = getCUpgDesc(c);
        document.getElementById('cUpgCost' + c.toString()).innerHTML = formatDefault(getCUpgCost(c));
        document.getElementById('cUpgLevel' + c.toString()).innerHTML = formatWhole(player.construction[c]) + (getExtraLevels(c)>0 ? ' + ' + formatWhole(getExtraLevels(c)) : '');
        if (isDisplayEffectC(c)) {
            document.getElementById('c' + c.toString() + 'Effect').style.display = '';
            if (c==5) { document.getElementById('cUpgEffect' + c.toString()).innerHTML = `[+${formatWhole(player.construction[5])}/+${formatWhole(player.construction[5].gt(0) ? Decimal.floor(player.construction[5].minus(1).div(2).plus(1)) : '0')}/+${formatWhole(player.construction[5].gt(0) ? Decimal.floor(player.construction[5].minus(1).div(3).plus(1)) : '0')}/+${formatWhole(player.construction[5].gt(0) ? Decimal.floor(player.construction[5].minus(1).div(4).plus(1)) : '0')}]` }
            else { document.getElementById('cUpgEffect' + c.toString()).innerHTML = CONSTR_DATA[c].isTimes ? formatDefault2(getCUpgEffect(c)) + CONSTR_DATA[c].displaySuffix : '+' + formatDefault2(getCUpgEffect(c)) }
        }
    }    

    for (var g in GALAXIES_DATA) {
        for (var u in GALAXIES_DATA[g].upgrades) {
            if (GALAXIES_DATA[g].upgrades[u].displayTooltip) { document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).setAttribute('data-title', GALAXIES_DATA[g].upgrades[u].displayFormula()) }
            if (player.galaxyUpgs[g][u].locked) {
                document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.add('lockedGalaxyUpg'); 
                document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.remove('galaxyUpg');
            } else {
                document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.remove('lockedGalaxyUpg');
                if (hasGUpgrade(g, u)) { 
                    document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.add('boughtGalaxyUpg'); 
                    document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.remove('galaxyUpg');//+ ((player.tooltipsEnabled && isDisplayTooltipG(g, u)) ? ' tooltip' : '') }
                } else {
                    document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.remove('boughtGalaxyUpg');
                    if (!canAffordGUpg(g, u)) {
                        document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.add('unclickGalaxyUpg'); 
                        document.getElementById(GALAXIES_DATA[g].upgrades[u].buttonID).classList.remove('galaxyUpg');
                    }
                }
            }
            document.getElementById('gUpgName' + g.toString() + '.' + u.toString()).innerHTML = getGUpgName(g, u); 
            document.getElementById('gUpgDesc' + g.toString() + '.' + u.toString()).innerHTML = getGUpgDesc(g, u); 
            if (GALAXIES_DATA[g].upgrades[u].requires.length>0) { document.getElementById('gUpgRequires' + g.toString() + '.' + u.toString()).innerHTML = `<span style=\"font-weight: 800;\">${GALAXIES_DATA[g].upgrades[GALAXIES_DATA[g].upgrades[u].requires[0]].title}</span>${(GALAXIES_DATA[g].upgrades[u].requires.length>1 ? " or <span style=\"font-weight: 800;\">" + GALAXIES_DATA[g].upgrades[GALAXIES_DATA[g].upgrades[u].requires[1]].title + "</span>" : "")}`; }
            document.getElementById('gUpgCost' + g.toString() + '.' + u.toString()).innerHTML = formatWhole(getGUpgCost(g, u)) + ' ' + galaxyTextSingulizer(getGUpgCost(g, u)); 
            if (isDisplayEffectG(g, u)) { document.getElementById(g.toString() + '.' + u.toString() + 'GEffect').style.display = 'inline'; }
            else { document.getElementById(g.toString() + '.' + u.toString() + 'GEffect').style.display = 'none'; }
        }
    }

    for (var e in ETH_DATA) {
        if (ETH_DATA[e].displayTooltip) { document.getElementById(ETH_DATA[e].buttonID).setAttribute('data-title', ETH_DATA[e].displayFormula()) }
        if (player.ethUpgs[e]) {
            document.getElementById(ETH_DATA[e].buttonID).classList.add('boughtEthUpg');
            document.getElementById(ETH_DATA[e].buttonID).classList.remove('ethUpg');
        } else {
            document.getElementById(ETH_DATA[e].buttonID).classList.remove('boughtEthUpg');
            if (!canAffordEUpg(e)) {
                document.getElementById(ETH_DATA[e].buttonID).classList.add('unclickableEthUpg');
                document.getElementById(ETH_DATA[e].buttonID).classList.remove('ethUpg');
            }
        }
        document.getElementById('eUpgName' + e.toString()).innerHTML = getEUpgName(e);
        document.getElementById('eUpgDesc' + e.toString()).innerHTML = getEUpgDesc(e);
        document.getElementById('eUpgCost' + e.toString()).innerHTML = formatWhole(getEUpgCost(e));
        if (isDisplayEffectE(e)) { document.getElementById('e' + e.toString() + 'Effect').style.display = '' }
    }

    if (hasGUpgrade(4, 41) && hasUpgrade(4, 22)) {
        document.getElementById('antiNerfDivText').style.display = 'none';
        document.getElementById('trueNerfDivText').style.display = 'none';
        document.getElementById('antiNerfTimesText').style.display = 'inline';
        document.getElementById('trueNerfTimesText').style.display = 'inline';
    } else {
        document.getElementById('antiNerfDivText').style.display = 'inline';
        document.getElementById('trueNerfDivText').style.display = 'inline';
        document.getElementById('antiNerfTimesText').style.display = 'none';
        document.getElementById('trueNerfTimesText').style.display = 'none';
    }

    document.getElementById('dontResetSliderBox').checked = player.dontResetSlider;

    document.getElementById('astralNerf').innerHTML = formatWhole(getAstralNerf());
    document.getElementById('astralNerfResearch').innerHTML = formatWhole(getAstralNerf());

    if (player.win) {
        document.getElementById('arkDescription').style.display = 'none';
        document.getElementById('winDescription').style.display = 'block';
        document.getElementById('fullyBuilt').style.display = 'none';
        document.getElementById('arkSubTab').style.height = '100px';
        for (var a in ARK_DATA) {
            document.getElementById(a).style.display = 'none';
            document.getElementById(a + 'But').style.display = 'none';
            document.getElementById(a + 'Built').style.display = 'none';
        }
    } else {
        for (var a in ARK_DATA) {
            document.getElementById(a + 'Text').innerHTML = "Build component:<br><span style=\"font-weight: 900;\">" + getAUpgName(a) + "</span><br>Cost: " + formatWhole(getAUpgBrickCost(a)) + " astral bricks" + "<br>and " + formatWhole(getAUpgTimeCost(a)) + " time crystals" + (isDisplayEffectA(a) ? ("<br>Currently: " + formatDefault2(getAUpgEffect(a)) + "x") : "");
            if (!arkIsUnlocked(a)) {
                document.getElementById(a + 'But').classList.add('lockedArkUpg');
                document.getElementById(a + 'But').classList.remove('arkUpg');
                document.getElementById(a + 'Text').style.display = 'none';
                document.getElementById(a).style.display = 'none';
                document.getElementById(a + 'Built').style.display = 'none';
            } else {
                if (hasAUpgrade(a)) {
                    document.getElementById(a + 'But').classList.add('boughtArkUpg');
                    document.getElementById(a + 'But').classList.remove('arkUpg');
                    document.getElementById(a).style.display = 'none';
                    document.getElementById(a + 'Built').style.display = 'block';
                    document.getElementById(a + 'Text').style.display = 'none';
                    document.getElementById(a + 'BoughtText').style.display = 'block';
                } else {
                    document.getElementById(a + 'Text').style.display = 'block';
                    if (!canAffordAUpg(a)) {
                        document.getElementById(a + 'But').classList.add('unclickableArkUpg')
                        document.getElementById(a + 'But').classList.remove('arkUpg')
                    }
                    document.getElementById(a).style.display = arkIsUnlocked(a) ? 'block' : 'none'
                    document.getElementById(a + 'Built').style.display = 'none';
                }
            }
        }
    }

    document.getElementById('timeSlider').value = player.antiPercent;
    if (player.timeLocked) {
        document.getElementById('lockInTimeBut').classList.add('unclickSliderBut');
        document.getElementById('lockInTimeBut').classList.remove('timeSliderBut');
        document.getElementById('respecTimeBut').classList.add('timeSliderBut');
        document.getElementById('respecTimeBut').classList.remove('unclickSliderBut');
        document.getElementById('timeSlider').classList.add('sliderLocked');
        document.getElementById('timeSlider').classList.remove('slider');
        document.getElementById('timeSlider').disabled = true;
    } else {
        if (player.unlocks['timeTab']['mainTab']) {
            document.getElementById('timeTabBut').classList.add('timeUnlockedNotify')
            document.getElementById('timeTabButMid').classList.add('timeUnlockedNotify')
            document.getElementById('timeDimSubTabBut').classList.add('timeUnlockedNotify')
        }
    }
    
    updatePopupsEtc();

    for (let id in ACH_DATA) {
        document.getElementById(ACH_DATA[id].divID).setAttribute('data-title', ((ACH_DATA[id].secret && !player.achievements[id]) ? ACH_DATA[id].hint : ACH_DATA[id].desc) + (ACH_DATA[id].hasReward ? ' Reward: ' + ACH_DATA[id].reward : '' ) + (ACH_DATA[id].showEffect ? ' Currently: ' + formatDefault2(ACH_DATA[id].effect()) + 'x' : '' ));
        if (player.achievements[id]) {
            document.getElementById(ACH_DATA[id].divID).classList.add('achievementUnlocked');
            document.getElementById(ACH_DATA[id].divID).classList.remove('achievement');
        }
    }

    for (let id in MILES_DATA) {
        if (player.milestones[id]) {
            document.getElementById('milestone' + id.toString()).classList.add('milestoneTDUnlocked');
            document.getElementById('milestone' + id.toString()).classList.remove('milestone');
            displayData.push(['setProp', 'milestoneReq' + id.toString(), 'text-decoration', 'line-through']);
        }
    }

    if (isResearchCompleted(6)) {
        document.getElementById('theoremDisplay').innerHTML = ` ${formatWhole(player.theorems)} `;
        document.getElementById('completionsDisplay').innerHTML = ` ${formatWhole(player.infCompletions)} `;
        document.getElementById('theoremEffect').innerHTML = ` ^${formatDefault2(getTheoremBoostW())}`;
        document.getElementById('theoremEffectC').innerHTML = ` ^${formatDefault2(getTheoremBoostC())}`;
        document.getElementById('resGoal7').innerHTML = formatWhole(RESEARCH_DATA[7].calcGoal());
    }

    if (player.isInResearch) {
        let id = getActiveResearch();
        document.getElementById(RESEARCH_DATA[id].buttonID).innerHTML = 'IN PROGRESS';
        for (let i=1; i<=7; i++) {
            if (!player.researchProjects[i].completed) {
                if (i==7) {
                    document.getElementById(RESEARCH_DATA[i].buttonID).classList.remove('infResearchButton');
                    if (i==id) {
                        document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('progressInfResearchButton');
                    } else {
                        document.getElementById(RESEARCH_DATA[i].buttonID).style.textDecoration = 'line-through';
                        document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('unclickInfResearchBut');
                    }
                } else {
                    document.getElementById(RESEARCH_DATA[i].buttonID).classList.remove('researchButton');
                    if (i==id) {
                        document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('progressResearchButton');
                    } else {
                        document.getElementById(RESEARCH_DATA[i].buttonID).style.textDecoration = 'line-through';
                        document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('unclickResearchBut');
                    }
                }
            }
        }
        if (id==6 || id==7) {
            let reqs = document.getElementsByClassName('gUpgRequires');
            for (let i=0; i<reqs.length; i++) {
                reqs[i].style.textDecoration = 'line-through';
            }
        }
        if (id==7) { document.getElementById('infResearchDisplayDiv').style.display = 'block'; }
        else { document.getElementById('researchDisplayDiv').style.display = 'block'; }
        if (id==7) { document.getElementById('infResearchGoalDisplay').innerHTML = ` ${formatWholeUnitRow(RESEARCH_DATA[id].calcGoal())} `; }
        else { document.getElementById('researchGoalDisplay').innerHTML = ` ${formatWholeUnitRow(RESEARCH_DATA[id].goal)} `; }
        document.getElementById('vortexProgess').style.display = 'none';
        document.getElementById('vortexProgessResearch').style.display = '';
    } else {
        for (let i=1; i<=7; i++) {
            if (!player.researchProjects[i].completed) {
                if (i==7) {
                    document.getElementById(RESEARCH_DATA[i].buttonID).style.textDecoration = '';
                    document.getElementById(RESEARCH_DATA[i].buttonID).classList.remove('unclickInfResearchBut');
                    document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('infResearchButton');
                    document.getElementById(RESEARCH_DATA[i].buttonID).innerHTML = 'BEGIN';
                } else {
                    document.getElementById(RESEARCH_DATA[i].buttonID).style.textDecoration = '';
                    document.getElementById(RESEARCH_DATA[i].buttonID).classList.remove('unclickResearchBut');
                    document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('researchButton');
                    document.getElementById(RESEARCH_DATA[i].buttonID).innerHTML = 'BEGIN';
                }
            }
        }
        document.getElementById('researchDisplayDiv').style.display = 'none';
        document.getElementById('infResearchDisplayDiv').style.display = 'none';
        document.getElementById('vortexProgess').style.display = '';
        document.getElementById('vortexProgessResearch').style.display = 'none';
    }


    for (let i=1; i<=6; i++) {
        if (player.researchProjects[i].completed) {
            document.getElementById(RESEARCH_DATA[i].buttonID).classList.add('completedResearchBut');
            document.getElementById(RESEARCH_DATA[i].buttonID).classList.remove('researchButton');
            document.getElementById(RESEARCH_DATA[i].buttonID).innerHTML = 'COMPLETED';
            unlockArkPart(RESEARCH_DATA[i].unlocks);
            RESEARCH_DATA[i].onComplete();
        }
    }

    if (player.astralFlag) {
        toggleAstralDisplay();
        document.getElementById('astralButResearch').innerHTML = 'Toggle Astral: ON';
        document.getElementById('astralButInfResearch').innerHTML = 'Toggle Astral: ON';
    }
}

//save stuff

function manualSave() {
    gtag('event', 'save', { 'type': 'manual' });
    save();
    showSavePopup();
}

function save() {
    localStorage.setItem('nekrosave', window.btoa(JSON.stringify(player)));
}

//main loop and related

function startGame() {
    var diff = new Date() - player.lastUpdate;
    if ((diff)>(300*1000)) {
        calculateOfflineTime(new Decimal(diff/1000));
    }
    else {
        player.lastUpdate = new Date();
        player.lastAutoSave = new Date();
        player.lastAutobuy = new Date();
        player.lastWindowUpdate = new Date();
        save();
    }

    if (player.pastRuns.lastRun.timeSpent == 0) { player.pastRuns.lastRun.timeSacrificed = new Date(); }
    if (player.pastAscRuns.lastRun.timeSpent == 0) { player.pastAscRuns.lastRun.timeAscended = new Date(); }
    document.getElementById('calcPopupContainer').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    updateDisplay();
    loadStyles();
    startInterval();
}

function startInterval() {
    mainLoop = setInterval(gameLoop, 50);
}

function gameLoop(diff=new Decimal(0), offline=false) {
    var currentUpdate = new Date().getTime();
    if (diff.eq(0)) { var diff = new Decimal(currentUpdate - player.lastUpdate); }
    if (DEV_SPEED>0) { diff = diff.times(DEV_SPEED); }
    var timeBuff;
    if (player.astralFlag) { timeBuff = getAntiTimeBuff().div(getAstralNerf()) }
    else { timeBuff = getTrueTimeBuff(); }
    var realDiff = diff;
    diff = diff.times(timeBuff);
    if (hasGUpgrade(1, 32) || hasGUpgrade(4, 22)) { realDiff = diff.times(timeBuff.sqrt()); } 
    if (player.astralFlag) {
        player.bricks = player.bricks.plus(getBricksPerSecond().times(diff.div(1000)));
        player.thisSacStats.totalBricks = player.thisSacStats.totalBricks.plus(getBricksPerSecond().times(diff.div(1000)));
        player.thisAscStats.totalBricks = player.thisAscStats.totalBricks.plus(getBricksPerSecond().times(diff.div(1000)));
        player.allTimeStats.totalBricks = player.allTimeStats.totalBricks.plus(getBricksPerSecond().times(diff.div(1000)));
        if (hasGUpgrade(1, 22)) {
            player.corpses = player.corpses.plus(getGUpgEffect(1, 22).times(diff.div(1000)));
            player.thisSacStats.totalCorpses = player.thisSacStats.totalCorpses.plus(getGUpgEffect(1, 22).times(diff.div(1000)));
            player.thisAscStats.totalCorpses = player.thisAscStats.totalCorpses.plus(getGUpgEffect(1, 22).times(diff.div(1000)));
            player.allTimeStats.totalCorpses = player.allTimeStats.totalCorpses.plus(getGUpgEffect(1, 22).times(diff.div(1000)));
        }
        if (player.isInResearch) { player.research = player.research.plus(getResearchPerSecond().times(diff.div(1000))); }
    } else {
        player.corpses = player.corpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
        player.thisSacStats.totalCorpses = player.thisSacStats.totalCorpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
        player.thisAscStats.totalCorpses = player.thisAscStats.totalCorpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
        player.allTimeStats.totalCorpses = player.allTimeStats.totalCorpses.plus(getCorpsesPerSecond().times(diff.div(1000)));
        if (hasGUpgrade(4, 32)) {
            player.bricks = player.bricks.plus(getGUpgEffect(4, 32).times(diff.div(1000)));
            player.thisSacStats.totalBricks = player.thisSacStats.totalBricks.plus(getGUpgEffect(4, 32).times(diff.div(1000)));
            player.thisAscStats.totalBricks = player.thisAscStats.totalBricks.plus(getGUpgEffect(4, 32).times(diff.div(1000)));
            player.allTimeStats.totalBricks = player.allTimeStats.totalBricks.plus(getGUpgEffect(4, 32).times(diff.div(1000)));
        }
    }
    if (player.corpses.gt(player.thisSacStats.bestCorpses)) { player.thisSacStats.bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.thisSacStats.bestBricks)) { player.thisSacStats.bestBricks = new Decimal(player.bricks); }
    if (player.corpses.gt(player.thisAscStats.bestCorpses)) { player.thisAscStats.bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.thisAscStats.bestBricks)) { player.thisAscStats.bestBricks = new Decimal(player.bricks); }
    if (player.corpses.gt(player.allTimeStats.bestCorpses)) { player.allTimeStats.bestCorpses = new Decimal(player.corpses); }
    if (player.bricks.gt(player.allTimeStats.bestBricks)) { player.allTimeStats.bestBricks = new Decimal(player.bricks); }
    for (var i=1; i<NUM_UNITS; i++) {
        player.units[i].amount = player.units[i].amount.plus(getUnitProdPerSecond(i).times(diff.div(1000)));
    }
    if (hasGUpgrade(2, 41)) { player.units[8].amount = player.units[8].amount.plus(getUnitProdPerSecond(i).times(realDiff.div(1000))); }
    if (player.timeLocked) {
        for (var i=1; i<=NUM_TIMEDIMS; i++) {
            if (i==1) {
                player.trueEssence = player.trueEssence.plus(getEssenceProdPerSecond().times(realDiff.div(1000)).times(player.truePercent/100));
                player.antiEssence = player.antiEssence.plus(getEssenceProdPerSecond().times(realDiff.div(1000)).times(player.antiPercent/100));
            } 
            else if (i<=4 || hasUpgrade(4, 23)) { player.timeDims[i-1].amount = player.timeDims[i-1].amount.plus(getTimeDimProdPerSecond(i).times(realDiff.div(1000))); }
        }
    }
    for (var b in BUILDS_DATA) {
        if (isBuilt(b)) {
            if (b==3) {
                player.buildings[b].amount = player.buildings[b].amount.plus(getBuildingProdPerSec(b).times(hasGUpgrade(1, 31) ? diff.times(getAstralNerf()).div(1000) : diff.div(1000)));
            } else if (b==4) {
                player.buildings[b].progress = player.buildings[b].progress.plus(getBuildingProdPerSec(b).times(diff.div(1000)));
                if (player.buildings[b].progress.gte(100)) {
                    player.buildings[b].progress = new Decimal(0);
                    player.buildings[b].amount = player.buildings[b].amount.plus(1);
                }
            }
            else { player.buildings[b].amount = player.buildings[b].amount.plus(getBuildingProdPerSec(b).times(diff.div(1000))); }
        }
    }

    updateUnlocks();
    updateHeaderDisplay();
    updateAchievements();
    updateMilestones();

    if (!offline && player.unlocks['unitsTab']['autobuyers']) {
        var slowAutoBuy = (currentUpdate - player.lastAutobuy)>=(15000/DEV_SPEED);
        autobuyerTick(slowAutoBuy);
        if (slowAutoBuy) { player.lastAutobuy = new Date(); }
    }
    if (!offline) {
        //allDisplay();
        if ((currentUpdate-player.lastAutoSave)>10000) { 
            player.lastAutoSave = currentUpdate;
            gtag('event', 'save', { 'type': 'auto' });
            save();
            if (player.headerDisplay['autosavePopup']) {
                if (!player.win || player.continue) { showAutosavePopup(); }
            }
        }
        player.lastUpdate = currentUpdate;
    }
    if (!offline && popupShownTime !== undefined && popupShownTime !== null) {
        if (currentUpdate-popupShownTime >= 2000) {
            displayData.push(['setProp', 'achUnlockPopup', 'opacity', '0']);
            popupShownTime = null;
        }
    }
    if (!offline && mPopupShownTime !== undefined && mPopupShownTime !== null) {
        if (currentUpdate-mPopupShownTime >= 2000) {
            displayData.push(['setProp', 'milesUnlockPopup', 'opacity', '0']);
            mPopupShownTime = null;
        }
    }
    if (!offline && sPopupShownTime !== undefined && sPopupShownTime !== null) {
        if (currentUpdate-sPopupShownTime >= 2000) {
            displayData.push(['setProp', 'savePopup', 'opacity', '0']);
            sPopupShownTime = null;
        }
    }
    if (!offline && asPopupShownTime !== undefined && asPopupShownTime !== null) {
        if (currentUpdate-asPopupShownTime >= 2000) {
            displayData.push(['setProp', 'autosavePopup', 'opacity', '0']);
            asPopupShownTime = null;
        }
    }
    if (!offline && !isHidden) { window.requestAnimationFrame(updateDisplay); }
}

function handleVisibilityChange() {
    if (!document[hidden]) {
        displayData = new Array(0);
        isHidden = false;
    } else { isHidden = true; }
}

function autobuyerTick(slow) {
    var tier;
    for (var i=0; i<player.autobuyers.priority.length; i++) {
        tier = player.autobuyers.priority[i];
        if (player.autobuyers[tier]['on'] && (player.autobuyers[tier]['fast'] || slow)) {
            if (player.autobuyers[tier]['bulk']) {
                buyMaxUnits(tier);
            } else {
                buySingleUnit(tier);
            }
        }
    }
    if (player.autobuyers[9]['on'] && (player.autobuyers[9]['fast'] || slow)) { if (isAutoSacTriggered()) { timePrestigeNoConfirm(); } }
    if (player.autobuyers[10]['on'] && (player.autobuyers[10]['fast'] || slow)) { if (canSpacePrestige() && (player.spaceResets.lt(player.autobuyers[10]['max']) || player.autobuyers[10]['max'] == 0)) { spacePrestigeNoConfirm(); } }
    if (player.autobuyers[11]['on'] && (player.autobuyers[11]['fast'] || slow)) { if (canGalaxyPrestige() && calculateGalaxyGain().gte(player.autobuyers[11]['amount'])) { galaxyPrestigeNoConfirm(); } }
    for (let i=NUM_TIMEDIMS; i>0; i--) {
        if (i<=4 || hasUpgrade(4, 23)) {
            if (player.autobuyers[12][i]) { buyMaxTime(i); }
        }
    }
    if (player.autobuyers['time']['on']) {
        for (let x=1; x<=3; x++) {
            for (let y=1; y<=4; y++) {
                if (canAffordTUpg(x.toString() + y.toString())) { buyTUpg(x.toString() + y.toString()); }
            }
        }
    }
}

function calculateOfflineTime(seconds) {
    document.getElementById('offlineCalcPopup').style.display = 'block';
    var ticks = seconds * 20;
    var extra = new Decimal(0);
    var simMilliseconds = 0;
    if (ticks>1000) {
        extra = new Decimal((ticks-1000)/20);
        ticks = 1000;
    }

    var startCorpses = new Decimal(player.corpses);
    var startBricks = new Decimal(player.bricks);
    var startArms = new Decimal(player.buildings[1].amount);
    var startAcolytes = new Decimal(player.buildings[2].amount);
    var startPhotons = new Decimal(player.buildings[3].amount);
    var startTrue = new Decimal(player.trueEssence);
    var startAnti = new Decimal(player.antiEssence);
    var startGalaxies = new Decimal(player.galaxies);
    var startResearch = new Decimal(player.research);

    for (var done=0; done<ticks; done++) {
        gameLoop(extra.plus(50), true);
        simMilliseconds += extra.plus(50);
        
        if (simMilliseconds>=15000) {
            simMilliseconds = 0;
            autobuyerTick(true);
        } else { autobuyerTick(false); }
    }
    player.lastUpdate = new Date();
    player.lastAutoSave = new Date();
    player.lastAutobuy = new Date();
    save();

    var allZero = true;
    if (player.corpses.gt(startCorpses)) {
        document.getElementById('offlineCorpseGain').innerHTML = formatDefault(player.corpses.minus(startCorpses));
        document.getElementById('offlineCorpse').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineCorpse').style.display = 'none';
    }
    if (player.bricks.gt(startBricks)) {
        document.getElementById('offlineBrickGain').innerHTML = formatDefault(player.bricks.minus(startBricks));
        document.getElementById('offlineBrick').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineBrick').style.display = 'none';
    }
    if (player.buildings[1].amount.gt(startArms)) {
        document.getElementById('offlineArmamentGain').innerHTML = formatDefault(player.buildings[1].amount.minus(startArms));
        document.getElementById('offlineArmament').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineArmament').style.display = 'none';
    }
    if (player.buildings[2].amount.gt(startAcolytes)) {
        document.getElementById('offlineAcolyteGain').innerHTML = formatDefault(player.buildings[2].amount.minus(startAcolytes));
        document.getElementById('offlineAcolyte').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineAcolyte').style.display = 'none';
    }
    if (player.buildings[3].amount.gt(startPhotons)) {
        document.getElementById('offlinePhotonGain').innerHTML = formatDefault(player.buildings[3].amount.minus(startPhotons));
        document.getElementById('offlinePhoton').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlinePhoton').style.display = 'none';
    }
    if (player.trueEssence.gt(startTrue) || player.antiEssence.gt(startAnti)) {
        document.getElementById('offlineTrueGain').innerHTML = formatDefault(player.trueEssence.minus(startTrue).gte(1) ? player.trueEssence.minus(startTrue) : '0');
        document.getElementById('offlineAntiGain').innerHTML = formatDefault(player.antiEssence.minus(startAnti).gte(1) ? player.antiEssence.minus(startAnti) : '0');
        document.getElementById('offlineEssence').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineEssence').style.display = 'none';
    }
    if (player.galaxies.gt(startGalaxies)) {
        document.getElementById('offlineGalaxyGain').innerHTML = formatDefault(player.galaxies.minus(startGalaxies));
        document.getElementById('offlineGalaxy').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineGalaxy').style.display = 'none';
    }
    if (player.research.gt(startResearch)) {
        document.getElementById('offlineResearchGain').innerHTML = formatDefault(player.research.minus(startResearch));
        document.getElementById('offlineResearch').style.display = 'block';
        allZero = false;
    } else {
        document.getElementById('offlineResearch').style.display = 'none';
    }

    if (allZero) {
        document.getElementById('offlineZero');
    }
    document.getElementById('offlineCalcPopup').style.display = 'none';
    document.getElementById('offlineGainPopup').style.display = 'block';
}

//import, export, etc

function hardReset() {
    if (!confirm("Are you sure? This will reset ALL of your progress.")) return
    player = null;
    save();
    window.location.reload(true);
}

function importToggle() {
    document.getElementById('exportTextLabel').style.display = 'block';
    document.getElementById('exportText').value = '';
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'table-cell';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').removeAttribute('colspan');
    document.getElementById('exportText').focus();
}

function importSave() {
    var imported = document.getElementById('exportText').value;
    if (imported !== undefined) {
        try {
            copyData(player, JSON.parse(window.atob(imported)));
            if (Object.keys(player).length == 0) { copyData(player, START_PLAYER); }
        } catch(e) {
            return;
        }
    }
    
    fixData(player, START_PLAYER); 
    if (player.version != GAME_DATA.version) { updateVersion(); }
    save();
    window.location.reload();
}

function exportSave() {
    var str = window.btoa(JSON.stringify(player));

    document.getElementById('exportText').value = str;
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
    document.getElementById('exportText').select();
}

function closeText() {
    document.getElementById('exportTextLabel').style.display = 'none';
    document.getElementById('exportText').style.display = 'none';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'none';
    document.getElementById('closeText').removeAttribute('colspan');
}

function exportGameState() {
    document.getElementById('exportText').value = window.btoa(JSON.stringify(player) + '\n\n') + window.btoa(JSON.stringify(START_PLAYER) + '\n\n') + window.btoa(JSON.stringify(UNITS_DATA) + '\n\n') + window.btoa(JSON.stringify(BUILDS_DATA) + '\n\n') + window.btoa(JSON.stringify(CONSTR_DATA) + '\n\n') + window.btoa(JSON.stringify(TIME_DATA) + '\n\n') + window.btoa(JSON.stringify(UNLOCKS_DATA) + '\n\n');
    document.getElementById('exportText').style.display = 'block';
    document.getElementById('importConfirm').style.display = 'none';
    document.getElementById('closeText').style.display = 'table-cell';
    document.getElementById('closeText').setAttribute('colspan', '2');
    document.getElementById('exportText').select();
}

//fixes and data manipulation

function copyData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            data[item] = [];
            copyData(data[item], start[item]);
        } else if (start[item] instanceof Decimal) {
            data[item] = new Decimal(start[item]);
        } else if (start[item] instanceof Date) {
            data[item] = new Date(start[item]);
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            data[item] = {};
            copyData(data[item], start[item]);
        } else {
            data[item] = start[item];
        }
    }

}

function fixData(data, start) {
    for (item in start) {
        if (start[item] == null) {
            if (data[item] === undefined) {
                data[item] = null;
            }
        } else if (Array.isArray(start[item])) {
            if (data[item] === undefined) {
                data[item] = [];
            }
            fixData(data[item], start[item]);
        } else if (start[item] instanceof Decimal) {
            if (data[item] === undefined) {
                data[item] = new Decimal(start[item]);
            } else {
                data[item] = new Decimal(data[item]);
            }
        } else if (start[item] instanceof Date) {
            if (data[item] === undefined) {
                data[item] = new Date(start[item]);
            } else { data[item] = new Date(data[item]); }
        } else if ((!!start[item]) && (typeof start[item] === "object")) {
            if (data[item] === undefined) {
                data[item] = {};
            }
            fixData(data[item], start[item]);
        } else {
            if (data[item] === undefined) {
                data[item] = start[item];
            }
        }
    }
}

function updateVersion() {
    let tempPlayer = {};
    copyData(tempPlayer, player);
    player = {};
    fixResetBug();
    copyData(player, START_PLAYER);
    updateVersionData(player, tempPlayer);
    player.version = GAME_DATA.version;
    tempPlayer = {};
}

function updateVersionData(newP, oldP) {
    for (item in newP) {
        if (newP[item] == null) {
            if (oldP[item] !== undefined) {
                if (oldP[item] != null) {
                    newP[item] = oldP[item];
                } 
            }
        } else if (Array.isArray(newP[item])) {
            if (newP[item] === undefined) {
                newP[item] = [];
            }
            updateVersionData(newP[item], oldP[item]);
        } else if (newP[item] instanceof Decimal) {
            if (oldP[item] !== undefined) {
                newP[item] = new Decimal(oldP[item]);
            }
        } else if ((!!newP[item]) && (typeof newP[item] === "object")) {
            if (oldP[item] !== undefined) {
                updateVersionData(newP[item], oldP[item]);
            }
        } else if (newP[item] instanceof Date) {
            if (oldP[item] !== undefined && oldP[item] instanceof Date) {
                newP[item] = new Date(oldP[item]);
            }
        } else {
            if (oldP[item] !== undefined && item != 'version') {
                if (typeof newP[item] === typeof oldP[item]) { newP[item] = oldP[item]; }
            }
        }
    }
}

//misc

function getRealTimeMultiplier() {
    let mult = new Decimal(1);
    if (player.astralFlag) {
        mult = mult.div(getAstralNerf());
        mult = mult.times(getAntiTimeBuff());
    } else {
        mult = mult.times(getTrueTimeBuff());
    }
    return mult;
}

//achievement stuff

function getAchievementBoost() {
    let b = Decimal.pow(1.1, getNumAchievements());
    b = b.times(Decimal.pow(1.2, getNumAchRows()));
    return Decimal.max(b, 1);
}

function hasAchievement(id) {
    return player.achievements[id];
}

function getAchievementEffect(id) {
    return ACH_DATA[id].effect();
}

function getNumAchievements() {
    let count = 0;
    for (let id in ACH_DATA) {
        if (player.achievements[id]) { count++ }
    }
    return count;
}

function getNumAchRows() {
    let count = 0;
    let yes = true;
    for (let i=1; i<=Math.floor(NUM_ACHS/5); i++) {
        for (let j=1; j<=5; j++) {
            if (!player.achievements[i.toString() + j.toString()]) { yes = false; }
        }
        if (yes) { count++ }
        yes = true;
    }
    return count;
}

//milestone stuff

function hasMilestone(id) {
    return player.milestones[id];
}

function getMilestoneEffect(id) {
    return MILES_DATA[id].effect();
}

function getNumMilestones() {
    let count = 0;
    for (let id in MILES_DATA) {
        if (player.milestones[id]) { count++ }
    }
    return count;
}

//hotkeys/autobuyers

document.onkeydown = function(e) {
    if (!player.hotkeysOn) {return}
    var key = e.key;
    var ctrlDown = e.ctrlKey;
    var shiftDown = e.shiftKey;
    var metaDown = e.metaKey;
    if (HOTKEYS[key] !== undefined && !ctrlDown && !metaDown && !(document.activeElement.id == 'ascensionBuyerAmount' || document.activeElement.id == 'maxPrestige' || document.activeElement.id == 'sacrificeBuyerAmount')) { HOTKEYS[key].onPress(shiftDown); }
}

function toggleHotkeys() {
    player.hotkeysOn = !player.hotkeysOn;
    document.getElementById('toggleHotkeysBut').innerHTML = player.hotkeysOn ? 'ENABLE HOTKEYS: ON' : 'ENABLE HOTKEYS: OFF'
}

function allAuto(n) {
    let cbox = document.getElementById('allBuyers');
    if (n<0) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['on'] = false;
        }
        if (cbox.checked) {
            player.autobuyers[9]['on'] = false;
            if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10]['on'] = false; }
        }
    } else if (n>0) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['on'] = true;
        }
        if (cbox.checked) {
            player.autobuyers[9]['on'] = true;
            if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10]['on'] = true; }
        }
    } else {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['on'] = !player.autobuyers[i]['on'];
        }
        if (cbox.checked) {
            player.autobuyers[9]['on'] = !player.autobuyers[9]['on'];
            if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10]['on'] = !player.autobuyers[10]['on']; }
        }
    }
    updateAutobuyersDisplay();
}

function allSpeed() {
    if (player.unlocks['unitsTab']['fastBuyers']) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['fast'] = !player.autobuyers[i]['fast'];
        }
        if (document.getElementById('allBuyers').checked) {
            player.autobuyers[9]['fast'] = !player.autobuyers[9]['fast'];
            if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10]['fast'] = !player.autobuyers[10]['fast']; }
        }
        updateAutobuyersDisplay();
    }
}

function allAmount() {
    if (player.unlocks['unitsTab']['bulkBuyers']) {
        for (let i=1; i<9; i++) {
            player.autobuyers[i]['bulk'] = !player.autobuyers[i]['bulk'];
        }
        if (document.getElementById('allBuyers').checked) {
            player.autobuyers[9]['bulk'] = !player.autobuyers[9]['bulk'];
            if (player.unlocks['unitsTab']['prestigeBuyer']) { player.autobuyers[10]['bulk'] = !player.autobuyers[10]['bulk']; }
        }
        updateAutobuyersDisplay();
    }
}

//dev stuff

function changeDevSpeed(num) {
    DEV_SPEED = num;
    if (DEV_SPEED!=1) { document.getElementById('devSpeedContainer').style.display = 'block'}
}

function resetDevSpeed() {
    DEV_SPEED = 1;
    document.getElementById('devSpeedContainer').style.display = 'none';
}

function rewindTime() {
    clearInterval(mainLoop);
    player.lastUpdate = player.lastUpdate - (3600*1000);
    save();
    window.location.reload();
}