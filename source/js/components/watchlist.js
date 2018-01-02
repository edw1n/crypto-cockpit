import Vue from 'vue/dist/vue.js';

const POSITIVE_CLASS = 'tick--positive';
const NEGATIVE_CLASS = 'tick--negative';
const template = `<div class="product tick">{{ product.isin }} -
					{{ product.name }} - {{ product.performance }}
					<button v-on:click="remove" class="button button--unstyled" title="Remove from watchlist">❌</button>
				</div>`;

const watchlist = Vue.component('component-watchlist', {
	props: ['product'],

	template,

	watch: {
		'product.performance': {
			handler(newValue, oldValue) {
				this.animateTick(this.$el, newValue > oldValue);
			},
		},
	},

	methods: {
		remove() {
			this.$emit('remove');
		},

		animateTick(el, positive) {
			return new Promise((resolve, reject) => {
				window.requestAnimationFrame(() => {
					function onTransitionEnd() {
						el.removeEventListener('transitionend', onTransitionEnd);

						el.classList.remove(POSITIVE_CLASS, NEGATIVE_CLASS);

						resolve(el);
					}

					el.addEventListener('transitionend', onTransitionEnd, false);

					el.classList.add(positive ? POSITIVE_CLASS : NEGATIVE_CLASS); // eslint-disable-line max-len
				});
			});
		},
	},
});

export default watchlist;
