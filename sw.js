/* 항상 최신을 먼저 받고, 인터넷이 안 될 때만 마지막으로 받아 둔 파일을 쓴다. (index.html 을 올리면 바로 반영됨) */
const CACHE = 'mm-shell-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for(const k of await caches.keys()) if(k!==CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if(r.method!=='GET' || u.origin!==location.origin) return;
  if(u.searchParams.has('c')) return;                       // 버전 확인용 요청은 캐시하지 않는다
  const key = u.origin+u.pathname;                          // ?u= 같은 주소 꼬리표는 같은 파일로 본다
  e.respondWith(fetch(r).then(res => {
    if(res && res.ok){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(key, cp)).catch(() => {}); }
    return res;
  }).catch(async () => {
    const c = await caches.open(CACHE);
    return (await c.match(key)) || (r.mode==='navigate' ? await c.match(u.origin+u.pathname.replace(/[^/]*$/, '')) || await c.match(u.origin+u.pathname.replace(/[^/]*$/, '')+'index.html') : null) || Response.error();
  }));
});
