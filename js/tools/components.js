var app;

function loadVue() {

	

	Vue.component('buyer-amount', {
		props: ['id'],
		data() {
			return {
				prestAmount: player.autobuyers[10].max,
				prestError: false,
				ascAmount: player.autobuyers[11].amount,
				ascError: false
			}
		},
		methods: {
			updatePrestige() {
				if (this.prestAmount != '') {
					try {
						player.autobuyers[10]['max'] = new Decimal(this.prestAmount);
						this.prestError = false;
					}
					catch(err) {
						this.prestError = true;
					}
				}
			},
			updateAsc() {
				if (this.ascAmount != '') {
					try {
						player.autobuyers[11]['amount'] = new Decimal(this.ascAmount);
						this.ascError = false;
					}
					catch(err) {
						this.ascError = true;
					}
				}
			}
		},
		template: `
		<div v-if="id==32">
			<div class="buyerOptionsContainer priorityContainer">
				<label for="maxPrestige">{{ DATA.ab.multi.dataLists[id][4].htm() }}</label><input v-model="prestAmount" v-on:change="updatePrestige()" type="text" id="maxPrestige" name="maxPrestige" class="buyerTextP">
			</div>
			<span>(set to 0 for unlimited)</span><br>
			<span v-if="prestError">invalid input. value set to last valid input: {{ formatWholeNoComma(player.autobuyers[10]['max']) }}</span>
		</div>
		<div v-else-if="id==33">
			<div class="buyerOptionsContainer priorityContainer">
				<label for="ascensionBuyerAmount">{{ DATA.ab.multi.dataLists[id][4].htm() }}</label><input v-model="ascAmount" v-on:change="updateAsc()" type="text" id="ascensionBuyerAmount" name="ascensionBuyerAmount" class="buyerTextP">
			</div>
			<span v-if="ascError">invalid input. value set to last valid input: {{ formatWholeNoComma(player.autobuyers[11]['amount']) }}</span>
		</div>
		`
	})

	Vue.component('sacrifice-buyer-options', {
		props: [],
		data() {
			return {
				sacAmount: player.autobuyers[9].amount,
				sacType: player.autobuyers[9].type,
				sacError: false
			}
		},
		methods: {
			updateSac() {
				player.autobuyers[9]['type'] = this.sacType;
        		if (this.sacAmount != '') {
					try {
						player.autobuyers[9]['amount'] = new Decimal(this.sacAmount);
						this.sacError = false;
					}
					catch(err) {
						this.sacError = true;
					}
				}
			}
		},
		template: `
		<div>
			<span style="position: relative; right: 62px;"><label for="sacrificeBuyerAdvancedList">condition:</label></span>
			<div id="sacrificeBuyerAmountsContainer" class="buyerOptionsContainerHalf">
				<div class="buyerAmountTextContainer">
					<input v-model="sacAmount" v-on:change="updateSac()" type="text" id="sacrificeBuyerAmount" name="sacrificeBuyerConditions" class="buyerText"><br>
					<label id="sacrificeBuyerAmountLabel" for="sacrificeBuyerAmount" style="font-size: 10pt;">{{ DATA.ab[9].labelTexts[sacType] }}</label>
				</div>
			</div>
			<div id="sacrificeBuyerAdvancedContainer" class="buyerOptionsContainerHalf">
				<div class="buyerAmountTextContainer">
					<select v-model="sacType" v-on:change="updateSac()" id="sacrificeBuyerAdvancedList" name="sacrificeBuyerAdvancedList" class="buyerList" size="3" :disabled="!player.unlocks['advancedBuyer']">
						<option id="atx" value="atx">at x crystals</option>
						<option id="xtimes" value="xtimes">at x times last</option>
						<option id="afterx" value="afterx">after x seconds</option>
					</select>
				</div>
				<div v-if="!player.unlocks['advancedBuyer']" class="buyerAdvancedContainer"></div>
			</div>
			<span v-if="sacError">invalid input. value set to last valid input: {{ formatWholeNoComma(player.autobuyers[9]['amount']) }}</span>
		</div>
		`
	})

	Vue.component('unit-buyer-priority', {
		props: ['id'],
		data() {
			return {
				priSelected: (player.autobuyers.priority.indexOf(this.id.toString())+1).toString()
			}
		},
		template: `
		<div class="buyerOptionsContainer priorityContainer">
			<label :for="DATA.ab[id].prefixText + 'Priority'">Priority:</label>
			<select v-model="priSelected" v-on:change="updateBuyerOrder(id)" :id="DATA.ab[id].prefixText + 'Priority'" class="buyerDropdown">
				<option :id="(id*10+1).toString()" class="priorityOptions" value="1">1</option>
				<option :id="(id*10+2).toString()" class="priorityOptions" value="2">2</option>
				<option :id="(id*10+3).toString()" class="priorityOptions" value="3">3</option>
				<option :id="(id*10+4).toString()" class="priorityOptions" value="4">4</option>
				<option :id="(id*10+5).toString()" class="priorityOptions" value="5">5</option>
				<option :id="(id*10+6).toString()" class="priorityOptions" value="6">6</option>
				<option :id="(id*10+7).toString()" class="priorityOptions" value="7">7</option>
				<option :id="(id*10+8).toString()" class="priorityOptions" value="8">8</option>
			</select>
		</div>
		`
	})

	//data = buyer id, method = 'on', 'fast', or 'max'
	Vue.component('unit-buyer-button', {
		props: ['data', 'method'],
		template: `
		<div v-if="method=='on'">
			<div class="buyerOptionsContainer">
				<label :for="DATA.ab[data].prefixText + 'EnabledBut'">on/off:</label><!-- --><button v-on:click="updateSingleBuyer(data, 'on')" :id="DATA.ab[data].prefixText + 'EnabledBut'" class="buyerEnabledBut" v-html="player.autobuyers[data]['on'] ? 'ON' : 'OFF'"></button><!-- -->	
			</div>
		</div>
		<div v-else-if="method=='fast'">
			<div class="buyerOptionsContainer">
				<label :for="DATA.ab[data].prefixText + 'SpeedBut'">speed:</label><!-- --><button v-on:click="updateSingleBuyer(data, 'fast')" :id="DATA.ab[data].prefixText + 'SpeedBut'" class="buyerSpeedBut" v-html="player.autobuyers[data]['fast'] ? 'FAST' : 'SLOW'" :disabled="!player.unlocks['fastBuyers']"></button><!-- -->
				<div v-if="!player.unlocks['fastBuyers']" class="buyerSpeedLock"></div>
			</div>
		</div>
		<div v-else-if="method=='max'">
			<div class="buyerOptionsContainer">
				<label :for="DATA.ab[data].prefixText + 'BulkBut'">amount:</label><!-- --><button v-on:click="updateSingleBuyer(data, 'bulk')" :id="DATA.ab[data].prefixText + 'BulkBut'" class="buyerBulkBut" v-html="player.autobuyers[data]['bulk'] ? 'MAX' : 'SINGLE'" :disabled="!player.unlocks['bulkBuyers']"></button><!-- -->
				<div v-if="!player.unlocks['bulkBuyers']" class="buyerBulkLock"></div>
			</div>
		</div>
		`
	})

	Vue.component('dim-buyer-buttons', {
		props: ['data'],
		template: `
		<div v-if="data==0">
			<button v-on:click="toggleAllTimeBuyers()" name="timeDimAllBut" id="timeDimAllBut" class="timeDimBuyerAllEnabledBut">TOGGLE ALL</button>
		</div>
		<div v-else>
			<div class="dimBuyerButtonRow">
				<div class="dimBuyerButtonCell">
					<label :for="'timeDim' + data + 'But'">{{ DATA.ab[12][data] }}</label><br><button v-on:click="updateDimBuyer(data)" :name="'timeDim' + data + 'But'" :id="'timeDim' + data + 'But'" class="timeDimBuyerEnabledBut" v-html="player.autobuyers[12][data] ? 'ON' : 'OFF'"></button>
				</div>
				<div v-if="player.unlocks['timeDims2']" class="dimBuyerButtonCell">
					<label :for="'timeDim' + (data+4) + 'But'">{{ DATA.ab[12][data+4] }}</label><br><button v-on:click="updateDimBuyer(data+4)" :name="'timeDim' + (data+4) + 'But'" :id="'timeDim' + (data+4) + 'But'" class="timeDimBuyerEnabledBut" v-html="player.autobuyers[12][data+4] ? 'ON' : 'OFF'"></button>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('tab-button', {
		props: ['data', 'active'],
		methods: {
			isNotify(tab) { return player.tabNotify[tab].notify },
			isIndirect(tab) { return player.tabNotify[tab].indirect },
		},
		template: `
		<div v-if="DATA.tabs[data].unlocked()">
			<button v-bind:class="{ tabBut: true, tabButSelected: (active==DATA.tabs[data].pid && data!='h'), helpButSelected: (data=='h' && player.help), tabButNotify: isNotify(data), tabButIndirectNotify: isIndirect(data), timeUnlockedNotify: (data=='t'&&!player.timeLocked) }" v-on:click="tabButtonClick(data)" v-html="((data=='h' && player.help) ? 'CLOSE HELP' : DATA.tabs[data].title)"></button>
		</div>
		`
	}) 

	Vue.component('sub-tab-button', {
		props: ['data', 'id', 'active'],
		methods: {
			isNotify(tab, sub) {
				if (sub.slice(0,5)=='timeU') { return player.tabNotify[tab]['u'].notify }
				else if (sub.slice(0,5)=='timeD') { return player.tabNotify[tab]['d'].notify }
				else { return player.tabNotify[tab][sub.slice(0,1)].notify }
			},
		},
		template: `
		<div v-if="DATA.tabs[data].subTabs[id].unlocked()">
			<button v-bind:class="{ subTabBut: true, tabButSelected: (active==DATA.tabs[data].subTabs[id].pid), tabButNotify: isNotify(data, id), timeUnlockedNotify: (id=='dims'&&!player.timeLocked) }" v-bind:style="[(isResearchCompleted(6)&&(id=='research')) ? { 'text-decoration': 'line-through' } : {}]" v-on:click="subTabButtonClick(data, id)" v-html="DATA.tabs[data].subTabs[id].title"></button>
		</div>
		`
	}) 

	Vue.component('sub-nav', {
		props: ['data', 'ids', 'active'],
		template: `
		<div v-if="DATA.tabs[data].subUnlocked()" class="subNavMenu">
			<div v-for="i in ids.length">
				<sub-tab-button :data="data" :id="ids[i-1]" :active="active"></sub-tab-button>
			</div>
		</div>
		`
	})

	Vue.component('main-nav', {
		props: ['data', 'active'],
		template: `
		<div class="navMenu">
			<div v-for="i in data.length">
				<tab-button :data="data[i-1]" :active="active"></tab-button>
			</div>
		</div>
		`
	})

	Vue.component('num-text', {
		props: ['data', 'val', 'label'],
		methods: {
			plural(d, str) {
				d = new Decimal(d.replace(',', ''));
				if (str.slice(-3)=='ies') { return (d.eq(1) ? (str.slice(0, -3)+'y') : str); }
				else if (str=='research'||str=='void research') { return str; }
				else { return (d.eq(1) ? str.slice(0, -1) : str); }
			},
		},
		template: `
		<span><span :class="DATA[data].layerDisplay.numClass" v-html="val"></span> {{ plural(val, label) }}</span>
		`
	})

	Vue.component('num-text-plain', {
		props: ['val', 'label'],
		methods: {
			plural(d, str) {
				d = new Decimal(d.replace(',', ''));
				if (str=='galaxies') { return (d.eq(1) ? 'galaxy' : str); }
				else if (str=='depleted galaxies') { return (d.eq(1) ? 'depleted galaxy' : str); }
				else if (str=='research'||str=='void research') { return str; }
				else { return (d.eq(1) ? str.slice(0, -1) : str); }
			},
		},
		template: `
		<span v-html="val + ' ' + plural(val, label)"></span>
		`
	})

	Vue.component('dimension', {
		props: ['data', 'id'],
		template: `
		<div v-if="DATA[data][id] !== undefined" class="dimensionRow">
			<div style="max-width: 5%;" class="dimensionElement" v-html="(data=='u') ? id : ''"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '15%'} : {'max-width': '20%'}]" class="dimensionElement" v-html="DATA[data][id].name"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="formatUnitRow(DATA[data][id].mult())+'x'"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '10%'} : {'max-width': '5%'}]" class="dimensionElement" v-html="(data=='u') ? ('('+formatUnitRow(DATA[data][id].prodMult())+'x)') : ''"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="formatWhole(DATA[data][id].amount())"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="formatWhole(DATA[data][id].bought())"></div>
			<div style="max-width: 11%;" class="dimensionElement" v-html="(DATA[data][id].gainPercent().gte(0.1) ? '(+'+formatUnitRow(DATA[data][id].gainPercent())+'%/s)' : (DATA[data][id].gainPercent().gte(0.05) ? '(<0.1%/s)' : ''))"></div>
			<div style="max-width: 17%;" class="dimensionElement"><button v-on:click="DATA[data].buySingle(id)" v-bind:class="{ [DATA[data].className]: true, single: true, can: DATA[data][id].canAfford(), cant: !DATA[data][id].canAfford() }">Cost: <num-text-plain :val="formatWholeUnitRow(DATA[data][id].cost())" :label="DATA[data].resource"></num-text-plain></button></div>
			<div style="max-width: 12%;" class="dimensionElement"><button v-on:click="DATA[data].buyMax(id)" v-bind:class="{ [DATA[data].className]: true, max: true, can: DATA[data][id].canAfford(), cant: !DATA[data][id].canAfford() }" v-html="'Buy max (' + formatWholeUnitRow(DATA[data].getMax(id)) + ')'"></button></div>
		</div>
		`
	})

	Vue.component('dimension-header', {
		props: ['data'],
		template: `
		<div class="dimensionRow dimensionHeader">
			<div style="max-width: 5%;" class="dimensionElement" v-html="(data=='u') ? 'Tier' : ''"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '15%'} : {'max-width': '20%'}]" class="dimensionElement" v-html="(data=='u') ? 'Unit Type' : 'Dimension'"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="(data=='u') ? 'Corpse Mult' : 'Multiplier'"></div>
			<div v-bind:style="[(data=='u') ? {'max-width': '10%'} : {'max-width': '5%'}]" class="dimensionElement" v-html="(data=='u') ? '(Unit Mult)' : ''"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="'Owned'"></div>
			<div style="max-width: 10%;" class="dimensionElement" v-html="'(Bought)'"></div>
			<div style="max-width: 11%;" class="dimensionElement" v-html="'Gain'"></div>
			<div style="max-width: 29%;" class="dimensionElement" style="text-align: center;"><button v-on:click="DATA[data].buyMaxA()" v-bind:class="{ [DATA[data].className]: true, max: true, can: true }" v-html="'Max all'"></button></div>
		</div>
		`
	})

	Vue.component('dimension-table', {
		props: ['data'],
		template: `
        <div class="dimTable">
		<dimension-header :data="data"></dimension-header>
			<div v-for="tier in DATA[data].numTiers">
				<div v-if="(data=='u'&&player.units[tier].unlocked)||(data=='td'&&player.timeDims[tier].unlocked)">
					<dimension :data="data" :id="tier"></dimension>
				</div>
			</div>
        </div>
		`
	})

	Vue.component('multi-boxes', {
		props: ['data'],
		template: `
		<div v-bind:class="{ [DATA[data].multi.idPre + 'Table']: true }">
			<div v-for="row in DATA[data].multi.rows" v-bind:class="{ [DATA[data].multi.idPre + 'Row']: true }">
				<div v-for="col in DATA[data].multi.cols"><div v-if="DATA[data].multi.boxUnlocked(row*10+col)" v-bind:class="{ [DATA[data].multi.idPre + 'Cell']: true }">
					<multi-box :data="data" :id="row*10+col"></multi-box>
				</div></div>
			</div>
		</div>
		`
	})

	Vue.component('multi-box', {
		props: ['data', 'id'],
		template: `
		<div v-bind:class="{ [DATA[data].multi.klass()]: true }">
			<div v-for="i in DATA[data].multi.numElsByBox(id)">
				<component v-if="(DATA[data].multi.dataLists[id][i].tag=='dim-buyer-buttons')&&DATA[data].multi.showEl(id, i)" :is="DATA[data].multi.dataLists[id][i].tag" :data="i-2"></component>
				<component v-else-if="(DATA[data].multi.dataLists[id][i].tag=='sacrifice-buyer-options')&&DATA[data].multi.showEl(id, i)" :is="DATA[data].multi.dataLists[id][i].tag"></component>
				<component v-else-if="(DATA[data].multi.dataLists[id][i].tag=='buyer-amount')&&DATA[data].multi.showEl(id, i)" :is="DATA[data].multi.dataLists[id][i].tag" :id="id"></component>
				<component v-else-if="(DATA[data].multi.dataLists[id][i].tag=='unit-buyer-button')&&DATA[data].multi.showEl(id, i)" :is="DATA[data].multi.dataLists[id][i].tag" :data="DATA[data].multi.dataLists[id][i].boxID" :method="(DATA[data].multi.dataLists[id][i].htm())"></component>
				<component v-else-if="(DATA[data].multi.dataLists[id][i].tag=='unit-buyer-priority')&&DATA[data].multi.showEl(id, i)" :is="DATA[data].multi.dataLists[id][i].tag" :id="DATA[data].multi.dataLists[id][i].boxID"></component>
				<component v-else-if="(DATA[data].multi.dataLists[id][i].tag=='button')&&data!='e'" :is="DATA[data].multi.dataLists[id][i].tag" v-bind:class="{ completedResearchBut: isResearchCompleted(DATA[data].multi.dataLists[id][i].boxID), researchButton: (canCompleteResearch(DATA[data].multi.dataLists[id][i].boxID)||!player.isInResearch), progressResearchButton: (isResearchActive(DATA[data].multi.dataLists[id][i].boxID)&&!canCompleteResearch(DATA[data].multi.dataLists[id][i].boxID)), unclickResearchBut: (player.isInResearch&&!isResearchActive(DATA[data].multi.dataLists[id][i].boxID)&&!isResearchCompleted(DATA[data].multi.dataLists[id][i].boxID)) }"
							v-bind:style="((player.isInResearch&&!isResearchCompleted(DATA[data].multi.dataLists[id][i].boxID)&&!isResearchActive(DATA[data].multi.dataLists[id][i].boxID)) ? {'text-decoration': 'line-through'} : {})" v-on:click="researchButtonClick(DATA[data].multi.dataLists[id][i].boxID)"
							v-html="(isResearchCompleted(DATA[data].multi.dataLists[id][i].boxID) ? 'COMPLETED' : (player.isInResearch ? (isResearchActive(DATA[data].multi.dataLists[id][i].boxID) ? (canCompleteResearch(DATA[data].multi.dataLists[id][i].boxID) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN'))"></component>
				<component v-else-if="(DATA[data].multi.dataLists[id][i].tag=='button')&&data=='e'" :is="DATA[data].multi.dataLists[id][i].tag" v-bind:class="{ completedInfResearchBut: isResearchCompleted(DATA[data].multi.dataLists[id][i].boxID), infResearchButton: (canCompleteResearch(7)||!player.isInResearch), progressInfResearchButton: (isResearchActive(7)&&!canCompleteResearch(7)), unclickInfResearchBut: (player.isInResearch&&!isResearchActive(7)) }"
							v-bind:style="((player.isInResearch&&!isResearchActive(7)) ? {'text-decoration': 'line-through'} : {})" v-on:click="researchButtonClick(7)"
							v-html="(player.isInResearch ? (isResearchActive(7) ? (canCompleteResearch(7) ? 'COMPLETE<br>PROJECT' : 'IN PROGRESS') : 'BEGIN') : 'BEGIN')"></component>
				<component v-else-if="DATA[data].multi.showEl(id, i)" :is="DATA[data].multi.dataLists[id][i].tag" v-bind:class="{ [DATA[data].multi.dataLists[id][i].klass()]: true }" 
							v-bind:style="(DATA[data].multi.dataLists[id][i].style !== undefined) ? DATA[data].multi.dataLists[id][i].style() : {}" 
							v-html="DATA[data].multi.dataLists[id][i].htm()" 
							v-on:click="function() { if(DATA[data].multi.dataLists[id][i].click!==undefined) { DATA[data].multi.dataLists[id][i].click() } }">
				</component>
			</div>
		</div>
		`
	})

	Vue.component('upgrade', {
		props: {
			data: String, 
			id: String,
			cssid: {
				type: String,
				default: '',
			},
			extra: {
				type: String,
				default: '',
			},
		},
		methods: {
			strikeout(d) {
				return (d.slice(0,1)=='g' && (isResearchActive(6)||isResearchActive(7)))
			}
		},
		template: `
		<div v-if="data!='a'||!player.win">
			<button v-if="DATA[data].upgrades[id]!== undefined" v-on:click="DATA[data].buyUpg(data, id)" v-bind:id="cssid" v-bind:class="{ [DATA[data].upgrades.className]: true, bought: DATA[data].upgrades[id].isBought(), cant: (!(DATA[data].upgrades[id].canAfford())&&!DATA[data].upgrades[id].isBought()), can: (DATA[data].upgrades[id].canAfford()&&!DATA[data].upgrades[id].isBought()&&!DATA[data].upgrades[id].locked()), locked: DATA[data].upgrades[id].locked(), tooltip: (player.tooltipsEnabled&&DATA[data].upgrades[id].displayTooltip)}" v-bind:extra-attr="extra" v-bind:data-title="DATA[data].upgrades[id].displayFormula()">
				<div v-if="data!='a'||(!DATA[data].upgrades[id].isBought()&&!DATA[data].upgrades[id].locked())">
					<span v-if="data=='a'">Build component:<br></span>
					<span v-html="DATA[data].upgrades[id].title" style="font-weight: 900;"></span><br>
					<span v-html="DATA[data].upgrades[id].desc()+'<br>'"></span>
					<span v-if="DATA[data].upgrades[id].requires!==undefined"><span v-if="DATA[data].upgrades[id].requires.length>0"v-bind:style="[strikeout(data) ? { 'text-decoration': 'line-through' } : { 'text-decoration': '' }]">Requires: <span style="font-weight: 900;" v-html="DATA[data].upgrades[DATA[data].upgrades[id].requires[0]].title"></span><span v-if="DATA[data].upgrades[id].requires.length>1"> or <span style="font-weight: 900;" v-html="DATA[data].upgrades[DATA[data].upgrades[id].requires[1]].title"></span></span><br></span></span> 
					Cost: <span v-if="data=='a'" v-html="DATA[data].upgrades[id].cost()"></span><span v-else><num-text-plain :val="formatDefault(DATA[data].upgrades[id].cost())" :label="DATA[data].upgrades[id].resource"></num-text-plain></span>
					<span v-if="data=='c'"><br>Level: {{ formatWhole(player.construction[id]) + (DATA[data].upgrades[id].extraLevels()>0 ? ' + ' + formatWhole(DATA[data].upgrades[id].extraLevels()) : '') }}</span>
					<span v-if="DATA[data].upgrades[id].displayEffect"><br>Currently: <span v-html="DATA[data].upgrades[id].effectString()"></span></span>
				</div>
				<div v-if="data=='a'&&DATA[data].upgrades[id].isBought()">
					<span v-html="DATA[data].upgrades[id].title.toUpperCase()+' ONLINE.'" style="font-weight: 900;"></span>
				</div>
			</button>
		</div>
		`
	})

    Vue.component('building', {
		props: ['data'],
		template: `
		<div v-if="DATA[data].unlocked()" class="buildingsTable">
			<div v-if="!player.buildings[DATA[data].tier].built">
				<button v-on:click="buyBuilding(data)" v-bind:class="{ buildBut: DATA[data].canAffordBuild(), unclickableBuildBut: !DATA[data].canAffordBuild() }">
					Build the<h3 v-html="DATA[data].id"></h3>Cost: <span v-html="formatWhole(DATA[data].cost)"></span> astral bricks
				</button>
			</div>
			<div v-else>
				<div>
					<h3 v-html="DATA[data].id"></h3>
					you have <num-text data="sp" :val="formatDefault(player.buildings[DATA[data].tier].amount)" :label="DATA[data].resource"></num-text><br>
					<span v-if="DATA[data].displayResourceGain" v-bind:class="{ tooltip: player.tooltipsEnabled }" :data-title="DATA[data].gainTooltip">you are producing <num-text data="sp" :val="formatDefault(DATA[data].prod(true))" :label="DATA[data].resource"></num-text>/<span v-html="player.displayRealTime ? 'real sec' : 'sec'"></span> (based on your {{ DATA[data].basedOn }})<br></span>
					<span v-if="data=='b3'"><div v-if="player.astralFlag" style="min-height: 30px;" v-bind:class="{ tooltip: player.tooltipsEnabled }" :data-title="DATA[data].gainTooltip">you are producing <num-text data="sp" :val="formatDefault(DATA[data].prod(true))" label="nekro-photons"></num-text>/<span v-html="player.displayRealTime ? 'real sec' : 'sec'"></span>, only during astral enslavement.<br></div><div v-else style="min-height: 25px; margin-top: 5px;" v-html="DATA[data].extraText()+'<br>'"></div></span>
					<span v-else-if="DATA[data].hasExtraText" v-bind:class="{ tooltip: (data=='b4'&&player.tooltipsEnabled) }" :data-title="(data=='b4' ? DATA[data].gainTooltip : '')" style="font-variant-numeric: tabular-nums;" v-html="DATA[data].extraText()+'<br>'"></span>
					<div v-for="row in DATA[data].upgrades.rows" class="buildingUpgRow">
						<div v-for="col in DATA[data].upgrades.cols"><div v-if="(DATA[data].upgrades[row*10+col]!== undefined) && DATA[data].upgrades[row*10+col].unlocked()" class="buildingUpgCell">
							<upgrade :data = "data" :id = "(row*10+col).toString()"></upgrade>
						</div></div>
					</div>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('construction', {
		props: ['data'],
		template: `
		<div class="constrTable">
			<div class="constrUpgHeader">
				<h2 style="font-size: 18pt;">CONSTRUCTION UPGRADES</h2>
				<layer-button data="c" :width="120" text="Max all" fname="buyMaxAllConstr"></layer-button>
			</div>
			<div class="constrUpgRow">
				<div v-for="upg in 4"><div v-if="(DATA[data].upgrades[upg]!== undefined) && DATA[data].upgrades[upg].unlocked()" class="constrUpgCell">
					<upgrade :data = "data" :id = "upg.toString()"></upgrade>
					<layer-button data="c" :width="120" text="Buy max" fname="buyMaxConstr" :args="upg"></layer-button>
				</div></div>
			</div>
			<div v-if="hasMilestone(1)" class="constrUpgRow">
				<div v-for="upg in 2"><div v-if="(DATA[data].upgrades[4+upg]!== undefined) && DATA[data].upgrades[4+upg].unlocked()" class="constrUpgCell">
					<upgrade :data = "data" :id = "(4+upg).toString()"></upgrade>
					<layer-button data="c" :width="120" text="Buy max" fname="buyMaxConstr" :args="upg"></layer-button>
				</div></div>
			</div>
		</div>
		`
	})

	Vue.component('time-upg-table', {
		props: ['data'],
		template: `
        <div class="timeUpgTable" v-bind:style="[hasMilestone(6) ? {'width': '1210px'} : {'width': '726px'}]">
			<div v-for="row in DATA[data].upgrades.rows" class="timeUpgRow">
				<div v-if="hasMilestone(6)"><div v-if="DATA[data].upgrades[40+row]!== undefined && DATA[data].upgrades[40+row].unlocked()" class="timeUpgCell">
					<upgrade :data = "data" :id = "(40+row).toString()"></upgrade>
				</div></div>
				<div v-for="col in DATA[data].upgrades.cols"><div v-if="DATA[data].upgrades[col*10+row]!== undefined && (col<4)" class="timeUpgCell">
					<upgrade :data = "data" :id = "(col*10+row).toString()"></upgrade>
				</div></div>
				<div v-if="hasMilestone(6)"><div v-if="DATA[data].upgrades[50+row]!== undefined && DATA[data].upgrades[50+row].unlocked()" class="timeUpgCell">
					<upgrade :data = "data" :id = "(50+row).toString()"></upgrade>
				</div></div>
			</div>
        </div>
		`
	})

	Vue.component('galaxy-table', {
		props: ['data'],
		template: `
		<div class="galaxyTable">
			<div class="galaxyUpgRow">
				<h3 v-html="DATA[data].name" style="flex: 1;"></h3>
			</div>
			<div class="galaxyUpgRow">
				<div class="topGalaxyCell">
					<upgrade :data = "data" id = "11"></upgrade>
				</div>
			</div>
			<div class="galaxyUpgRow">
				<div class="leftGalaxyCell">
					<upgrade :data = "data" id = "21"></upgrade>
				</div>
				<div class="rightGalaxyCell">
					<upgrade :data = "data" id = "22"></upgrade>
				</div>
			</div>
			<div class="galaxyUpgRow">
				<div class="leftGalaxyCell">
					<upgrade :data = "data" id = "31"></upgrade>
				</div>
				<div class="rightGalaxyCell">
					<upgrade :data = "data" id = "32"></upgrade>
				</div>
			</div>
			<div class="galaxyUpgRow">
				<div class="bottomGalaxyCell">
					<upgrade :data = "data" id = "41"></upgrade>
				</div>
			</div>
        </div>
		`
	})

	Vue.component('galaxies-table', {
		props: [],
		data() {
			return {
				displayAll: (player.activeGalaxies[0]=='4'),
				displaySingles: [
					(player.activeGalaxies[0]=='4'||player.activeGalaxies[1]=='1'||(player.activeGalaxies[0]=='2' && player.activeGalaxies[2]=='1')),
					(player.activeGalaxies[0]=='4'||player.activeGalaxies[1]=='2'||(player.activeGalaxies[0]=='2' && player.activeGalaxies[2]=='2')),
					(player.activeGalaxies[0]=='4'||player.activeGalaxies[1]=='3'||(player.activeGalaxies[0]=='2' && player.activeGalaxies[2]=='3')),
					(player.activeGalaxies[0]=='4'||player.activeGalaxies[1]=='4'||(player.activeGalaxies[0]=='2' && player.activeGalaxies[2]=='4'))
				],
			}
		},
		template: `
		<div v-bind:class="{ galaxiesTable4Cont: displayAll, galaxiesTableCont: !displayAll }">
			<div v-for="gal in 4"><div v-if="displaySingles[gal-1]" class="galaxyCell">
				<galaxy-table :data="'g'+gal.toString()"></galaxy-table>
			</div></div>
		</div>
		`
	})

	Vue.component('eth-upg-table', {
		props: ['data'],
		template: `
		<div class="ethUpgTable">
			<div class="ethUpgHeader">
				<h2 style="font-size: 20pt; -webkit-text-stroke-width: .5px; -webkit-text-stroke-color: white;">Ethereal Upgrades</h2>
				<layer-button data="e" :width="250" :text="'Respec Ethereal Upgrades<br>(forces a sacrifice reset)'" fname="respecEthereal"></layer-button>
			</div>
			<div v-for="row in DATA[data].upgrades.rows" class="ethUpgRow">
				<div v-for="col in DATA[data].upgrades.cols"><div v-if="(DATA[data].upgrades[row*10+col]!== undefined) && DATA[data].upgrades[row*10+col].unlocked()" class="ethUpgCell">
					<upgrade :data = "data" :id = "(row*10+col).toString()"></upgrade>
				</div></div>
			</div>
		</div>
		`
	})

	Vue.component('prestige-button', {
		props: ['data'],
		template: `
		<div class="prestigeContainer">
			<button v-on:click="DATA[data].prestige.doReset()" v-bind:class="{ [DATA[data].prestige.className]: true, cant: !DATA[data].prestige.canReset(), can: DATA[data].prestige.canReset(), tooltip: (player.tooltipsEnabled&&DATA[data].prestige.displayTooltip)}" v-bind:data-title="DATA[data].prestige.displayFormula()">
				<div v-html="DATA[data].prestige.heading" style="font-weight: 900; font-size: 17pt; margin: 5px 0px;"></div>
				<div v-if="DATA[data].prestige.displayDesc()" style="margin: 5px 0px;" v-html="DATA[data].prestige.desc"></div>
				<div v-if="DATA[data].prestige.canReset()" style="font-size: 15pt; margin: 0px;">Reset for <num-text-plain :val="formatWhole(DATA[data].prestige.getGain())" :label="DATA[data].prestige.gainResource"></num-text-plain></div>
				<div v-if="!DATA[data].prestige.canReset()" style="font-size: 15pt; margin: 0px;">Requires {{ DATA[data].prestige.getReqAmount() }} {{ DATA[data].prestige.getReqResource() }}</div>
				<div v-if="DATA[data].prestige.canReset()&&DATA[data].prestige.showNextAt" style="font-size: 15pt; margin: 0px;">Next at {{ formatWhole(DATA[data].prestige.getNextAt()) }} {{ DATA[data].prestige.getReqResource() }}</div>
			</button>
		</div>
		`
	})

	Vue.component('opt-button', {
		props: ['data'],
		template: `
		<div>
			<button v-bind:class="{ optBut: true }" v-on:click="DATA.o[data].fxn()" v-html="(DATA.o[data].altToggle() ? DATA.o[data].altTitle : DATA.o[data].title)"></button>
		</div>
		`
	}) 

	Vue.component('options-table', {
		props: [],
		template: `
		<div class="optionsTable">
			<div v-for="row in DATA['o'].rows" class="optRow">
				<div v-for="col in DATA['o'].cols"><div class="optButCell">
					<opt-button :data="10*row+col"></opt-button>
				</div></div>
			</div>
		</div>
		`
	}) 

	Vue.component('layer-button', {
		props: {
			data: String,
			width: Number,
			height: {
				type: Number,
				default: null,
			},
			text: String,
			fname: String,
			args: {
				type: null,
				default: null,
			},
			cancl: {
				type: Boolean,
				default: false,
			},
			addlclass: {
				type: String,
				default: '',
			},
		},
		methods: {
			call(f, a) {
				if (a === null) { window[f](); }
				else if (Array.isArray(a)) { window[f](a[0], a[1]); }
				else { window[f](a); }
			},
			canClick() { return this.cancl; }
		},
		template: `
		<button v-on:click="call(fname, args)" v-bind:class="{ [DATA[data].layerDisplay.layerButtonClass]: true, [addlclass]: (addlclass!=''), can: canClick(), cant: !canClick() }" v-bind:style="[(height==0) ? {'width': width+'px'} : {'width': width+'px', 'height': height+'px'}]" v-html="text"></button>
		`
	})

	Vue.component('layer-button-two', {
		props: {
			data: String,
			width: Number,
			text: String,
			fname: String,
			args: {
				type: null,
				default: null,
			},
			width2: Number,
			text2: String,
			fname2: String,
			args2: {
				type: null,
				default: null,
			},
		},
		methods: {
			call(f, a) {
				if (a === null) { window[f](); }
				else { window[f](a); }
			}
		},
		template: `
		<div>
			<button v-on:click="call(fname, args)" v-bind:class="{ [DATA[data].layerDisplay.layerButtonClass]: true }" v-bind:style="[{'width': width+'px'}]" v-html="text"></button>
			<button v-on:click="call(fname2, args2)" v-bind:class="{ [DATA[data].layerDisplay.layerButtonClass]: true }" v-bind:style="[{'width': width2+'px'}]" v-html="text2"></button>
		</div>
		`
	})

	Vue.component('milestone', {
		props: ['data'],
		template: `
		<div v-bind:class="{ milestoneTD: true, locked: !player.milestones[data], unlocked: player.milestones[data] }">
			<span v-bind:class="{ milestoneReq: true, unlocked: player.milestones[data] }" v-html="DATA.ms[data].reqText"></span><br>
			<span class="milestoneReward" style="font-size: 11pt;" v-html="DATA.ms[data].rewardText"></span>
		</div>
		`
	})

	Vue.component('milestones', {
		props: [],
		template: `
		<div class="milestoneTable">
			<div v-for="i in 7">
				<milestone :data="i"></milestone>
			</div>
		</div>
		`
	})

	Vue.component('toggle-button', {
		props: {'fname': String,
				'args': {
					type: null,
					default: null,
				}, 
				'on': Boolean,
		},
		methods: {
			call(f, a) {
				if (a === null) { window[f](); }
				else if (Array.isArray(a)) { window[f](a[0], a[1]); }
				else { window[f](a); }
			}
		},
		template: `
		<button class="confBut" v-on:click="call(fname, args)" v-html="on ? 'ON' : 'OFF'"></button>
		`
	})

	Vue.component('display-toggle', {
		props: ['data'],
		template: `
		<div class="toggleRow">
			<div class="toggleText" v-html="DATA.header[data].text"></div>
			<div class="toggleButtonDiv">
				<toggle-button class="confBut" fname="toggleDisplay" :args="DATA.header[data].id" :on="player.headerDisplay[DATA.header[data].id]"></toggle-button>
			</div>
		</div>
		`
	})

	Vue.component('display-toggles', {
		props: [],
		template: `
		<div class="displayButtonsTable">
			<div v-for="i in DATA.header.rows">
				<div v-if="player.headerDisplayUnlocked[DATA.header[i].id]">
					<display-toggle :data="i"></display-toggle>
				</div>
			</div>
			<button class="displayButSkinny" style="margin: 10px;" v-on:click="setDisplayDefaults()">defaults</button>
		</div>
		`
	})

	Vue.component('confirm-toggle', {
		props: ['data'],
		template: `
		<div class="toggleRow">
			<div class="toggleText" v-html="DATA.ul.confirmations[data].text"></div>
			<div class="toggleButtonConfDiv">
				<toggle-button class="confBut" :data="DATA.ul.confirmations[data].id" fname="toggleConfirmations" :args="[DATA.ul.confirmations[data].id, 'click']" :on="player.confirmations[DATA.ul.confirmations[data].id]['click']"></toggle-button>
			</div>
			<div class="toggleButtonConfDiv">
				<toggle-button class="confBut" :data="DATA.ul.confirmations[data].id" fname="toggleConfirmations" :args="[DATA.ul.confirmations[data].id, 'key']" :on="player.confirmations[DATA.ul.confirmations[data].id]['key']"></toggle-button>
			</div>
		</div>
		`
	})

	Vue.component('confirm-toggles', {
		props: [],
		template: `
		<div class="confirmButtonsTable">
			<div class="toggleRow">
				<div class="toggleText"><strong>action</strong></div>
				<div class="toggleButtonConfHead">
					<strong>on<br>click</strong>
				</div>
				<div class="toggleButtonConfHead">
					<strong>on<br>key</strong>
				</div>
			</div>
			<div v-for="i in DATA.ul.confirmations.rows">
				<div v-if="player.confirmations[DATA.ul.confirmations[i].id].unlocked">
					<confirm-toggle :data="i"></confirm-toggle>
				</div>
			</div>
			<button class="displayButSkinny" style="margin: 10px;" v-on:click="setConfDefaults()">defaults</button>
		</div>
		`
	})

	Vue.component('stats-table', {
		props: ['data'],
		template: `
		<div>
			<div class="statsTableDiv">
				<h3>{{ player.stats[data].label }}</h3>
				<div class="statsHeader">
					<div class="resourceCellH">resource</div>
					<div class="totalCellH">total</div>
					<div class="bestCellH">best</div>
				</div>
				<div class="statsRow">
					<div class="resourceCell">corpses</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalCorpses) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestCorpses) }}</div>
				</div>
				<div class="statsRow">
					<div class="resourceCell">astral bricks</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalBricks) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestBricks) }}</div>
				</div>
				<div class="statsRow" v-if="(data=='thisAscStats')||((data=='allTimeStats')&&player.stats['allTimeStats'].totalTimeResets.gt(0))">
					<div class="resourceCell">time crystals</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalCrystals) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestCrystals) }}</div>
				</div>
				<div class="statsRow">
					<div class="resourceCell">exterminated worlds</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalWorlds) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestWorlds) }}</div>
				</div>
				<div class="statsRow" v-if="(data=='allTimeStats')&&player.stats['allTimeStats'].totalAscensions.gt(0)">
					<div class="resourceCell">depleted galaxies</div>
					<div class="totalCell">{{ formatWhole(player.stats[data].totalGalaxies) }}</div>
					<div class="bestCell">{{ formatWhole(player.stats[data].bestGalaxies) }}</div>
				</div>
			</div>
			<div class="statsTableText">
				<div>
					<span>you have world prestiged {{ formatWhole(player.stats[data].totalSpaceResets) }} times</span>
					<span v-if="(data=='thisAscStats')||((data=='allTimeStats')&&player.stats['allTimeStats'].totalTimeResets.gt(0))"> / sacrificed {{ formatWhole(player.stats[data].totalSpaceResets) }} times</span>
					<span v-if="data=='allTimeStats'"> / ascended {{ formatWhole(player.stats[data].totalAscensions) }} times</span>
				</div>
				<div>
					<span v-if="(data=='thisAscStats')||((data=='allTimeStats')&&player.stats['allTimeStats'].totalTimeResets.gt(0))">your best crystal gain was {{ formatWhole(player.stats[data].bestCrystalGain) }} and your best crystal gain rate was {{ formatWhole(player.stats[data].bestCrystalRate) }}/min</span>
				</div>
				<div>
					<span v-if="(data=='allTimeStats')&&player.stats['allTimeStats'].totalAscensions.gt(0)">you have spent a total of {{ formatWhole(player.stats[data].totalSpentGalaxies) }} galaxies</span>
				</div>
			</div>
		</div>
		`
	})

	Vue.component('stats-page', {
		props: [],
		template: `
		<div class="statsTables">
			<div v-if="player.stats['thisSacStats'].displayStats()">
				<stats-table data="thisSacStats"></stats-table>
			</div>
			<div v-if="player.stats['thisAscStats'].displayStats()">
				<stats-table data="thisAscStats"></stats-table>
			</div>
			<div>
				<stats-table data="allTimeStats"></stats-table>
			</div>
		</div>
		`
	})

	Vue.component('ten-sac', {
		props: [],
		template: `
		<div class="pastRunsTable">
			<div v-if="(player.pastRuns.lastRun.timeSpent != 0)">
				<div><h3>Last 10 Sacrifice Runs</h3></div>
				<div v-html="'Avg. of past 10 runs: ' + generateSacAvgs()"></div>
				<br>
				<div v-for="i in 10">
					<div v-html="generateSacString(i-1)"></div>
				</div>
			</div>
			<div v-else>
				<div><h3>Last 10 Sacrifice Runs</h3></div>
				<div>you don't have any past runs!</div>
			</div>
		</div>
		`
	})

	Vue.component('ten-asc', {
		props: [],
		template: `
		<div class="pastRunsTable">
			<div v-if="(player.pastAscRuns.lastRun.timeSpent != 0)">
				<div><h3>Last 10 Ascension Runs</h3></div>
				<div v-html="'Avg. of past 10 runs: ' + generateAscAvgs()"></div>
				<br>
				<div v-for="i in 10">
					<div v-html="generateAscString(i-1)"></div>
				</div>
			</div>
			<div v-else>
				<div><h3>Last 10 Ascension Runs</h3></div>
				<div>you don't have any past runs!</div>
			</div>
		</div>
		`
	})

	Vue.component('achievement', {
		props: ['data'],
		methods: {
			genTooltip(id) {
				let str = '';
				if (DATA.ach[id].secret && !player.achievements[id]) { str += DATA.ach[id].hint; }
				else { str += DATA.ach[id].desc; }
				if (DATA.ach[id].hasReward) { str += (' Reward: ' + DATA.ach[id].reward); }
				if (DATA.ach[id].showEffect) { str += (' Currently: ' + formatDefault2(DATA.ach[id].effect()) + 'x'); }
				return str;
			},
			isNew() {
				return 
			}
		},
		template: `
		<div v-bind:class="{ achievement: true, locked: !player.achievements[data], unlocked: player.achievements[data], new: player.tabNotify.ach[data], achTooltip: true }" v-bind:data-title="genTooltip(data)" v-on:mouseover="mouseoverAchievement(data)" v-html="'<p>'+DATA.ach[data].title+(DATA.ach[data].reward ? '<br>+' : '')+'</p>'"></div>
		`
	})

	Vue.component('achievements', {
		props: [],
		template: `
		<div class="achTable">
			<div v-for="row in DATA.ach.rows" class="achRow">
				<div v-for="col in DATA.ach.cols"><div v-if="player.achievements.rowsUnlocked[row]">
					<achievement :data="row*10+col"></achievement>
				</div></div>
			</div>
		</div>
		`
	})

	

	Vue.component('popups', {
		props: [],
		data() {
			return {
				timedPopups: []
			}
		},
		template: `
		<div id="popupContainer">
			<transition-group name="fade">
				<div v-for="popup, index in timedPopups" v-bind:key="'p'+index">
					<div v-bind:class="popup.className" v-html="popup.popupText"></div>
				</div>
			</transition-group>
		</div>
		`
	})

	//data is the name of the function to call on confirm
	Vue.component('confirm-popup', {
		props: [],
		data() {
			return {
				isActivePop: false,
				confirmText: '',
				fname: '',
				arg: null,
			}
		},
		methods: {
			confirmYes() {
				this.isActivePop = false;
				this.confirmText = '';
				if (this.arg==null) { window[this.fname](); }
				else { window[this.fname](this.arg); }
				this.fname = '';
				this.arg = null;
			},
			confirmNo() {
				this.isActivePop = false;
				this.confirmText = '';
				this.fname = '';
				this.arg = null;
			}
		},
		template: `
		<div v-if="isActivePop" class="confPopup">
			<h3>Are You Sure?</h3>
			<div style="margin: auto;" v-html="confirmText"></div>
			<div style="display: flex; justify-content: center; margin: 10px auto;">
				<div style="flex: 1; max-width: 100px; margin: 5px;"><button class="confirmBut" v-on:click="confirmYes()">YES</button></div>
				<div style="flex: 1; max-width: 100px; margin: 5px;"><button class="confirmBut" v-on:click="confirmNo()">NO</button></div>
			</div>
		</div>
		`
	})
	
	Vue.component('header-popup', {
		props: [],
		data() {
			return {
				isActivePop: false
			}
		},
		template: `
		<div v-if="isActivePop" class="dPopup">
			<div class="headerHeaderContainer">
				<div class="headerPopupHeader">Header Display</div>
				<div class="headerPopupHeaderX"><a href="javascript:closeNormalPopup('hpop')">X</a></div>
			</div>
			<display-toggles></display-toggles>
		</div>
		`
	})

	Vue.component('confirmations-popup', {
		props: [],
		data() {
			return {
				isActivePop: false
			}
		},
		template: `
		<div v-if="isActivePop" class="cPopup">
			<div class="headerHeaderContainer">
				<div class="headerPopupHeader">Confirmations</div>
				<div class="headerPopupHeaderX"><a href="javascript:closeNormalPopup('cpop')">X</a></div>
			</div>
			<confirm-toggles></confirm-toggles>
		</div>
		`
	})

	Vue.component('milestones-popup', {
		props: [],
		data() {
			return {
				isActivePop: false
			}
		},
		template: `
		<div v-if="isActivePop" class="milestonePopup">
			<div class="milestoneHeaderContainer">
				<div class="milestonePopupHeader">MILESTONES</div>
				<div class="milestonePopupHeaderX"><a href="javascript:closeNormalPopup('mpop');">X</a></div>
				<div class="milestonePopupHR"></div>
			</div>
			<milestones></milestones>
		</div>
		`
	})

	Vue.component('favs-popup', {
		props: [],
		data() {
			return {
				isActivePop: false,
				isGSpecErr: false,
				gSpecErr: '',
			}
		},
		template: `
		<div v-if="isActivePop" class="gSpecPopup">
			<div v-for="i in 3">
				<fav-row :data="i"></fav-row>
			</div>
			<div style="height: 20px; min-height: 20px;"><div v-if="isGSpecErr">{{ gSpecErr }}</div></div>
			<div style="margin: 10px auto; width: 310px;">
				<button class="optBut" v-on:click="resetAllFavsClick()" style="float: left; margin: 2px !important;">RESET ALL</button>
				<button class="optBut" v-on:click="closeFavPopup()" style="float: right; margin: 2px !important;">CLOSE</button>
			</div>
		</div>
		`
	})

	Vue.component('g-import-popup', {
		props: [],
		data() {
			return {
				isActivePop: false,
				isGImpErr: false,
				gImpErr: '',
				gImpText: '',
			}
		},
		methods: {
			focusInput() {
				this.$refs['gitext'].focus();
			}
		},
		template: `
		<div v-if="isActivePop" class="giPopup">
			<label id="gImportTextLabel" for="gImportText"><h2>Paste your galaxy code:</h2></label>
			<textarea v-model="gImpText" ref="gitext" id="gImportText" name="gImportText" style="display: block; resize: none;"></textarea>
			<div style="height: 20px; min-height: 20px;"><div v-if="isGImpErr">{{ gImpErr }}</div></div>
			<div style="margin: 5px 10px;">
				<button class="optBut" v-on:click="importGalaxies()" style="float: left; margin: 2px !important;">IMPORT</button>
			</div>
			<div style="margin: 5px 10px;">
				<button class="optBut" v-on:click="closeImpGalaxies()" style="float: right; margin: 2px !important;">CLOSE</button>
			</div>
		</div>
		`
	})

	Vue.component('g-export-popup', {
		props: [],
		data() {
			return {
				isActivePop: false,
				gExpText: '',
			}
		},
		methods: {
			selectInput() {
				this.$refs['getext'].select();
			}
		},
		template: `
		<div v-if="isActivePop" class="gePopup">
			<label id="gExportTextLabel" for="gExportText"><h2>Your galaxy code:</h2></label>
			<textarea v-model="gExpText" ref="getext" id="gExportText" name="gExportText" style="display: block; resize: none;"></textarea>
			<div style="margin: auto;"><button class="optBut" v-on:click="closeExpGalaxies()">CLOSE</button></div>
		</div>
		`
	})

	Vue.component('fav-row', {
		props: ['data'],
		template: `
		<div class="favRow">
			<div class="favCell" style="min-width: 48%; line-height: 50px;">{{ player.favGalNames[data-1] }}</div>
			<div class="favCell" style="min-width: 15%;"><button class="saveLoadFavBut" v-on:click="saveFavoriteClick(data)">SAVE</button></div>
			<div class="favCell" style="min-width: 15%;"><button class="saveLoadFavBut" v-on:click="importGalaxies(true, data)">LOAD</button></div>
			<div class="favCell" style="min-width: 20%;"><button class="renameFavBut" v-on:click="renameFavorite(data)">RENAME</button></div>
		</div>
		`
	})

	Vue.component('hotkeys-display', {
		props: [],
		template: `
		<div class="hotkeysDesc">
			<div><span style="font-size: 18pt; font-weight: bold;">hotkeys: </span>Number Keys 1-8: Buy Single Unit; shift+(1-8): Buy Max Units;</div>
			<div v-for="i in (Object.keys(DATA.hk).length-1)" style="display: inline;">
				<span v-html="DATA.hk[i].key + ': ' + DATA.hk[i].desc + '; '"></span><br v-if="i==4||i==7">
			</div>
			<div style="font-size: 12pt; font-weight: bold;">hotkeys do not trigger if ctrl or command (mac) is pressed.</div>
		</div>
		`
	})

	app = new Vue({
		el: "#app",
		data: {
			player,
			Decimal,
			format,
			formatWhole,
            formatDefault,
			formatDefault2,
			formatUnitRow,
			formatUnitRow2,
			formatWholeUnitRow,
			formatTime,
			buyBUpg,
			buyTUpg,
			buyGUpg,
			buyArkUpgrade,
			buyEUpg,
			hasUpgrade,
			hasTUpgrade,
			hasGUpgrade,
			hasAUpgrade,
			hasEUpgrade,
			hasMilestone,
			hasAchievement,
			showNormalPopup,
			closeNormalPopup,
			HOTKEYS,
            DATA,
            GAME_DATA,
			POPUPS: {
				'achUnlock': false, 
				'mileUnlock': false, 
				'offline': false, 
				'import': false, 
				'export': false, 
				'favs': false, 
				'milestones': false, 
				'confirmations': false, 
				'header': false,
			},
			showNormalPopup,
			closeNormalPopup,
			getCorpsesPerSecond,
			getCorpseMultFromUnits,
			getGalaxiesBonus,
			getWorldsBonus,
			getTotalCorpseMult,
			getBricksPerSecond,
			getAstralNerf,
			getNumCompletedProj,
			isResearchActive,
			isResearchCompleted,
			getTheoremBoostW,
			getTheoremBoostC,
			getNumAchievements,
			getNumAchRows,
			getAchievementEffect,
			getAchievementBoost,
			getEssenceProdAfterSlider,
			getTrueTimeBuff,
			getAntiTimeBuff,
			getResearchPerSecond,
			getCurrentGoal,
			tabButtonClick,
			generateHelpText,
			generateLastAsc,
			generateAscAvgs,
			generateAscString,
			generateLastSac,
			generateSacAvgs,
			generateSacString,
			galSelected: player.activeGalaxies[0],
			isOffline: false,
			allBuyersRadio: 'all',
			respecNextGal: false,
			respecNextSac: false,
			dontRespec: player.dontResetSlider,
			sliderVal: player.antiPercent,
			shadowStyle: '',
			devSpeed: 1,
			showHelp: false,
			importing: false,
			exporting: false,
			exportTextArea: '',
		},
	})

    
}