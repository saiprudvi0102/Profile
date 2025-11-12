// Service Worker for PWA functionality

const CACHE_NAME = 'saiprudvi-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/profile.html',
    '/experience.html',
    '/projects.html',
    '/resume.html',
    '/skills.html',
    '/certifications.html',
    '/contact.html',
    '/styles.css',
    '/mobile-app-enhancements.css',
    '/netflix-mobile-styles.css',
    '/mobile-navigation-fix.css',
    '/script.js',
    '/mobile-app.js',
    '/assets/icon-192.png'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

