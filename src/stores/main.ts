import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
	state: (): {
		credential: string
	} => ({
		credential: '',
	}),
	getters: {
		isLogin(): boolean {
			return true || this.credential !== ''
		},
	},
	actions: {
		setCredential(credential: string): void {
			this.credential = credential
		},
		clearCredential(): void {
			this.credential = ''
		},
	},
})
