import Vue from 'vue/dist/vue.js';
import Vuex from 'vuex';

import coins from './modules/coins';
import watchlist from './modules/watchlist';

const { locale } = document.documentElement.dataset;

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,

	state: {
		locale,
		isLoading: false,
	},

	modules: {
		coins,
		watchlist,
	},

	mutations: {
		setLoading(state, isLoading = true) {
			state.isLoading = isLoading;
		},
	},
});
