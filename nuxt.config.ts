// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss", "@nuxt/scripts"],
	css: ["~/assets/css/main.css"],
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
