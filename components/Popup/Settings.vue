<template>
    <PopupBase
        title="Settings"
        close-message="Okay Sick"
    >
        <div class="text-center">
            <p>
                Version {{ version }}
            </p>
            <a @click="manual">
                Click to check for updates
            </a>
        </div>
        <br>
        <!-- I LOVE DISPLAY:FLEX I USE IT EVERYWHERE CAN RECOMMEND -->
        <div class="flex items-center gap-2">
            <label for="visualizer">Music Visualizer:</label>
            <input
                name="visualizer"
                :checked="visualizer"
                type="checkbox"
                @change="onVisualizerChange"
            >
        </div>
        <label for="audio-format">Audio Format:</label>
        <select
            ref="audioFormat"
            name="audio-format"
            :value="audioFormat"
            @change="onAudioFormatChange"
        >
            <option value="MP3">
                MP3 (less bandwidth)
            </option>
            <option value="AAC">
                AAC (better quality)
            </option>
        </select>
        <br>
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
import { bool, string } from 'vue-types';

export default defineComponent({
    props: {
        visualizer: bool().isRequired,
        audioFormat: string<AudioFormat>().isRequired,
    },
    emits: ['visualizerChanged', 'audioFormatChanged'],
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

        getAudioFormatEl() {
            return this.$refs.audioFormat as HTMLSelectElement;
        },

        onVisualizerChange() {
            this.$emit('visualizerChanged', !this.visualizer);
        },
        onAudioFormatChange() {
            this.$emit('audioFormatChanged', this.getAudioFormatEl().value);
        },
    },
});
</script>
