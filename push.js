self.addEventListener('push', function(evt) {
  evt.waitUntil(
    self.registration.showNotification(
      'test',
      {
        actions: [{action: 'mercari', title: "Mercari🍣"},{action: 'buy', title: "Buy"}],
        icon: '/image/ic_android_black_48dp.png',
        body: 'test',
        tag: 'tag'
      }
    )
  );
}, false);

self.addEventListener('notificationclick', function(evt) {
  evt.notification.close();

  if (evt.action == 'mercari') {
      clients.openWindow('https://mercari.com');
  } else if(evt.action == 'buy') {

  } else {
      evt.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(evt) {
          var p = location.pathname.split('/');
          p.pop();
          p = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port : '') + p.join('/') + '/';
          for(var i = 0 ; i < evt.length ; i++) {
            var c = evt[i];
            if(((c.url == p) || (c.url == p + 'index.html')) && ('focus' in c))
              return c.focus();
          }
          if(clients.openWindow)
            return clients.openWindow('./');
        }));
    }
}, false);
