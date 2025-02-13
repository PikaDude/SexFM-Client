<template>
    <PopupBase
        title="Last Played"
        close-message="Tubular."
    >
        <ol class="select-text list-decimal list-inside">
            <li
                v-for="(song, i) in metadata.metadata['last-played']"
                :key="i"
            >
                {{ song.title }} by {{ song.artist }}
                <hr v-if="i != metadata.metadata['last-played'].length - 1">
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
