<script setup lang="ts">
import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()
const router = useRouter()

function googleLoginCallback(response: { clientId: string; credential: string; select_by: string }) {
	console.log('googleLoginCallback', response)
	mainStore.setCredential(response.credential)
	router.push({ name: 'home' })
}
</script>

<template>
	<div class="flex justify-center items-center">
		<GoogleLogin :callback="googleLoginCallback" prompt auto-login>
			<div class="w-40">
				<van-button type="primary" size="large"> Login with Google </van-button>
			</div>
		</GoogleLogin>
	</div>
</template>

<style lang="scss"></style>
