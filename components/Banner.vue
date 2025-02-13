<template>
    <div class="top-0 absolute w-full text-center xs:text-2xl">
        <p
            v-if="autoUpdateInfo?.status == 'ready'"
            class="bg-red-300"
        >
            An update will be installed once you exit
        </p>
        <p
            v-if="autoUpdateInfo?.status == 'angry'"
            class="bg-red-300 cursor-pointer"
            @click="autoUpdateInfo.runInstallFunction"
        >
            Click here to install the update
        </p>
    </div>
</template>

<script lang="ts">
export default defineComponent({
    setup() {
        return { autoUpdateInfo: useAutoUpdateStore() };
    },
});
</script>
