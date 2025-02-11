<template>
    <a
        v-if="app.isWeb"
        :href="link"
        target="_blank"
        rel="noopener"
    >{{ text }}<slot /></a>
    <a
        v-else
        href="#"
        @click="click"
    >{{ text?.trim() }}<slot /></a>
</template>

<script lang="ts">
import { open } from '@tauri-apps/plugin-shell';
import { string } from 'vue-types';

export default defineComponent({
    props: {
        link: string().isRequired,
        text: string(), // I LOVE HTML!!!!!!!!!!!!!! ADD SPACES WHEREVER YOU WANT
    },
    setup() {
        return { app: useAppStore() };
    },
    methods: {
        click() {
            open(this.link);
        },
    },
});
</script>

<style scoped>
a {
    @apply text-sexfm-300 underline;
}
</style>
