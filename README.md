
# How to create a PWA (Progressive Web App)

Provided below are the requirements on how to generate a PWA from a normal web-App:

1. Create an app manifest
2. Add it to your base HTML template
3. Create the service worker
4. Serve the service worker on the root of the scope you used in the manifest
5. Add a `<script>` block to your base HTML template to load the service worker
6. Deploy your Progressive web app
7. Test your PWA using Chrome's Lighthouse (web-app auditing tool that includes PWA-auditing features) to make sure the web-app is PWA ready.

## Create an app manifest

1.  Create a file named "**manifest.json**" under the root folder.
2.  Add the following details :
    * **name**: The full name of your web app.
    * **short_name**: Short name to be shown on the home screen.
    * **description**: A sentence or two explaining what your app does.
    * **icons**: A bunch of icon information — source URLs, sizes, and types. The user can add multiple icons so the user's device can choose which the one that fits best. Some devices require a bigger sized icon. Also, it would be advisable to keep the icon backkground as transparent to avoid making the icon stick out to the splash screen.
    * **start_url**: The index document to launch when starting the app.
    * **display**: How the app is displayed; can be fullscreen, standalone, minimal-ui, or browser.
    * **theme_color**: A primary color for the UI, used by operating system.
    * **background_color**: A color used as the app's default background, used during install and on the splash screen.
    * **orientation**: Restrictions on the display orientation (It is best to keep it as "any" to avoid any limitations)
       
       An example of the content is as follows:
        ```  
        {
        "background_color": "#FFFFFF",
        "description": "Pulsar Bluetooth Remote Access",
        "dir": "ltr",
        "display": "standalone",
        "name": "Pulsar Bluetooth Remote Access",
        "orientation": "any",
        "scope": "./",
        "short_name": "Pulsar-Webapp",
        "start_url": "index.html",
        "theme_color": "#E4ECED",
        "categories": [],
        "screenshots": [],
        "icons": [
            {
            "src": "./img/pulsaricon-rgb512x512t2.png",
            "type": "image/png",
            "sizes": "512x512"
            }
        ],
        "shortcuts": []
        }
        ```

## Adding app manifest to the base HTML template

The user can reference the manifest file as follows:
```
  <link rel="manifest" href="manifest.json"> 
```

## Creating a service worker
In order to create a service worker, the user should create a JS file (`sw.js`) and refer all the files that needs to be cached for offline mode. This service worker needs to be in the root folder. Else, it would not work. The example is as follows:

```
self.addEventListener('install', e => {
    e.waitUntil(
      caches.open('web-app-offline').then(function(cache) {
        return cache.addAll([
          '/test.github.io/',
          '/test.github.io/manifest.json',
          '/test.github.io/index.html',
          '/test.github.io/index.js',
          '/test.github.io/sw.js',
          '/test.github.io/css/element.css',
          '/test.github.io/css/font-awesome.min.css',
          '/test.github.io/css/jquery-impromptu.css',
          '/test.github.io/css/jura.css',
          '/test.github.io/css/normalize.min.css',
          '/test.github.io/css/skel-noscript.css',
          '/test.github.io/css/slider.css',
          '/test.github.io/css/style.css',
          '/test.github.io/css/style-desktop.css',
          '/test.github.io/css/style-lr.css',
          '/test.github.io/fonts/fontawesome-webfont.eot',
          '/test.github.io/fonts/fontawesome-webfont.svg',
          '/test.github.io/fonts/fontawesome-webfont.ttf',
          '/test.github.io/fonts/fontawesome-webfont.woff',
          '/test.github.io/fonts/fontawesome-webfont.woff2',
          '/test.github.io/fonts/segoeui.ttf',
          '/test.github.io/fonts/segoeui.woff',
          '/test.github.io/fonts/segoeui.woff2',
          '/test.github.io/fonts/segoeuibold.ttf',
          '/test.github.io/fonts/segoeuibold.woff',
          '/test.github.io/fonts/segoeuibold.woff2',
          '/test.github.io/fonts/segoeuisemibold.ttf',
          '/test.github.io/fonts/segoeuisemibold.woff',
          '/test.github.io/fonts/segoeuisemibold.woff2',
          '/test.github.io/js/bootstrap.min.js',
          '/test.github.io/js/chart.js',
          '/test.github.io/js/ekko-lightbox.js',
          '/test.github.io/js/jquery-2.1.1.min.js',
          '/test.github.io/js/jquery-impromptu.js',
          '/test.github.io/js/lang.js',
          '/test.github.io/js/script-lr2.js',
          '/test.github.io/js/slider.js',
          '/test.github.io/img/pulsaricon-rgb64_2.png',
          '/test.github.io/img/pulsaricon-rgb512x512t2.png',
          '/test.github.io/img/pulsarlogo.svg',
          '/test.github.io/img/tank1.png'
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
```

## Loading the service worker
This could be done in two ways. Either the script could be loaded from the base HTML file or referred from another loaded file. i.e.,

Method 1:
Add the following to the base HTML file at the end of your `<body>
`
```
<script>
 if (!navigator.serviceWorker.controller) {
     navigator.serviceWorker.register("/sw.js").then(function(reg) {
         console.log("Service worker has been registered for scope: " + reg.scope);
     });
 }
</script>
```

Method 2:
Create another file (`index.js`) and add the above script to it. Refer this file from the base HTMl file.
```
 <script src="index.js" defer></script>
```

## Deploying and testing your Progressive Web App
Host the updated web-app in order to audit its compatibility. In order to test the same using Chrome's Lighthouse audit tool, right click on the webpage and select "**Inspect**". 

![alt text](/mdfiles/Inspect.png "Inspect section")

Select "**Lighthouse**" from the top right hand corner of the toolbar.

![alt text](/mdfiles/Lighthouse1.png "Lighthouse section")

Click on "**Analyze page load**" and the user would see the following:

![alt text](/mdfiles/Lighthouse2.png "Auditing the web-app")

**NOTE**: If the user is stuck at "**Auditing xxxxxx..**", without any progress, close all your Chrome browsers, relaunch and try again.

Once analysed, the user should see the results. Screenshot provided below:

![alt text](/mdfiles/Lighthouse3.png "Auditing results")

Click on "**PWA**" to check if your web-app is PwA optimised. It should say "**INSTALLABLE**" and "**Registers a service worker that controls page and** `start_url`" should be green. These are the bare minimum to make the web-app PWA ready. This could be further optimised by activating/enabling the additional "**PWA OPTIMIZED**" options.

![alt text](/mdfiles/Lighthouse4.png "PWA results")

## How to install PWA into your device:

**Windows** (Microsoft Edge/Chrome): Click on the Install button on the right side of the URL bar. Alternatively, you can install the PWA from the "three dot" menu.

**Android** (Microsoft Edge/Chrome): Navigate to the site in Chrome. Press the "three dot" icon in the upper right to open the menu. Select "Add to Home screen." Press the "Add" button in the popup. The PWA is now installed and available on your home screen.

**iOS** (Safari/Microsoft Edge/Chrome): First, navigate to the site from your browser. Press the "Share" button and select "Add to Home Screen" from the popup. Lastly, tap "Add" in the top right corner to finish installing the PWA. It will now be on your home screen.

**NOTE**: iOS app *Bluefy* does not support PWA, as of now. Hence, any web-app designed for BLE devices would not work in iOS when PWA is made available using Safari/Microsoft Edge/Chrome.