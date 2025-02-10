<template>
    <div class="flex justify-center items-center h-screen select-none">
        <NuxtRouteAnnouncer />

        <div class="box-border flex flex-col drop-shadow-sex border-4 border-sexfm-400 border-ridge rounded-xl w-[90%] h-[90%] overflow-hidden">
            <div
                class="flex justify-between items-center bg-sexfm sex-shadow p-2"
                data-tauri-drag-region
            >
                <span class="text-white text-lg">SexFM</span>
                <div class="flex items-center gap-1">
                    <div
                        class="border button"
                        @click="help = true"
                    >
                        <Icon name="material-symbols:question-mark" />
                    </div>
                    <div
                        class="border button"
                        @click="minimize"
                    >
                        <Icon name="material-symbols:minimize" />
                    </div>
                    <div
                        class="border button"
                        @click="close"
                    >
                        <Icon name="material-symbols:close" />
                    </div>
                </div>
            </div>

            <div class="relative flex flex-col justify-center items-center gap-2 bg-sex bg-cover p-4 h-full">
                <canvas
                    v-show="visualizer"
                    ref="bars"
                    width="256"
                    height="384"
                    class="bottom-0 absolute opacity-20 pointer-events-none"
                />

                <Transition>
                    <LastPlayed
                        v-if="lastPlayed"
                        :songs="metadata['last-played']"
                        class="absolute"
                        @close="lastPlayed = false"
                    />
                </Transition>
                <Transition>
                    <Help
                        v-if="help"
                        class="absolute"
                        :visualizer="visualizer"
                        @close="help = false"
                        @visualizer-changed="onVisualizerChanged"
                    />
                </Transition>

                <div class="z-10 flex flex-col justify-center items-center gap-2 h-full">
                    <img
                        src="~/assets/logo.png"
                        class="w-4/5 logo"
                    >

                    <div class="flex flex-col text-center">
                        <span class="text-lg select-text">{{ metadata['current-track'].title }}</span>
                        <span class="select-text">{{ metadata['current-track'].artist }}</span>
                    </div>

                    <div
                        class="border-2 button"
                        @click="playpause"
                    >
                        <Icon
                            v-show="paused"
                            name="material-symbols:play-arrow"
                            size="64"
                        />
                        <Icon
                            v-show="!paused"
                            name="material-symbols:pause"
                            size="64"
                        />
                    </div>

                    <div class="flex justify-center items-center gap-1">
                        <div
                            class="flex justify-center items-center border button"
                            @click="toggleMute"
                        >
                            <Icon
                                v-show="volume > 0.5 && !muted"
                                name="material-symbols:volume-up"
                            />
                            <Icon
                                v-show="volume <= 0.5 && volume != 0 && !muted"
                                name="material-symbols:volume-down"
                            />
                            <Icon
                                v-show="volume == 0 || muted"
                                name="material-symbols:volume-off"
                            />
                        </div>
                        <div class="relative">
                            <span class="left-1 absolute">{{ Math.floor(volume * 100) }}%</span>
                            <input
                                v-model="volume"
                                type="range"
                                max="1"
                                min="0"
                                step="0.01"
                                @input="onVolumeChange"
                                @change="onVolumeSet"
                            >
                        </div>
                    </div>

                    <div
                        class="flex justify-center items-center gap-2 px-[10px!important] border button"
                        @click="lastPlayed = true"
                    >
                        <Icon
                            name="material-symbols:menu"
                        />
                        <span>Last Played</span>
                    </div>
                </div>
            </div>

            <audio
                ref="player"
                hidden
                :src="src"
                crossorigin="anonymous"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useAVBars } from 'vue-audio-visual';

export default defineComponent({
    setup() {
        useHead({
            title: 'SexFM',
            link: [
                { rel: 'preload', href: '/Jersey10.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
            ],
        });
    },
    data() {
        return {
            src: 'https://streaming.live365.com/a25222',

            paused: true,
            volume: 0.5,
            muted: false,
            visualizer: true,

            metadataRefreshTimeout: null as null | NodeJS.Timeout,
            metadata: {
                'current-track': {
                    title: 'Unknown Song',
                    artist: 'Unknown Artist',
                },
                'last-played': [],
            } as APIData,

            lastPlayed: false,
            help: false,
        };
    },
    computed: {
        bars() {
            return this.$refs.bars as HTMLCanvasElement | undefined;
        },
        player() {
            return this.$refs.player as HTMLAudioElement | undefined;
        },
    },
    mounted() {
        document.addEventListener('contextmenu', e => e.preventDefault());

        this.volume = Number(localStorage.getItem('volume') || '0.5');
        this.visualizer = localStorage.getItem('visualizer') != 'false';

        requestAnimationFrame(this.onFrame);
        this.onVolumeChange();
        this.onMetadataRefresh();

        useAVBars(this.player, this.bars, { src: this.src, canvHeight: 256, canvWidth: 384, barColor: ['#00CCFF', '#00CCFF', '#0066FF'] });
    },
    beforeUnmount() {
        // TODO lol simply never unload the page (this should never happen at the moment)
    },
    methods: {
        close() {
            getCurrentWindow().close();
        },
        minimize() {
            getCurrentWindow().minimize();
        },

        playpause() {
            const player = this.player;
            if (player) {
                if (player.paused) player.play();
                else player.pause();
            }
        },
        toggleMute() {
            const muted = this.muted;
            this.muted = !muted;
            if (this.player) this.player.muted = !muted;
        },

        onFrame() {
            // the best way to catch it if the user pauses the player using media controls or if the stream cuts out
            const player = this.player;
            if (player) this.paused = player.paused;

            requestAnimationFrame(this.onFrame);

            if (this.metadataRefreshTimeout == null) this.metadataRefreshTimeout = setTimeout(this.onMetadataRefresh, 5000);
        },
        onVolumeChange() {
            if (this.player) {
                this.player.volume = this.volume;
                this.player.muted = false;
                this.muted = false;
            }
        },
        onVolumeSet() {
            localStorage.setItem('volume', this.volume.toString());
        },
        onVisualizerChanged(value: boolean) {
            this.visualizer = value;
            localStorage.setItem('visualizer', value.toString());
        },
        async onMetadataRefresh() {
            this.metadataRefreshTimeout = null;
            const response = await fetch('https://api.live365.com/station/a25222');
            this.metadata = await response.json() as APIData; // what's the worst that could happen if we get unexpected data

            if (this.metadataRefreshTimeout) {
                clearTimeout(this.metadataRefreshTimeout);
            }
            this.metadataRefreshTimeout = setTimeout(this.onMetadataRefresh, 5000);

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
</script>

<style scoped>
.logo {
    filter: drop-shadow(2px 2px 2px #3366CC);
    -webkit-filter: drop-shadow(2px 2px 2px #3366CC);
}

.sex-shadow {
    text-shadow: 4px 4px 4px blue;
    -webkit-text-stroke-width: .1px;
    -webkit-text-stroke-color: #00CCFF;
}

/*Safari and Chrome*/
input[type="range"] {
    @apply bg-gray-300 overflow-hidden appearance-none;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

input[type="range"]::-webkit-slider-runnable-track {
    @apply bg-gray-300;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

input[type="range"]::-webkit-slider-thumb {
    @apply bg-sexfm-500 w-2 h-8 appearance-none cursor-pointer;
    box-shadow: -100px 0 0 100px #02C5F7;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
