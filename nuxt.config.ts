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
			title: "圖上字 - 免費線上圖片加字工具",
			titleTemplate: "%s | 圖上字",
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
					content:
						"圖上字是免費的線上圖片加字工具，輕鬆在圖片、證件或海報上新增文字標註。支援拖曳調整位置、自訂字型大小，在瀏覽器本地處理，無需上傳至伺服器。",
				},
				{
					name: "keywords",
					content:
						"圖片上字, 圖片加字, 證件上字, 線上加字, 文字工具, 免費圖片編輯, 在線圖片文字",
				},
				{
					name: "language",
					content: "zh-TW",
				},
				{
					name: "robots",
					content: "index, follow",
				},
				{
					name: "author",
					content: "Sianglife",
				},
				// Open Graph
				{
					property: "og:type",
					content: "website",
				},
				{
					property: "og:site_name",
					content: "圖上字",
				},
				{
					property: "og:title",
					content: "圖上字 - 免費線上圖片加字工具",
				},
				{
					property: "og:description",
					content:
						"免費的線上圖片加字工具，輕鬆在圖片、證件或海報上新增文字標註。支援拖曳調整位置、自訂字型大小，在瀏覽器本地處理，無需上傳至伺服器。",
				},
				{
					property: "og:url",
					content: "https://sianglife.github.io/id-texting/",
				},
				{
					property: "og:image",
					content:
						"https://sianglife.github.io/id-texting/og-image.png",
				},
				{
					property: "og:image:width",
					content: "1200",
				},
				{
					property: "og:image:height",
					content: "630",
				},
				{
					property: "og:image:alt",
					content: "圖上字 - 線上圖片加字工具預覽",
				},
				{
					property: "og:locale",
					content: "zh_TW",
				},
				// Twitter Card
				{
					name: "twitter:card",
					content: "summary_large_image",
				},
				{
					name: "twitter:title",
					content: "圖上字 - 免費線上圖片加字工具",
				},
				{
					name: "twitter:description",
					content:
						"免費的線上圖片加字工具，輕鬆在圖片、證件或海報上新增文字標註。支援拖曳調整位置、自訂字型大小，在瀏覽器本地處理，無需上傳至伺服器。",
				},
				{
					name: "twitter:image",
					content:
						"https://sianglife.github.io/id-texting/og-image.png",
				},
				{
					name: "twitter:image:alt",
					content: "圖上字 - 線上圖片加字工具預覽",
				},
			],
			link: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/id-texting/favicon.svg",
				},
				{
					rel: "canonical",
					href: "https://sianglife.github.io/id-texting/",
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
