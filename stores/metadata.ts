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
        refreshTimeout: undefined as undefined | NodeJS.Timeout,
    }),
    actions: {
        async fetch() {
            clearTimeout(this.refreshTimeout);
            this.refreshTimeout = undefined;

            // insane amounts of error handling just in case. this api loves being weird
            try {
                const response = await fetch('https://api.live365.com/station/a25222').catch(this.queueRefresh);
                if (!response) {
                    this.queueRefresh('empty response');
                    return;
                }
                const newData = await response.json().catch(this.queueRefresh) as (APIData | undefined);
                if (!newData) {
                    this.queueRefresh('empty json');
                    return;
                }

                // what's the worst that could happen if we get unexpected data
                if (this.metadata['last-played'][0]?.title != newData['current-track']?.title && newData['current-track']?.title != null) this.metadata = newData;
            }
            catch (e) {
                this.queueRefresh(e);
                return;
            }

            this.queueRefresh();
            this.setMediaSession();
        },
        queueRefresh(error?: Error | unknown) {
            if (error) console.error(error);
            if (this.refreshTimeout == undefined) this.refreshTimeout = setTimeout(this.fetch, 5000);
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
    },
});
