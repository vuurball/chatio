/**
 * storing the logged in user username here for demo purposes
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		username: '',
	},
	getters: {
		getLoggedUsername: state => state.username,
	},
	mutations: {
		setLoggedUsername: (state, username) => (state.username = username),
	},
	actions: {
		loginAs: ({ commit }, username) => {
			commit('setLoggedUsername', username);
		},
	},
	modules: {},
});
