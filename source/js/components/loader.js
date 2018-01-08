import Vue from 'vue/dist/vue.js';

const template = '<div class="loader" v-show="isLoading"></div>';

const loader = Vue.component('component-loader', {
	props: ['isLoading'],

	template,
});

export default loader;
