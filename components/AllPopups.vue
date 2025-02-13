<template>
    <Transition>
        <PopupLastPlayed
            v-if="popups.lastPlayed"
            class="absolute"
            @close="popups.lastPlayed = false"
        />
    </Transition>
    <Transition>
        <PopupHelp
            v-if="popups.help"
            class="absolute"
            @close="popups.help = false"
        />
    </Transition>
    <Transition>
        <PopupSettings
            v-if="popups.settings"
            class="absolute"

            @close="popups.settings = false"
            @reload-player="reloadPlayer"
        />
    </Transition>
</template>

<script lang="ts">
export default defineComponent({
    emits: ['reloadPlayer'],
    setup() {
        return {
            settings: useSettingsStore(),
            popups: usePopupsStore(),
        };
    },
    data() {
        return {
            windowHeight: '384px',
        };
    },
    mounted() {
        this.windowHeight = `${window.innerHeight}px`;
        window.addEventListener('resize', this.resize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.resize);
    },
    methods: {
        resize() {
            this.windowHeight = `${window.innerHeight}px`;
        },
        reloadPlayer() {
            this.$emit('reloadPlayer');
        },
    },
});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.5s linear; /* linear looks way cooler */
}

.v-enter-from,
.v-leave-to {
  transform: translateY(v-bind(windowHeight));
}
</style>
