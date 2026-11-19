// Günlük İspanyolca Konuşma — internetsiz çalışma
// Kabuk (sayfa, veri, simgeler, yazı tipi) her sürümde yenilenir; ses paketleri ayrı ve kalıcı önbellekte durur,
// adlarında içerik özeti olduğu için yalnızca değişen paketler yeniden iner. Sesleri sayfa tek tek indirir.
const KABUK = 'ispanyolca-kabuk-0918d934ce';
const SES = 'ispanyolca-ses';
const KABUK_DOSYALAR = ["./", "ikon-180.png", "ikon-192.png", "ikon-512.png", "ikon-maskable-512.png", "manifest.webmanifest", "veri.js", "yazitipi/7a3188b65975.woff2", "yazitipi/9fecae86b15d.woff2", "yazitipi/c0dd90c78986.woff2", "yazitipi/yazitipi.css"];
const SES_DOSYALAR = new Set(["ses/acil-e.5223ee4e.js", "ses/acil.9da03a7b.js", "ses/alisveris-e.a797785e.js", "ses/alisveris.d0b27cce.js", "ses/banka-e.7c4e524d.js", "ses/banka.8aa7be70.js", "ses/berber-e.185ecca6.js", "ses/berber.c4f2b998.js", "ses/bulusma-e.c45d93a2.js", "ses/bulusma.c8e4dfcf.js", "ses/duygular-e.1d5c483d.js", "ses/duygular.36545538.js", "ses/ev-e.c87ee3f5.js", "ses/ev.450c77c2.js", "ses/is-e.abf70206.js", "ses/is.f141a569.js", "ses/kafe-e.b5631171.js", "ses/kafe.f4ac1b32.js", "ses/kendim-e.351cee6a.js", "ses/kendim.ff0eb134.js", "ses/komsu-e.b80be419.js", "ses/komsu.f12120c0.js", "ses/kutuphane-e.3addb506.js", "ses/kutuphane.abbaa0b1.js", "ses/lokanta-e.1c011de6.js", "ses/lokanta.fc71067d.js", "ses/manav-e.a8470ff7.js", "ses/manav.7613fbf4.js", "ses/market-e.c909afd1.js", "ses/market.36863bb3.js", "ses/nezaket-e.cade2ec7.js", "ses/nezaket.ce1179e7.js", "ses/okul-e.70d088dd.js", "ses/okul.99f0e756.js", "ses/otel-e.bbdeae14.js", "ses/otel.3f10f3c8.js", "ses/saglik-e.2638b33d.js", "ses/saglik.2181c6b0.js", "ses/sayilar-e.d0bd6600.js", "ses/sayilar.b529d0dd.js", "ses/sesler-e.c638cf27.js", "ses/sesler.62b37fe2.js", "ses/sohbet-e.95264cfc.js", "ses/sohbet.dd2b2c8d.js", "ses/stratejiler-e.283c7dfc.js", "ses/stratejiler.8199b07b.js", "ses/tanisma-e.494b432c.js", "ses/tanisma.5affd455.js", "ses/telefon-e.b19fcf82.js", "ses/telefon.03847af2.js", "ses/ulasim-e.6aacdfac.js", "ses/ulasim.4aee1184.js", "ses/yol-e.506caf32.js", "ses/yol.3982fbd2.js", "ses/zaman-e.4901a606.js", "ses/zaman.bc03812b.js"]);
self.addEventListener('install', e => {
  // tarayıcının kendi önbelleğindeki eski kopyalar değil, sunucudaki yeni dosyalar alınsın
  e.waitUntil(caches.open(KABUK).then(c => c.addAll(KABUK_DOSYALAR.map(d => new Request(d, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('ispanyolca-') && k !== KABUK && k !== SES) await caches.delete(k);  // yalnızca bu programın eski önbellekleri
    const c = await caches.open(SES);   // artık kullanılmayan eski ses paketlerini temizle
    for (const r of await c.keys()) { const p = new URL(r.url).pathname.split('/').slice(-2).join('/'); if (!SES_DOSYALAR.has(p)) await c.delete(r); }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.includes('/ses/')) {
    e.respondWith(caches.open(SES).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r ||
      fetch(e.request).then(y => { if (y.ok) c.put(e.request, y.clone()); return y; }))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r ||
    (e.request.mode === 'navigate' ? caches.match('./') : null)).then(r => r || fetch(e.request)));
});
