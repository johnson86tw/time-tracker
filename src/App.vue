<script setup lang="ts">
import packageJson from '../package.json'

type Tabbar = 'home' | 'list'

const route = useRoute()

watch(
	() => route.name,
	() => {
		if (route.name) {
			tabbar.value = route.name as Tabbar
		}
	},
)

const tabbar = ref<Tabbar>('home')
</script>

<template>
	<van-config-provider theme="dark" class="h-screen">
		<RouterView class="h-[calc(100%-50px)]" />

		<van-tabbar v-model="tabbar">
			<van-tabbar-item to="/" name="home" icon="home-o"></van-tabbar-item>
			<van-tabbar-item to="/list" name="list" icon="notes-o"></van-tabbar-item>
		</van-tabbar>
	</van-config-provider>

	<div class="fixed right-0 bottom-[0px] z-10 text-gray-500 text-xs">v{{ packageJson.version }}</div>
</template>

<style lang="scss"></style>
