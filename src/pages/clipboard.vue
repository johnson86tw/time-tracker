<script setup lang="ts">
import copy from 'copy-to-clipboard'
import clipboardJson from '@/clipboard.json'

const copiedTitle = ref('')

function onClickCopy(content: string, title: string) {
	copy(content)
	copiedTitle.value = title

	// refer to https://www.reddit.com/r/shortcuts/comments/1436y1h/deeplink_url_schemes_for_the_chatgpt_app/?rdt=35021
	window.location.href = 'com.openai.chat://'

	setTimeout(() => {
		copiedTitle.value = ''
	}, 3000)
}
</script>

<template>
	<div>
		<van-list>
			<van-cell
				v-for="item in clipboardJson"
				:key="item.title"
				:title="item.title"
				size="large"
				clickable
				@click="onClickCopy(item.content, item.title)"
			>
				<template #right-icon>
					<div v-if="copiedTitle === item.title" class="flex items-center">
						<van-icon name="success" class="text-green-500" />
					</div>
				</template>
			</van-cell>
		</van-list>
	</div>
</template>

<style lang="scss"></style>
