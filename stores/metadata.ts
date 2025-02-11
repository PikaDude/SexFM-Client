import { defineStore } from 'pinia';

export const useMetadataStore = defineStore('metadataStore', {
    state: () => ({
        metadata: {
            'current-track': {
                title: 'Unknown Song',
                artist: 'Unknown Artist',
            },
            'last-played': [],
        } as APIData,
        refreshTimeout: null as null | NodeJS.Timeout,
    }),
    actions: {
        async fetch() {
            this.refreshTimeout = null;
            const response = await fetch('https://api.live365.com/station/a25222');
            const newData = await response.json() as APIData;
            // what's the worst that could happen if we get unexpected data
            if (this.metadata['last-played'][0]?.title != newData['current-track']?.title && newData['current-track']?.title != null) this.metadata = newData;

            if (this.refreshTimeout) {
                clearTimeout(this.refreshTimeout);
            }
            this.refreshTimeout = setTimeout(this.fetch, 5000);
            this.setMediaSession();
        },
        setMediaSession() {
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: this.metadata['current-track'].title,
                    artist: this.metadata['current-track'].artist,
                    artwork: [
                        {
                            src: '/128x128.png',
                            sizes: '128x128',
                            type: 'image/png',
                        },
                        {
                            src: '/256x256.png',
                            sizes: '256x256',
                            type: 'image/png',
                        },
                    ],
                });
            }
        },
        checkRefreshTimeout() {
            if (this.refreshTimeout == null) this.refreshTimeout = setTimeout(this.fetch, 5000);
        },
    },
});
