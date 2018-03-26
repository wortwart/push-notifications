'use strict';

const btnTexts = [
	'Push-Nachrichten abonnieren',
	'Push-Abonnement beenden',
	'Push-Abonnement: Fehler'
];
const btn = document.querySelector('button');
const pubkey = document.querySelector('output');
let worker = null;
let isSubscribed = null;

// Register service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
	navigator.serviceWorker.register('worker.js')
	.then(reg => {
		worker = reg;
		btn.disabled = false;
		// Do we have a subscription?
		worker.pushManager.getSubscription()
		.then(subscription => {
			if (subscription === null) {	// not subscribed
				isSubscribed = false;
				btn.textContent = btnTexts[0];
			} else {	// already subscribed
				isSubscribed = true;
				btn.textContent = btnTexts[1];
			}
		});
	})
	.catch(err => console.error('Fehler beim Registrieren des ServiceWorkers', err));
} else {
	alert('Push-Nachrichten funktionieren nicht!');
}

// After button click
btn.addEventListener('click', ev => {
	ev.preventDefault();
	if (worker === null) return;
	if (isSubscribed) {
		// Unsubscribe
		worker.pushManager.getSubscription()
		.then(subscription => {
			if (!subscription) return;
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = ev => {
				if (xhr.readyState === 4 && xhr.status === 200)
					console.log(xhr.responseText + ' Datensatz gelöscht');
			}
			xhr.open('POST', 'subscribe.php');
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send('endpoint=' + encodeURIComponent(subscription.endpoint));
			return subscription.unsubscribe();
		})
		.catch(err => console.error('Fehler beim Abo-Kündigen', err))
		.then(() => {
			btn.textContent = btnTexts[0];
			isSubscribed = false;
		});
	} else {
		// Subscribe
		worker.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlB64ToUint8Array(pubkey)
		})
		.catch(err => console.error('Fehler beim Abonnieren', err))
		.then(subscription => {
			const json = JSON.stringify(subscription);
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = ev => {
				if (xhr.readyState === 4 && xhr.status === 200) {
					if (parseInt(xhr.responseText)) {
						console.log('Push-Abo #' + xhr.responseText + ' angelegt');
						btn.textContent = btnTexts[1];
						isSubscribed = true;
					} else {
						console.error(xhr.responseText);
						btn.textContent = btnTexts[2];
						subscription.unsubscribe();
						isSubscribed = false;
					}
				}
			}
			xhr.onerror = ev => {
				console.error(ev);
				btn.textContent = btnTexts[2];
				subscription.unsubscribe();
				isSubscribed = false;
			}
			xhr.open('POST', 'subscribe.php');
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(json);
		});
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
