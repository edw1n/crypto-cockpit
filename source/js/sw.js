const CACHE_NAME = '0.0.8';
const URLS_TO_CACHE = [
	'/',
	'/dist/css/main.css',
	'/dist/js/bundle.js',
];

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(CACHE_NAME)
		.then(cache => cache.addAll(URLS_TO_CACHE)));
});

// self.addEventListener('fetch', (e) => {
// 	e.respondWith(caches.match(e.request)
// 		.then(response => response || fetch(e.request)));
// });

// https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-then-network
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(caches.open('mysite-dynamic')
// 		.then(cache => fetch(event.request)
// 			.then((response) => {
// 				cache.put(event.request, response.clone());

// 				return response;
// 			})));
// });

// https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#on-network-response
self.addEventListener('fetch', (event) => {
	event.respondWith(caches.open(CACHE_NAME)
		.then(cache => cache.match(event.request)
			.then(response => response || fetch(event.request)
				.then((res) => {
					cache.put(event.request, res.clone());

					return res;
				}))));
});
