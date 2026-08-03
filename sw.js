// Service worker — จงชงดี PWA
// กลยุทธ์: network-first (ออนไลน์ = ได้ล่าสุดเสมอ, ออฟไลน์ = ใช้แคชได้)
// >>> เวลาแก้แอปแล้ว deploy: เปลี่ยนเลข VERSION ด้านล่างให้ต่างจากเดิม 1 ครั้ง <<<
const VERSION = "1.0.0";
const CACHE = "jcd-" + VERSION;
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();            // ให้ SW ใหม่พร้อมทำงานทันที
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())   // เข้าคุมทุกแท็บที่เปิดอยู่
  );
});

// network-first สำหรับไฟล์ในโดเมนเดียวกัน
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit => hit || caches.match("./index.html"))
      )
  );
});
