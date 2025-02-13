<template>
    <a
        v-if="app.isWeb"
        :href="link"
        target="_blank"
        rel="noopener"
        :class="{ 'text-sexfm-300': useStyle, 'underline': useStyle }"
    >{{ text }}<slot /></a>
    <a
        v-else
        href="#"
        :class="{ 'text-sexfm-300': useStyle, 'underline': useStyle }"
        @click="click"
    >{{ text?.trim() }}<slot /></a>
</template>

<script lang="ts">
import { open } from '@tauri-apps/plugin-shell';
import { bool, string } from 'vue-types';

export default defineComponent({
    props: {
        link: string().isRequired,
        text: string(), // I LOVE HTML!!!!!!!!!!!!!! ADD SPACES WHEREVER YOU WANT
        useStyle: bool().def(true),
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
