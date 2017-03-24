<template>
<div :class="$style.root">
    <div :class="$style.body">
        <div :class="$style.sside">
            <v-tree-view nkey="name" :tree="ctors" />
            <!-- v-tree-view nkey="name" :tree="instances" @enter-node="enterNode" @leave-node="leaveNode">
            </v-tree-view -->
        </div>
        <div :class="$style.side">
            <v-tree-view nkey="content" :tree="contextVNode.children" />
        </div>
        <div :class="$style.main">
        </div>
    </div>
    <div :class="$style.foot">{{ contextVNode.content }}</div>
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
    computed: mapState({
        instances: (state) => state.rootInstance ? [state.rootInstance] : [],
        contextVNode: 'contextVNode',
        ctors: (state) => Object.keys(state.ctors).map((key) => state.ctors[key]),
    }),
    methods: {
        enterNode(node) {
            window.bridge.send('enter-instance', node.id);
        },
        leaveNode(node) {
            window.bridge.send('leave-instance', node.id);
        }
    }
});
</script>

<style module>
$foot-height: 30px;

.root {
    height: 100%;

    .body {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: $foot-height;
        display: flex;
    }

    .foot {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: $foot-height;
        background: #eee;
    }

    .sside {
        width: 20%;
        border-right: 1px solid #ddd;
    }

    .side {
        width: 30%;
        border-right: 1px solid #ddd;
    }

    .main {
        flex: auto;
    }
}
</style>
