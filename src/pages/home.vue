<script setup lang="ts">
import { useApiExercise } from '@/api'
import { showLoading, errorToastOptions } from '@/utils'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const FORMAT = 'YYYY/M/D HH:mm:ss'

const { addItem } = useApiExercise()

const isTiming = ref(false)
const start = ref('')
const now = ref('')

const displayTime = computed(() => {
	if (isTiming.value) {
		const diff = dayjs(now.value).diff(dayjs(start.value), 'second')
		return dayjs.duration(diff, 'seconds').format('HH:mm:ss')
	}
	return 0
})

let interval: any

async function onClickStart() {
	start.value = dayjs().format(FORMAT)
	now.value = dayjs().format(FORMAT)

	interval = setInterval(() => {
		now.value = dayjs().format(FORMAT)
		console.log('now', now.value)
	}, 1000)

	isTiming.value = true
}

async function onClickEnd() {
	// @todo show dialog to input note
	showLoading()
	isTiming.value = false
	clearInterval(interval)

	const end = dayjs().format(FORMAT)

	try {
		await addItem({
			start: start.value,
			end,
			note: '',
		})
		closeToast()
	} catch (err: any) {
		closeToast()
		showFailToast({
			message: err.message,
			...errorToastOptions,
		})
	}
}
</script>

<template>
	<div class="relative">
		<div class="h-full flex items-center justify-center">
			<div class="flex flex-col gap-10 justify-center items-center">
				<div class="text-3xl">{{ displayTime }}</div>
				<div class="w-32">
					<van-button v-if="!isTiming" type="primary" round size="large" @click="onClickStart">
						Start
					</van-button>
					<van-button v-else color="#DD5746" round size="large" @click="onClickEnd">Stop</van-button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss"></style>
