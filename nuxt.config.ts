import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxtjs/tailwindcss', '@pinia/nuxt', 'vue-types-nuxt'],

    // Enable SSG
    // NOTE: we do SSG with SSR enabled https://nuxt.com/docs/getting-started/deployment#static-hosting
    ssr: true,
    devtools: { enabled: true },

    css: ['~/assets/global.css'],

    // Enables the development server to be discoverable by other devices when running on iOS physical devices
    devServer: { host: process.env.TAURI_DEV_HOST || 'localhost' },
    compatibilityDate: '2024-11-01',

    vite: {
    // Better support for Tauri CLI output
        clearScreen: false,
        // Enable environment variables
        // Additional environment variables can be found at
        // https://v2.tauri.app/reference/environment-variables/
        envPrefix: ['VITE_', 'TAURI_'],
        server: {
            // Tauri requires a consistent port
            strictPort: true,
        },
    },

    telemetry: { enabled: false },
    eslint: {
        config: {
            stylistic: true,
        },
    },
});
