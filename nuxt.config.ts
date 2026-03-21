// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss", "@nuxt/scripts"],
	css: ["~/assets/css/main.css"],
	app: {
		head: {
			htmlAttrs: {
				lang: "zh-TW",
			},
			title: "圖上字",
			meta: [
				{
					charset: "utf-8",
				},
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				{
					name: "description",
					content: "圖上字，輕鬆幫證件標註文字的幫手",
				},
				{
					name: "keywords",
					content: "圖片上字, 證件上字, 上字, 文字工具",
				},
				{
					name: "language",
					content: "zh-TW",
				},
				{
					httpEquiv: "X-UA-Compatible",
					content: "ie=edge",
				},
			],
			link: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg",
				},
			],
		},
	},
	$production: {
		scripts: {
			registry: {
				googleAnalytics: {
					id: "G-WSWKZM1V4W",
				},
			},
		},
	},
});
