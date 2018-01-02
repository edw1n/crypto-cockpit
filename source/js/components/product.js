import Vue from 'vue/dist/vue.js';

const template = `<div class="product tick">
					{{ product.isin }} &dash; {{ product.name }}
					<button v-on:click="add" v-bind:class="{ 'is-faded': product.inWatchlist }" class="button button--unstyled" title="Add to watchlist">🕵️</button>
				</div>`;

const product = Vue.component('component-product', {
	props: ['product'],

	template,

	methods: {
		add() {
			this.$emit('add');
		},
	},
});

export default product;
