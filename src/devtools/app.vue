<template>
<div :class="$style.root">
    <div :class="$style.left">
        <v-tree-view :tree="instances">
            <v-test />
            <v-test />
            <v-test />
        </v-tree-view>
    </div>
    <div :class="$style.right">
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import TreeView from './common/tree-view.vue';
import Test from './common/test.vue';
import { mapState } from 'vuex';
import { mapComponents } from 'src/util';

export default Vue.extend({
    name: 'v-app',
    components: mapComponents([TreeView, Test]),
    data() {
        return {
            test: 123,
        };
    },
    computed: mapState(['instances']),
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
