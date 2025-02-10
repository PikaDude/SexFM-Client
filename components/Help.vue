<template>
    <div
        class="z-20 flex justify-center items-center backdrop-blur-md w-full h-full"
    >
        <div
            class="bg-white p-4 rounded-lg w-[90%] leading-none"
        >
            <p class="text-xl text-center">
                SexFM Desktop Player
            </p>
            <p class="text-center">
                v{{ version }}
            </p>
            <br>
            <p>SexFM's official website can be found at <a @click="sex">sexfm.live</a>. Find all their links there. Click on all of them.</p>
            <br>
            <p>
                This is an <u>UNOFFICIAL</u> SexFM desktop player made by <a
                    title="i don't really use social media anymore and don't have anything else to link"
                    @click="pikadude"
                >PikaDude</a>.
            </p>
            <p><a @click="github">(Source Code)</a></p>
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

            <span
                class="mt-4 border button"
                @click="close"
            >Okay Sick</span>
        </div>
    </div>
</template>

<script lang="ts">
import { open } from '@tauri-apps/plugin-shell';
import { getVersion } from '@tauri-apps/api/app';
import { bool } from 'vue-types';

export default defineComponent({
    props: {
        visualizer: bool().isRequired,
    },
    emits: ['close', 'visualizerChanged'],
    data() {
        return {
            version: '???',
        };
    },
    async mounted() {
        this.version = await getVersion();
    },
    methods: {
        close() {
            this.$emit('close');
        },
        github() {
            open('https://github.com/PikaDude/SexFM-Player');
        },
        pikadude() {
            open('https://bsky.app/profile/pikadude.bsky.social');
        },
        sex() {
            open('https://sexfm.live');
        },

        onVisualizerChange() {
            this.$emit('visualizerChanged', !this.visualizer);
        },
    },
});
</script>

<style scoped>
a {
    @apply text-sexfm-300 underline cursor-pointer;
}
</style>
