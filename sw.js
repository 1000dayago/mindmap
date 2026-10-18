/* 설치 가능 조건용 최소 서비스워커. 캐시는 하지 않아 index.html을 새로 올리면 바로 반영된다. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
