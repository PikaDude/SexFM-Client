import { defineStore } from 'pinia';

export const useAutoUpdateStore = defineStore('autoUpdateStore', {
    state: () => ({
        status: 'nothing' as AutoUpdateStatus,
        downloaded: 0,
        contentLength: undefined as number | undefined,
        installFunction: undefined as (() => Promise<void>) | undefined,
    }),
    actions: {
        async runInstallFunction() {
            if (this.installFunction) await this.installFunction();
        },
    },
});
