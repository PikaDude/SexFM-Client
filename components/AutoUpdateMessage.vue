<template>
    <div class="text-center">
        <p>
            Version {{ app.version }}
        </p>
        <p v-if="!app.isWeb">
            {{ message }}
        </p>
        <SexLink
            v-if="!app.isWeb && (info?.status == 'error' || info?.status == 'angry')"
            link="'https://github.com/PikaDude/SexFM-Player/releases'"
            text="Click for the downloads page"
        />
    </div>
</template>

<script lang="ts">
import { object } from 'vue-types';

export default defineComponent({
    props: {
        info: object<AutoUpdateInfo>(),
    },
    setup() {
        return { app: useAppStore() };
    },
    computed: {
        message() {
            switch (this.info?.status) {
                case 'downloading':
                    return `Downloading update ${this.info.downloaded}/${this.info.contentLength} bytes.`;
                case 'error':
                    return 'Failed to check for updates. Please check manually.';
                case 'angry':
                    return 'Update failing to install? Please download it manually.';
                case 'ready':
                    return 'Update ready to install. Restart whenever you\'re ready.';
                default:
                case 'nothing':
                    return 'No updates available.';
            }
        },
    },
});
</script>
