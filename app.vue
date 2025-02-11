<template>
    <!-- Shadow -->
    <div class="flex justify-center items-center h-auto max-h-screen aspect-[284/427] select-none hei">
        <NuxtRouteAnnouncer />
        <AutoUpdate />

        <!-- Window -->
        <div class="flex flex-col drop-shadow-sex sex-border rounded-xl w-[90%] h-[90%] overflow-hidden">
            <Titlebar />

            <!-- Main Content -->
            <div class="relative flex flex-col justify-center items-center bg-sex bg-cover h-full">
                <AllPopups
                    :metadata="metadata"
                />

                <!-- Player -->
                <div class="relative flex flex-col justify-center items-center gap-2 px-4 pt-4 pb-2 w-full h-full">
                    <canvas
                        v-show="settings.visualizer"
                        ref="bars"
                        width="256"
                        height="192"
                        class="bottom-0 absolute flex flex-col opacity-20 w-full pointer-events-none pixelated"
                    />

                    <div class="z-10 flex flex-col justify-center items-center gap-2 sm:gap-4 h-full">
                        <Banner />

                        <Logo class="pb-1 w-4/5" />

                        <div class="flex flex-col gap-1 text-center">
                            <span class="text-lg leading-none select-text">{{ metadata['current-track'].title }}</span>
                            <span class="leading-none select-text">{{ metadata['current-track'].artist }}</span>
                        </div>

                        <PlayButton
                            :paused="paused"
                            :loading="loading"
                            @click="playpause"
                        />

                        <VolumeControl
                            @toggle-mute="toggleMute"
                            @volume-change="onVolumeChange"
                        />

                        <div
                            class="flex justify-center items-center gap-2 px-[10px!important] border button"
                            @click="popups.lastPlayed = true"
                        >
                            <Icon
                                name="material-symbols:menu"
                            />
                            <span>Last Played</span>
                        </div>
                    </div>
                </div>

                <SexLink
                    class="w-full"
                    link="https://patreon.com/SexFMLive"
                >
                    <img
                        class="w-full pixelated"
                        src="~/assets/player_banner.jpg"
                    >
                </SexLink>
            </div>

            <audio
                ref="player"
                hidden
                :src="src"
                crossorigin="anonymous"
                preload="none"
                @play="play"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { useAVBars } from 'vue-audio-visual';

export default defineComponent({
    setup() {
        useHead({
            title: 'SexFM',
            link: [
                { rel: 'preload', href: '/Jersey10.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
            ],
        });

        return {
            app: useAppStore(),
            settings: useSettingsStore(),
            popups: usePopupsStore(),
            autoUpdateInfo: useAutoUpdateStore(),
        };
    },
    data() {
        return {
            paused: true,
            loading: false,
            secondPlay: false,

            metadataRefreshTimeout: null as null | NodeJS.Timeout,
            metadata: {
                'current-track': {
                    title: 'Unknown Song',
                    artist: 'Unknown Artist',
                },
                'last-played': [],
            } as APIData,
        };
    },
    computed: {
        src() {
            switch (this.settings.audioFormat) {
                case 'AAC':
                    return 'https://streaming.live365.com/a25222_2';
                default:
                case 'MP3':
                    return 'https://streaming.live365.com/a25222';
            }
        },
        bars() {
            return this.$refs.bars as HTMLCanvasElement | undefined;
        },
        player() {
            return this.$refs.player as HTMLAudioElement | undefined;
        },
    },
    async mounted() {
        document.addEventListener('contextmenu', e => e.preventDefault());

        await this.app.init();
        this.settings.load();

        this.initializePlayer(true);

        requestAnimationFrame(this.onFrame);
        this.onMetadataRefresh();
        this.setMetadata();
    },
    beforeUnmount() {
        // TODO lol simply never unload the page (this should never happen at the moment)
    },
    methods: {
        playpause() {
            const player = this.player;
            if (player) {
                if (player.paused) {
                    this.play();
                }
                else {
                    player.pause();
                }
            }
        },
        toggleMute() {
            if (this.player) this.player.muted = this.settings.muted;
        },
        initializePlayer(firstRun: boolean) {
            const player = this.player;
            if (!player) return;
            player.volume = this.settings.volume;
            player.muted = this.settings.muted;

            if (firstRun) useAVBars(player, this.bars, { src: this.src, canvHeight: 192, canvWidth: 256, barColor: ['#00CCFF', '#00CCFF', '#0066FF'] });
        },
        setMetadata() {
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
        play() {
            // do NOT call player.play() directly!
            // this exists to catch if the user uses OS media controls to play the player
            // we wanna interrupt that and reload the stream before playing
            // we need to do this on play rather than pause, because if we reload on pause, then the OS media controls will disappear
            if (this.secondPlay) {
                this.secondPlay = false;
                return;
            }

            this.secondPlay = true;
            this.player?.load();
            this.initializePlayer(false);
            this.player?.play();
        },

        onFrame() {
            // the best way to catch it if the user pauses the player using media controls or if the stream cuts out
            const player = this.player;
            if (player) {
                this.paused = player.paused;
                this.loading = player.readyState < 3;
            }

            requestAnimationFrame(this.onFrame);

            if (this.metadataRefreshTimeout == null) this.metadataRefreshTimeout = setTimeout(this.onMetadataRefresh, 5000);
        },
        onVolumeChange() {
            if (this.player) {
                this.player.volume = this.settings.volume;
                this.player.muted = false;
                this.settings.muted = false;
            }
        },
        async onMetadataRefresh() {
            this.metadataRefreshTimeout = null;
            const response = await fetch('https://api.live365.com/station/a25222');
            const newData = await response.json() as APIData;
            // what's the worst that could happen if we get unexpected data
            if (this.metadata['last-played'][0]?.title != newData['current-track']?.title && newData['current-track']?.title != null) this.metadata = newData;

            if (this.metadataRefreshTimeout) {
                clearTimeout(this.metadataRefreshTimeout);
            }
            this.metadataRefreshTimeout = setTimeout(this.onMetadataRefresh, 5000);
            this.setMetadata();
        },
    },
});
</script>
