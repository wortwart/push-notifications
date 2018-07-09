'use strict';

self.addEventListener('push', ev => {
  const title = 'Eine Nachricht für dich!';
  const options = {
    body: ev.data.text(),
    icon: 'ct.png',
    image: 'bild.jpg'
  };
  ev.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', ev => {
  ev.notification.close();
  ev.waitUntil(clients.openWindow('https://ct.de/'));
});