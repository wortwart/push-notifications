'use strict';

self.addEventListener('push', ev => {
	// Create notification from push message
  console.log(ev.data.text(), Notification.permission)
  const title = 'Eine Nachricht für dich!';
  const options = {
    body: ev.data.text(),
    icon: 'ct.png'
  };
  ev.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', ev => {
	// After notification click
  ev.notification.close();
  ev.waitUntil(
    clients.openWindow('https://ct.de/')
  );
});