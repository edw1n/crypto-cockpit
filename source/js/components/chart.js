import Vue from 'vue/dist/vue.js';

const template = `<div class="chart">
					<div id="chart-container"></div>
				</div>`;

const chart = Vue.component('component-chart', {
	props: ['chart'],

	template,

	methods: {
	},
});

export default chart;
