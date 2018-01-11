// import Vue from 'vue/dist/vue.js';
import { mapState } from 'vuex';

export default {
	template: '<div class="loader" v-show="isLoading"></div>',

	computed: mapState(['isLoading']),
};
