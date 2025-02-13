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
                v-if="!app.isWeb"
                class="border button"
                @click="minimize"
            >
                <Icon name="material-symbols:minimize" />
            </div>
            <div
                v-if="!app.isWeb"
                class="border button"
                @click="close"
            >
                <Icon name="material-symbols:close" />
            </div>
            <SexLink
                v-if="isWebDesktop"
                class="border button"
                :use-style="false"
                link="https://github.com/PikaDude/SexFM-Player/releases/latest"
            >
                <Icon name="material-symbols:download-sharp" />
            </SexLink>
            <SexLink
                v-if="isWebMobile"
                class="border button"
                :use-style="false"
                link="https://player.sexfm.live"
            >
                <Icon name="material-symbols:open-in-new" />
            </SexLink>
        </div>
    </div>
</template>

<script lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';

export default defineComponent({
    setup() {
        return {
            app: useAppStore(),
            popups: usePopupsStore(),
            autoUpdate: useAutoUpdateStore(),
        };
    },
    computed: {
        isWebDesktop() {
            return (this.app.isWeb && this.$device.isDesktop);
        },
        isWebMobile() {
            return (this.app.isWeb && this.$device.isMobileOrTablet);
        },
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
