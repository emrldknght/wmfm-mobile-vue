<template>
    <table>
        <tr>
            <th></th>
            <th title="нанёс точных ударов">У</th>
            <th title="получил попаданий">П</th>
            <th title="дополнительных атак">Д</th>
            <th title="атак щитом">АЩ</th>
            <th title="отбил щитом">Щ</th>
            <th title="поборол противников">Б</th>
            <th title="отправил противников в нокаут">Н</th>
        </tr>
        <template v-for="row in data">
            <tr>
                <td>{{row.fighter}}</td>
                <td>{{row.stat[0]}}</td>
                <td>{{row.stat[1]}}</td>
                <td>{{row.stat[2]}}</td>
                <td>{{row.stat[3]}}</td>
                <td>{{row.stat[4]}}</td>
                <td>{{row.stat[5]}}</td>
                <td>{{row.stat[6]}}</td>
            </tr>
        </template>
    </table>
</template>

<script lang="ts">

    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component({
        props: {
            data: Array
        }
    })
    export default class CombatResultTable extends Vue{

    }
</script>

<style scoped>
    table {
        --tip-margin: 4px;
        width: 100%;
    }
    th {
        cursor: pointer;
        position:relative;
    }
    tr:nth-child(even) {
        background-color:var(--dim-color);
    }
    td {
        border-right: 1px solid black;
        text-align:right;
        padding-right:2px;
    }
    th:before {
        content: attr(title);
        background-color:rgba(127,48,144, .5);
        position:absolute;
        display:none;
        flex-direction:row;
        width: max-content;
        top: calc(-100% - var(--tip-margin));
        padding: var(--tip-margin);
    }
    th:hover:before {
        display:flex;
    }
</style>
