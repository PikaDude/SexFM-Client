type AudioFormat = 'MP3' | 'AAC';

type AutoUpdateStatus = 'error' | 'nothing' | 'downloading' | 'installing' | 'ready';
interface AutoUpdateInfo {
    status: AutoUpdateStatus
    downloaded: number
    contentLength: number | undefined
    message: string
}
