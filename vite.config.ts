import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver, VantImports } from '@vant/auto-import-resolver'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		// unplugin-auto-import https://github.com/antfu/unplugin-auto-import#configuration
		AutoImport({
			// @ts-ignore
			imports: ['vue', 'vue-router', 'pinia', VantImports()],
			resolvers: [VantResolver()],
		}),
		// unplugin-vue-components https://github.com/antfu/unplugin-vue-components#configuration
		Components({
			resolvers: [VantResolver()],
		}),

		VitePWA({
			strategies: 'injectManifest', // the vite-plugin-pwa plugin will compile your custom service worker and inject its precache manifest
			injectRegister: 'inline', // register the service worker myself
			srcDir: 'src/service-worker',
			filename: 'sw.ts',
			injectManifest: {
				injectionPoint: undefined, // prevent from Error: Unable to find a place to inject the manifest
			},
			registerType: 'autoUpdate',
			includeAssets: ['**/*'], // autoUpdate 的時候要把哪些東西更新
			devOptions: {
				enabled: false,
			},
			// workbox: {
			// 	globPatterns: ['**/*'], // 哪些檔案要被快取
			// 	runtimeCaching: [
			// 		{
			// 			urlPattern: ({ url }) => {
			// 				return url.pathname.startsWith('/')
			// 			},
			// 			handler: 'CacheFirst', // 當 browser 發出 request，會先看快取有無資料，沒有的話才去跟 server 要資料。
			// 			options: {
			// 				cacheName: 'time-trakcer-cache',
			// 				cacheableResponse: {
			// 					statuses: [200], // 只快取 200 的 response
			// 				},
			// 			},
			// 		},
			// 	],
			// },
			manifest: {
				name: 'time-tracker',
				short_name: 'Time Tracker',
				// start_url: '.',
				// display: 'standalone',
				theme_color: '#fff',
				description: 'A time tracker app',
				icons: [
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
		}),
	],
	resolve: {
		alias: { '@': path.resolve(__dirname, 'src') },
	},
})
