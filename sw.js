self.addEventListener('install', e => {
    e.waitUntil(
      caches.open('web-app-offline').then(function(cache) {
        return cache.addAll([
          '/test2.github.io/',
          '/test2.github.io/manifest.json',
          '/test2.github.io/index.html',
          '/test2.github.io/index.js',
          '/test2.github.io/sw.js',
          '/test2.github.io/css/element.css',
          '/test2.github.io/css/font-awesome.min.css',
          '/test2.github.io/css/jquery-impromptu.css',
          '/test2.github.io/css/jura.css',
          '/test2.github.io/css/normalize.min.css',
          '/test2.github.io/css/skel-noscript.css',
          '/test2.github.io/css/slider.css',
          '/test2.github.io/css/style.css',
          '/test2.github.io/css/style-desktop.css',
          '/test2.github.io/css/style-lr.css',
          '/test2.github.io/fonts/fontawesome-webfont.eot',
          '/test2.github.io/fonts/fontawesome-webfont.svg',
          '/test2.github.io/fonts/fontawesome-webfont.ttf',
          '/test2.github.io/fonts/fontawesome-webfont.woff',
          '/test2.github.io/fonts/fontawesome-webfont.woff2',
          '/test2.github.io/fonts/segoeui.ttf',
          '/test2.github.io/fonts/segoeui.woff',
          '/test2.github.io/fonts/segoeui.woff2',
          '/test2.github.io/fonts/segoeuibold.ttf',
          '/test2.github.io/fonts/segoeuibold.woff',
          '/test2.github.io/fonts/segoeuibold.woff2',
          '/test2.github.io/fonts/segoeuisemibold.ttf',
          '/test2.github.io/fonts/segoeuisemibold.woff',
          '/test2.github.io/fonts/segoeuisemibold.woff2',
          '/test2.github.io/js/bootstrap.min.js',
          '/test2.github.io/js/chart.js',
          '/test2.github.io/js/ekko-lightbox.js',
          '/test2.github.io/js/jquery-2.1.1.min.js',
          '/test2.github.io/js/jquery-impromptu.js',
          '/test2.github.io/js/lang.js',
          '/test2.github.io/js/script-lr2.js',
          '/test2.github.io/js/slider.js',
          '/test2.github.io/img/pulsaricon-rgb64_2.png',
          '/test2.github.io/img/pulsaricon-rgb512x512t2.png',
          '/test2.github.io/img/pulsarlogo.svg',
          '/test2.github.io/img/tank1.png'
        ]);
      })
    );
   });
   
   self.addEventListener('fetch', e => {
     console.log(e.request.url);
     e.respondWith(
       caches.match(e.request).then(response => response || fetch(e.request))
     );
   });

//This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

//Install stage sets up the offline page in the cache and opens a new cache
// self.addEventListener('install', function(event) {
//   event.waitUntil(preLoad());
// });

// var preLoad = async function(){
//   console.log('[Web-app] Install Event processing');
//   const cache = await caches.open('web-app-offline');
//   console.log('[Web-app] Cached index and offline page during Install');
//   return await cache.addAll([
//     '/test2.github.io/',
//     '/test2.github.io/manifest.json',
//     '/test2.github.io/index.html',
//     '/test2.github.io/index.js',
//     '/test2.github.io/sw.js',
//     '/test2.github.io/css/element.css',
//     '/test2.github.io/css/font-awesome.min.css',
//     '/test2.github.io/css/jquery-impromptu.css',
//     '/test2.github.io/css/jura.css',
//     '/test2.github.io/css/normalize.min.css',
//     '/test2.github.io/css/skel-noscript.css',
//     '/test2.github.io/css/slider.css',
//     '/test2.github.io/css/style.css',
//     '/test2.github.io/css/style-desktop.css',
//     '/test2.github.io/css/style-lr.css',
//     '/test2.github.io/fonts/fontawesome-webfont.eot',
//     '/test2.github.io/fonts/fontawesome-webfont.svg',
//     '/test2.github.io/fonts/fontawesome-webfont.ttf',
//     '/test2.github.io/fonts/fontawesome-webfont.woff',
//     '/test2.github.io/fonts/fontawesome-webfont.woff2',
//     '/test2.github.io/fonts/segoeui.ttf',
//     '/test2.github.io/fonts/segoeui.woff',
//     '/test2.github.io/fonts/segoeui.woff2',
//     '/test2.github.io/fonts/segoeuibold.ttf',
//     '/test2.github.io/fonts/segoeuibold.woff',
//     '/test2.github.io/fonts/segoeuibold.woff2',
//     '/test2.github.io/fonts/segoeuisemibold.ttf',
//     '/test2.github.io/fonts/segoeuisemibold.woff',
//     '/test2.github.io/fonts/segoeuisemibold.woff2',
//     '/test2.github.io/js/bootstrap.min.js',
//     '/test2.github.io/js/chart.js',
//     '/test2.github.io/js/ekko-lightbox.js',
//     '/test2.github.io/js/jquery-2.1.1.min.js',
//     '/test2.github.io/js/jquery-impromptu.js',
//     '/test2.github.io/js/lang.js',
//     '/test2.github.io/js/script-lr2.js',
//     '/test2.github.io/js/slider.js',
//     '/test2.github.io/img/pulsaricon-rgb64_2.png',
//     '/test2.github.io/img/pulsarlogo.svg',
//     '/test2.github.io/img/tank1.png'
//   ]);
// };

// self.addEventListener('fetch', function(event) {
//   console.log('[Web-app] The service worker is serving the asset.');
//   event.respondWith(checkResponse(event.request).catch(function() {
//     return returnFromCache(event.request);
//   }));
//   event.waitUntil(addToCache(event.request));
// });

// var checkResponse = function(request){
//   return new Promise(function(fulfill, reject) {
//     fetch(request).then(function(response){
//       if(response.status !== 404) {
//         fulfill(response);
//       } else {
//         reject();
//       }
//     }, reject);
//   });
// };

// var addToCache = async function(request){
//   const cache = await caches.open('web-app-offline');
//   const response = await fetch(request);
//   console.log('[Web-app] add page to offline' + response.url);
//   return await cache.put(request, response);
// };

// var returnFromCache = async function(request){
//   const cache = await caches.open('web-app-offline');
//   const matching = await cache.match(request);
//   if (!matching || matching.status == 404) {
//     return cache.match('offline.html');
//   } else {
//     return matching;
//   }
// };

