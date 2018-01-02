import Vue from 'vue/dist/vue.js';
import './components/product';
import './components/watchlist';

// const products = [
// 	{
// 		isin: 'NL0012063580',
// 		name: 'Sprinter Long 11350,0 op DAX',
// 		inWatchlist: false,
// 	},
// 	{
// 		isin: 'NL0011301890',
// 		name: 'Sprinter BEST Short 67,8 op Brent Future',
// 		inWatchlist: false,
// 	},
// 	{
// 		isin: 'NL0012076699',
// 		name: 'Sprinter BEST Long 1234,8 op Goud',
// 		inWatchlist: false,
// 	},
// 	{
// 		isin: 'NL0012463038',
// 		name: 'Sprinter BEST Long 534,59 op AEX',
// 		inWatchlist: false,
// 	},
// 	{
// 		isin: 'NL0012467344',
// 		name: 'Sprinter Long 101000,0 op Berkshire Hathaway',
// 		inWatchlist: false,
// 	},
// 	{
// 		isin: 'NL0009105741',
// 		name: 'Sprinter BEST Short 13341,84 op DAX',
// 		inWatchlist: false,
// 	},
// ];

const app = new Vue({
	el: '.js-app',

	data() {
		return {
			products: [],
			form: {},
		};
	},

	mounted() {
		this.getData();

		this.dummyTick();
	},

	watch: {
		products: {
			handler() {
				this.setData();
			},
			deep: true,
		},
	},

	methods: {
		toggleInWatchlist(index) {
			const product = this.products[index];

			this.$set(product, 'inWatchlist', !product.inWatchlist);
		},

		remove(index) {
			this.watchlist.splice(index, 1);
		},

		getData() {
			const products = JSON.parse(localStorage.getItem('products'));

			if (products) {
				this.products = products;
			}
		},

		addProduct(e) {
			e.preventDefault();

			this.products.push(this.form);
		},

		setData() {
			localStorage.setItem('products', JSON.stringify(this.products));
		},

		dummyTick() {
			setInterval(() => this.onTick(), 3000);
		},

		onTick() {
			this.products.map((product) => {
				if (this.getRandomNumber(0, 1)) {
					this.$set(product, 'performance', this.getRandomNumber(0, 200));
				}

				return product;
			});
		},

		getRandomNumber(min, max) {
			return Math.floor(Math.random() * (max - min + 1));
		},
	},
});

window.app = app;
