<script setup lang="ts">
import { deleteItem } from '@/api'
import { apiUrl } from '@/config'
import dayjs from 'dayjs'
import { ofetch } from 'ofetch'
import { errorToastOptions } from '@/utils'

type Item = {
	start: string
	end: string
	duration: string
	note: string
}

const list = ref<Item[]>([])
const loading = ref(false)
const finished = ref(false)

async function onLoad() {
	const res = await ofetch(apiUrl)
	list.value = res
	loading.value = false
	finished.value = true
}

const displayList = computed(() =>
	list.value
		.map(item => ({
			...item,
			start: dayjs(new Date(item.start)).format('MM/DD HH:mm'),
		}))
		.sort((a, b) => (dayjs(a.start, 'MM/DD HH:mm').isAfter(dayjs(b.start, 'MM/DD HH:mm')) ? -1 : 1)),
)

const deleting = ref(false)

async function onClickDelete(index: number) {
	deleting.value = true
	try {
		await deleteItem(index)
	} catch (err: any) {
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	} finally {
		onLoad()
	}
}
</script>

<template>
	<div>
		<van-list v-model:loading="loading" :finished="finished" loading-text="Loading..." @load="onLoad">
			<van-swipe-cell v-for="(item, i) in displayList" :key="i">
				<van-cell :title="item.start" :value="item.note" />
				<template #right>
					<van-button square type="danger" text="Delete" @click="onClickDelete(i)" />
					<!-- <van-button square type="primary" text="Edit" /> -->
				</template>
			</van-swipe-cell>
		</van-list>
	</div>
</template>

<style lang="scss"></style>
