<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { errorToastOptions } from '@/utils'
import { useExerciseStore } from '@/stores/exercise'
import { ExerciseItem } from '@/types'

const exerciseStore = useExerciseStore()
const { displayList } = storeToRefs(exerciseStore)

const loading = ref(false)
const finished = ref(false)
const loadError = ref(false)

// feat: 首次載入背景偷偷更新
onMounted(async () => {
	// 如果 store 沒有資料，要顯示 loading
	if (!exerciseStore.list.length) {
		await onRefresh()
		return
	}

	// 如果 store 有資料，背景偷偷更新
	try {
		await exerciseStore.updateList()
	} catch (err: any) {
		console.error(err)
		loadError.value = true
	}
})

async function onLoad() {
	try {
		await exerciseStore.updateList()
		finished.value = true
	} catch (err: any) {
		console.error(err)
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

function getDate(item: ExerciseItem) {
	return dayjs(new Date(item.start)).format('M/DD')
}

function getTime(item: ExerciseItem) {
	return dayjs(new Date(item.start)).format('hh:mm A')
}

function getDuration(item: ExerciseItem) {
	const diff = dayjs(item.end).diff(dayjs(item.start), 'second')
	const duration = dayjs.duration(diff, 'second')
	const totalMinutes = duration.hours() * 60 + duration.minutes()
	return `${totalMinutes} min`
}

const isUploadingFailedItem = ref(false)

async function onClickUploadFailedItem(item: ExerciseItem) {
	try {
		isUploadingFailedItem.value = true
		await useExerciseStore().uploadFailedItem(item)
	} catch (err: any) {
		console.error(err)
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	} finally {
		isUploadingFailedItem.value = false
	}
}

/**
 * immediate-check: A load event will be triggered immediately
 */
</script>

<template>
	<div class="overflow-y-scroll">
		<van-pull-refresh v-model="loading" @refresh="onRefresh">
			<van-list
				v-model:loading="loading"
				:finished="finished"
				v-model:error="loadError"
				@load="onLoad"
				:immediate-check="false"
			>
				<van-swipe-cell v-for="(item, i) in displayList" :key="i">
					<van-cell
						:title="getDate(item) + ' - ' + getDuration(item)"
						:label="getTime(item)"
						:value="item.note"
					>
						<template #right-icon>
							<van-button
								v-if="exerciseStore.isFailedItem(item.id)"
								size="mini"
								:loading="isUploadingFailedItem"
								@click="onClickUploadFailedItem(item)"
							>
								Upload
							</van-button>
						</template>
					</van-cell>

					<template #right>
						<!-- <van-button square type="danger" text="Delete" @click="onClickDelete(item)" /> -->
						<!-- <van-button square type="primary" text="Edit" /> -->
					</template>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>
	</div>
</template>

<style lang="css" scoped>
:deep(.van-button) {
	--van-button-default-height: 100%;
}
</style>
