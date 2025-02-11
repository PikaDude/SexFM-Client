import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settingsStore', {
    state: () => ({
        volume: 0.5,
        muted: false,
        visualizer: true,
        audioFormat: 'MP3' as AudioFormat,
    }),
    getters: {
        volumePercentage: state => `${Math.floor(state.volume * 100)}%`,
    },
    actions: {
        load() {
            this.volume = Number(localStorage.getItem('volume') || '0.5');
            this.visualizer = localStorage.getItem('visualizer') != 'false';
            this.audioFormat = (localStorage.getItem('audioFormat') || 'MP3') as AudioFormat;
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
    },
});
