<script setup lang="ts">
import { deleteItem } from '@/api'
import { apiUrl } from '@/config'
import dayjs from 'dayjs'
import { ofetch } from 'ofetch'
import { errorToastOptions } from '@/utils'

// @todo 下拉更新

const list = ref<
	{
		start: string
		end: string
		duration: string
		note: string
	}[]
>([])
const loading = ref(false)
const finished = ref(false)
const loadError = ref(false)
const refreshing = ref(false)

async function onLoad() {
	try {
		const res = await ofetch(apiUrl)
		list.value = res
		finished.value = true
	} catch (err: any) {
		loadError.value = true
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	} finally {
		loading.value = false
	}
}

async function onRefresh() {
	finished.value = false
	loading.value = true
	await onLoad()
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
		await onLoad()
	} catch (err: any) {
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	} finally {
		deleting.value = false
	}
}
</script>

<template>
	<div>
		<van-list
			v-model:loading="loading"
			:finished="finished"
			loading-text="Loading..."
			v-model:error="loadError"
			error-text="Request failed. Click to reload"
			v-model="refreshing"
			@refresh="onRefresh"
			@load="onLoad"
		>
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
