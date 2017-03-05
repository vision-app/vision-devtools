<template>
<div :class="$style.root">
    <v-tree-list v-if="tree" :list="tree" />
    <slot />
</div>
</template>

<script>
import TreeList from './tree-list.vue';
import { mapComponents } from 'src/util';

/**
 * @param {Array|null} tree
 */
export default {
    name: 'v-tree-view',
    components: mapComponents([TreeList]),
    props: {
        tree: Array,
        nkey: {
            type: String,
            default: 'text',
        },
    },
    data() {
        return {
            selected: undefined,
        };
    },
    beforeCreate() {
        this.$treeRoot = this;
    },
    methods: {
        select(node) {
            this.selected = node;
            this.$emit('select', {
                selected: node,
            });
        }
    }
}
</script>

<style module>
.root {
    overflow-x: hidden;
    overflow-y: visible;
    user-select: none;
    padding: 5px 0;
    border: 1px solid #eee;
    border-radius: 2px;
}
</style>
