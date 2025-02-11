<template>
    <div class="flex justify-center items-center h-screen select-none">
        <NuxtRouteAnnouncer />
        <AutoUpdate />

        <div class="flex flex-col drop-shadow-sex sex-border rounded-xl w-[90%] h-[90%] overflow-hidden">
            <div
                class="flex justify-between items-center bg-sexfm sex-shadow p-2"
                data-tauri-drag-region
            >
                <div class="flex items-center gap-1">
                    <span
                        data-tauri-drag-region
                        class="mr-1 text-white text-lg"
                    >SexFM</span>
                    <div
                        class="border button"
                        @click="popups.settings = !popups.settings"
                    >
                        <Icon name="material-symbols:tools-wrench-outline-sharp" />
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <div
                        class="border button"
                        @click="popups.help = !popups.help"
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

            <div class="relative flex flex-col justify-center items-center bg-sex bg-cover h-full">
                <Transition>
                    <PopupLastPlayed
                        v-if="popups.lastPlayed"
                        :songs="metadata['last-played']"
                        class="absolute"
                        @close="popups.lastPlayed = false"
                    />
                </Transition>
                <Transition>
                    <PopupHelp
                        v-if="popups.help"
                        class="absolute"
                        :auto-update-info="autoUpdateInfo"
                        @close="popups.help = false"
                    />
                </Transition>
                <Transition>
                    <PopupSettings
                        v-if="popups.settings"
                        class="absolute"

                        :auto-update-info="autoUpdateInfo"
                        :visualizer="settings.visualizer"
                        :audio-format="settings.audioFormat"

                        @close="popups.settings = false"
                        @reload-player="reloadPlayer"
                    />
                </Transition>

                <div class="relative flex flex-col justify-center items-center gap-2 px-4 pt-4 pb-2 h-full">
                    <canvas
                        v-show="settings.visualizer"
                        ref="bars"
                        :key="audioKey"
                        width="256"
                        height="192"
                        class="bottom-0 absolute flex flex-col opacity-20 w-full pointer-events-none"
                    />

                    <div class="z-10 flex flex-col justify-center items-center gap-2 h-full">
                        <p
                            v-if="autoUpdateInfo?.status == 'ready'"
                            class="top-0 absolute bg-red-300 w-full text-center"
                        >
                            An update will be installed once you exit
                        </p>
                        <p
                            v-if="autoUpdateInfo?.status == 'angry'"
                            class="top-0 absolute bg-red-300 w-full text-center cursor-pointer"
                            @click="update"
                        >
                            Click here to install the update
                        </p>

                        <img
                            src="~/assets/logo.webp"
                            class="pb-1 w-4/5 logo"
                        >

                        <div class="flex flex-col gap-1 text-center">
                            <span class="text-lg leading-none select-text">{{ metadata['current-track'].title }}</span>
                            <span class="leading-none select-text">{{ metadata['current-track'].artist }}</span>
                        </div>

                        <div
                            class="border-2 button"
                            :style="{ cursor: (!paused && loading) ? 'wait' : 'pointer' }"
                            @click="playpause"
                        >
                            <Icon
                                v-show="paused"
                                name="material-symbols:play-arrow"
                                size="64"
                            />
                            <Icon
                                v-show="!paused && !loading"
                                name="material-symbols:pause"
                                size="64"
                            />
                            <Icon
                                v-show="!paused && loading"
                                name="eos-icons:hourglass"
                                size="64"
                            />
                        </div>

                        <div class="flex justify-center items-center gap-1">
                            <div
                                class="flex justify-center items-center border button"
                                @click="toggleMute"
                            >
                                <Icon
                                    v-show="settings.volume > 0.5 && !settings.muted"
                                    name="material-symbols:volume-up"
                                />
                                <Icon
                                    v-show="settings.volume <= 0.5 && settings.volume != 0 && !settings.muted"
                                    name="material-symbols:volume-down"
                                />
                                <Icon
                                    v-show="settings.volume == 0 || settings.muted"
                                    name="material-symbols:volume-off"
                                />
                            </div>
                            <div class="relative">
                                <span class="left-1 absolute">{{ settings.volumePercentage }}</span>
                                <input
                                    v-model="settings.volume"
                                    type="range"
                                    max="1"
                                    min="0"
                                    step="0.01"
                                    @input="onVolumeChange"
                                    @change="settings.setVolume"
                                >
                            </div>
                        </div>

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

                <a @click="patreon"><img src="~/assets/player_banner.jpg"></a>
            </div>

            <audio
                ref="player"
                :key="audioKey"
                hidden
                :src="src"
                crossorigin="anonymous"
                preload="none"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/plugin-shell';
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
            settings: useSettingsStore(),
            popups: usePopupsStore(),
            autoUpdateInfo: useAutoUpdateStore(),
        };
    },
    data() {
        return {
            paused: true,
            loading: false,

            metadataRefreshTimeout: null as null | NodeJS.Timeout,
            metadata: {
                'current-track': {
                    title: 'Unknown Song',
                    artist: 'Unknown Artist',
                },
                'last-played': [],
            } as APIData,

            audioKey: new Date().toISOString(),
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
    mounted() {
        document.addEventListener('contextmenu', e => e.preventDefault());

        this.settings.load();

        requestAnimationFrame(this.onFrame);
        this.onVolumeChange();
        this.onMetadataRefresh();
    },
    beforeUnmount() {
        // TODO lol simply never unload the page (this should never happen at the moment)
    },
    methods: {
        async close() {
            await this.update();
            getCurrentWindow().close();
        },
        minimize() {
            getCurrentWindow().minimize();
        },
        async update() {
            if (this.autoUpdateInfo.installFunction) await this.autoUpdateInfo.installFunction();
        },
        patreon() {
            open('https://patreon.com/SexFMLive');
        },

        playpause() {
            const player = this.player;
            if (player) {
                if (player.paused) {
                    this.initializePlayer();
                    player.play();
                }
                else {
                    this.reloadPlayer();
                }
            }
        },
        toggleMute() {
            const muted = this.settings.muted;
            this.settings.muted = !muted;
            if (this.player) this.player.muted = !muted;
        },
        initializePlayer() {
            const player = this.player;
            if (!player) return;
            player.volume = this.settings.volume;
            player.muted = this.settings.muted;

            // every time the user pauses the radio and restarts it, we initialize a new AVBars
            // why? well, in the scenario we don't do this, if the user pauses the radio and restarts it, and we reload the audio source to force a reconnect (instead of the entire audio/canvas element), the audio *doubles* in volume because of AVBars
            // there's no good way to unload or refresh AVBars since it's not at all flexible
            // this somehow doesn't appear to cause a noticeable memory leak on chromium so that's neat i guess
            // i should probably open up a github issue on vue-audio-visual for this but i'm lazy
            useAVBars(player, this.bars, { src: this.src, canvHeight: 192, canvWidth: 256, barColor: ['#00CCFF', '#00CCFF', '#0066FF'] });
        },
        reloadPlayer() {
            this.player?.pause();
            this.audioKey = new Date().toISOString();
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
            if (this.metadata['last-played'][0]?.title != newData['current-track']?.title && this.metadata['current-track']?.title != null) this.metadata = newData;

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
  transition: transform 0.5s linear; /* linear looks way cooler */
}

.v-enter-from,
.v-leave-to {
  transform: translateY(384px);
}
</style>
