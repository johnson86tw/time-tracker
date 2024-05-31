import { ExerciseItem } from '@/types'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import _ from 'lodash'
import { ofetch } from 'ofetch'
import { apiUrl } from '@/config'
import { useMainStore } from '@/stores/main'

export const FORMAT = 'YYYY/M/D HH:mm:ss'
export let interval = 0

export const useExerciseStore = defineStore('exercise', {
	state: (): {
		list: ExerciseItem[]
		lastUpdated: number // timestamp
		unuploadedItems: ExerciseItem[]
		isAppending: boolean

		start: string
		now: string
		isTiming: boolean
	} => ({
		list: [],
		lastUpdated: 0,
		unuploadedItems: [],
		isAppending: false,

		start: '',
		now: '',
		isTiming: false,
	}),
	getters: {
		displayList(): ExerciseItem[] {
			return _.uniqBy([...this.list, ...this.unuploadedItems], 'id').sort(
				(a: ExerciseItem, b: ExerciseItem) => Number(b.id) - Number(a.id),
			)
		},

		displayTiming(): string {
			if (this.isTiming) {
				const diff = dayjs(this.now).diff(dayjs(this.start), 'second')
				return dayjs.duration(diff, 'seconds').format('HH:mm:ss')
			}
			return '0'
		},
	},
	actions: {
		startTiming() {
			this.start = dayjs().format(FORMAT)
			this.now = dayjs().format(FORMAT)

			interval = setInterval(() => {
				this.now = dayjs().format(FORMAT)
				console.log('now', this.now)
			}, 1000)

			this.isTiming = true
		},

		clearTimingInterval() {
			clearInterval(interval)
		},

		async updateList() {
			this.list = await useApiExercise().fetchList()
			this.unuploadedItems = this.unuploadedItems.filter(
				item =>
					!this.list.some(listItem => {
						console.log('list start', dayjs(listItem.start).format(FORMAT))
						console.log('unuploaded start', item.start)
						console.log(dayjs(listItem.start).isSame(dayjs(item.start), 'second'))
						return dayjs(listItem.start).isSame(dayjs(item.start), 'second')
					}),
			)
			this.lastUpdated = Date.now()
		},

		async appendItem(item: ExerciseItem) {
			this.unuploadedItems.push(item)

			try {
				this.isAppending = true
				await useApiExercise().addItem({
					start: item.start,
					end: item.end,
					note: item.note,
				})
				await this.updateList()
			} catch (e) {
				throw e
			} finally {
				this.isAppending = false
			}
		},

		isUnuploaded(id: number) {
			return this.unuploadedItems.some(item => item.id === id)
		},

		async uploadItem(item: ExerciseItem) {
			await useApiExercise().addItem({
				start: item.start,
				end: item.end,
				note: item.note,
			})
			await this.updateList()
		},
	},
	persist: {
		key: 'exercise',
	},
})

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

	async function deleteItem(id: number) {
		const mainStore = useMainStore()

		const res = await ofetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
			},
			body: {
				action: 'delete',
				token: mainStore.credential,
				id,
			},
		})

		handleResponseError(res)

		return res
	}

	async function updateNote(id: number, note: string) {
		const mainStore = useMainStore()

		const res = await ofetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/plain;charset=utf-8', // allow CORS https://stackoverflow.com/a/68933465/10752354
			},
			body: {
				action: 'update',
				token: mainStore.credential,
				id,
				data: {
					note,
				},
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
		updateNote,
	}
}
