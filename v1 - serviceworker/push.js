'use strict';
const btnTexts = [
  'Abonnieren',
  'Abo beenden'
];
const btn = document.querySelector('button');
let worker = null;
let isSubscribed = false;
if ('PushManager' in window) {
  navigator.serviceWorker.register('worker.js')
  .then(reg => {
    worker = reg;
    btn.disabled = false;
    worker.pushManager.getSubscription()
    .then(subscription => {
      if (subscription === null) {
        btn.textContent = btnTexts[0];
      } else {
        isSubscribed = true;
        btn.textContent = btnTexts[1];
      }
    });
  })
  .catch(err => console.error(err));
}
