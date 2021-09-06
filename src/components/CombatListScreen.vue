<template>
	<div class="screen-wrapper">
		<template v-if="!folded">
			<AppScreenHeader :header="l('combatList')+':'" :ctx="this"></AppScreenHeader>
			<DebugWrapper>
				Combat list<br>
				<button @click="getCombatList()">Get</button>
			</DebugWrapper>
			<ListWrapper reset-scroll-dir>
				<template v-for="(item, i) in list">
					<div class="item" :key="i">
						<DebugWrapper>{{item}}</DebugWrapper>
						<span :class="resultClass(item)" @click="showCombat(item.combatid)">#{{item.combatid}}</span>
						<span class="item-fin">{{l('finished')}} {{calcDate(item.endtime)}} </span>
						<span class="item-class">{{l('type')}}: {{item.class}}</span>
						<span class="item-type">[{{item.type}}]</span>
					</div>
				</template>
			</ListWrapper>
		</template>
	</div>
</template>

<script lang="ts">
    import Component from 'vue-class-component';
	import {locale} from "../Locale";
	import {EventBus} from "../EventBus";
	import {Events} from "../Events";
	import ListWrapper from "./ListWrapper.vue";
	import DebugWrapper from "../DebugWrapper.vue";
	import {GlobalTimers} from "../GlobalTimers";
	import {ICombat} from "./Combat/ICombat";
	import {ICombatEvent} from "./Combat/ICombatEvent";
	import AppScreenHeader from "../AppScreenHeader.vue";
	import {Screens} from "../interfaces/AppScreen/Screens";
	import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
	import {getCombatList} from "../api/Combat/getCombatList";

	// req - combat	1485 last 0

    @Component({
		components: {AppScreenHeader, DebugWrapper, ListWrapper},
		computed: {
			state() {
				return this.$store.getters.SCREENS
			}
		}
	})
    export default class CombatListScreen extends AppScreenX {
		screenName = Screens.CombatList;
		list: ICombat[] = [];
        // folded: boolean = true;
		combatId:number = -1;
		combatInfo: ICombatEvent[] = [];

        showCombat(sid: string) {
        	const id = parseInt(sid);

        	/*
        	const msg: IMessage = { combat: id, last: 0 };
        	apiMessageCombat(msg).then((req: ICombatEvent[]) => {
        		console.log('show combat', req);
        		this.combatId = id;
        		this.combatInfo = req;
			});
        	 */

        	this.$store.dispatch('SET_CID', id);
        	EventBus.emit(Events.ShowCombatWindow);
		}

		calcDate(unixTime: string) {
        	const date = new Date(parseInt(unixTime) * 1000);
        	return date.toLocaleDateString();
		}
        resultClass(item: ICombat) {
        	const c = 'item-id ';
        	return (item.result === 'lose') ? c + 'lose' : c + 'win'
		}
        toggleFold() {
        	if(this.folded) {
        		this.getCombatList();
			}
            this.toggleFoldX(this);
        }
        getCombatList() {
			getCombatList()
        	// apiRequest(ServerActions.CombatList, Options.id)
				.then((r: ICombat[]) =>{
					// console.log('combats', r);
					this.list = r;
				})
        }
        mounted() {
			// this.showCombat('2842');
			GlobalTimers.updaters.push({ ctx: this, cb: () => { this.getCombatList() } });
        	if(!this.folded) {
				this.getCombatList();
			}
			EventBus.on(Events.CombatListScreenToggle, () => {
				this.toggleFold();
			});
        	// debug
			// this.showCombat('5109');
		}
		l(textBit: string) {
			return locale(textBit)
		}
    }
</script>

<style scoped>
	.screen-wrapper {
		background-color:var(--main-bg-color);
		color: white;

		display:flex;
		flex-direction:column;
		max-width: 35vw;
	}
	.win { color: limegreen }
	.lose { color: red }
	.item-id {
		grid-area:id;
		cursor:pointer;
	}
	.item-fin {
		grid-area:fin;
	}
	.item-class {
		grid-area:class;
	}
	.item-type {
		grid-area:type;
	}
	.item {
		/* display:flex;
		flex-direction:row; */
		display:grid;
		grid-template-areas: "id fin class type";
		grid-template-columns: .5fr repeat(2 , 1fr) .5fr;


		border: 0 solid black;
		border-bottom-width: 1px;
	}
	.item:hover {
		background-color: var(--dim-color);
	}
	.item span:not(:last-child) {
		margin-right: 2px;
		border-right: 1px solid white;
	}
</style>
