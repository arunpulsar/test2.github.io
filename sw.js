self.addEventListener('install', e => {
    e.waitUntil(
      caches.open('web-app-offline').then(function(cache) {
        return cache.addAll([
            '/aruntest.github.io/',
            '/aruntest.github.io/index.html',
            '/aruntest.github.io/index.js',
            '/aruntest.github.io/sw.js',
            '/aruntest.github.io/css/element.css',
            '/aruntest.github.io/css/font-awesome.min.css',
			      '/aruntest.github.io/css/jquery-impromptu.css',
            '/aruntest.github.io/css/jura.css',
            '/aruntest.github.io/css/normalize.min.css',
            '/aruntest.github.io/css/skel-noscript.css',
            '/aruntest.github.io/css/slider.css',
            '/aruntest.github.io/css/style.css',
            '/aruntest.github.io/css/style-desktop.css',
            '/aruntest.github.io/css/style-lr.css',
            '/aruntest.github.io/fonts/fontawesome-webfont.eot',
            '/aruntest.github.io/fonts/fontawesome-webfont.svg',
            '/aruntest.github.io/fonts/fontawesome-webfont.ttf',
            '/aruntest.github.io/fonts/fontawesome-webfont.woff',
            '/aruntest.github.io/fonts/fontawesome-webfont.woff2',
            '/aruntest.github.io/fonts/segoeui.ttf',
            '/aruntest.github.io/fonts/segoeui.woff',
            '/aruntest.github.io/fonts/segoeui.woff2',
            '/aruntest.github.io/fonts/segoeuibold.ttf',
            '/aruntest.github.io/fonts/segoeuibold.woff',
            '/aruntest.github.io/fonts/segoeuibold.woff2',
            '/aruntest.github.io/fonts/segoeuisemibold.ttf',
            '/aruntest.github.io/fonts/segoeuisemibold.woff',
            '/aruntest.github.io/fonts/segoeuisemibold.woff2',
            '/aruntest.github.io/js/bootstrap.min.js',
            '/aruntest.github.io/js/chart.js',
            '/aruntest.github.io/js/chartjs-plugin-zoom.min.js',
            '/aruntest.github.io/js/ekko-lightbox.js',
            '/aruntest.github.io/js/hammer.min.js',
            '/aruntest.github.io/js/jquery-2.1.1.min.js',
			      '/aruntest.github.io/js/jquery-impromptu.js',
            '/aruntest.github.io/js/lang.js',
            '/aruntest.github.io/js/script-lr2.js',
            '/aruntest.github.io/js/slider.js',
            '/aruntest.github.io/img/pulsaricon-rgb64_2.png',
            '/aruntest.github.io/img/pulsarlogo.svg',
            '/aruntest.github.io/img/tank1.png'
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
