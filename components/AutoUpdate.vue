<template>
    <div />
</template>

<script lang="ts">
import { check } from '@tauri-apps/plugin-updater';

export default defineComponent({
    emits: {
        announce(info: AutoUpdateInfo) {
            return info == info; // awesome validation
        },
    },
    data() {
        return {
            info: {
                status: 'nothing' as const,
                downloaded: 0,
                contentLength: undefined,
                message: 'No updates available',
            } as AutoUpdateInfo,
            install: undefined as (() => Promise<void>) | undefined,
        };
    },
    mounted() {
        this.checkForUpdates();

        setInterval(this.checkForUpdates, 1000 * 60 * 10);
    },
    methods: {
        async checkForUpdates() {
            if (!(this.info.status == 'nothing' || this.info.status == 'error')) return;

            const update = await check().catch((e) => {
                console.error(e);
                this.info.status = 'error';
                this.announce();
            }) || null;
            if (!update) {
                localStorage.removeItem('updateReady');
                return;
            }

            console.log(
                `found update ${update.version} from ${update.date} with notes ${update.body}`,
            );
            this.announce();

            this.info.downloaded = 0;
            this.info.contentLength = 0;
            await update.download((event) => {
                this.announce();

                switch (event.event) {
                    case 'Started':
                        this.info.status = 'downloading';
                        this.info.contentLength = event.data.contentLength;
                        console.log(`started downloading ${event.data.contentLength} bytes`);
                        break;
                    case 'Progress':
                        this.info.status = 'downloading';
                        this.info.downloaded += event.data.chunkLength;
                        console.log(`downloaded ${this.info.downloaded} from ${this.info.contentLength}`);
                        break;
                    case 'Finished':
                        // this.info.status = 'installing';
                        console.log('download finished');
                        break;
                }
            });

            console.log('update ready to install');
            this.install = async () => {
                await update.install();
            };
            this.info.status = 'ready';
            this.announce();

            if (localStorage.getItem('updateReady') == 'true') this.info.status = 'angry';
            else localStorage.setItem('updateReady', 'true');
        },
        announce() {
            this.$emit('announce', this.info);
        },
    },
});
</script>
