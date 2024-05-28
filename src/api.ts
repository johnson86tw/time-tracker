import { ofetch } from 'ofetch'
import { apiUrl } from '@/config'
import { useMainStore } from '@/stores/main'

export function useApiExercise() {
	const router = useRouter()

	function handleResponseError(res: { status: string; message: string }) {
		if (res.message === 'Invalid credentials') {
			router.push('/login')
			throw new Error('Invalid credentials')
		}

		if (res.status === 'error') {
			throw new Error(res.message)
		}
	}

	async function login(password: string) {
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

		handleResponseError(res)

		return res
	}

	async function fetchList() {
		const mainStore = useMainStore()
		if (!mainStore.credential) throw new Error('No credential found')

		const res = await ofetch(`${apiUrl}?token=${mainStore.credential}`, {
			headers: {
				'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
			},
			retry: 0, // GET default is 1
		})

		handleResponseError(res)

		return res
	}

	async function addItem(data: { start: string; end: string; note: string }) {
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

		handleResponseError(res)

		return res
	}

	async function deleteItem(index: number) {
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

		handleResponseError(res)

		return res
	}

	return {
		login,
		fetchList,
		addItem,
		deleteItem,
	}
}
