import { ofetch } from 'ofetch'
import { apiUrl } from '@/config'
import { useMainStore } from './stores/main'

export async function fetchList() {
	const res = await ofetch(apiUrl, {
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		retry: 0,
	})

	if (res.status === 'error') {
		throw new Error(res.message)
	}

	return res
}

export async function login(password: string) {
	const res = await ofetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		body: {
			action: 'login',
			data: {
				password,
			},
		},
	})

	if (res.status === 'error') {
		throw new Error(res.message)
	}

	return res
}

export async function addItem(data: { start: string; end: string; note: string }) {
	const mainStore = useMainStore()

	const res = await ofetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		body: {
			action: 'post',
			token: mainStore.credential,
			data,
		},
	})

	if (res.status === 'error') {
		throw new Error(res.message)
	}

	return res
}

export async function deleteItem(index: number) {
	const mainStore = useMainStore()

	const res = await ofetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
		},
		body: {
			action: 'delete',
			token: mainStore.credential,
			index,
		},
	})

	if (res.status === 'error') {
		throw new Error(res.message)
	}

	return res
}
