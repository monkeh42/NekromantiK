var rumble;
var rumbleCount = 0;
var takeOffInt;
var vert = 0;

function getNumArkUpgs() {
    let count = 0;
    for (let a in DATA.a.upgrades) {
        if (a!='className') {
            if (player.ark[a].bought) { count++; }
        }
    }
    return count;
}

function arkIsUnlocked(a) {
    return player.ark[a].unlocked;
}

function getAUpgBrickCost(a) {
    return DATA.a.upgrades[a].brickCost;
}

function getAUpgTimeCost(a) {
    return DATA.a.upgrades[a].timeCost;
}

function getAUpgDesc(a) {
    return DATA.a.upgrades[a].desc;
}

function getAUpgName(a) {
    return DATA.a.upgrades[a].name;
}

function getAUpgEffect(a) {
    return DATA.a.upgrades[a].effect();
}

function hasAUpgrade(a) {
    return player.ark[a].bought;
}

function canAffordAUpg(a) {
    return (player.crystals.gte(DATA.a.upgrades[a].timeCost) && player.bricks.gte(DATA.a.upgrades[a].brickCost) && player.ark[a].unlocked);
}

function isDisplayEffectA(a) {
    return DATA.a.upgrades[a].displayEffect;
}

function isDisplayTooltipA(a) {
    return DATA.a.upgrades[a].displayTooltip;
}

function getEUpgCost(e) {
    return DATA.e.upgrades[e].cost();
}

function getEUpgDesc(e) {
    return DATA.e.upgrades[e].desc();
}

function getEUpgName(e) {
    return DATA.e.upgrades[e].title;
}

function getEUpgEffect(e) {
    return DATA.e.upgrades[e].effect();
}

function hasEUpgrade(e) {
    return player.ethUpgs[e];
}

function canAffordEUpg(e) {
    return player.theorems.gte(DATA.e.upgrades[e].cost());
}

function isDisplayEffectE(e) {
    return DATA.e.upgrades[e].displayEffect;
}

function isDisplayTooltipE(e) {
    return DATA.e.upgrades[e].displayTooltip;
}

function getGUpgCost(g, u) {
    return DATA['g'+g.toString()].upgrades[u].cost();
}

function getGUpgDesc(g, u) {
    return DATA['g'+g.toString()].upgrades[u].desc;
}

function getGUpgName(g, u) {
    return DATA['g'+g.toString()].upgrades[u].title;
}

function getGUpgEffect(g, u) {
    return DATA['g'+g.toString()].upgrades[u].effect();
}

function hasGUpgrade(g, u) {
    return player.galaxyUpgs[g][u].bought;
}

function isDisplayEffectG(g, u) {
    return DATA['g'+g.toString()].upgrades[u].displayEffect;
}

function isDisplayTooltipG(g, u) {
    return DATA['g'+g.toString()].upgrades[u].displayTooltip;
}

function getNumCompletedProj() {
    let count = 0;
    for (let i=1; i<=6; i++) {
        if (isResearchCompleted(i)) { count++; }
    }
    return count;
}

function generateExportedGalaxies() {
    let exp = '';
    for (let g=1; g<=4; g++) {
        for (let u in DATA['g'+g.toString()].upgrades) {
            if (!isNaN(u)) {
                if (player.galaxyUpgs[g][u].bought) { exp += g.toString() + '.' + u.toString() + ', '; }
            }
        }
    }
    return exp.slice(0, -2);
}

function generateFavoriteGalaxies() {
    let favs = new Array();
    for (let g=1; g<=4; g++) {
        for (let u in DATA['g'+g.toString()].upgrades) {
            if (!isNaN(u)) {
                if (player.galaxyUpgs[g][u].bought) { favs.push(g.toString() + '.' + u.toString()); }
            }
        }
    }
    return favs;
}

function resetAllFavsClick() {
    confirmation('This will erase all three favorites slots and rename them to "Slot 1", "Slot 2", and "Slot 3".', 'resetAllFavs');
}

function resetAllFavs() {
    player.favGalaxies = [...DATA.sp.favGalaxies];
    player.favGalNames = [...DATA.sp.favGalNames];
    
    setTimeout(function() { showNormalPopup('fpop'); }, 10)
}

function renameFavorite(i) {
    let rename = prompt("Enter a new name for this favorites slot:");
    if (rename !== undefined && rename != null) {
        Vue.nextTick(function() {
            player.favGalNames[i-1] = rename;
        })
    }
    closeNormalPopup('fpop');
    setTimeout(function() { showNormalPopup('fpop'); }, 10)
}

function saveFavoriteClick(i) {
    if (player.favGalaxies[i-1].length>0) {
        confirmation('You already have favorites saved in this slot - overwrite?', 'saveFavorite', i)
    } else { saveFavorite(i) }
}

function saveFavorite(i) {
    player.favGalaxies[i-1] = [...generateFavoriteGalaxies()];
    app.$refs['fpop'].gSpecErr = 'Successfully saved to slot ' + i.toString() + '.';
    app.$refs['fpop'].isGSpecErr = true;
}

function exportGalaxies() {
    showNormalPopup('gepop');
    app.$refs['gepop'].gExpText = generateExportedGalaxies();
    setTimeout(app.$refs['gepop'].selectInput, 50);
}

function importGalaxies(fav=false, favSlot=0) {
    let gals = verifyGalaxyImp(fav, favSlot);
    if (gals.length == 0) { return; }

    let g=0;
    let u=0;
    let count=0;

    for (let i=0; i<gals.length; i++) {
        g = parseInt(gals[i].slice(0, 1));
        u = parseInt(gals[i].slice(2, 4));
        if (canAffordGUpg(g, u)) { buyGUpg(g, u); }
        else {
            if (fav) {
                app.$refs['fpop'].gSpecErr = 'Too expensive; bought ' + formatWhole(count) + '.';
                app.$refs['fpop'].isGSpecErr = true;
            } else {
                app.$refs['gipop'].gImpErr = 'Too expensive; bought ' + formatWhole(count) + '.';
                app.$refs['gipop'].isGImpErr = true;
            }
            return;
        }
        count++;
    }

    if (fav) { 
        app.$refs['fpop'].gSpecErr = 'Successfully bought ' + formatWhole(count) + ' upgrades.';
        app.$refs['fpop'].isGSpecErr = true;
    }
    else {
        app.$refs['gipop'].gImpErr = 'Successfully bought ' + formatWhole(count) + ' upgrades.';
        app.$refs['gipop'].isGImpErr = true;
    }
}

function verifyGalaxyImp(fav=false, favSlot=0) {
    let imp = app.$refs['gipop'].gImpText;
    let gals = new Array();
    let dupes = false;
    let undef = false;
    let g=0;
    let u=0;
    let reg = /^\d\.\d\d(,\s\d\.\d\d)*$/;

    if (getBoughtGUpgs() != 0) {
        if (fav) {
            app.$refs['fpop'].gSpecErr = 'You must respec first.';
            app.$refs['fpop'].isGSpecErr = true;
        } else {
            app.$refs['gipop'].gImpErr = 'You must respec first.';
            app.$refs['gipop'].isGImpErr = true;
        }
        return [];
    }

    if (imp.length>3 || fav) {
        if (reg.test(imp) || fav) {
            if (fav) { gals = [...player.favGalaxies[favSlot-1]]; }
            else {
                while (imp.length>2) {
                    gals.push(imp.slice(0, 4));
                    imp = imp.slice(6, imp.length);
                }
            }
            if (gals.length<=24) {
                for (let i=0; i<gals.length; i++) {
                    for (let j=i+1; j<gals.length; j++) {
                        if (gals[i] == gals[j]) {
                            i = gals.length;
                            j = gals.length;
                            dupes = true;
                        }
                    }
                }
                if (!dupes) {
                    for (let l=0; l<gals.length; l++) {
                        g = parseInt(gals[l].slice(0, 1));
                        u = parseInt(gals[l].slice(2, 4));
                        if (DATA['g'+g.toString()] === undefined) {
                            undef = true;
                            l = gals.length;
                        } else if (DATA['g'+g.toString()].upgrades[u] === undefined) {
                            undef = true;
                            l = gals.length;
                        }
                    }
                    if (!undef) {
                        for (let k=0; k<gals.length-1; k++) {
                            g = parseInt(gals[k].slice(0, 1));
                            u = parseInt(gals[k].slice(2, 4));
                            if (g > parseInt(gals[k+1].slice(0, 1))) {
                                if (fav) {
                                    app.$refs['fpop'].gSpecErr = 'Error: misordered upgrades.';
                                    app.$refs['fpop'].isGSpecErr = true;
                                } else {
                                    app.$refs['gipop'].gImpErr = 'Error: misordered upgrades.';
                                    app.$refs['gipop'].isGImpErr = true;
                                }
                                return [];
                            } else if (u > parseInt(gals[k+1].slice(2, 4)) && g == parseInt(gals[k+1].slice(0, 1))) {
                                if (fav) {
                                    app.$refs['fpop'].gSpecErr = 'Error: misordered upgrades.';
                                    app.$refs['fpop'].isGSpecErr = true;
                                } else {
                                    app.$refs['gipop'].gImpErr = 'Error: misordered upgrades.';
                                    app.$refs['gipop'].isGImpErr = true;
                                }
                                return [];
                            } else if ((gals.includes(g.toString() + '.21') && gals.includes(g.toString() + '.22')) || (gals.includes(g.toString() + '.31') && gals.includes(g.toString() + '.32'))) {
                                if (fav) {
                                    app.$refs['fpop'].gSpecErr = 'Error: both upgrade branches.';
                                    app.$refs['fpop'].isGSpecErr = true;
                                } else {
                                    app.$refs['gipop'].gImpErr = 'Error: both upgrade branches.';
                                    app.$refs['gipop'].isGImpErr = true;
                                }
                                return [];
                            }
                        }
                        return gals;
                    } else {
                        if (fav) {
                            app.$refs['fpop'].gSpecErr = 'Error: undefined upgrades.';
                            app.$refs['fpop'].isGSpecErr = true;
                        } else {
                            app.$refs['gipop'].gImpErr = 'Error: undefined upgrades.';
                            app.$refs['gipop'].isGImpErr = true;
                        }
                        return [];
                    }
                } else {
                    if (fav) {
                        app.$refs['fpop'].gSpecErr = 'Error: duplicate upgrades.';
                        app.$refs['fpop'].isGSpecErr = true;
                    } else {
                        app.$refs['gipop'].gImpErr = 'Error: duplicate upgrades.';
                        app.$refs['gipop'].isGImpErr = true;
                    }
                    return [];
                }
            } else {
                if (fav) {
                    app.$refs['fpop'].gSpecErr = 'Error: too many upgrades.';
                    app.$refs['fpop'].isGSpecErr = true;
                } else {
                    app.$refs['gipop'].gImpErr = 'Error: too many upgrades.';
                    app.$refs['gipop'].isGImpErr = true;
                }
                return [];
            }
        } else {
            if (fav) {
                app.$refs['fpop'].gSpecErr = 'Error: incorrect format.';
                app.$refs['fpop'].isGSpecErr = true;
            } else {
                app.$refs['gipop'].gImpErr = 'Error: incorrect format.';
                app.$refs['gipop'].isGImpErr = true;
            }
            return [];
        }
    } else {
        if (fav) {
            app.$refs['fpop'].gSpecErr = 'Error: empty or too short code.';
            app.$refs['fpop'].isGSpecErr = true;
        } else {
            app.$refs['gipop'].gImpErr = 'Error: empty or too short code.';
            app.$refs['gipop'].isGImpErr = true;
        }
        return [];
    }
}

function closeImpGalaxies() {
    app.$refs['gipop'].isGImpErr = false;
    app.$refs['gipop'].gImpText = '';
    closeNormalPopup('gipop');
}

function closeExpGalaxies() {
    closeNormalPopup('gepop');
    document.getElementById('gExportText').value = '';
}

function closeFavPopup() {
    app.$refs['fpop'].isGSpecErr = false;
    closeNormalPopup('fpop');
}

function showImportGalaxies() {
    showNormalPopup('gipop');
    setTimeout(app.$refs['gipop'].focusInput, 10);
}

function hasPrereqGUpg(g, u) {
    if (u==11 || isResearchActive(6) || isResearchActive(7)) { return true; }
    else {
        var reqs = DATA['g'+g.toString()].upgrades[u].requires;
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
    if (player.galaxies.gte(DATA['g'+g.toString()].upgrades[u].cost())) {
        return (hasPrereqGUpg(g, u) && !hasGUpgrade(g, u)); 
    } else { return false; }
}

function buyGUpg(g, u) {
    if (canAffordGUpg(g, u) && !player.galaxyUpgs[g][u].locked) {
        let thisRow = DATA['g'+g.toString()].upgrades[u].row;
        player.galaxies = player.galaxies.minus(DATA['g'+g.toString()].upgrades[u].cost());
        player.spentGalaxies = player.spentGalaxies.plus(DATA['g'+g.toString()].upgrades[u].cost());
        player.galaxyUpgs[g][u].bought = true;
        if (DATA['g'+g.toString()].upgrades[u].onBuy!==undefined) { DATA['g'+g.toString()].upgrades[u].onBuy(); }

        if (u == 21) {
            player.galaxyUpgs[g][22].locked = true;
            player.galaxyUpgs[g][32].locked = true;
        } else if (u == 22) {
            player.galaxyUpgs[g][21].locked = true;
            player.galaxyUpgs[g][31].locked = true;
        }

        if ((isResearchActive(5)) && (getBoughtGUpgs()==1)) {
            for (let gg=1; gg<=4; gg++) {
                if (gg!=g) {
                    for (let uu in DATA['g'+gg.toString()].upgrades) {
                        if (!isNaN(uu)) { player.galaxyUpgs[gg][uu].locked = true; }
                    }
                }
            }
        }

        if (isResearchActive(6) || isResearchActive(7)) {
            for (let gg=1; gg<=4; gg++) {
                if (gg==g) {
                    for (let uu in DATA['g'+gg.toString()].upgrades) {
                        if (uu!=u && !isNaN(uu)) {
                            player.galaxyUpgs[gg][uu].locked = true;
                        }
                    }
                } else {
                    for (let vv in DATA['g'+gg.toString()].upgrades) {
                        if (DATA['g'+gg.toString()].upgrades[vv].row==thisRow) {
                            if (!isNaN(vv)) { player.galaxyUpgs[gg][vv].locked = true; }
                        }
                    }
                }
            }
        }
    }
}

function buyEUpg(e) {
    if (canAffordEUpg(e) && !hasEUpgrade(e)) {
        player.ethUpgs[e] = true;
        player.theorems = player.theorems.minus(getEUpgCost(e));
    }
}

function respecEthereal() {
    for (let e in DATA.e.upgrades) {
        if (player.ethUpgs[e]) {
            player.theorems = player.theorems.plus(1);
            player.ethUpgs[e] = false;
        }
    }

    if (canTimePrestige()) { timePrestigeNoConfirm(); }
    else { timePrestigeReset(); }
}

function buyArkUpgrade(a) {
    if (!player.ark[a].bought && canAffordAUpg(a)) {
        player.bricks = player.bricks.minus(getAUpgBrickCost(a));
        player.crystals = player.crystals.minus(getAUpgTimeCost(a));
        player.ark[a].bought = true;

        if (checkForWin()) {
            winGame();
        }
    }
}

function checkForWin() {
    for (let a in DATA.a.upgrades) {
        if (a!='className') {
            if (!hasAUpgrade(a)) { return false; }
        }
    }
    return true;
}

function winGame() {
    player.win = true;
    document.getElementById('navigationBut').scrollIntoView();
    document.getElementById('htmlBody').classList.add('hidden-scrollbar');
    rumble = setInterval(rumbleAnim, 100);
    setTimeout(takeOff, 3000);
}

function rumbleAnim() {
    if (rumbleCount >= 30) { clearInterval(rumble) }
    switch (rumbleCount % 4) {
        case 0:
            document.getElementById('fullyBuilt').style.left = "48%";
            break;
        case 1:
            document.getElementById('fullyBuilt').style.left = "50%";
            break;
        case 2:
            document.getElementById('fullyBuilt').style.left = "52%";
            break;
        case 3:
            document.getElementById('fullyBuilt').style.left = "50%";
            break;
    }
    rumbleCount++;
}

function takeOff() {
    takeOffInt = setInterval(takeOffAnim, 5);
    setTimeout(congrats, 5000);
}

function takeOffAnim() {
    vert++;
    if (vert>=1000) { clearInterval(takeOffInt); }
    document.getElementById('fullyBuilt').style.top = (300 - vert).toString() + 'px';
}

function congrats() {
    document.getElementById('winScreen').style.display = 'block';
    document.getElementById('winScreen').scrollIntoView();
    document.getElementById('winMessage').style.opacity = '1';
}

function continueGame() {
    player.continue = true;
    //document.getElementById('arkSubTab').style.height = '100px';
    player.tab = 'unitsTab';
    player.subTabs['u'] = 'unitsSubTab';
    document.getElementById('htmlBody').classList.remove('hidden-scrollbar');
    document.getElementById('winScreen').style.opacity = '0';
    setTimeout(function() {
        document.getElementById('winScreen').style.display = 'none';
    }, 2000);
}

function respecGalaxiesClick() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['click']) { confirmation(DATA.g.prestige.confirmPopText, 'respecGalaxiesAch'); }
        else { respecGalaxiesAch(); }
    }
}

function respecGalaxiesKey() {
    if (player.ascensions.gte(1)) {
        if (player.confirmations['galaxyRespec']['key']) { confirmation(DATA.g.prestige.confirmPopText, 'respecGalaxiesAch'); }
        else { respecGalaxiesAch(); }
    }
}

function respecGalaxiesAch() {
    if (getBoughtGUpgs() == 0 && !hasAchievement(52)) { unlockAchievement(52); }
    if (canGalaxyPrestige()) { galaxyPrestigeNoConfirm(true); }
    else { galaxyPrestigeReset(true); }
}

function respecGalaxies() {
    player.galaxies = player.galaxies.plus(player.spentGalaxies);
    player.spentGalaxies = new Decimal(0);
    copyData(player.galaxyUpgs, DATA.sp.galaxyUpgs);
}

function galaxyPrestigeClick(respec) {
    if (canGalaxyPrestige()) {
        if (player.confirmations['galaxyPrestige']['click']) { confirmation(DATA.g.prestige.confirmPopText, 'galaxyPrestigeNoConfirm', respec); }
        else { galaxyPrestigeNoConfirm(respec); }
    }
}

function galaxyPrestigeKey(respec) {
    if (canGalaxyPrestige()) {
        if (player.confirmations['galaxyPrestige']['key']) { confirmation(DATA.g.prestige.confirmPopText, 'galaxyPrestigeNoConfirm', respec); }
        else { galaxyPrestigeNoConfirm(respec); }
    }
}

function canGalaxyPrestige() {
    return player.worlds.gte(10);
}

function calculateGalaxyGain() {
    if (player.worlds.lt(10)) { return new Decimal(0); }
    let g = new Decimal(player.worlds).div(10);
    let d = new Decimal(g.sqrt());
    let gals = Decimal.floor(player.worlds.pow(g.minus(d).plus(isBuilt(4) ? DATA['b4'].resourceEff() : 0)));
    return gals.plus(getCUpgEffect(6));
}

function calculateGalaxyGainFuture(w) {
    if (w.lt(10)) { return new Decimal(0); }
    let g = new Decimal(w).div(10);
    let d = new Decimal(g.sqrt());
    let gals = Decimal.floor(w.pow(g.minus(d).plus(isBuilt(4) ? DATA['b4'].resourceEff() : 0)));
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
        player.stats['allTimeStats'].totalGalaxies = player.stats['allTimeStats'].totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.stats['allTimeStats'].bestGalaxies)) { player.stats['allTimeStats'].bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.stats['allTimeStats'].totalAscensions = player.stats['allTimeStats'].totalAscensions.plus(1);
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeNoConfirm(respec=false) {
    if (canGalaxyPrestige()) {
        if (getBoughtGUpgs()==0 && player.ascensions.gt(0) && !hasAchievement(55)) { unlockAchievement(55); }
        player.galaxies = player.galaxies.plus(calculateGalaxyGain());
        player.stats['allTimeStats'].totalGalaxies = player.stats['allTimeStats'].totalGalaxies.plus(calculateGalaxyGain());
        if (player.galaxies.gt(player.stats['allTimeStats'].bestGalaxies)) { player.stats['allTimeStats'].bestGalaxies = new Decimal(player.galaxies); }
        player.ascensions = player.ascensions.plus(1);
        player.stats['allTimeStats'].totalAscensions = player.stats['allTimeStats'].totalAscensions.plus(1);
        if (app.respecNextGal) {
            app.respecNextGal = false;
        }
        galaxyPrestigeReset(respec);
    }
}

function galaxyPrestigeReset(respec=false, startingResearch=false) {
    if (player.astralFlag) { toggleAstral(); }
    if (player.timeLocked && !player.dontResetSlider) {
        player.timeLocked = false;
    }
    clearInterval(mainLoop);
    if (player.isInResearch&&!startingResearch) {
        let id = getActiveResearch();
        player.isInResearch = false;
        player.researchProjects[getActiveResearch()].active = false;
        player.research = new Decimal(0);
        updateShadow();
        respec = true;
    }
    
    if (!hasAchievement(42)) {
        copyData(player.autobuyers, DATA.sp.autobuyers);
    }

    player.pastAscRuns.lastRun.galaxyGain = calculateGalaxyGain();
    player.pastAscRuns.lastRun.timeSpent = new Date()-player.pastAscRuns.lastRun.timeAscended;
    player.pastAscRuns.lastRun.timeAscended = new Date();
    if (player.pastAscRuns.lastRun.galaxyGain.gt(player.stats['allTimeStats'].bestGalaxyGain)) { player.stats['allTimeStats'].bestGalaxyGain = new Decimal(player.pastAscRuns.lastRun.galaxyGain) }
    for (var i=9; i>=0; i--) { copyData(player.pastAscRuns.lastTen[i], player.pastAscRuns.lastTen[i-1]); }
    copyData(player.pastAscRuns.lastTen[0], player.pastAscRuns.lastRun);
    for (var j=0; j<10; j++) { copyData(player.pastRuns.lastTen[j], DATA.sp.pastRuns.lastTen[j]); }
    copyData(player.pastRuns.lastRun, DATA.sp.pastRuns.lastRun)

    resetTime(startingResearch);
    resetTimeCounts(startingResearch);
    resetUnits(true);
    resetBuildingResources(false, true, startingResearch);
    resetBuildings(true, startingResearch);
    if (!startingResearch) {
        if (!hasAchievement(42)) { player.unlocks['autobuyers'] = false; }
        if (!hasAchievement(43)) {
            player.unlocks['time'] = false;
            player.unlocks['timeUpgrades'] = false;
            player.unlocks['timeUpgrades2'] = false;
            player.unlocks['timeDims'] = false;
        }
        else { player.unlocks['time'] = false; }
    }
    
    if (respec || startingResearch) {
        respecGalaxies();
    }
    app.respecNextGal = false;

    

    player.corpses = (hasAchievement(41)&&!startingResearch) ? new Decimal(DATA.sp.corpsesAch41) : (hasAchievement(13) ? new Decimal(DATA.sp.corpsesAch13) : new Decimal(DATA.sp.corpses))
    if (!hasAchievement(42)) { player.subTabs['u'] = 'unitsSubTab'; }
    if (!hasMilestone(1)) { player.subTabs['b'] = 'buildingsSubTab'; }
    if (!hasAchievement(43)) { player.subTabs['t'] = 'timeDimSubTab'; }
    if (startingResearch) { resLockGalaxies(); }
    save();
    startInterval();
    updateShadow();
}

function resetTimeCounts(startingResearch=false) {
    player.timeResets = new Decimal(DATA.sp.timeResets);
    player.crystals = new Decimal((hasMilestone(4)&&!startingResearch) ? DATA.sp.milesCrystals : DATA.sp.crystals);
    player.trueEssence = new Decimal(DATA.sp.trueEssence);
    player.antiEssence = new Decimal(DATA.sp.antiEssence);
    if (!player.dontResetSlider) {
        player.truePercent = new Decimal(DATA.sp.truePercent);
        player.antiPercent = new Decimal(DATA.sp.antiPercent);
    }
    copyData(player.stats['thisAscStats'], DATA.sp.stats['thisAscStats']);
    player.stats['thisAscStats'].bestCrystals = player.crystals;
    player.stats['thisAscStats'].totalCrystals = player.crystals;
}

function researchReset(proj) {
    if (player.astralFlag) { toggleAstral(); }
    if (player.timeLocked) {
        player.timeLocked = false;
    }
    clearInterval(mainLoop);

    let tempVortex = {};
    let time4 = [];
    let time5 = [];
    copyData(tempVortex, player.buildings[4]);
    for (let i=1; i<=4; i++) {
        time4[i-1] = player.timeUpgs['4' + i.toString()];
        time5[i-1] = player.timeUpgs['5' + i.toString()];
    }

    resetUnits();
    copyData(player.buildings, DATA.sp.buildings);
    copyData(player.construction, DATA.sp.construction);
    resetTimeDims();
    copyData(player.timeUpgs, DATA.sp.timeUpgs);
    player.corpses = new Decimal(DATA.sp.corpsesAch13);
    player.bricks = new Decimal(DATA.sp.bricks);
    player.crystals = new Decimal(DATA.sp.crystals);
    player.worlds = new Decimal(DATA.sp.worlds);
    player.spaceResets = new Decimal(DATA.sp.spaceResets);
    player.timeResets = new Decimal(DATA.sp.timeResets);
    player.trueEssence = new Decimal(DATA.sp.trueEssence);
    player.antiEssence = new Decimal(DATA.sp.antiEssence);
    player.nextSpaceReset = new Array(1, 5);
    copyData(player.stats['thisSacStats'], DATA.sp.stats['thisSacStats']);
    copyData(player.stats['thisAscStats'], DATA.sp.stats['thisAscStats']);
    player.unlocks['factory'] = false;
    player.unlocks['factoryRow2'] = false;
    player.unlocks['necropolis'] = false;
    player.unlocks['necropolisRow2'] = false;
    player.unlocks['sun'] = false;
    player.unlocks['sunRow2'] = false;
    player.unlocks['construction'] = false;
    player.unlocks['constructionRow2'] = false;

    copyData(player.buildings[4], tempVortex);
    for (let i=1; i<=4; i++) {
        player.timeUpgs['4' + i.toString()] = time4[i-1];
        player.timeUpgs['5' + i.toString()] = time5[i-1];
    }

    respecGalaxies();
    
    let g = DATA.r[proj].galaxyLock;
    if (g>0) {
        for (let u in DATA['g'+g.toString()].upgrades) {
            if (u!='className') {
                player.galaxyUpgs[g][u].locked = true;
            }
        }
    } 
    
    player.subTabs['u'] = 'unitsSubTab';
    player.subTabs['b'] = 'buildingsSubTab';
    player.subTabs['t'] = 'timeDimSubTab';
    save();
    //loadStyles();
    startInterval();
    updateShadow();
}

function resLockGalaxies() {
    let proj = getActiveResearch();
    let g = DATA.r[proj].galaxyLock;
    if (g>0) {
        for (let u in DATA['g'+g.toString()].upgrades) {
            if (u!='className') {
                player.galaxyUpgs[g][u].locked = true;
            }
        }
    } 
}

function getGalaxiesBonus() {
    var b = new Decimal(player.stats['allTimeStats'].totalGalaxies)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return getGalaxySoftcap(boost);
}

function getGalaxiesBonusNoSC() {
    var b = new Decimal(player.stats['allTimeStats'].totalGalaxies)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return boost;
}

function getGalaxiesBonusFixed(gals) {
    var b = new Decimal(gals)
    var e = 1.5;
    var boost = Decimal.max(b.pow(e).plus(1), 1);
    if (hasMilestone(3)) { boost = boost.times(1.5); }
    return boost;
}

function getGalaxySoftcap(eff) {
    let start = getGalaxiesBonusFixed(1000*(2**getNumCompletedProj()));
    let mag = 3;
    if (isSoftcapActive(eff)) {
        return Decimal.pow(10, Decimal.pow(eff.log10(), 1/mag).times(Decimal.pow(start.log10(), Decimal.sub(1, 1/mag))));
    } else { return eff; }
}

function getGalaxyUpgSoftcap(eff) {
    let start = new Decimal(1000*(2**getNumCompletedProj())+1);
    let mag = 3;
    if (eff.gte(start) && !hasAchievement(64)) {
        return Decimal.pow(10, Decimal.pow(eff.log10(), 1/mag).times(Decimal.pow(start.log10(), Decimal.sub(1, 1/mag))));
    } else { return eff; }
}

function isSoftcapActive(val) {
    return (val.gte(getGalaxiesBonusFixed(1000*(2**getNumCompletedProj()))) && !hasAchievement(64));
}

function getBoughtGUpgs() {
    let count = 0;
    let root
    for (let g=1; g<=4; g++) {
        for (let u in DATA['g'+g.toString()].upgrades) {
            if (!isNaN(u)) {
                if (hasGUpgrade(g, u)) { count++; }
            }
        }
    }
    return count;
}

function getBoughtGUpgsByRow(row) {
    let count = 0;
    for (let g=1; g<=4; g++) {
        for (let u in DATA['g'+g.toString()].upgrades) {
            if (!isNaN(u)) {
                if (hasGUpgrade(g, u) && DATA['g'+g.toString()].upgrades[u].row == row) { count++; }
            }
        }
    }
    return count;
}

function getResearchPerSecond(disp=false) {
    if (!player.isInResearch || !player.astralFlag) { return new Decimal(0); }
    var e = 0.2
    var r = getCorpsesPerSecond().pow(e).sqrt();
    if (hasEUpgrade(14)) { r = r.times(getEUpgEffect(14)); }
    if (disp && player.displayRealTime) { return r.times(getRealTimeMultiplier()); }
    else { return r; } 
}

function isResearchActive(proj) {
    return player.researchProjects[proj].active;
}

function getActiveResearch() {
    for (let i=1; i<=7; i++) {
        if (player.researchProjects[i].active) { return i; }
    }
    return 0;
}

function isResearchCompleted(i) {
    return player.researchProjects[i].completed;
}

function getCurrentGoal() {
    if (!player.isInResearch) { return new Decimal(0); }
    let proj = getActiveResearch();
    if (proj==7) { return DATA.r[proj].calcGoal(); }
    else { return DATA.r[proj].goal; }
}

function canCompleteResearch() {
    let proj = getActiveResearch();
    if (proj==0) { return false; }
    if (proj==7) { return player.research.gte(DATA.r[proj].calcGoal()); }
    else { return player.research.gte(DATA.r[proj].goal); }
}

function researchButtonClick(id) {
    if (!player.isInResearch) { startResearch(id) }
    else if (canCompleteResearch()) { completeResearch(id) }
}

function completeResearch(id) {
    if (id!=7) { player.researchProjects[id].completed = true; }
    player.researchProjects[id].active = false;
    player.isInResearch = false;
    player.research = new Decimal(0);

    if (id==7) {
        player.theorems = player.theorems.plus(1);
        player.infCompletions = player.infCompletions.plus(1);
        
    }
    else { unlockArkPart(DATA.r[id].unlocks); }

    updateShadow();
    DATA.r[id].onComplete(id);
    player.tabNotify['g'].indirect = false;
    if (id==7) { player.tabNotify['g']['i'].notify = false; }
    else { player.tabNotify['g']['r'].notify = false; }
    respecGalaxies();
}

function startResearch(id) {
    if (player.isInResearch || player.researchProjects[id].completed) { return; }
    player.researchProjects[id].active = true;
    player.isInResearch = true;
    updateShadow();
    galaxyPrestigeReset(true, true);
}

function unlockArkPart(name) {
    if (!player.researchProjects[DATA.a.upgrades[name].project].completed || hasAUpgrade(name)) { return; }
    player.ark[name].unlocked = true;
}

function getTheoremBoostW() {
    return Decimal.pow(1.2, player.theorems);
}

function getTheoremBoostC() {
    return Decimal.pow(1.01, player.infCompletions);
}

var RESEARCH_DATA = {
    1: {
        galaxyLock: 4,
        goal: new Decimal(1e6),
        buttonID: 'startResearch1',
        unlocks: 'thrusters',
        onComplete: function() {
            return;
        }
    },
    2: {
        galaxyLock: 1,
        goal: new Decimal(1e9),
        buttonID: 'startResearch2',
        unlocks: 'engines',
        onComplete: function() {
            return;
        }
    },
    3: {
        galaxyLock: 2,
        goal: new Decimal(1e12),
        buttonID: 'startResearch3',
        unlocks: 'navigation',
        onComplete: function() {
            return;
        }
    },
    4: {
        galaxyLock: 3,
        goal: new Decimal(1e14),
        buttonID: 'startResearch4',
        unlocks: 'torpedos',
        onComplete: function() {
            return;
        }
    },
    5: {
        galaxyLock: 0,
        goal: new Decimal(1e10),
        buttonID: 'startResearch5',
        unlocks: 'railguns',
        onComplete: function() {
            return;
        }
    },
    6: {
        galaxyLocks: 0,
        goal: new Decimal(1e15),
        buttonID: 'startResearch6',
        unlocks: 'support',
        onComplete: function() {
            //document.getElementById('researchSubTabBut').style.textDecoration = 'line-through';
        }
    },
    7: {
        galaxyLocks: 0,
        goal: new Decimal(1e16),
        buttonID: 'startResearch7',
        unlocks: '',
        calcGoal: function() {
            return this.goal.times(Decimal.pow(10, player.infCompletions));
        },
        onComplete: function() {
            return;
        }
    },
    multi: {
        rows: 2,
        cols: 3,
        idPre: 'research',
        klass: function() { return 'researchDiv' },
        numBoxes: 6,
        numElsByBox: function(i) {
            return Object.keys(this.dataLists[i]).length;
        },
        boxUnlocked: function(i) {
            return true;
        },
        showEl: function(id, i) {
            return true;
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
                    htm: function() { return `${isResearchCompleted(this.boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { researchButtonClick(this.boxID); }
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
                    htm: function() { return `${isResearchCompleted(this.boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { researchButtonClick(this.boxID); }
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
                    htm: function() { return `${isResearchCompleted(this.boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { researchButtonClick(this.boxID); }
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
                    htm: function() { return `${isResearchCompleted(this.boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { researchButtonClick(this.boxID); }
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
                    htm: function() { return `${isResearchCompleted(this.boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(this.boxID) ? (canCompleteResearch(this.boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')}`; },
                    style: function() { return ((player.isInResearch&&!isResearchCompleted(this.boxID)&&!isResearchActive(this.boxID)) ? {'text-decoration': 'line-through'} : {}); },
                    click: function() { researchButtonClick(this.boxID); }
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
                    click: function() { researchButtonClick(this.boxID); }
                }
            },
        },
    },
}

var ARK_DATA = {
    buyUpg: function(data, id) {
        buyArkUpgrade(id);
    },
    upgrades: {
        className: 'arkUpg',
        'thrusters': {
            title: 'Thrusters',
            id: 'thrusters',
            desc: function() { return ''; },
            cost: function() { return `${formatWhole(this.brickCost)} astral bricks<br>and ${formatWhole(this.timeCost)} time crystals`; },
            resource: '',
            isBought: function() { return player.ark[this.id].bought; },
            unlocked: function() { return true; },
            locked: function() { return !player.ark[this.id].unlocked; },
            canAfford: function() { return (player.bricks.gte(this.brickCost)&&player.crystals.gte(this.timeCost)); },
            brickCost: new Decimal(1e100),
            timeCost: new Decimal(1e25),
            buttonID: 'thrustersBut',
            textID: 'thrustersText',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return ''; },
            project: 1,
            effect: function() {
                return;
            }
        },
        'engines': {
            title: 'Engines',
            id: 'engines',
            desc: function() { return ''; },
            cost: function() { return `${formatWhole(this.brickCost)} astral bricks<br>and ${formatWhole(this.timeCost)} time crystals`; },
            resource: '',
            isBought: function() { return player.ark[this.id].bought; },
            unlocked: function() { return true; },
            locked: function() { return !player.ark[this.id].unlocked; },
            canAfford: function() { return (player.bricks.gte(this.brickCost)&&player.crystals.gte(this.timeCost)); },
            brickCost: new Decimal(1e125),
            timeCost: new Decimal(5e27),
            buttonID: 'enginesBut',
            textID: 'enginesText',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return ''; },
            project: 2,
            effect: function() {
                return;
            }
        },
        'navigation': {
            title: 'Navigation',
            id: 'navigation',
            desc: function() { return ''; },
            cost: function() { return `${formatWhole(this.brickCost)} astral bricks<br>and ${formatWhole(this.timeCost)} time crystals`; },
            resource: '',
            isBought: function() { return player.ark[this.id].bought; },
            unlocked: function() { return true; },
            locked: function() { return !player.ark[this.id].unlocked; },
            canAfford: function() { return (player.bricks.gte(this.brickCost)&&player.crystals.gte(this.timeCost)); },
            brickCost: new Decimal(1e150),
            timeCost: new Decimal(1e30),
            buttonID: 'navigationBut',
            textID: 'navigationText',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return ''; },
            project: 3,
            effect: function() {
                return;
            }
        },
        'torpedos': {
            title: 'Torpedos',
            id: 'torpedos',
            desc: function() { return ''; },
            cost: function() { return `${formatWhole(this.brickCost)} astral bricks<br>and ${formatWhole(this.timeCost)} time crystals`; },
            resource: '',
            isBought: function() { return player.ark[this.id].bought; },
            unlocked: function() { return true; },
            locked: function() { return !player.ark[this.id].unlocked; },
            canAfford: function() { return (player.bricks.gte(this.brickCost)&&player.crystals.gte(this.timeCost)); },
            brickCost: new Decimal(1e200),
            timeCost: new Decimal(1e35),
            buttonID: 'torpedosBut',
            textID: 'torpedosText',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return ''; },
            project: 4,
            effect: function() {
                return;
            }
        },
        'railguns': {
            title: 'Railguns',
            id: 'railguns',
            desc: function() { return ''; },
            cost: function() { return `${formatWhole(this.brickCost)} astral bricks<br>and ${formatWhole(this.timeCost)} time crystals`; },
            resource: '',
            isBought: function() { return player.ark[this.id].bought; },
            unlocked: function() { return true; },
            locked: function() { return !player.ark[this.id].unlocked; },
            canAfford: function() { return (player.bricks.gte(this.brickCost)&&player.crystals.gte(this.timeCost)); },
            brickCost: new Decimal("1e300"),
            timeCost: new Decimal(1e40),
            buttonID: 'railgunsBut',
            textID: 'railgunsText',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return ''; },
            project: 5,
            effect: function() {
                return;
            }
        },
        'support': {
            title: 'Death Support',
            id: 'support',
            desc: function() { return ''; },
            cost: function() { return `${formatWhole(this.brickCost)} astral bricks<br>and ${formatWhole(this.timeCost)} time crystals`; },
            resource: '',
            isBought: function() { return player.ark[this.id].bought; },
            unlocked: function() { return true; },
            locked: function() { return !player.ark[this.id].unlocked; },
            canAfford: function() { return (player.bricks.gte(this.brickCost)&&player.crystals.gte(this.timeCost)); },
            brickCost: new Decimal("1e400"),
            timeCost: new Decimal(1e45),
            buttonID: 'supportBut',
            textID: 'supportText',
            displayEffect: false,
            displayTooltip: false,
            displayFormula: function() { return ''; },
            project: 6,
            effect: function() {
                return;
            }
        },
    }
}

var ETH_DATA = {
    layerDisplay: {
        layerButtonClass: 'ethBut',
        numClass: 'ethNum',
    },
    buyUpg: function(data, id) {
        buyEUpg(id);
    },
    upgrades: {
        className: 'ethUpg',
        rows: 1,
        cols: 4,
        11: {
            id: 11,
            title: 'Hypertime',
            desc: function() { return `The first time upgrade in the fourth and fifth columns stay active during research.` },
            resource: 'impossible theorems',
            cost: function() {
                return new Decimal(1);
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            isBought: function() {
                return player.ethUpgs[this.id];
            },
            canAfford: function() {
                return player.theorems.gte(this.cost());
            },
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'ethUpg11',
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            }
        },
        12: {
            id: 12,
            title: 'Practical Theoretics',
            desc: function() { return `Each Ark component built multiplies corpse production by 10.` },
            resource: 'impossible theorems',
            cost: function() {
                return new Decimal(1);
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            isBought: function() {
                return player.ethUpgs[this.id];
            },
            canAfford: function() {
                return player.theorems.gte(this.cost());
            },
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'ethUpg12',
            effect: function() {
                return Decimal.pow(new Decimal(10), getNumArkUpgs());
            },
            effectString: function() {
                return formatWhole(this.effect()) + 'x';
            }
        },
        13: {
            id: 13,
            title: 'Meta-Solar',
            desc: function() { return `<span style="font-weight: bold;">Ultra-Solar</span> stays active during research.` },
            resource: 'impossible theorems',
            cost: function() {
                return new Decimal(1);
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            isBought: function() {
                return player.ethUpgs[this.id];
            },
            canAfford: function() {
                return player.theorems.gte(this.cost());
            },
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'ethUpg13',
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            }
        },
        14: {
            id: 14,
            title: 'Quantum Equivalence',
            desc: function() { return `Void Research production is multiplied by the log${hasUpgrade(4, 13) ? ' (ln after Ultra-Solar).' : ''} of your current bricks/sec.` },
            resource: 'impossible theorems',
            cost: function() {
                return new Decimal(1);
            },
            locked: function() {
                return false;
            },
            unlocked: function() {
                return true;
            },
            isBought: function() {
                return player.ethUpgs[this.id];
            },
            canAfford: function() {
                return player.theorems.gte(this.cost());
            },
            displayEffect: true,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'ethUpg14',
            effect: function() {
                return (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? getBricksPerSecond().ln() : getBricksPerSecond().log10();
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            }
        },
    },
    multi: {
        rows: 1,
        cols: 1,
        idPre: 'research',
        klass: function() { return 'infResearchDiv' },
        numBoxes: 1,
        numElsByBox: function(i) {
            return Object.keys(this.dataLists[i]).length;
        },
        boxUnlocked: function(i) {
            return true;
        },
        showEl: function(id, i) {
            return true;
        },
        dataLists: {
            11: {
                1: {
                    id: 1,
                    boxID: 7,
                    tag: 'h3',
                    klass: function() { return ''; },
                    htm: function() { return `Infinite Research`; }
                },
                2: {
                    id: 2,
                    boxID: 7,
                    tag: 'div',
                    klass: function() { return `infResConds`; },
                    htm: function() { return `You can only buy one galaxy upgrade from each tree and from each row.<br>Corpse production is raised to the ^0.9 a second time.`; }
                },
                3: {
                    id: 3,
                    boxID: 7,
                    tag: 'hr',
                    klass: function() { return `infResHR`; },
                    htm: function() { return ``; }
                },
                4: {
                    id: 4,
                    boxID: 7,
                    tag: 'div',
                    klass: function() { return `infResReward`; },
                    htm: function() { return `<h6>Reward: 1 Impossible Theorem.</h6> `; }
                },
                5: {
                    id: 5,
                    boxID: 7,
                    tag: 'div',
                    klass: function() { return `infResGoal`; },
                    htm: function() { return `<h6>Current Goal: ${formatWhole(DATA.r[7].calcGoal())} Void Research</h6>`; }
                },
                6: {
                    id: 6,
                    boxID: 7,
                    tag: 'button',
                    klass: function() { return `${player.isInResearch&&!isResearchActive(this.boxID) ? 'unclickInfResearchBut' : (player.isInResearch&&isResearchActive(this.boxID) ? (canCompleteResearch() ? 'infResearchButton' : 'progressInfResearchButton') : 'infResearchButton')}`; },
                    htm: function() { return `${player.isInResearch&&isResearchActive(this.boxID) ? (canCompleteResearch() ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN' }`; },
                    click: function() { return {
                                            handle: researchButtonClick,
                                            arg: this.boxID,
                                        } }
                }
            },
        },

    },
}

var GALAXIES_DATA = new Array(5);
GALAXIES_DATA[0] = {
    notify:  false,
    indirect: false,
    layerDisplay: {
        layerButtonClass: 'galaxyBut',
        numClass: 'galNum',
    },
    prestige: {
        className: 'galaxyPrestige',
        heading: 'ASCENSION',
        desc: 'Ascend your mortal form and gain true infernal might - gather your exterminated worlds and form a Depleted Galaxy to rule.<br>This resets everything that sacrifice does, plus time crystals, Time Dimensions, and Time Upgrades.',
        confirmPopText: 'This will reset ALL of your progress up to unlocking Galaxies.<br><span style="font-size: 11pt;">(These confirmations can be disabled in options)</span>',
        displayDesc: function() { return true; },
        displayTooltip: true,
        displayFormula: function() { return 'floor(worlds^(worlds/10 - sqrt(worlds/10)))' },
        canReset: function() { return canGalaxyPrestige(); },
        getGain: function() { return calculateGalaxyGain(); },
        gainResource: 'depleted galaxies',
        getReqAmount: function() { return 'at least 10'; },
        getReqResource: function() { return 'exterminated worlds'; },
        doReset: function() { galaxyPrestigeClick(app.respecNextGal); },
        showNextAt: true,
        getNextAt: function() {
            return calculateNextGalaxy();
        }
    },
};


GALAXIES_DATA[1] = {
    name: 'andromeda',
    id: 1,
    unlocked: function() { return true; },
    buyUpg: function(data, id) {
        buyGUpg(data.slice(-1), id);
    },
    upgrades: {
        className: 'galaxyUpg',
        11: {
            id: 11,
            tier: 1,
            title: '1.11',
            desc: function() { return 'Decrease the astral enslavement time nerf from 10x -> 5x.' },
            resource: 'galaxies',
            requires: [],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 1,
            position: 0,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg1.11',
            lockImageID: '',
            textID: 'text1.11',
            cost: function() {
                let c = 1;
                c += getBoughtGUpgsByRow(4);
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
            onBuy: function() {
                
            },
        },
        21: {
            id: 21,
            tier: 1,
            title: '1.21',
            desc: function() { return 'Increase the exponent on the astral brick production formula from ^0.2 -> ^0.3.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg1.21',
            lockImageID: 'skull1.21',
            textID: 'text1.21',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
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
            tier: 1,
            title: '1.22',
            desc: function() { return 'You produce 1% of your corpse production while in astral enslavement.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: 1,
            displayEffect: true,
            displaySuffix: '/sec',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg1.22',
            lockImageID: 'skull1.22',
            textID: 'text1.22',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return player.astralFlag ? getCorpsesPerSecond().times(.01) : new Decimal(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + '/sec<br>(real time)';
            },
        },
        31: {
            id: 31,
            tier: 1,
            title: '1.31',
            desc: function() { return 'The astral time nerf doesn\'t apply to nekro-photon production (but you still only produce them during astral).' },
            resource: 'galaxies',
            requires: [21],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg1.31',
            lockImageID: 'skull1.31',
            textID: 'text1.31',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        32: {
            id: 32,
            tier: 1,
            title: '1.32',
            desc: function() { return 'The square root of the anti time essence boost affects time dimensions while in astral enslavement.' },
            resource: 'galaxies',
            requires: [22],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: 1,
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg1.32',
            lockImageID: 'skull1.32',
            textID: 'text1.32',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return player.astralFlag ? getAntiTimeBuff().sqrt() : new Decimal(1);
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        41: {
            id: 41,
            tier: 1,
            title: '1.41',
            desc: function() { return 'Decrease the astral enslavement time nerf even more, 5x -> 2x.' },
            resource: 'galaxies',
            requires: [31, 32],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 4,
            position: 0,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg1.41',
            lockImageID: '',
            textID: 'text1.41',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
            onBuy: function() {
                
            },
        },
    },
}
GALAXIES_DATA[2] = {
    name: 'circinus',
    id: 2,
    unlocked: function() { return true; },
    buyUpg: function(data, id) {
        buyGUpg(data.slice(-1), id);
    },
    upgrades: {
        className: 'galaxyUpg',
        11: {
            id: 11,
            tier: 2,
            title: '2.11',
            desc: function() { return 'The base zombie corpse multiplier is increased, 1.75 -> 2.5.' },
            resource: 'galaxies',
            requires: [],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 1,
            position: 0,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg2.11',
            lockImageID: '',
            textID: 'text2.11',
            cost: function() {
                let c = 1;
                c += getBoughtGUpgsByRow(4);
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        21: {
            id: 21,
            tier: 2,
            title: '2.21',
            desc: function() { return 'Each unit tier produces the tier below it at a rate of 1/unit/sec instead of (1/tier)/unit/sec.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg2.21',
            lockImageID: 'skull2.21',
            textID: 'text2.21',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
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
            tier: 2,
            title: '2.22',
            desc: function() { return 'Start every sacrifice with one free exterminated world that doesn\'t increase the world prestige requirement.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: 1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg2.22',
            lockImageID: 'skull2.22',
            textID: 'text2.22',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        31: {
            id: 31,
            tier: 2,
            title: '2.31',
            desc: function() { return 'Your total galaxies multiply unit production multipliers.' },
            resource: 'galaxies',
            requires: [21],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: -1,
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return `1 + x` },
            buttonID: 'galaxyUpg2.31',
            lockImageID: 'skull2.31',
            textID: 'text2.31',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                return getGalaxyUpgSoftcap(e.plus(1));
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        32: {
            id: 32,
            tier: 2,
            title: '2.32',
            desc: function() { return 'Exponential cost scaling for all units starts after twice as many bought.' },
            resource: 'galaxies',
            requires: [22],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: 1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg2.32',
            lockImageID: 'skull2.32',
            textID: 'text2.32',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        41: {
            id: 41,
            tier: 2,
            title: '2.41',
            desc: function() { return 'First time dimensions also produce Sun Eaters at a greatly reduced rate.' },
            resource: 'galaxies',
            requires: [31, 32],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
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
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return (hasUpgrade(4, 13) && (!player.isInResearch || hasEUpgrade(13))) ? getEssenceProdPerSecond().ln() : getEssenceProdPerSecond().log10();
            },
            effectString: function() {
                return formatDefault2(this.effect()) + '/sec<br>(real time)';
            },
        },
    },
}
GALAXIES_DATA[3] = {
    name: 'sculptor dwarf',
    id: 3,
    unlocked: function() { return true; },
    buyUpg: function(data, id) {
        buyGUpg(data.slice(-1), id);
    },
    upgrades: {
        className: 'galaxyUpg',
        11: {
            id: 11,
            tier: 3,
            title: '3.11',
            desc: function() { return 'Cube the <span style=\"font-weight: 800;\">Industrialize</span> effect.' },
            resource: 'galaxies',
            requires: [],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 1,
            position: 0,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg3.11',
            lockImageID: '',
            textID: 'text3.11',
            cost: function() {
                let c = 1;
                c += getBoughtGUpgsByRow(4);
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(3);
            },
            effectString: function() {
                return '';
            },
        },
        21: {
            id: 21,
            tier: 3,
            title: '3.21',
            desc: function() { return 'The effect of each second row Necropolis upgrade directly applies to the effect of the upgrade above it.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg3.21',
            lockImageID: 'skull3.21',
            textID: 'text3.21',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
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
            title: '3.22',
            desc: function() { return 'Exponential cost scaling for the first four construction upgrades starts after twice as many levels.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: 1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg3.22',
            lockImageID: 'skull3.22',
            textID: 'text3.22',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        31: {
            id: 31,
            tier: 3,
            title: '3.31',
            desc: function() { return 'Square your acolyte gain.' },
            resource: 'galaxies',
            requires: [21],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg3.31',
            lockImageID: 'skull3.31',
            textID: 'text3.31',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
        },
        32: {
            id: 32,
            tier: 3,
            title: '3.32',
            desc: function() { return 'The effects of the first four construction upgrades are each 20% stronger.' },
            resource: 'galaxies',
            requires: [22],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: 1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg3.32',
            lockImageID: 'skull3.32',
            textID: 'text3.32',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1.2);
            },
            effectString: function() {
                return '';
            },
        },
        41: {
            id: 41,
            tier: 3,
            title: '3.41',
            desc: function() { return 'The <span style=\"font-weight: 800;\">Lightspeed</span> effect squared also applies to the production of corpses and astral bricks.' },
            resource: 'galaxies',
            requires: [31, 32],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 4,
            position: 0,
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg3.41',
            lockImageID: '',
            textID: 'text3.41',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return hasTUpgrade(23) ? getTUpgEffect(33).pow(2) : new Decimal(1)
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
    },
}
GALAXIES_DATA[4] = {
    name: 'triangulum',
    id: 4,
    unlocked: function() { return true; },
    buyUpg: function(data, id) {
        buyGUpg(data.slice(-1), id);
    },
    upgrades: {
        className: 'galaxyUpg',
        11: {
            id: 11,
            tier: 4,
            title: '4.11',
            desc: function() { return 'Your total galaxies multiply time essence production.' },
            resource: 'galaxies',
            requires: [],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 1,
            position: 0,
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: true,
            displayFormula: function() { return `1 + x` },
            buttonID: 'galaxyUpg4.11',
            lockImageID: '',
            textID: 'text4.11',
            cost: function() {
                let c = 1;
                c += getBoughtGUpgsByRow(4);
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                let e = new Decimal(player.galaxies.plus(player.spentGalaxies));
                return getGalaxyUpgSoftcap(e.plus(1));
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        21: {
            id: 21,
            tier: 4,
            title: '4.21',
            desc: function() { return 'Quadruple your time crystal gain.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg4.21',
            lockImageID: 'skull4.21',
            textID: 'text4.21',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(4);
            },
            effectString: function() {
                return '';
            },
        },
        22: {
            id: 22,
            tier: 4,
            title: '4.22',
            desc: function() { return 'The square root of the true time essence boost affects time dimensions outside of astral enslavement.' },
            resource: 'galaxies',
            requires: [11],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 2,
            position: 1,
            displayEffect: true,
            displaySuffix: 'x',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg4.22',
            lockImageID: 'skull4.22',
            textID: 'text4.22',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return player.astralFlag ? new Decimal(1) : getTrueTimeBuff().sqrt()
            },
            effectString: function() {
                return formatDefault2(this.effect()) + 'x';
            },
        },
        31: {
            id: 31,
            tier: 4,
            title: '4.31',
            desc: function() { return 'Both time essence boosts are based on log(x)^2 instead of log(x).' },
            resource: 'galaxies',
            requires: [21],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: -1,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg4.31',
            lockImageID: 'skull4.31',
            textID: 'text4.31',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(2);
            },
            effectString: function() {
                return '';
            },
        },
        32: {
            id: 32,
            tier: 4,
            title: '4.32',
            desc: function() { return 'You produce your astral brick production ^0.9 outside of astral enslavement (still affected by the astral time nerf).' },
            resource: 'galaxies',
            requires: [22],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 3,
            position: 1,
            displayEffect: true,
            displaySuffix: '/sec<br>(real time)',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg4.32',
            lockImageID: 'skull4.32',
            textID: 'text4.32',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return player.astralFlag ? new Decimal(0) : getBricksPerSecond().pow(0.9).div(getAstralNerf())
            },
            effectString: function() {
                return formatDefault2(this.effect()) + '/sec<br>(real time)';
            },
        },
        41: {
            id: 41,
            tier: 4,
            title: '4.41',
            desc: function() { return 'True and anti time essence no longer nerf the other\'s effect.' },
            resource: 'galaxies',
            requires: [31, 32],
            isBought: function() { return player.galaxyUpgs[this.tier][this.id].bought; },
            canAfford: function() {
                return canAffordGUpg(this.tier, this.id);
            },
            unlocked: function() { return true; },
            locked: function() { return player.galaxyUpgs[this.tier][this.id].locked; },
            row: 4,
            position: 0,
            displayEffect: false,
            displaySuffix: '',
            displayTooltip: false,
            displayFormula: function() {return ''},
            buttonID: 'galaxyUpg4.41',
            lockImageID: '',
            textID: 'text4.41',
            cost: function() {
                let c = 1;
                for (let i=1; i<this.row; i++) {
                    c += getBoughtGUpgsByRow(i);
                }
                return (player.isInResearch ? 3*c : c);
            },
            effect: function() {
                return new Decimal(1);
            },
            effectString: function() {
                return '';
            },
            onBuy: function() {
                return;
            }
        },
    },
}