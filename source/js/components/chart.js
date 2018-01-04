import Vue from 'vue/dist/vue.js';

const template = `<div class="chart tick">hier komt een chart
				</div>`;

const chart = Vue.component('component-chart', {
	props: ['chart'],

	template,

	watch: {
	},

	methods: {
	},
});

export default chart;
