<template>
    <PopupBase
        title="Settings"
        close-message="Okay Sick"
    >
        <p class="text-center">
            Version {{ version }}
        </p>
        <a
            class="text-center"
            @click="manual"
        >
            Click to check for updates
        </a>
        <br>
        <!-- I LOVE DISPLAY:FLEX I USE IT EVERYWHERE CAN RECOMMEND -->
        <div class="flex items-center gap-2">
            <input
                name="visualizer"
                :checked="visualizer"
                type="checkbox"
                @change="onVisualizerChange"
            >
            <label for="visualizer">Music Visualizer</label>
        </div>
        <br>
        <div class="flex justify-center">
            <img
                src="~/assets/rotate.gif"
                class="pixelated"
            >
        </div>
    </PopupBase>
</template>

<script lang="ts">
import { getVersion } from '@tauri-apps/api/app';
import { open } from '@tauri-apps/plugin-shell';
import { bool } from 'vue-types';

export default defineComponent({
    props: {
        visualizer: bool().isRequired,
    },
    emits: ['visualizerChanged'],
    data() {
        return {
            version: '???',
        };
    },
    async mounted() {
        this.version = await getVersion();
    },
    methods: {
        manual() {
            open('https://github.com/PikaDude/SexFM-Player/releases');
        },

        onVisualizerChange() {
            this.$emit('visualizerChanged', !this.visualizer);
        },
    },
});
</script>
