'use strict';

const applicationServerPublicKey = 'BCg-4uliQxFuTjKYMKcNfwNO7srodFr3afhKy6O2iXAH72hIJakC9mMqtoJfz9Vpx4tB5bfCuJTq_qSNAWDd8I8'

let swRegistration = null;

function urlB64ToUint8Array(base64String) {
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

if ('serviceWorker' in navigator && 'PushManager' in window) {
	navigator.serviceWorker.register('worker.js')
	.then(reg => {
		swRegistration = reg;
		buttonSubscribe.disabled = false;
	})
	.catch(err => alert('Fehler beim Registrieren des ServiceWorkers'));
} else {
	alert('Push-Nachrichten funktionieren nicht');
}

buttonSubscribe.addEventListener('click', ev => {
	ev.preventDefault();
	console.log(1)

	let x = urlB64ToUint8Array(applicationServerPublicKey);
	console.log(x)

	swRegistration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlB64ToUint8Array(applicationServerPublicKey)
	})
	.then(subscription => {
		console.log(subscription)
		//updateSubscriptionOnServer(subscription);
		//isSubscribed = true;
		buttonSend.disabled = false;
	})
	.catch(err => {
		console.error(err)
		alert('Abonnement der Push-Nachrichten ist fehlgeschlagen.');
	});


});

buttonSend.addEventListener('click', ev => {
	ev.preventDefault();
	console.log(2)
});
