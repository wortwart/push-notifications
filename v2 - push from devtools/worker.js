'use strict';
self.addEventListener('push', ev => {
  const title = 'Nachricht für dich!';
  let text = 'Text ...';
  if (ev.data !== null)
    text = ev.data.text();
  ev.waitUntil(self.registration.showNotification(title, {body: text}));
});