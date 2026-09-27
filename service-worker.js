const PREFIX='code-seal-v43-scope-'+encodeURIComponent(self.registration.scope)+'-',CACHE=PREFIX+"1184012a-0cc9-4ddc-bf31-66064c66a81c-offline-v2",ASSETS=["./app.csl","./app-runtime.wasm","./seal-bridge.js","./assets/image-hash-hero.png","./assets/ImageHashGenerator.png","./assets/ImageHashGenerator.ico","./assets/ImageHashGenerator-512.png","./assets/ImageHashGenerator-192.png","./ImageHashGenerator.ico","./manifest.json","./seal-manifest.json","./index.html"];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{for(const asset of ASSETS){
  const url=new URL(asset,self.registration.scope).href;
  const response=await fetch(new Request(url,{cache:'reload'}));
  if(!response.ok)throw Error('Offline installation failed: '+url+' (HTTP '+response.status+')');
  await cache.put(url,response);
 }}catch(error){await caches.delete(CACHE);console.error(error);throw error}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),scope=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // Home-screen launches can use the scope root, index.html, or a query string.
  const entry=request.mode==='navigate'&&(url.pathname===scope.pathname||url.pathname===scope.pathname+'index.html');
  const cached=entry?await cache.match(new URL('index.html',scope).href):await cache.match(request);
  return cached||fetch(request);
 })());
});