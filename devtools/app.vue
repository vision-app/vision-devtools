<template>
<div :class="$style.root">
    <div :class="$style.left">
    </div>
    <div :class="$style.right">
    </div>
</div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    name: 'v-app',
});
</script>

<style module>
.root {
    display: flex;
    height: 100%;

    .left {
        width: 36%;
        border-right: 1px solid #ddd;
    }

    .right {
        flex: auto;
    }
}
</style>
