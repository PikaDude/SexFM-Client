type AudioFormat = 'MP3' | 'AAC';

type AutoUpdateStatus = 'error' | 'nothing' | 'downloading' | 'ready' | 'angry';
interface AutoUpdateInfo {
    status: AutoUpdateStatus
    downloaded: number
    contentLength: number | undefined
}
