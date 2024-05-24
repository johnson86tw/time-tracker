import { ofetch } from 'ofetch'
import { apiUrl } from '@/config'

export async function fetchList() {
	return await ofetch(apiUrl)
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
