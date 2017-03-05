import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        message: '',
        tab: 'components',
        rootInstance: null,
        contextVNode: {},
        inspectedInstance: null,
    },
    mutations: {
        FLUSH(state, payload) {
            state.rootInstance = Object.freeze(payload.rootInstance);
            state.inspectedInstance = Object.freeze(payload.inspectedInstance);
        },
        SELECT_CONTEXT(state, vnode) {
            state.contextVNode = vnode;
        },
        SHOW_MESSAGE(state, message) {
            state.message = message;
        },
        SWITCH_TAB(state, tab) {
            state.tab = tab;
        },
    },
});

export default store;
