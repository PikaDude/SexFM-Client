<template>
    <div class="flex flex-col gap-1 text-center">
        <span class="text-lg xs:text-3xl leading-none select-text">{{ metadata.current.title }}</span>
        <span class="xs:text-2xl leading-none select-text">{{ metadata.current.artist }}</span>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    setup() {
        return { metadata: useMetadataStore() };
    },
});
</script>
