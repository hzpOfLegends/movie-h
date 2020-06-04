import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    ticket: 0
  },
  mutations: {
    setTicket(state) {
      ++state.ticket;
    },
    increment(state) {
      state.count++;
    },
  },
});
