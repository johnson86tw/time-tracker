<script setup lang="ts">
import packageJson from '../package.json'
import { useMainStore } from '@/stores/main'

type Tabbar = '' | 'home' | 'list'

const route = useRoute()
const router = useRouter()

watch(
	() => route.name,
	() => {
		// check login
		const mainStore = useMainStore()
		if (!mainStore.isLogin && route.name !== 'login') {
			router.push({ name: 'login' })
			return
		}

		if (route.name) {
			tabbar.value = route.name as Tabbar
		}
	},
)

const tabbar = ref<Tabbar>('')
</script>

<template>
	<van-config-provider theme="dark" class="h-screen">
		<RouterView class="h-[calc(100%-50px)]" />

		<van-tabbar v-model="tabbar" v-if="route.name !== 'login'">
			<van-tabbar-item to="/" name="home" icon="home-o"></van-tabbar-item>
			<van-tabbar-item to="/list" name="list" icon="notes-o"></van-tabbar-item>
		</van-tabbar>
	</van-config-provider>

	<div class="fixed left-[2px] bottom-[0px] z-10 text-gray-500 text-xs">v{{ packageJson.version }}</div>
</template>

<style lang="css" scoped>
:deep(.van-tabbar) {
	--van-tabbar-height: 60px;
}
</style>
