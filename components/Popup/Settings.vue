<template>
    <PopupBase
        title="Settings"
        close-message="Fly."
    >
        <AutoUpdateMessage />
        <br>
        <!-- I LOVE DISPLAY:FLEX I USE IT EVERYWHERE CAN RECOMMEND -->
        <div class="flex items-center gap-2">
            <label for="visualizer">Music Visualizer:</label>
            <input
                name="visualizer"
                :checked="settings.visualizer"
                type="checkbox"
                @change="settings.toggleVisualizer"
            >
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <label for="audio-format">Audio Format:</label>
            <select
                ref="audioFormat"
                name="audio-format"
                :value="settings.audioFormat"
                @change="onAudioFormatChange"
            >
                <option value="MP3">
                    MP3 (less bandwidth)
                </option>
                <option value="AAC">
                    AAC (better quality)
                </option>
            </select>
        </div>
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
export default defineComponent({
    emits: ['reloadPlayer'],
    setup() {
        return { settings: useSettingsStore() };
    },
    methods: {
        onAudioFormatChange(event: Event) {
            const value = (event.target as HTMLSelectElement).value as AudioFormat;
            this.settings.setAudioFormat(value);
            this.$emit('reloadPlayer');
        },
    },
});
</script>
