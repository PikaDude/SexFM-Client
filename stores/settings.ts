import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settingsStore', {
    state: () => ({
        volume: 0.5,
        muted: false,
        visualizer: true,
        audioFormat: 'MP3' as AudioFormat,
        discordRPC: true,
    }),
    getters: {
        volumePercentage: state => `${Math.floor(state.volume * 100)}%`,
    },
    actions: {
        load() {
            this.volume = Number(localStorage.getItem('volume') || '0.5');
            this.visualizer = localStorage.getItem('visualizer') != 'false';
            this.audioFormat = (localStorage.getItem('audioFormat') || 'MP3') as AudioFormat;
            this.discordRPC = localStorage.getItem('discordRPC') != 'false';
        },

        toggleVisualizer() {
            const value = !this.visualizer;
            this.visualizer = value;
            localStorage.setItem('visualizer', value.toString());
        },
        setAudioFormat(value: AudioFormat) {
            this.audioFormat = value;
            localStorage.setItem('audioFormat', value);
        },
        setVolume() {
            localStorage.setItem('volume', this.volume.toString());
        },
        async toggleDiscordRPC() {
            const value = !this.discordRPC;
            this.discordRPC = value;
            localStorage.setItem('discordRPC', value.toString());

            if (typeof useDiscordRPCStore != 'undefined') {
                const discordRPC = useDiscordRPCStore();
                if (value) {
                    await discordRPC.initialize();
                    discordRPC.update();
                }
                else discordRPC.destroy();
            }
        },
    },
});
