const C="zynelabs-v1";
self.addEventListener("install",function(e){self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==self.location.origin)return;
  if(u.pathname.indexOf("/api/")===0)return;
  e.respondWith(caches.match(e.request).then(function(hit){
    var net=fetch(e.request).then(function(r){
      if(r&&r.ok){var c=r.clone();caches.open(C).then(function(cc){cc.put(e.request,c);}).catch(function(){});}
      return r;
    }).catch(function(){return hit;});
    return hit||net;
  }));
});
