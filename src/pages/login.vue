<script setup lang="ts">
import { useMainStore } from '@/stores/main'
import type { CallbackTypes } from 'vue3-google-login'

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
</script>

<template>
	<div class="flex justify-center items-center">
		<GoogleLogin :callback="googleLoginCallback" prompt auto-login popup-type="TOKEN">
			<div class="w-40">
				<van-button type="primary" size="large"> Login with Google </van-button>
			</div>
		</GoogleLogin>
	</div>
</template>

<style lang="scss"></style>
