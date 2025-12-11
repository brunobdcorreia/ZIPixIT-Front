# ZIPixit Client

A modern Angular web application for zipping and downloading Pixiv illustrations with real-time progress tracking and multiple compression format support.

Available at [ZIPixIT](https://zipixit.com)

![A GIF demonstrating the webpage at work](./readme%20assets/zipixit%20demo.gif)

## Features

- 🖼️ **Real-time Image Gallery** - View images as they download in real-time
- 📦 **Multiple Compression Formats** - Download as ZIP, 7z, or TAR.GZ
- 🎯 **Range Selection** - Download specific ranges of illustrations (e.g., 1-5, 2-, -10)
- 🌐 **WebSocket Support** - Live updates during download process
- 🎨 **Modern UI** - Built with Angular and responsive design
- 🚀 **Fast & Optimized** - Production-ready build with gzip compression

## Language support

Currently supports the following languages:
- Japanese (日本語)
- English


## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 17.x or higher

## Configuration

### API Endpoints

The application communicates with the backend at:
- **HTTP API:** `{apiUrl}/download`
- **WebSocket:** `{socketUrl}/`


### Compression Formats

Supported formats configured in form:
- **ZIP** - Standard compression
- **7z** - High compression ratio
- **TAR.GZ** - Unix/Linux compatible

## Usage

1. **Enter Pixiv URL**
   - Go to Pixiv.net and find an artwork
   - Copy the URL (e.g., `https://www.pixiv.net/artworks/12345678`)
   - Paste into the input field

2. **Select Range (Optional)**
   - Leave empty to download all images
   - Enter `1-5` to download images 1-5
   - Enter `2-` to download from image 2 onwards
   - Enter `-3` to download up to image 3

3. **Choose Compression Format**
   - Select ZIP, 7z, or TAR.GZ

4. **Enable Live Display (Optional)**
   - Toggle to see images as they download in real-time (not recommended for NSFW artworks)

5. **Download**
   - Click "Download" and wait for completion
   - File will automatically download to your machine

## Technologies

- **Framework:** Angular 17+
- **Language:** TypeScript
- **Styling:** CSS3
- **Real-time:** Socket.io
- **HTTP:** RxJS

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License

Feel free to alter this code and modify its expected behaviour in any way you see fit.

## Acknowledgments

### Libraries & Frameworks
- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Flask-SocketIO](https://flask-socketio.readthedocs.io/) - Real-time WebSocket communication
- [Flask-CORS](https://flask-cors.readthedocs.io/) - Cross-Origin Resource Sharing
- [pixivpy3](https://github.com/upbit/pixivpy3) - Pixiv API client library
- [Eventlet](https://eventlet.net/) - Coroutine-based networking library

### Data Processing & Compression
- [py7zr](https://py7zr.readthedocs.io/) - 7z archive support
- [tarfile](https://docs.python.org/3/library/tarfile.html) - TAR archive creation
- [zipfile](https://docs.python.org/3/library/zipfile.html) - ZIP archive creation
- [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) - HTML parsing

### Frontend
- [Angular](https://angular.io/) - Modern web application framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript superset
- [RxJS](https://rxjs.dev/) - Reactive programming library

### Deployment & Infrastructure
- [Docker](https://www.docker.com/) - Containerization platform
- [Nginx](https://nginx.org/) - High-performance web server & reverse proxy
- [DigitalOcean](https://www.digitalocean.com/) - Cloud infrastructure provider
- [Let's Encrypt](https://letsencrypt.org/) - Free SSL/TLS certificates
- [Certbot](https://certbot.eff.org/) - Let's Encrypt automation tool

### External Services
- [Pixiv](https://www.pixiv.net/) - Image source and inspiration

### Special Thanks
- **upbit** - Creator of [PixivPy3](https://github.com/upbit/pixivpy3), without which this project wouldn't be possible (or I'd have to develop the API myself which would be a huge pain)
- **The open-source community** - For creating and maintaining the amazing libraries that power this project

## Changelog

### v1.0.1 (2025-12-11)
- Added button for minimising image gallery

### v1.0.0 (2025-12-05)
- Initial release
- Real-time image gallery
- Multiple compression formats
- Range selection support
- WebSocket live updates