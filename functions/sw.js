const CACHE_NAME = 'SITE_CONTENT_V1';
const urlsToCache = [
    //global
    '/assets/images/img_2.png',
    '/assets/main.css',
    '/scripts/search.js',
    '/error.html',

    //weather_icons
    'http://openweathermap.org/img/wn/01d@2x.png',
    'http://openweathermap.org/img/wn/01n@2x.png',
    'http://openweathermap.org/img/wn/02n@2x.png',
    'http://openweathermap.org/img/wn/02d@2x.png',
    'http://openweathermap.org/img/wn/03d@2x.png',
    'http://openweathermap.org/img/wn/03n@2x.png',
    'http://openweathermap.org/img/wn/04n@2x.png',
    'http://openweathermap.org/img/wn/04d@2x.png',
    'http://openweathermap.org/img/wn/09d@2x.png',
    'http://openweathermap.org/img/wn/09n@2x.png',
    'http://openweathermap.org/img/wn/10n@2x.png',
    'http://openweathermap.org/img/wn/10d@2x.png',
    'http://openweathermap.org/img/wn/11d@2x.png',
    'http://openweathermap.org/img/wn/11n@2x.png',
    'http://openweathermap.org/img/wn/13d@2x.png',
    'http://openweathermap.org/img/wn/13n@2x.png',
    'http://openweathermap.org/img/wn/50n@2x.png',
    'http://openweathermap.org/img/wn/50d@2x.png',
]

self.addEventListener('install', installer => {
    console.log('installing...');
    const done = async() => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(urlsToCache);
    }
    installer.waitUntil(done());
});

self.addEventListener('fetch', fetchEvent => {
const url = fetchEvent.request.url;
console.log(`fetching: ${url}`);
const getResponse = async (request) => {
    let response;
    if(fetchEvent.request.destination !== 'document'){
        console.log(fetchEvent.request.destination);
        response = await caches.match(request);
        if(response && response.status === 200){
            console.log('File in cache. Returning cached version.');
            return response;
        }
    }
    try{
        response = await fetch(request);
        if(response && response.status === 404){
            return caches.match('/error.html');
        }
    }
    catch(e){
        response = await caches.match(request);
        console.log(e);
    }
    const clone  = response.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(url, clone);
    return response;
};
fetchEvent.respondWith(getResponse(fetchEvent.request));
});

self.addEventListener('activate', activator => {
    console.log('Activating...');
    const currentCaches = [CACHE_NAME];
    const done = async () => {
        const names = await caches.keys();
        return Promise.all(names.map(name => {
            if(!currentCaches.includes(name)){
                return caches.delete(name);
            }
        }));
    };
    activator.waitUntil(done());
});