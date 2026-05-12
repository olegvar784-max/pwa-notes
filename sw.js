const CACHE_NAME = 'pwa-notes-v1';

const APP_FILES = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.webmanifest',
    './icon.svg'
];

// Установка: кешируем все файлы приложения
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
    );
    self.skipWaiting();
});

// Активация: удаляем старые кеши
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
            .then(() => {
                self.clients.claim();
            })
    );
});

// Перехват запросов: отдаём из кеша, если нет сети
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
    );
});