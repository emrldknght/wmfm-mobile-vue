<template>
    <div class="debug-wrapper-body" v-if="isDebug">
        <span v-if="showHeader">DEBUG {{isDebug}}</span>
        <slot>
            DEBUG View
        </slot>
    </div>
</template>

<script>
    import {Options} from './Options';
    export default {
        name: "DebugWrapper",
        data() {
            return {
                showHeader: false,
                isDebug: Options.DEBUG,
            }
        },
    }
</script>

<style scoped>
    .debug-wrapper-body {
        display: flex;
        flex-direction: column;

        border: 1px dashed yellow;
    }
</style>
