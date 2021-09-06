<template>
	<div class="slot"
		 @click="tapItem()"
		 @dblclick="remove()"
			:style="itemPic()"
	>
		<DebugWrapper v-if="data">
			{{data.id}}
		</DebugWrapper>
		<template v-if="!itemPic()">
			<span class="empty-item">
				{{ name }}
			</span>
		</template>
		<template v-if="isArmor()">
			<span class="defence">
				<img src="../../img/cat/shield.png" width="11" alt="shield">{{ showDefence() }}
			</span>
		</template>
		<ItemDurability :item="data"></ItemDurability>
	</div>
</template>

<script lang="ts">

    import Vue from "vue";
	import Component from "vue-class-component";
    import {Options} from "../../Options";
	import {ItemTypes} from "../../interfaces/ItemTypes";
	import {EventBus} from "../../EventBus";
	import {Events} from "../../Events";
	import ItemDurability from "../Inventory/ItemDurability.vue";
	import DebugWrapper from "../../DebugWrapper.vue";

    @Component({
		components: {DebugWrapper, ItemDurability},
		props: {
		    name: String,
			data: Object,
			removeItem: Function
		}
	})
    export default class ItemSlot extends Vue {
    	// itemTypes = ItemTypes;
		dummy() {
			return Options.allowDummy();
		}
		tapItem() {
			const id = this.$props?.data?.id;
			if(!id) return;
			EventBus.emit(Events.TapEquippedItemOnFighterScreen, parseInt(id));
		}
		showItem(){
		    return (this.$props.data) ? this.$props.data.name : this.$props.name;
		}
		isArmor() {
			return (this.$props.data) ? this.$props.data.class === ItemTypes.Armor : false;
		}
		showDefence() {
			if(this.$props.data.class !== ItemTypes.Armor) return false;

			return (this.$props.data) ? this.$props.data.defence : '';
		}
		itemPic() {
		    return (this.$props.data) ? `background-image:url(${Options.serverPath}${this.$props.data.img});` : '';
		}
		remove() {
		    this.$props.removeItem(this.$props.data.id);
		}
    }
</script>

<style scoped>
	.empty-item {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.4vh;
		overflow: hidden;
	}
	.slot {
		/* prevent double-tap zoom */
		touch-action: manipulation;
		display:flex;
		flex-flow:column;
	}
	.defence {
		display:flex;
		flex-direction:row;
		align-items:center;

		width:min-content;
		background-color:crimson;
		color:white;
		font-size: 1.2vh;
		user-select:none;
		margin-top: auto;
		opacity: .8;
		padding-right:3px;
	}
	.defence img {
		width:11px;
		height:11px;
	}
</style>
