<template>
    <PopupBase
        title="Last Played"
        close-message="Tubular."
    >
        <ol class="select-text list-decimal list-inside">
            <li
                v-for="(song, i) in metadata.tracks.slice(1)"
                :key="i"
            >
                {{ song.replace(' - ', ' by ') }}
                <hr v-if="i != metadata.tracks.length - 1">
            </li>
        </ol>
    </PopupBase>
</template>

<script lang="ts">
export default defineComponent({
    setup() {
        return { metadata: useMetadataStore() };
    },
});
</script>
