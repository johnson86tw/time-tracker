<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { CF_URL_BASE, WEBPUSH_PUB_KEY } from '@/config'

const error = ref('')
const requestResult = ref('')
const isSubscribed = ref(false)

async function requestNotificationPermission() {
	try {
		if (!('Notification' in window)) {
			requestResult.value = 'Browser does not support notifications'
			throw new Error('Browser does not support notifications')
		}

		const permission = await Notification.requestPermission()

		if (permission !== 'granted') {
			requestResult.value = 'Permission not granted'
			throw new Error('Permission not granted')
		} else {
			requestResult.value = 'Permission granted'

			requestResult.value = 'Permission granted'

			const registration = await navigator.serviceWorker.ready
			if (!registration) {
				throw new Error('Registration not found')
			}

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: WEBPUSH_PUB_KEY,
			})

			try {
				const response = await saveSubscription(subscription)

				if (response.status === 'Success') {
					isSubscribed.value = true
				}
			} catch (e) {
				throw new Error('Failed to save subscription: ' + e)
			}
		}
	} catch (e: any) {
		error.value = e
	}
}

const swActivated = ref(false)
const swRegistrationError = ref('')

useRegisterSW({
	onRegisterError(err) {
		swRegistrationError.value = err
	},
	async onRegisteredSW(_swUrl, _registration) {
		swActivated.value = true
	},
})

async function saveSubscription(subscription: PushSubscription) {
	try {
		console.log('Starting fetch request')
		const response = await fetch(`${CF_URL_BASE}/save-subscription`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(subscription),
		})

		console.log('Fetch request completed')
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}

		const responseData = await response.json()
		console.log('Response data:', responseData)
		return responseData
	} catch (error) {
		console.error('Failed to save subscription:', error)
		throw error
	}
}

function reload() {
	location.reload()
}
</script>

<template>
	<div class="p-5 relative">
		<div class="flex flex-col gap-2">
			<div>
				<van-button type="primary" size="small" @click="requestNotificationPermission">
					Enable Notification
				</van-button>
			</div>

			<div>Notification Permission: {{ requestResult }}</div>
			<div>Is Subscribed: {{ isSubscribed }}</div>

			<div>SW Activated: {{ swActivated }}</div>
			<div>SW Registration Error: {{ swRegistrationError }}</div>

			<div>Error: {{ error }}</div>
		</div>

		<div class="absolute bottom-20">
			<van-button type="primary" size="small" @click="reload"> Reload </van-button>
		</div>
	</div>
</template>

<style lang="scss"></style>
