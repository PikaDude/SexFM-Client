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
        <hr>
        <div class="flex items-center gap-2">
            <label for="discord">Set Discord Status:</label>
            <input
                name="discord"
                :checked="!app.isWeb && settings.discordRPC"
                :disabled="app.isWeb"
                type="checkbox"
                @change="toggleDiscordRPC"
            >
        </div>
        <span v-if="app.isWeb">Only available in the <SexLink link="https://github.com/PikaDude/SexFM-Player/releases/latest">Desktop app</SexLink>.</span>
        <span
            v-else-if="discordChanged"
            class="text-red-600 leading-none"
        >NOTE: It may take a minute or a restart to turn this off. This will be fixed soon, sorry.</span>
        <hr>
        <div class="flex flex-wrap items-center">
            <label
                for="audio-format"
                class="mr-1"
            >Audio Format:</label>
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
        return { app: useAppStore(), settings: useSettingsStore() };
    },
    data() {
        return {
            discordChanged: false,
        };
    },
    methods: {
        onAudioFormatChange(event: Event) {
            const value = (event.target as HTMLSelectElement).value as AudioFormat;
            this.settings.setAudioFormat(value);
            this.$emit('reloadPlayer');
        },
        toggleDiscordRPC() {
            this.settings.toggleDiscordRPC();
            this.discordChanged = true;
        },
    },
});
</script>
