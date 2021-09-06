<template>
    <div class="header-row">
        <div class="item-n" @click="select(fighter.id)">{{getName(fighter.name)}}</div>
        <div class="item-h">
            {{Math.floor(parseFloat(fighter.height))}}
        </div>
        <div class="item-w">
            {{Math.floor(parseFloat(fighter.weight))}}
        </div>
        <div class="item-a">{{fighter.age}}</div>
        <div class="item-s">
            <RecruitScreenParameter
                    :parameter="fighter.strength"
            ></RecruitScreenParameter>
        </div>
        <div class="item-d">
            <RecruitScreenParameter
                    :parameter="fighter.dextirity"
            ></RecruitScreenParameter>
        </div>
        <div class="item-st">
            <RecruitScreenParameter
                    :parameter="fighter.stamina"
            ></RecruitScreenParameter>
        </div>
        <div class="item-ef">
            {{parseFloat(fighter.effectiveness).toFixed(1)}}
        </div>
        <div class="item-act"><button @click="invite(fighter.id)">{{l('Invite')}}</button></div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import RecruitScreenParameter from "./RecruitScreenParameter.vue";
    import {locale} from "../../Locale";
    import {Prop} from "vue-property-decorator";

    @Component({
        /*
        props: {
            // fighter: Object,
            // select: Function,
            // invite: Function
        },
         */
        components: {
            RecruitScreenParameter
        }
    })
    export default class RecruitScreenRow extends Vue{
        @Prop() fighter!: IFighter;
        @Prop() select!: (id: string) => void;
        @Prop() invite!: (id: string) => void;
        getName(name:string) {
            const parts = name.split(' ');
            return `${parts[0].charAt(0)}. ${parts[1]}`
        }
        l(textBit: string) {
            return locale(textBit)
        }

    }
</script>

<style scoped>
    .header-row{
        display:grid;
        grid-template-columns:1fr repeat(3, 0.5fr) repeat(4, 0.4fr [-th]) min-content;
        grid-template-areas:"n h w a s d st ef act";
        /*width:42vw; */
        grid-area: header;
    }
    .header-row div {
        border:0 dotted gainsboro;
        border-left-width:1px;
        border-bottom-width:1px;
        box-sizing:border-box;

        display:flex;
        align-content:center;
        align-items:center;
        justify-content:center;
        justify-items:center;
    }
    .item-n{
        grid-area:n;
        cursor: pointer;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
    .item-n:hover {
        background-color: var(--dim-color);
    }
    .item-h{
        grid-area:h
    }
    .item-w{
        grid-area:w
    }
    .item-a{
        grid-area:a
    }
    .item-s{
        grid-area:s
    }
    .item-d{
        grid-area:d
    }
    .item-st{
        grid-area:st
    }
    .item-ef{
        grid-area:ef
    }
</style>
