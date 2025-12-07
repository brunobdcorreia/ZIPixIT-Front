# ZIPixit Client

A modern Angular web application for downloading Pixiv illustrations with real-time progress tracking and multiple compression format support.

## Features

- 🖼️ **Real-time Image Gallery** - View images as they download in real-time
- 📦 **Multiple Compression Formats** - Download as ZIP, 7z, or TAR.GZ
- 🎯 **Range Selection** - Download specific ranges of illustrations (e.g., 1-5, 2-, -10)
- 🌐 **WebSocket Support** - Live updates during download process
- 🎨 **Modern UI** - Built with Angular and responsive design
- 🚀 **Fast & Optimized** - Production-ready build with gzip compression

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Angular CLI** 17.x or higher

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zipixiv-client.git
   cd zipixiv-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Update `src/environments/environment.ts` for development:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api',
     socketUrl: 'http://localhost:5000'
   };
   ```

## Development

### Start Development Server

Follow the instructions at and run [ZIPixIT Back](https://github.com/brunobdcorreia/ZIPixIT-Back).

```

### Run Unit Tests

```bash
ng test
```

### Run End-to-End Tests

```bash
ng e2e
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header.component.ts
│   │   ├── illustration-form.component.ts
│   │   ├── image-gallery.component.ts
│   │   ├── range-tooltip.component.ts
│   │   └── error-message.component.ts
│   ├── services/
│   │   ├── zipixiv.service.ts          # API calls
│   │   ├── socket.service.ts           # WebSocket/Socket.io
│   │   └── language.service.ts         # i18n
│   ├── app.ts                          # Root component
│   └── app.css                         # Global styles
├── environments/
│   ├── environment.ts                  # Development
│   └── environment.prod.ts             # Production
└── index.html                          # Entry point
```

## Configuration

### API Endpoints

The application communicates with the backend at:
- **HTTP API:** `{apiUrl}/download`
- **WebSocket:** `{socketUrl}/socket.io`

Update these in `src/environments/environment.ts`

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
   - Toggle to see images as they download in real-time

5. **Download**
   - Click "Download" and wait for completion
   - File will automatically download to your machine

## Technologies

- **Framework:** Angular 17+
- **Language:** TypeScript
- **Styling:** CSS3
- **Real-time:** Socket.io
- **HTTP:** RxJS

## Deployment

### Docker

```bash
# Build Docker image
docker build -t zipixiv-client .

# Run container
docker run -p 80:80 zipixiv-client
```

### Static Hosting (GitHub Pages, Netlify, Vercel)

```bash
# Build for production
ng build --configuration production

# Deploy the dist/ folder to your hosting provider
```

### Nginx Configuration

See `infra/nginx.conf` for production Nginx setup.

## Environment Variables

No environment variables required for the frontend. All configuration is done through `src/environments/environment.ts`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Angular](https://angular.io/) - Frontend framework
- [Socket.io](https://socket.io/) - Real-time communication
- [Pixiv](https://www.pixiv.net/) - Image source

## Changelog

### v1.0.0 (2024-12-05)
- Initial release
- Real-time image gallery
- Multiple compression formats
- Range selection support
- WebSocket live updates