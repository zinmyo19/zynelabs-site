const C="zynelabs-v3";
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil((async function(){
  var ks=await caches.keys();
  var upgraded=ks.some(function(k){return k!==C;});
  await Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));
  await self.clients.claim();
  /* upgrading from an older cached version: reload open pages once so the app never stays on the old page */
  if(upgraded){var cs=await self.clients.matchAll({type:"window"});cs.forEach(function(c){try{c.navigate(c.url);}catch(_){}});}
})());});
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==self.location.origin)return;
  var isPage=e.request.mode==="navigate"||u.pathname==="/"||u.pathname.endsWith(".html");
  if(isPage){
    /* network first so updates show immediately; cached copy only when offline */
    e.respondWith(fetch(e.request).then(function(r){
      if(r&&r.ok){var c=r.clone();caches.open(C).then(function(cc){cc.put(e.request,c);}).catch(function(){});}
      return r;
    }).catch(function(){return caches.match(e.request).then(function(h){return h||caches.match("/");});}));
    return;
  }
  /* static files: cache first, refresh in background */
  e.respondWith(caches.match(e.request).then(function(hit){
    var net=fetch(e.request).then(function(r){
      if(r&&r.ok){var c=r.clone();caches.open(C).then(function(cc){cc.put(e.request,c);}).catch(function(){});}
      return r;
    }).catch(function(){return hit;});
    return hit||net;
  }));
});
