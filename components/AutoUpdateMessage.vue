<template>
    <div class="text-center">
        <p>
            Version {{ version }}
        </p>
        <p>{{ message }}</p>
        <a
            v-if="info?.status == 'error'"
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
        };
    },
    computed: {
        message() {
            switch (this.info?.status) {
                case 'downloading':
                    return `Downloading update ${this.info.downloaded}/${this.info.contentLength} bytes.`;
                case 'error':
                    return 'Failed to check for updates. Please check manually.';
                case 'installing':
                    return 'Installing update...';
                case 'ready':
                    return 'Update ready to install. Restart whenever you\'re ready.';
                default:
                case 'nothing':
                    return 'No updates available.';
            }
        },
    },
    async mounted() {
        this.version = await getVersion();
    },
    methods: {
        manual() {
            open('https://github.com/PikaDude/SexFM-Player/releases');
        },
    },
});
</script>
