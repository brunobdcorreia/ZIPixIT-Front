export enum WebSocketEvent {
    CONNECT = 'connected',
    DISCONNECT = 'disconnected',
    CONNECTION_ESTABLISHED = 'connection_estabilished',
    START_DOWNLOAD = 'start_download',
    DOWNLOAD_ACCEPTED = 'download_accepted',
    DOWNLOAD_STARTED = 'download_started',
    IMAGE_DOWNLOADED = 'image_downloaded',
    IMAGES_DOWNLOADED = 'images_downloaded',
    DOWNLOAD_COMPLETED = 'download_completed',
    DOWNLOAD_ERROR = 'download_error'
}