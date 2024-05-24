<script setup lang="ts">
import { deleteItem, fetchList } from '@/api'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { errorToastOptions, showLoading } from '@/utils'

type Item = {
	start: string
	end: string
	duration: string
	note: string
}

const list = ref<Item[]>([])
const loading = ref(false)
const finished = ref(false)
const loadError = ref(false)

async function onLoad() {
	try {
		const res = await fetchList()
		list.value = res as unknown as Item[]
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

async function onClickDelete(index: number) {
	showLoading()
	try {
		await deleteItem(index)
		await onRefresh()
		closeToast()
	} catch (err: any) {
		closeToast()
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	}
}

function getDate(item: Item) {
	return dayjs(new Date(item.start)).format('M/DD')
}

function getTime(item: Item) {
	return dayjs(new Date(item.start)).format('hh:mm A')
}

function getDuration(item: Item) {
	const diff = dayjs(item.end).diff(dayjs(item.start), 'second')
	const duration = dayjs.duration(diff, 'second')
	const totalMinutes = duration.hours() * 60 + duration.minutes()
	return `${totalMinutes} min`
}
</script>

<template>
	<div>
		<van-pull-refresh v-model="loading" @refresh="onRefresh">
			<van-list v-model:loading="loading" :finished="finished" v-model:error="loadError" @load="onLoad">
				<van-swipe-cell v-for="(item, i) in displayList" :key="i">
					<van-cell
						:title="getDate(item) + ' - ' + getDuration(item)"
						:label="getTime(item)"
						:value="item.note"
					/>
					<template #right>
						<van-button square type="danger" text="Delete" @click="onClickDelete(i)" />
						<!-- <van-button square type="primary" text="Edit" /> -->
					</template>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<style lang="scss"></style>
