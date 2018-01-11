import Vue from 'vue/dist/vue.js';

const template = `<div>
					<h1>{{ coin.long }} <small>{{ coin.short }}</small></h1>
					<div class="group">
						<div class="group__item">
							Market cap
							<h2 class="group__label">{{ coin.mktcap }}</h2>
						</div>
						<div class="group__item">
							Price
							<h2 class="group__label">{{ coin.price }}</h2>
						</div>
						<div class="group__item">
							Supply
							<h2 class="group__label">{{ coin.supply }}</h2>
						</div>
						<div class="group__item">
							Volume
							<h2 class="group__label">{{ coin.volume }}</h2>
						</div>
					</div>
				</div>`;

const detail = Vue.component('component-detail', {
	props: ['coin'],

	template,
});

export default detail;
