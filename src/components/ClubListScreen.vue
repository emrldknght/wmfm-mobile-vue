<template>
    <div class="screen-wrapper">
        <template v-if="!folded">
            <AppScreenHeader :header="l('clubList')" :ctx="this"></AppScreenHeader>
            <span class="pages">
                {{l('pages')}}:
                <template v-for="i in list.pages">
                    <span @click="getPage(i)" :class="{active: i === currentPage}">[{{i}}]</span>
                </template>
            </span>
            <ListWrapper>
                <template v-for="(item, key) in list">
                    <template v-if="key !== 'pages'">
                        <ClubInfo :k="parseInt(key) + ((currentPage - 1) * limit) + 1" :data="item"></ClubInfo>
                    </template>
                </template>
            </ListWrapper>
        </template>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import ListWrapper from "./ListWrapper.vue";
    import ClubInfo from "./Club/ClubInfo.vue";
    import {EventBus} from "../EventBus";
    import {Events} from "../Events";
    import AppScreenHeader from "../AppScreenHeader.vue";
    import {Screens} from "../interfaces/AppScreen/Screens";
    import {AppScreenX} from "../interfaces/AppScreen/AppScreenX";
    import {IClubInfoList} from "./Club/IClubInfoList";
    import {getClubList} from "../api/Club/getClubList";

    @Component({
        components: {AppScreenHeader, ClubInfo, ListWrapper},
    })
    export default class ClubListScreen extends AppScreenX {
        screenName = Screens.ClubList;
        currentPage: number = 1;
        limit: number = 10;
        // list: IClubInfo[] = [];
        list: IClubInfoList = {};
        // http://wmfm.ru/a.php?feature=mobile&GetClubList&page=1&limit=5
        getList() {
            /*
            const msg: IMessage = {
                [ServerActions.GetClubList]: '',
                // page: 1,
                page: this.currentPage,
                limit: this.limit
            };
            apiMessage(msg)
             */
            getClubList(this.currentPage, this.limit)
                .then((result: IClubInfoList) => {
                    this.list = result;
                })
        }
        getPage(num: number) {
            if(num === this.currentPage) return;

            // console.log('page:', num);
            this.currentPage = num;
            this.getList();
        }
        toggleFold() {
            if(this.folded) {
                this.getList();
            }
            this.toggleFoldX(this);
        }
        mounted() {
            if(!this.folded) {
                this.getList();
            }
            EventBus.on(Events.ClubListScreenToggle, () => {
                this.toggleFold();
            });
        }
    }
</script>

<style scoped>
    .screen-wrapper {
        background-color: var(--main-bg-color);
        color:white;
        max-width: 22vw;
        display: flex;
        flex-direction: column;
    }
    .screen-wrapper .pages {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .screen-wrapper .pages span{
        cursor: pointer;
    }
    .screen-wrapper .pages span:hover{
        background-color: var(--dim-color);
    }
    .screen-wrapper .pages span.active{
        background-color: rgba(0,0,0,.5);
    }
</style>
