<script setup lang="ts">
import { useExerciseStore, FORMAT } from '@/stores/exercise'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const exerciseStore = useExerciseStore()
const { isTiming, start, displayTiming } = storeToRefs(exerciseStore)

function onClickStart() {
	exerciseStore.startTiming()
}

async function onClickEnd() {
	isTiming.value = false
	exerciseStore.clearTimingInterval()

	const end = dayjs().format(FORMAT)

	try {
		exerciseStore.appendItem({
			id: new Date().getTime(),
			start: start.value,
			end,
			duration: dayjs(end).diff(dayjs(start.value), 'second').toString(),
			note: '',
		})
	} catch (err: any) {
		console.error(err)
	}
}
</script>

<template>
	<div class="relative">
		<div class="h-full flex items-center justify-center">
			<div class="flex flex-col gap-10 justify-center items-center">
				<div class="text-3xl">{{ displayTiming }}</div>
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
