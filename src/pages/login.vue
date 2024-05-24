<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import type { CallbackTypes } from 'vue3-google-login'
import { errorToastOptions, showLoading } from '@/utils'
import { login } from '@/api'

const mainStore = useMainStore()
const router = useRouter()

// access_token
const googleLoginCallback: CallbackTypes.TokenResponseCallback = response => {
	console.log('googleLoginCallback', response)
	mainStore.setCredential(response.access_token)
	router.push({ name: 'home' })
}

// credential
// const googleLoginCallback: CallbackTypes.CredentialCallback = response => {
// 	console.log('googleLoginCallback', response)
// 	mainStore.setCredential(response.credential)
// 	router.push({ name: 'home' })
// }

// code
// const googleLoginCallback: CallbackTypes.CodeResponseCallback = response => {
// 	console.log('googleLoginCallback', response)
// 	mainStore.setCredential(response.code)
// 	router.push({ name: 'home' })
// }

const password = ref('')
const showKeyboard = ref(true)

async function onClickEnter() {
	try {
		showLoading()
		const res = await login(password.value)
		const token = res.token
		mainStore.setCredential(token)
		router.push({ name: 'home' })
		closeToast()
	} catch (err: any) {
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	}
}
</script>

<template>
	<div class="flex flex-col justify-center items-center gap-5">
		<!-- <GoogleLogin :callback="googleLoginCallback" prompt auto-login popup-type="TOKEN">
			<div class="w-40">
				<van-button type="primary" size="large"> Login with Google </van-button>
			</div>
		</GoogleLogin> -->
		<div class="w-full">
			<van-password-input length="4" :value="password" :focused="showKeyboard" @focus="showKeyboard = true" />
			<van-number-keyboard v-model="password" :show="showKeyboard" @blur="showKeyboard = false" />
		</div>

		<div class="w-40">
			<van-button type="primary" round size="large" @click="onClickEnter"> Enter </van-button>
		</div>
	</div>
</template>

<style lang="scss"></style>
