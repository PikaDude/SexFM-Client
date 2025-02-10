<template>
    <PopupBase
        title="Settings"
        close-message="Okay Sick"
    >
        <p class="text-center">
            v{{ version }}
        </p>
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
    </PopupBase>
</template>

<script lang="ts">
import { getVersion } from '@tauri-apps/api/app';
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
