import { defineStore } from 'pinia';

export const useMetadataStore = defineStore('metadataStore', {
    state: () => ({
        tracks: [] as { artist: string, title: string }[],
        eventSource: null as EventSource | null,
        justOpened: true,

        delay: 0 as number,

        addTimeouts: [] as NodeJS.Timeout[],
        openTimeout: null as NodeJS.Timeout | null,
        reconnectTimeout: null as NodeJS.Timeout | null,
    }),
    getters: {
        current: state => state.tracks[0] || { title: 'Unknown Song', artist: 'Unknown Artist' },
    },
    actions: {
        initialize() {
            this.justOpened = true;
            this.tracks = [];

            this.eventSource = new EventSource('https://a.erisly.moe/radio');
            this.eventSource.addEventListener('error', this.onError);
            this.eventSource.addEventListener('message', this.onMessage);
            this.eventSource.addEventListener('open', this.onOpen);
        },
        unmount() {
            if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
            if (this.openTimeout) clearTimeout(this.openTimeout);
            for (const t of this.addTimeouts) clearTimeout(t);
            this.addTimeouts = [];

            this.eventSource?.removeEventListener('error', this.onError);
            this.eventSource?.removeEventListener('message', this.onMessage);
            this.eventSource?.removeEventListener('open', this.onOpen);
            this.eventSource?.close();
        },
        onError() {
            if (this.eventSource?.readyState == 2) this.reconnectTimeout = setTimeout(() => this.initialize(), 5000);
        },
        onMessage(message: MessageEvent<string>) {
            const push = () => {
                const [artist, title] = message.data.split(' - ');
                this.tracks.unshift({ artist, title });
                if (this.tracks.length > 6) this.tracks.pop();
                if (!this.justOpened) this.setMediaSession();
            };
            if (this.justOpened) push();
            else this.addTimeouts.push(setTimeout(push, (1000 * 30) + this.delay));
        },
        onOpen() {
            this.openTimeout = setTimeout(() => {
                this.justOpened = false;
                this.setMediaSession();
            }, 3000);
        },
        setMediaSession() {
            if ('mediaSession' in navigator) {
                const { title, artist } = this.current;
                navigator.mediaSession.metadata = new MediaMetadata({
                    title,
                    artist,
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

            if (typeof useDiscordRPCStore != 'undefined') {
                const discordRPC = useDiscordRPCStore();
                discordRPC.update();
            }
        },
    },
});
