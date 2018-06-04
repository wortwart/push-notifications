'use strict';
const btnTexts = [
  'Abonnieren',
  'Abo beenden'
];
const btn = document.querySelector('button');
const pubkey = document.querySelector('input');
const output = document.querySelector('output');
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

btn.addEventListener('click', ev => {
  if (isSubscribed) {
    worker.pushManager.getSubscription()
    .then(subscr => {
      if (subscr)
        subscr.unsubscribe();
    })
    .catch(err => console.log(err))
    .then(() => {
      output.textContent = '';
      button.textContent = btnTexts[0];
      isSubscribed = false;
    });
  } else {
    worker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8(pubkey.value)
    })
    .then(subscr => {
      output.textContent = JSON.stringify(subscr);
      btn.textContent = btnTexts[1];
      isSubscribed = true;
    })
  }
});

function urlB64ToUint8(b64String) {
  const padding = '='.repeat((4 - b64String.length % 4) % 4);
  const b64 = (b64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  return new Uint8Array(atob(b64)
    .split('')
    .map(el => el.charCodeAt(0)));
}