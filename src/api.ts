import { ofetch } from 'ofetch'
import { apiUrl } from '@/config'

export async function fetchList() {
	return await ofetch(apiUrl)
}

export async function deleteItem(index: number) {
	await ofetch(apiUrl, {
		method: 'POST',
		body: {
			action: 'delete',
			index,
		},
	})
}
