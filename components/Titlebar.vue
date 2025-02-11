<template>
    <div
        class="flex justify-between items-center bg-sexfm sex-shadow p-2"
        data-tauri-drag-region
    >
        <div class="flex items-center gap-1">
            <span
                data-tauri-drag-region
                class="mr-1 text-white text-lg"
            >SexFM</span>
            <div
                class="border button"
                @click="popups.settings = !popups.settings"
            >
                <Icon name="material-symbols:tools-wrench-outline-sharp" />
            </div>
        </div>

        <div class="flex items-center gap-1">
            <div
                class="border button"
                @click="popups.help = !popups.help"
            >
                <Icon name="material-symbols:question-mark" />
            </div>
            <div
                class="border button"
                @click="minimize"
            >
                <Icon name="material-symbols:minimize" />
            </div>
            <div
                class="border button"
                @click="close"
            >
                <Icon name="material-symbols:close" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';

export default defineComponent({
    setup() {
        return {
            popups: usePopupsStore(),
            autoUpdate: useAutoUpdateStore(),
        };
    },
    methods: {
        async close() {
            await this.autoUpdate.runInstallFunction();
            getCurrentWindow().close();
        },
        minimize() {
            getCurrentWindow().minimize();
        },
    },
});
</script>
