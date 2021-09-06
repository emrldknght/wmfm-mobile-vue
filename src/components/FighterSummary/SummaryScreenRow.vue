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
        <div class="item-sword">
            <SummaryScreenSkill
                    :parameter="fighter.sword"
            ></SummaryScreenSkill>
        </div>
        <div class="item-shield">
            <SummaryScreenSkill
                    :parameter="fighter.shield"
            ></SummaryScreenSkill>
        </div>
        <div class="item-blunt">
            <SummaryScreenSkill
                    :parameter="fighter.morningstar"
            ></SummaryScreenSkill>
        </div>
        <div class="item-bastard">
            <SummaryScreenSkill
                    :parameter="fighter.bastard"
            ></SummaryScreenSkill>
        </div>
        <div class="item-polearm">
            <SummaryScreenSkill
                    :parameter="fighter.polyarm"
            ></SummaryScreenSkill>
        </div>
        <div class="item-wrestling">
            <SummaryScreenSkill
                    :parameter="fighter.wrestling"
            ></SummaryScreenSkill>
        </div>
        <div class="item-ef">
            {{fighter.effectiveness}}
            <!--
            <WeaponSetIcon :cat-key="getEff()[0]"></WeaponSetIcon>
            {{getEff()[1]}}
            <template v-if="getEff()[2]">
                <WeaponSetIcon :cat-key="getEff()[2]"></WeaponSetIcon>
                {{getEff()[3]}}
            </template>
            -->
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import RecruitScreenParameter from "../Recruit/RecruitScreenParameter.vue";
    import {locale} from "../../Locale";
    import SummaryScreenSkill from "./SummaryScreenSkill.vue";
    import WeaponSetIcon from "../FighterList/WeaponSetIcon.vue";
    import { calcEff } from '../FighterList/calcEff';
    import {Prop} from "vue-property-decorator";

    @Component({
        props: {
            fighter: Object,
            // select: Function,
            // invite: Function
        },
        components: {
            WeaponSetIcon,
            RecruitScreenParameter, SummaryScreenSkill
        }
    })
    export default class SummaryScreenRow extends Vue{
        @Prop() select!: (id: string) => void;
        @Prop() invite!: (id: string) => void;

        getEff() {
            const fighter: IFighter = this.$props.fighter;
            return calcEff(fighter);
        }

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
        grid-template-columns:1fr repeat(3, 0.5fr) repeat(9, 0.4fr [-th]) 0.6fr;
        grid-template-areas:"n h w a s d st sword shield blunt bastard polearm wrestling ef";
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
    .item-sword {
        grid-area:sword;
    }
    .item-shield {
        grid-area:shield;
    }
    .item-blunt { grid-area: blunt }
    .item-bastard { grid-area:bastard }
    .item-polearm { grid-area:polearm }
    .item-wrestling { grid-area:wrestling }
    .item-ef{
        grid-area:ef
    }
</style>
