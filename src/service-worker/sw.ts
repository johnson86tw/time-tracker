/// <reference lib="webworker" />

console.log('New service worker is installing...')

declare const self: ServiceWorkerGlobalScope

// To force the new service worker to activate immediately
self.addEventListener('install', () => void self.skipWaiting())

self.addEventListener('activate', async () => {
	self.registration.showNotification('Service worker is activated')
})

self.addEventListener('push', event => {
	console.log('push event', event.data?.json())

	const content = event.data?.json()

	if (content.type === 'ADDRESS_ACTIVITY') {
		const network = content.event.network

		for (const activity of content.event.activity) {
			const asset = activity.asset
			const value = activity.value
			const hash = activity.hash

			self.registration.showNotification(`${network}`, {
				body: `${asset} - ${value}`,
				data: {
					url: `https://sepolia.etherscan.io/tx/${hash}`,
				},
				action: [{ action: 'open_url', title: 'Visit Site' }],
			})
		}
	} else {
		self.registration.showNotification('New message', { body: event.data?.text() })
	}
})

self.addEventListener('notificationclick', event => {
	event.notification.close()

	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
			for (const client of clientList) {
				if (client.url === event.notification.data.url && 'focus' in client) {
					return client.focus()
				}
			}
			if (clients.openWindow) {
				return clients.openWindow(event.notification.data.url)
			}
		}),
	)
})
