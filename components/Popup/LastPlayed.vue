<template>
    <PopupBase
        title="Last Played"
        close-message="Tubular."
    >
        <ol class="select-text list-decimal list-inside">
            <li
                v-for="(song, i) in songs"
                :key="i"
            >
                {{ song.title }} by {{ song.artist }}
                <hr v-if="i != songs.length - 1">
            </li>
        </ol>
    </PopupBase>
</template>

<script lang="ts">
import { object } from 'vue-types';

export default defineComponent({
    props: {
        songs: object<APIData['last-played']>().isRequired,
    },
});
</script>
