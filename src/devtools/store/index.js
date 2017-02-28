import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        message: '',
        tab: 'components',
        instances: undefined,
    },
    mutations: {
        FLUSH(state, payload) {
            state.instances = payload.instances; // Object.freeze(payload.instances);
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
