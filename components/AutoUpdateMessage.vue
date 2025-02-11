<template>
    <div class="text-center">
        <p>
            Version {{ version }}
        </p>
        <p v-if="!web">
            {{ message }}
        </p>
        <a
            v-if="!web && (info?.status == 'error' || info?.status == 'angry')"
            @click="manual"
        >
            Click for the downloads page
        </a>
    </div>
</template>

<script lang="ts">
import { getVersion } from '@tauri-apps/api/app';
import { open } from '@tauri-apps/plugin-shell';
import { object } from 'vue-types';

export default defineComponent({
    props: {
        info: object<AutoUpdateInfo>(),
    },
    data() {
        return {
            version: '???',
            web: false,
        };
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
    async mounted() {
        if ('__TAURI_INTERNALS__' in window) {
            this.version = await getVersion();
        }
        else {
            const runtimeConfig = useRuntimeConfig();
            this.version = `${runtimeConfig.public.appVersion}-web`;
            this.web = true;
        }
    },
    methods: {
        manual() {
            open('https://github.com/PikaDude/SexFM-Player/releases');
        },
    },
});
</script>
