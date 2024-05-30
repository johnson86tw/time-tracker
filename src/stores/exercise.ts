import { ExerciseItem } from '@/types'
import { defineStore } from 'pinia'

export const useExerciseStore = defineStore('exercise', {
	state: (): {
		list: ExerciseItem[]
		lastUpdated: number // timestamp
	} => ({
		list: [],
		lastUpdated: 0,
	}),
	getters: {},
	actions: {
		updateList(list: ExerciseItem[]) {
			this.list = list
			this.lastUpdated = Date.now()
		},
	},
	persist: {
		key: 'exercise',
		paths: ['list', 'lastUpdated'],
	},
})
