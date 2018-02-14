'use strict';

const buttonTexts = [
	'Push-Nachrichten abonnieren',
	'Push-Abonnement beenden'
];

let worker = null;
let isSubscribed = null;

// Register service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
	navigator.serviceWorker.register('worker.js')
	.then(reg => {
		worker = reg;
		button.disabled = false;
		// Do we have a subscription?
		worker.pushManager.getSubscription()
		.then(subscription => {
			if (subscription === null) {	// not subscribed
				isSubscribed = false;
				button.textContent = buttonTexts[0];
				localStorage.setItem('pushAuth', '');
			} else {	// already subscribed
				isSubscribed = true;
				button.textContent = buttonTexts[1];
				// use local storage to save and restore auth data
				pushAuth.textContent = localStorage.getItem('pushAuth');
			}
			pubkey.value = localStorage.getItem('pubKey');
		});
	})
	.catch(err => console.error('Fehler beim Registrieren des ServiceWorkers', err));
} else {
	alert('Push-Nachrichten funktionieren nicht!');
}

// After button click
button.addEventListener('click', ev => {
	ev.preventDefault();
	if (worker === null) return;
	if (isSubscribed) {
		// Unsubscribe
		worker.pushManager.getSubscription()
		.then(subscription => {
			if (subscription)
				return subscription.unsubscribe();
		})
		.catch(err => console.error('Fehler beim Abo-Kündigen', err))
		.then(() => {
			pushAuth.textContent = '';
			localStorage.setItem('pushAuth', '');
			button.textContent = buttonTexts[0];
			isSubscribed = false;
		});
	} else {
		// Subscribe
		if (!pubkey.value) {
			alert('Geben Sie einen Schlüssel für den Anwendungsserver an!');
			return;
		}
		localStorage.setItem('pubKey', pubkey.value);
		worker.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlB64ToUint8Array(pubkey.value)
		})
		.catch(err => console.error('Fehler beim Abonnieren', err))
		.then(subscription => {
			const json = JSON.stringify(subscription);
			pushAuth.textContent = json;
			localStorage.setItem('pushAuth', json);
			button.textContent = buttonTexts[1];
			isSubscribed = true;
		})
	}
});

function urlB64ToUint8Array(base64String) {
	// Convert URL safe Base64 to typed array with byte values
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i)
		outputArray[i] = rawData.charCodeAt(i);
	return outputArray;
}
