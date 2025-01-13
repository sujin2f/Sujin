const version = new URL(location).searchParams.get('version')
if (!version) {
    console.error('Version is not set. Service worker is not registered!')
}

const manifest = `/${version}/manifest.json`
const precache = `sujin-cache-${version}`

self.addEventListener('install', (event) => {
    event.waitUntil(
        fetch(manifest)
            .then((response) => response.json())
            .then((jsonData) => {
                const urls = Object.values(jsonData)
                    .filter(
                        (file) => file.endsWith('.css') || file.endsWith('.js'),
                    )
                    .map((file) => `/${version}/${file}`)

                caches
                    .open(precache)
                    .then((cache) => cache.addAll([...urls, '/']))
                    .then(() => self.skipWaiting())
                    .catch((e) => console.error(e.message))
            })
            .catch((e) => {
                console.error(
                    `service-worker cannot fetch manifest.json: ${manifest} | ${e.message}`,
                )
                return []
            }),
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter(
                    (cacheName) =>
                        ![precache, `${precache}-runtime`].includes(cacheName),
                )
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete)
                    }),
                )
            })
            .then(() => self.clients.claim()),
    )
})

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            (async () => {
                const cachedResponse = await caches.match(event.request)
                if (cachedResponse) {
                    return cachedResponse
                }
                const request = event.request.clone()
                if (
                    request.method !== 'GET' ||
                    request.url.indexOf('http') !== 0
                ) {
                    return await fetch(request)
                }
                return await caches
                    .open(`${precache}-runtime`)
                    .then(async (cache) => {
                        return await fetch(request).then(async (response) => {
                            if (!response || response.status !== 200) {
                                return response
                            }
                            return await cache
                                .put(event.request, response.clone())
                                .then(() => response)
                        })
                    })
            })(),
        )
    }
})
