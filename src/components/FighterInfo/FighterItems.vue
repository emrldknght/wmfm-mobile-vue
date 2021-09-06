<template>
    <div class="wrapper">
        <div class="expand">
            <div class="expand-header" @click="showExpand()" :class="{'not-full': eqNumber() !== 10}">
                {{l('FItems')}}
                <template v-if="eqNumber()!== 10">
                    {{eqNumber()}}[!]
                </template>
                <DebugWrapper>
                    <button @click.stop="force">⟲</button>
                    [{{selectedF}}]
                </DebugWrapper>
            </div>
            <div class="expand-body" v-show="expand">
                <div class="container">
                    <div class="left">
                        <ItemSlot class="slot" :name="l('Helmet')" :data="bySlots().helmet" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('Bracers')" :data="bySlots().bracers" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('mainWeapon')" :data="bySlots().righthand" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('Gloves')" :data="bySlots().glowes" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('Leggings')" :data="bySlots().jambs" :removeItem="removeItem"></ItemSlot>
                    </div>
                    <div class="center">
                        <span>
                            <button @click="saveEquipSet()">&#128190;</button>
                            <button>128</button>
                        </span>
                    </div>
                    <div class="right">
                        <ItemSlot class="slot" :name="l('Body')" :data="bySlots().torso" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('Shoulders')" :data="bySlots().shoulderpads" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('secondaryWeapon')" :data="bySlots().lefthand" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('Cuisses')" :data="bySlots().cuisses" :removeItem="removeItem"></ItemSlot>
                        <ItemSlot class="slot" :name="l('Foot')" :data="bySlots().boots" :removeItem="removeItem"></ItemSlot>
                    </div>
                </div>
                <ItemsWeight></ItemsWeight>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import ItemSlot from "./ItemSlot.vue";
    import {locale} from "../../Locale";
    import {Events} from "../../Events";
    import {EventBus} from "../../EventBus";
    import {IItem} from "../../interfaces/IItem";
    import DebugWrapper from "../../DebugWrapper.vue";
    import ItemsWeight from "./ItemsWeight.vue";
    import {removeItem} from "../../api/Fighter/removeItem";

    @Component({
        components: {
            ItemsWeight,
            DebugWrapper,
            ItemSlot
        },
        props: {
            // selected: Number,
        },
        computed: {
            selectedF() { return this.$store.getters.SELECTED_FIGHTER },
            d() { return this.$store.getters.SELECTED_FIGHTER_DATA },
            data() { return this.$store.getters.SELECTED_FIGHTER_INVENTORY; }
        }
    })
    export default class FighterItems extends Vue {
        selectedF!: number;
        expand: boolean = false;
        data!: IItem[];
        d!: IFighter;

        updateInventory() {
            return this.$store.dispatch('GET_SELECTED_FIGHTER_INVENTORY');
        }
        showExpand() {
            this.expand = !this.expand;
        }
        force(e: Event) {
            // console.log('force', e);
            // e.stopPropagation();
            this.updateInventory()
        }
        eqNumber() {
            return Object.keys(this.bySlots()).length;
        }
        bySlots(): ISlots {
            let s:ISlots = {};
            if(this.data) {
                this.data.forEach((item: IItem) => {
                    const partName = item.bodypart;
                    if(partName) {
                        const parts: string[] = partName.split(',');
                        parts.forEach((part) => s[part] = {...item});
                    }
                });
            }
            return s;
        }

        l(textBit: string) {
            return locale(textBit)
        }

        saveEquipSet() {
            // remembercomplect: 1 fighter: 329
        }

        removeItem(sid: string) {
            const id = parseInt(sid);

            // const fighter = this.$props.selected;
            const fighter = this.selectedF;
            // console.log(fighter, fighter1);
            console.log(`remove item ${id} from ${fighter}`);

            // EventBus.emit(Events.RemoveItem, { fighter, id });
            /*
            const msg: IMessage = {"dress": id, "who": fighter, "off": "off"};
            apiMessage(msg)
            */
            removeItem(id, fighter)
                .then((res: any) => {
                // console.log('server answer', res);
                if (res == 1) {
                    this.updateInventory().then(() => {
                        // get items
                        EventBus.emit(Events.RemoveItem, { fighter, id });
                    });

                }
            });
        }
        mounted() {
            /*
            EventBus.on(Events.EquipItem, (data: {fighter: number, id: number, item: IItem}) => {
                console.log('fighter items catch', data);
                // this.$props.updateInventory();

            }); */
        }

    }
</script>

<style scoped>
    .wrapper {
        width:100%;
    }

    /* slots */
    .container {
        --box-dim: 50px;
        --bg-color: black;
        color: white;
    }
    .container {
        display: flex;
        flex-direction:row;
        background-color: var(--bg-color);
        width: calc(var(--box-dim) * 4);
        height: max-content;

        background-image:url("http://wmfm.ru/img/test3.jpg");
        background-repeat:no-repeat;
        background-size: 97%;
        background-position-x: 65%;
        background-position-y: 40%;
    }
    .slot {
        width: var(--box-dim);
        height: var(--box-dim);
        margin:1px 0;
        display:flex;
        /*
        justify-content:center;
        align-items:center;
         */

        font-size:10px;
        color:white;
        text-align:center;

        border: 1px solid white;
        box-sizing:border-box;

        user-select:none;
        cursor:pointer;

        background: gray no-repeat center center;
        background-size:contain;
    }
    .slot:hover {
        background-color:lightblue;
        color:gray;
    }
    .left {
        background-color:var(--bg-color);
    }
    .center {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    }
    .right{
        background-color:var(--bg-color);
    }
</style>
