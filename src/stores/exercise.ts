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
		failedItems: ExerciseItem[]

		start: string
		now: string
		isTiming: boolean
	} => ({
		list: [],
		lastUpdated: 0,
		failedItems: [],

		start: '',
		now: '',
		isTiming: false,
	}),
	getters: {
		displayList(): ExerciseItem[] {
			return _.uniqBy([...this.list, ...this.failedItems], 'id')
				.map((item: ExerciseItem) => ({
					...item,
					start: dayjs(new Date(item.start)).format('MM/DD HH:mm'),
				}))
				.sort((a: ExerciseItem, b: ExerciseItem) => Number(b.id) - Number(a.id))
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
			this.lastUpdated = Date.now()
		},

		async appendItem(item: ExerciseItem) {
			this.list.push(item)

			try {
				await useApiExercise().addItem({
					start: item.start,
					end: item.end,
					note: item.note,
				})
			} catch (err: any) {
				this.failedItems.push(item)
				throw err
			}
		},

		isFailedItem(id: number) {
			return this.failedItems.some(item => item.id === id)
		},

		async uploadFailedItem(item: ExerciseItem) {
			try {
				await useApiExercise().addItem({
					start: item.start,
					end: item.end,
					note: item.note,
				})
				await this.updateList()
				this.failedItems = this.failedItems.filter(failedItem => failedItem.id !== item.id)
			} catch (err: any) {
				throw err
			}
		},
	},
	persist: {
		key: 'exercise',
		paths: ['list', 'lastUpdated', 'failedItems'],
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

	return {
		login,
		fetchList,
		addItem,
		deleteItem,
	}
}
