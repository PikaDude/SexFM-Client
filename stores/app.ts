import { defineStore } from 'pinia';
import { getVersion } from '@tauri-apps/api/app';

// not that kind of app store :trollface:
export const useAppStore = defineStore('appStore', {
    state: () => ({
        version: '???',
        isWeb: false,
    }),
    actions: {
        async init() {
            this.isWeb = this.isWebFunc();
            if (!this.isWeb) {
                console.log('Running in Tauri mode');
                this.version = await getVersion();
            }
            else {
                console.log('Running in browser mode');
                const runtimeConfig = useRuntimeConfig();
                this.version = `${runtimeConfig.public.appVersion}-web`;
            }
        },
        isWebFunc() {
            return !('__TAURI_INTERNALS__' in window);
        },
    },
});
