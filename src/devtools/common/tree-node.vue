<template>
<div :class="$style.root">
    <div :class="$style.item" :selected="this.$treeRoot.selected === node"
        @click="select" @mouseenter="enterNode" @mouseleave="leaveNode">
        <div :class="$style.back"></div>
        <i :class="$style.icon"></i>
        <div :class="$style.text">{{ node[$treeRoot.nkey] }}</div>
    </div>
    <slot />
</div>
</template>

<script>
export default {
    name: 'v-tree-node',
    props: ['node'],
    beforeCreate() {
        this.$treeRoot = this.$parent.$treeRoot;
    },
    methods: {
        select() {
            this.$treeRoot.select(this.node);
            this.$emit('select', {
                selected: this.node,
            });
        },
        enterNode(e) {
            this.$treeRoot.$emit('enter-node', this.node, e);
        },
        leaveNode(e) {
            this.$treeRoot.$emit('leave-node', this.node, e);
        }
    }
};
</script>

<style module>
$height: 24px;

.root {
    margin-left: 20px;

    .item {
        position: relative;
        line-height: $height;
        /*border: 1px solid #eee;*/

        .back {
            position: absolute;
            left: -10000px;
            right: -10000px;
            height: 100%;
        }

        .icon {

        }

        .text {
            position: relative;
        }
    }

    .item:hover {
        .back {
            background: aliceblue;
        }
    }

    .item[selected] {
        .back {
            background: #09f;
        }
    }
}
</style>
