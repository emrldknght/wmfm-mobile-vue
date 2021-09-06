<template>
	<div
		class="slot"
		:style="calcUrl(item.img)"
		@click.stop="tap(item.id)"
		:data-id="item.id"
		@dblclick="equip(item.id)"
		:class="{active: active}"
	>
		<template v-if="item.tosell === '1'">
			<div class="on-market" :data-text="l('onMarket')"></div>
		</template>
		<span style="display:none">
			[{{ item.id }}]
			{{ item.name }}
		</span>
		<template v-if="indicators()">
			<span class="indicators">
				<template v-if="item.class === itemTypes.Armor">
					<span class="defence-indicator">
						⛨{{item.defence}}
					</span>
				</template>
				<template v-if="item.maxdurability > 0">
					<ItemDurability :item="item"></ItemDurability>
				</template>
			</span>
		</template>
	</div>
</template>

<script lang="ts">

    import Vue from "vue";
	import Component from "vue-class-component";
	import {Options} from "../../Options";
	import {ItemTypes} from "../../interfaces/ItemTypes";
	import {locale} from "../../Locale";
	import ItemDurability from "./ItemDurability.vue";
	import {Prop} from "vue-property-decorator";
	// import { IItem } from '../interfaces/IItem';

    @Component({
		components: {ItemDurability},
		props: {
			item: Object,
			// tap: Function,
			// equip: Function,
			active: Boolean,
			hideIndicators: Boolean
		}
	})
    export default class InventoryItem extends Vue {
    	@Prop() readonly tap!: (id: string) => void;
		@Prop() readonly equip!: (id: string) => void;
    	indicators() {
    		return !this.$props.hideIndicators;
		}
		itemTypes = ItemTypes;
		calcUrl(link: string) {
			return `background-image: url('${Options.serverPath}${link}');`;
		}
		l(textBit: string) {
			return locale(textBit);
		}
    }
</script>

<style scoped>
	.on-market {
		position:absolute;
		width:100%;
		height:100%;
		background-color:rgba(160, 160, 160, .7);

	}
	.on-market:before {
		content:attr(data-text);
		width:140%;
		background-color:crimson;
		position:absolute;
		transform-origin: top left;
		transform:rotate(45deg) translate(0, -50%);
		text-wrap:none;
		text-align:center;
		border-top: 1px solid white;
		border-bottom: 1px solid white;
		box-sizing:border-box;

	}
	.slot {
		width: var(--box-dim);
		height: var(--box-dim);
		background-color: #9f9f9f;
		margin: 1px;
		overflow: hidden;

		color: white;
		font-size: x-small;

		background-size: contain;
		background-repeat:  no-repeat;
		background-position: center center;

		position: relative;
		cursor: pointer;
		user-select:none;
		/* prevent double-tap zoom */
		touch-action: manipulation;

		display:flex;
		flex-direction:column;
	}
	.slot:hover {
		background-color: #b6b6b6;
	}
	.slot.active {
		background-color:#e6a900;
	}
	.slot.active:hover {
		background-color:#ffbd00;
	}
	.indicators {
		margin-top:auto;
		display:flex;
		flex-direction:column;
		user-select:none;
	}

	.defence-indicator {
		background-color:darkblue;
		font-size: smaller;
		width:min-content;
	}
</style>
