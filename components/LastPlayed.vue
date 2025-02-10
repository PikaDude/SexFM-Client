<template>
    <div
        class="z-20 flex justify-center items-center backdrop-blur-md w-full h-full"
    >
        <div
            class="bg-white p-4 rounded-lg w-[90%] max-h-[90%] overflow-y-auto"
        >
            <p class="text-xl text-center leading-none">
                Last Played
            </p>

            <ol class="select-text list-decimal list-inside">
                <li
                    v-for="(song, i) in songs"
                    :key="i"
                >
                    {{ song.title }} by {{ song.artist }}
                </li>
            </ol>

            <span
                class="mt-4 border button"
                @click="close"
            >Okay Cool</span>
        </div>
    </div>
</template>

<script lang="ts">
import { object } from 'vue-types';

export default defineComponent({
    props: {
        songs: object<APIData['last-played']>().isRequired,
    },
    emits: ['close'],
    methods: {
        close() {
            this.$emit('close');
        },
    },
});
</script>
