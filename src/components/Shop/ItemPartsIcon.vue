<template>
    <div class="img-parts-icon">
        <!-- <img :src="getPath()" alt="parts"> -->
        <div class="icon" :class="getParts()"></div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    const slots = [
        'helmet',
        'shoulderpads',
        'torso',
        'bracers',
        'glowes',
        'cuisses',
        'jambs',
        'boots'
    ];

    @Component({
        props: {
            data: String
        }
    })
    export default class ItemPartsIcon extends Vue {
        // name: ""
        getPath() {
            return `../../img/item_parts_icons/${0}.png`;
        }
        getParts() {
            const itemSlots = (this.$props.data).split(',');

            const mask = slots.map(e => (itemSlots.includes(e)) ? 1 : 0).join('');
            const bin = parseInt(mask, 2);

            return 'p-' + bin;
        }
    }
</script>

<style scoped>
    .icon {
        --zoom: 1;
        width: calc(13px * var(--zoom));
        height: calc(27px * var(--zoom));
        /*
        background-color:#7f3090;
        */
        background-size:cover;
    }
    /* helmet */
    .p-128 { background-image:url('../../img/item_parts_icons/128.png'); }
    /* shoulders */
    .p-64 { background-image:url('../../img/item_parts_icons/64.png'); }
    /* torso */
    .p-32 { background-image:url('../../img/item_parts_icons/32.png'); }
    /* bracers */
    .p-16 { background-image:url('../../img/item_parts_icons/16.png'); }
    /* gloves */
    .p-8 { background-image:url('../../img/item_parts_icons/8.png'); }
    /* cuisses */
    .p-4 { background-image:url('../../img/item_parts_icons/4.png'); }
    /* jambs */
    .p-2 { background-image:url('../../img/item_parts_icons/2.png'); }
    /* boots */
    .p-1 { background-image:url('../../img/item_parts_icons/1.png'); }

    /* mixed */
    /* bracers + shoulders */
    .p-80 { background-image:url('../../img/item_parts_icons/80.png'); }
    /* cuisses,jambs */
    .p-6 { background-image:url('../../img/item_parts_icons/6.png'); }
    /* torso + cuisses */
    .p-36 { background-image:url('../../img/item_parts_icons/36.png'); }
    /* torso,shoulderpads */
    .p-96 { background-image:url('../../img/item_parts_icons/96.png'); }
    /* torso,cuisses,shoulderpads */
    .p-100 { background-image:url('../../img/item_parts_icons/100.png'); }

    .p-116 { background-image:url('../../img/item_parts_icons/116.png'); }

    .img-parts-icon {
        position:absolute;
        bottom: 1vh;
        right: 0.3vw;
        background-color:black;
    }
</style>
