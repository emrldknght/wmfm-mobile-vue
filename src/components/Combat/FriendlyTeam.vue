<template>
    <div class="team-wrapper"  :class="{'active' : active}">
        <template v-for="item in data">
            <template v-if="item.id && item.name">
                <div
                    class="team-fighter"
                    :data-id="item.id"
                    @click="select(item.id)"
                >
                    <template v-if="item.club.img">
                        <ClubBannerSmall :path="item.club.img"></ClubBannerSmall>
                        <!--
                        <img :src="getImgPath(item.club.img)" alt="" width="11" height="11">
                        -->
                    </template>
                    <span class="team-fighter-name">{{ item.name }}</span>
                    <template v-if="canRemove">
                        <span class="team-fighter-remove"
                            @click.stop="remove(item.id, $event)"
                        >X</span>
                    </template>
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {EventBus} from "../../EventBus";
    import {Events} from "../../Events";
    import {Options} from "../../Options";
    import ClubBannerSmall from "../FighterList/ClubBannerSmall.vue";
    import {Prop} from "vue-property-decorator";

    @Component({
        components: {ClubBannerSmall},
        props: {
            data: Array,
            canRemove: Boolean,
            // remove: Function,
            active: Boolean
        }
    })
    export default class FriendlyTeam extends Vue{
        @Prop() readonly remove!: (sid: string, e: Event) => void;
        getImgPath(path: string):string {
            return `${Options.serverPath}img/clubbanners/small/${path}`;
        }
        select(id: string) {
            // console.log('select', id);
            EventBus.emit(Events.SelectNotOwnedFighter, parseInt(id));
        }
    }
</script>

<style scoped>
    img {
        padding: 0 1px;
    }
    .team-fighter-name {
        padding: 0 .3vw;
        flex-grow:1;
    }
    .team-fighter-remove {
        border-left: 1px solid white;
        padding: 0 .3vw;
        overflow:hidden;
    }
    .team-fighter-remove:hover {
        background-color:crimson;
    }
    .team-wrapper {
        padding: 4px;
        /*margin: 2px;*/
        box-sizing:border-box;
        border: 2px double black;
        height: 100%;
        background-color:rgba(150,150,150,.6);
    }
    .team-wrapper.active {
        border-color:limegreen;
    }
    .team-fighter {
        /* border: 1px solid white; */
        color: white;
        display: inline-flex;
        width:max-content;
        flex-direction:row;
        margin: 1px;
        /* padding: 0 .3vw; */
        font-size: smaller;

        cursor: pointer;
        align-items: center;
    }
    .team-fighter:hover {
        background-color: var(--dim-color);
    }
</style>
