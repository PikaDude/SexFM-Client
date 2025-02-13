<template>
    <div
        class="flex justify-between items-center bg-sexfm sex-shadow p-2 xs:p-4"
        data-tauri-drag-region
    >
        <div class="flex items-center gap-1 xs:gap-2">
            <span
                data-tauri-drag-region
                class="mr-1 text-white text-lg xs:text-3xl"
            >SexFM</span>
            <div
                class="button"
                @click="popups.settings = !popups.settings"
            >
                <SexIcon name="material-symbols:tools-wrench-outline-sharp" />
            </div>
        </div>

        <div class="flex items-center gap-1 xs:gap-2">
            <div
                class="button"
                @click="popups.help = !popups.help"
            >
                <SexIcon name="material-symbols:question-mark" />
            </div>
            <div
                v-if="!app.isWeb"
                class="button"
                @click="minimize"
            >
                <SexIcon name="material-symbols:minimize" />
            </div>
            <div
                v-if="!app.isWeb"
                class="button"
                @click="close"
            >
                <SexIcon name="material-symbols:close" />
            </div>
            <SexLink
                v-if="isWebDesktop"
                class="button"
                :use-style="false"
                link="https://github.com/PikaDude/SexFM-Player/releases/latest"
            >
                <SexIcon name="material-symbols:download-sharp" />
            </SexLink>
            <div
                v-if="isWebMobile && !isInlineFrame && !isFullscreen"
                class="button"
                @click="fullscreen"
            >
                <SexIcon name="material-symbols:fullscreen" />
            </div>
            <div
                v-if="isWebMobile && !isInlineFrame &&isFullscreen"
                class="button"
                @click="fullscreen"
            >
                <SexIcon name="material-symbols:fullscreen-exit" />
            </div>
            <SexLink
                v-if="isWebMobile && isInlineFrame"
                class="button"
                :use-style="false"
                link="https://player.sexfm.live"
            >
                <SexIcon name="material-symbols:open-in-new" />
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
    data() {
        return {
            isFullscreen: false,
        };
    },
    computed: {
        isWebDesktop() {
            return this.app.isWeb && this.$device.isDesktop;
        },
        isWebMobile() {
            return this.app.isWeb && this.$device.isMobileOrTablet;
        },
        isInlineFrame() {
            return window.self != window.top;
        },
    },
    mounted() {
        document.addEventListener('fullscreenchange', this.onFullscreenChange);
    },
    beforeUnmount() {
        document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    },
    methods: {
        async close() {
            await this.autoUpdate.runInstallFunction();
            getCurrentWindow().close();
        },
        minimize() {
            getCurrentWindow().minimize();
        },
        fullscreen() {
            if (document.fullscreenElement) document.exitFullscreen();
            else document.documentElement.requestFullscreen();
        },

        onFullscreenChange() {
            this.isFullscreen = document.fullscreenElement != null;
        },
    },
});
</script>
