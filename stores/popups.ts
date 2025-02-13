import { defineStore } from 'pinia';

export const usePopupsStore = defineStore('popupsStore', {
    state: () => ({
        help: false,
        lastPlayed: false,
        settings: false,
    }),
});
