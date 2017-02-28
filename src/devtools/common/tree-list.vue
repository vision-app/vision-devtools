<template>
<div :class="$style.root">
    <v-tree-node v-for="node in list" :node="node">
        <v-tree-list v-if="node && node.children && node.children.length" :list="node.children" />
    </v-tree-node>
</div>
</template>

<script>
import TreeNode from './tree-node.vue';
import { mapComponents } from 'src/util';

export default {
    name: 'v-tree-list',
    components: mapComponents([TreeNode]),
    props: ['list'],
    beforeCreate() {
        this.$treeRoot = this.$parent.$treeRoot;
    },
};
</script>

<style module>
.root {

}
</style>
