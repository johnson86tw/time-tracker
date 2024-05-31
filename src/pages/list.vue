<script setup lang="ts">
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { errorToastOptions, showLoading } from '@/utils'
import { useApiExercise, useExerciseStore } from '@/stores/exercise'
import { ExerciseItem } from '@/types'

const exerciseStore = useExerciseStore()
const { displayList, isAppending } = storeToRefs(exerciseStore)

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

// ============================ Upload ============================

const isUploading = ref(false)

async function onClickUploadItem(item: ExerciseItem) {
	try {
		isUploading.value = true
		await useExerciseStore().uploadItem(item)
	} catch (err: any) {
		console.error(err)
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	} finally {
		isUploading.value = false
	}
}

// ============================ Dialog ============================
const showDialog = ref(false)
const note = ref('')
const editingItemId = ref(0)

function onClickEdit(item: ExerciseItem) {
	note.value = item.note
	editingItemId.value = item.id
	showDialog.value = true
}

async function onDialogConfirm() {
	try {
		showLoading()
		await useApiExercise().updateNote(editingItemId.value, note.value)
		await exerciseStore.updateList()
		closeToast()
	} catch (err: any) {
		console.error(err)
		closeToast()
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	}
}
// ============================ Dialog end ============================

/**
 * template:
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
					<van-cell :title="getDate(item) + ' - ' + getDuration(item)" :label="getTime(item)">
						<template #right-icon>
							<div class="flex items-center gap-4">
								<div>
									{{ item.note }}
								</div>

								<van-button
									v-if="exerciseStore.isUnuploaded(item.id)"
									size="mini"
									:loading="isUploading || isAppending"
									@click="onClickUploadItem(item)"
								>
									Upload
								</van-button>

								<van-button v-else size="mini" icon="edit" @click="onClickEdit(item)"></van-button>
							</div>
						</template>
					</van-cell>

					<template #right>
						<!-- <van-button square type="danger" text="Delete" @click="onClickDelete(item)" /> -->
						<!-- <van-button square type="primary" text="Edit" /> -->
					</template>
				</van-swipe-cell>
			</van-list>
		</van-pull-refresh>

		<van-dialog v-model:show="showDialog" title="Edit note" show-cancel-button @confirm="onDialogConfirm">
			<div class="p-5">
				<van-field v-model="note" placeholder="typing some text..." />
			</div>
		</van-dialog>
	</div>
</template>

<style lang="css" scoped>
:deep(.van-button) {
	--van-button-default-height: 100%;
}
</style>
