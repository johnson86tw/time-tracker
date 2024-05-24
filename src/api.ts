import { ofetch } from 'ofetch'
import { apiUrl } from '@/config'
import { useMainStore } from './stores/main'

export async function fetchList() {
	const mainStore = useMainStore()

	return await ofetch(apiUrl, {
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		retry: 0,
	})

	// using native fetch (has bug)
	return await fetch(apiUrl, {
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
	})
}

export async function addItem(data: { start: string; end: string; note: string }) {
	await ofetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		body: {
			action: 'post',
			data,
		},
	})
}

export async function deleteItem(index: number) {
	await ofetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		body: {
			action: 'delete',
			index,
		},
	})
}
