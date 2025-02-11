<template>
    <div />
</template>

<script lang="ts">
import { check } from '@tauri-apps/plugin-updater';

export default defineComponent({
    setup() {
        return { info: useAutoUpdateStore() };
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
            }) || null;
            if (!update) {
                localStorage.removeItem('updateReady');
                return;
            }

            console.log(
                `found update ${update.version} from ${update.date} with notes ${update.body}`,
            );

            this.info.downloaded = 0;
            this.info.contentLength = 0;
            await update.download((event) => {
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
            this.info.installFunction = async () => {
                await update.install();
            };
            this.info.status = 'ready';

            if (localStorage.getItem('updateReady') == 'true') this.info.status = 'angry';
            else localStorage.setItem('updateReady', 'true');
        },
    },
});
</script>
