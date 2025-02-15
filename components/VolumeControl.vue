<template>
    <div class="flex justify-center items-center gap-1">
        <div
            class="flex justify-center items-center button"
            :class="{ grayscale: settings.muted }"
            @click="toggleMute"
        >
            <SexIcon
                v-show="settings.volume > 0.5 && !settings.muted"
                name="material-symbols:volume-up"
            />
            <SexIcon
                v-show="settings.volume <= 0.5 && settings.volume != 0 && !settings.muted"
                name="material-symbols:volume-down"
            />
            <SexIcon
                v-show="settings.volume == 0 || settings.muted"
                name="material-symbols:volume-off"
            />
        </div>
        <div class="relative">
            <span class="left-1 absolute xs:text-xl">{{ settings.volumePercentage }}</span>
            <input
                v-model="settings.volume"
                type="range"
                max="1"
                min="0"
                step="0.01"
                @input="onVolumeChange"
                @change="settings.setVolume"
            >
        </div>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    emits: ['toggleMute', 'volumeChange'],
    setup() {
        return { settings: useSettingsStore() };
    },
    methods: {
        toggleMute() {
            this.settings.muted = !this.settings.muted;
            this.$emit('toggleMute');
        },
        onVolumeChange() {
            this.$emit('volumeChange');
        },
    },
});
</script>

<style scoped>
input[type="range"] {
    @apply bg-gray-300 w-32 xs:w-40 h-8 xs:h-10 overflow-hidden appearance-none;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

input[type="range"]::-webkit-slider-runnable-track {
    @apply bg-gray-300;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

input[type="range"]::-webkit-slider-thumb {
    @apply bg-sexfm-500 w-2 xs:w-3 h-8 xs:h-10 appearance-none cursor-pointer;
    box-shadow: -100px 0 0 100px #02C5F7;
}

input[type="range"]::-moz-range-thumb {
    @apply bg-sexfm-500 w-2 xs:w-3 h-8 xs:h-10 appearance-none cursor-pointer;
    box-shadow: -100px 0 0 100px #02C5F7;
}
</style>
