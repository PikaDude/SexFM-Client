import { AVPlugin } from 'vue-audio-visual';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(AVPlugin);
});
