import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketEvent } from '../enums/events.enum';

export interface DownloadedImage {
    index: number;
    filename: string;
    imageData: string; // base64 encoded image data
    completed: number;
    total: number;
}

export interface DownloadProgress {
    message: string;
    total?: number;
    title?: string;
    artist?: string;
}

@Injectable({
  providedIn: 'root'
})

export class SocketService {
    private socket: Socket | null = null;
    isConnected = signal(false);
    downloadedImages = signal<DownloadedImage[]>([]);
    downloadProgress = new BehaviorSubject<DownloadProgress | null>(null);
    downloadError = new BehaviorSubject<string | null>(null);
    downloadCompleted = new BehaviorSubject<boolean>(false);

    constructor() {
        if (this.isBrowser()) {
            this.initializeSocket(); 
        }
    }

    // Check if running in browser environment and not Angular build environment
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof window.location !== 'undefined';
    }

    private initializeSocket(): void {
        this.socket = io(window.location.origin, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        this.socket.on(WebSocketEvent.CONNECT, () => {
            this.isConnected.set(true);
            console.log('Connected to WebSocket server');
        });

        this.socket.on(WebSocketEvent.DISCONNECT, () => {
            this.isConnected.set(false);
            console.log('Disconnected from WebSocket server');
        });

        this.socket.on(WebSocketEvent.CONNECTION_ESTABLISHED, (data) => {
            console.log('WebSocket connection established:', data);
        });

        this.setupDownloadListeners();
    }

    private setupDownloadListeners(): void {
        if (!this.socket) return;

        this.socket.on(WebSocketEvent.DOWNLOAD_ACCEPTED, (data) => {
            console.log('Download request accepted:', data);
            this.downloadProgress.next({ message: data.message });
        });

        this.socket.on(WebSocketEvent.DOWNLOAD_STARTED, (data) => {
            console.log('Download started:', data);
            this.downloadProgress.next({ 
                message: data.message, 
                total: data.total, 
                title: data.title, 
                artist: data.artist
            });
            this.downloadedImages.set([]);
        });

        this.socket.on(WebSocketEvent.IMAGE_DOWNLOADED, (data) => {
            console.log('Image downloaded:', data);

            const newImage: DownloadedImage = {
                index: data.index,
                filename: data.filename,
                imageData: data.image_data,
                completed: data.completed,
                total: data.total
            }

            this.downloadedImages.update(images => [...images, newImage]);

            this.downloadProgress.next({ 
                message: `Downloaded ${data.completed} of ${data.total} images`
            });
        });

        this.socket.on(WebSocketEvent.DOWNLOAD_COMPLETED, (data) => {
            console.log('Download completed:', data);
            this.downloadProgress.next({
                message: data.message,
                total: data.total
            });
            this.downloadCompleted.next(true);
            const zipData = data.archive_data;
            const link = document.createElement('a');
            link.href = `data:application/octet-stream;base64,${zipData}`;
            link.download = data.filename;
            link.click();
        });

        this.socket.on(WebSocketEvent.DOWNLOAD_ERROR, (data) => {
            this.downloadError.next(data.message);
            this.downloadProgress.next(null);
        });
    }

    startWebSocketDownload(illustUrl: string, selectionRange: string | undefined, compressionFormat: string): void {
        if (!this.socket || !this.socket.connected) {
            console.error('WebSocket is not connected to server.');
            return;
        }

        console.log("Compression Format:", compressionFormat);
        this.downloadError.next(null);
        this.downloadCompleted.next(false);
        this.downloadedImages.set([]);

        this.socket.emit(WebSocketEvent.START_DOWNLOAD, {
            illust_url: illustUrl,
            compression_format: compressionFormat,
            selection_range: selectionRange || null,
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    reconnect(): void {
        if (this.socket && !this.socket.connected) {
            this.socket.connect();
        }
    }
}