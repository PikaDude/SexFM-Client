import { destory, setActivity, start } from 'tauri-plugin-drpc';
import { Activity, ActivityType, Assets, Button } from 'tauri-plugin-drpc/activity';

export const useDiscordRPCStore = defineStore('discordRPCStore', {
    state: () => ({
        playing: false,
    }),
    actions: {
        async initialize() {
            const settings = useSettingsStore();
            if (settings.discordRPC) await start('1339987884157177917');
        },
        destroy() {
            // TODO: clear activity https://github.com/smokingplaya/tauri-plugin-drpc/issues/2
            destory();
        },
        update() {
            const settings = useSettingsStore();
            if (settings.discordRPC) {
                const app = useAppStore();
                const metadata = useMetadataStore();

                const buttons: Button[] = [
                    new Button('Tune in', 'https://sexfm.live'),
                ];

                let activity = new Activity()
                    .setActivity(ActivityType.Listening) // discord doesn't actually allow this unfortunately
                    .setButton(buttons)
                    .setState(`${metadata.tracks[0].title} by ${metadata.tracks[0].artist}`);

                let assets = new Assets()
                    .setLargeImage('logo')
                    .setLargeText(`SexFM Player v${app.version}`);
                if (this.playing) {
                    assets = assets
                        .setSmallImage('play')
                        .setSmallText('Playing');
                    activity = activity.setDetails('Now listening to:');
                }
                else {
                    assets = assets
                        .setSmallImage('pause')
                        .setSmallText('Paused');
                    activity = activity.setDetails('Now playing:');
                }

                activity = activity.setAssets(assets);

                setActivity(activity);
            }
        },
    },
});
