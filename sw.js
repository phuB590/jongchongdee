// Service worker — จงชงดี PWA
// network-first สำหรับไฟล์แอป (ออนไลน์=ล่าสุดเสมอ), cache-first สำหรับ Firebase SDK
// >>> เวลาแก้แอปแล้ว deploy: เปลี่ยนเลข VERSION ให้ต่างจากเดิม 1 ครั้ง <<<
const VERSION = "2.0.0";
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
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // ไฟล์แอปในโดเมนเดียวกัน → network-first (offline ใช้แคช)
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(()=>{}); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match("./index.html")))
    );
    return;
  }

  // Firebase SDK จาก gstatic → cache-first (ให้เปิดออฟไลน์ได้)
  if (url.hostname === "www.gstatic.com" && url.pathname.includes("firebasejs")) {
    e.respondWith(
      caches.match(req).then(hit => hit ||
        fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(()=>{}); return res; })
      )
    );
    return;
  }

  // อื่นๆ (เช่น firestore.googleapis.com สำหรับ sync) → ปล่อยให้ต่อเน็ตตรงๆ ไม่แคช
});
