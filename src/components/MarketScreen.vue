<template>
	<div class="screen-wrapper">
		<template v-if="!folded">
			<AppScreenHeader :header="l('market')" :ctx="this"></AppScreenHeader>
			<DebugWrapper>
			<span>
				Market screen
				<button @click="getMarketList()">⟲</button>
			</span>
			</DebugWrapper>
			<Filters ref="filters"></Filters>
			<ListWrapper reset-scroll-dir>
				<template v-for="(item, i) in getFiltered()">
					<MarketItem
                        :item="item"
                        :buy="buy"
                        :key="i"
                    ></MarketItem>
				</template>
			</ListWrapper>
		</template>
	</div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import { IMarketItem } from "../interfaces/IMarketItem";
    import { locale } from "../Locale";
    import { Options } from "../Options";
    import { EventBus } from "../EventBus";
    import { Events } from "../Events";
	import MarketItem from "./Market/MarketItem.vue";
	import ListWrapper from "./ListWrapper.vue";
	import DebugWrapper from "../DebugWrapper.vue";
	import {IDialogMode} from "./DialogWrapper/IDialogMode";
	import {processPurchase} from "./Shop/processPurchase";
	import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
	import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
	import {parseIntE} from "../lib/parseIntE";
	import {buyMarketItem} from "../api/Market/buyMarketItem";
	import {getMarketItems} from "../api/Market/getMarketItems";
	import Filters from "./Inventory/Filters.vue";
	import {IItem} from "../interfaces/IItem";
	import {IFilters} from "./Inventory/IFilters";
    @Component({
        components: {Filters, AppScreenHeader, DebugWrapper, MarketItem, ListWrapper}
    })
    export default class MarketScreen extends AppScreenX {
        screenName = Screens.Market;
    	list: IMarketItem[] = [];

		$refs!: {
			filters: Filters & IFilters
		};

		getFiltered(): IItem[] {
			let filtered: IItem[] = [];
			this.list.forEach(item => {
				let matchFilter = (this.$refs.filters) ? this.$refs.filters.applyFilter(item) : true;
				if (matchFilter) {
					filtered.push(item);
				}
			});
			return filtered;
		}

        buy(item: IMarketItem): void {

			const cost = item.sellcost;
			const newText = `Вы уверены, что хотите приобрести ${item.name} за ${cost}$?`;
			EventBus.emit(Events.DialogSetMode, IDialogMode.None);
			EventBus.emit(Events.DialogSetText, newText);


        	const purchase = () => {
				// apiRequest(ServerActions.BuyMarket, item.id)
				const id = parseIntE(item.id);
				buyMarketItem(id)
					.then((res: any) => {
						const result = processPurchase(res, item);
						if(result) this.getMarketList();
					});
					/*
					.then((res: any) => {
						console.log(res); // 1 on success
						if (res === 1) {
							EventBus.emit(Events.AddItem, item);
							EventBus.emit(Events.RefreshMoney);
						} else {
							showErrorInfoDialog(res.result);
						}
					});
					 */
			};

			EventBus.emit(Events.DialogSetCallback, purchase);
			EventBus.emit(Events.DialogShow);

        }
        imgPath(item: IMarketItem) {
            return `${Options.serverPath}${item.img}`;
        }
        toggleFold() {
            if (this.folded) {
                this.getMarketList();
            }
            this.toggleFoldX(this);
        }
        getMarketList() {
            // const msg: IMessage = { [ServerActions.MarketItems]: 1, Limit: 1000 };
            // apiMessage(msg)
			getMarketItems()
				.then((r: Array<IMarketItem>) => {
					// console.log("market", r);
					this.list = r;
				});
        }
        mounted() {
            if (!this.folded) {
                this.getMarketList();
            }
            EventBus.on(Events.MarketScreenToggle, () => {
                this.toggleFold();
            });
            EventBus.on(Events.MarketScreenUpdate, () => {  this.getMarketList(); });
        }
        l(textBit: string) {
            return locale(textBit);
        }
    }
</script>

<style scoped>
    .screen-wrapper {
        background-color: var(--main-bg-color);
		color:white;
        display: flex;
        flex-direction: column;
    }
</style>
