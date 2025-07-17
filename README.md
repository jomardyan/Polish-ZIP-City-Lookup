# Enhanced Polish ZIP & City Lookup 📮
![License](https://img.shields.io/github/license/jomardyan/Polish-ZIP-City-Lookup)
![Last Commit](https://img.shields.io/github/last-commit/jomardyan/Polish-ZIP-City-Lookup)
![Repo Size](https://img.shields.io/github/repo-size/jomardyan/Polish-ZIP-City-Lookup)
![Languages](https://img.shields.io/github/languages/top/jomardyan/Polish-ZIP-City-Lookup)
![Stars](https://img.shields.io/github/stars/jomardyan/Polish-ZIP-City-Lookup?style=social)
![Forks](https://img.shields.io/github/forks/jomardyan/Polish-ZIP-City-Lookup?style=social)
![GitHub issues](https://img.shields.io/github/issues/jomardyan/Polish-ZIP-City-Lookup)

A powerful, feature-rich web application for looking up Polish postal ZIP codes and cities. Built with modern web technologies, it supports single & batch lookups, search history, favorites, interactive maps, multiple themes, and multilingual support.

🌐 **Live Demo**: https://jomardyan.github.io/Polish-ZIP-City-Lookup/

---

## ✨ Key Features

### 🔍 **Smart Lookup System**
* **Single Lookup**: Convert ZIP codes to cities and vice versa
* **Batch Processing**: Handle multiple entries with CSV/Excel import
* **Auto-Detection**: Automatically detects input type (ZIP or city)
* **Fuzzy Search**: Find results even with partial or approximate inputs
* **Instant Results**: Optional real-time search as you type

### 📊 **Advanced Data Management**
* **Search History**: Automatic tracking of all searches with timestamps
* **Favorites System**: Star and save frequently used searches
* **Smart Filtering**: Filter history by time periods (today, week, month)
* **Export Options**: CSV, Excel, and clipboard export functionality
* **Data Privacy**: Complete control over data retention and storage

### 🗺️ **Interactive Mapping**
* **Dynamic Visualization**: Real-time map updates with search results
* **Multiple Providers**: OpenStreetMap, CartoDB, and Stamen tile layers
* **Smart Zoom**: Auto-fit view to show all results optimally
* **Location Markers**: Detailed popups with search information
* **Responsive Design**: Touch-friendly controls for mobile devices

### 🎨 **Customizable Interface**
* **Theme Options**: Light, dark, and auto (system) themes
* **Font Scaling**: Small to extra-large text size options
* **Compact Mode**: Space-efficient layout for smaller screens
* **Accessibility**: WCAG compliant with keyboard navigation
* **Animations**: Smooth transitions with reduced-motion support

### 🌍 **Multilingual Support**
* **Languages**: English, Polish, and German interfaces
* **Localization**: Complete UI translation including help text
* **Regional Settings**: Culturally appropriate date and number formats
* **Easy Extension**: Simple framework for adding new languages

### ⚡ **Performance & Reliability**
* **Smart Caching**: Intelligent result caching to reduce API calls
* **Offline Mode**: Continue working with cached data when offline
* **Error Handling**: Graceful degradation with informative error messages
* **Rate Limiting**: Built-in request throttling to prevent API abuse
* **Progressive Enhancement**: Works even with JavaScript disabled

---

## 🚀 Getting Started

### Prerequisites

* Modern web browser (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
* Internet connection for API access and map tiles
* (Optional) HTTP server for local development

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jomardyan/Polish-ZIP-City-Lookup.git
   cd Polish-ZIP-City-Lookup
   ```

2. **Install dependencies** (for development):
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:8000`

4. **Configure APIs** (optional for full functionality):
   * Get a free [GeoNames account](https://www.geonames.org/login)
   * Update `GEONAMES_USERNAME` in `assets/js/vanilla-app.js`

### Production Deployment

Simply upload all files to any web server. The application is fully client-side and requires no backend infrastructure.

---

## � Usage Guide

### Single Lookup
1. **Navigate** to the **Lookup** tab
2. **Enter** a ZIP code (e.g., `00-001`) or city name (e.g., `Warszawa`)
3. **Click** the lookup button or press **Enter**
4. **View** results in the table and on the interactive map
5. **Star** searches to add them to favorites

### Batch Processing
1. **Switch** to the **Batch** tab
2. **Import** data via:
   * **File Upload**: CSV, Excel, or text files
   * **Drag & Drop**: Simply drop files onto the upload area
   * **Manual Entry**: Paste data directly into the text area
3. **Configure** processing options:
   * Mode: ZIP→City, City→ZIP, or Auto-detect
   * Max results limit and request delay
   * Error handling preferences
4. **Process** and monitor progress with the real-time progress bar
5. **Export** results in your preferred format

### History & Favorites
1. **Visit** the **History** tab to see all past searches
2. **Filter** by time period or search for specific entries
3. **Repeat** any previous search with one click
4. **Manage** favorites and export history data
5. **View** usage statistics and analytics

### Settings & Customization
1. **Open** the **Settings** tab
2. **Customize** appearance (theme, font size, layout)
3. **Configure** search behavior and defaults
4. **Manage** privacy and data retention settings
5. **Adjust** map preferences and providers
6. **Fine-tune** advanced options for power users

---

## 🛠️ Development

### Project Structure
```
├── assets/
│   ├── css/
│   │   └── styles.css          # Enhanced styling with CSS variables
│   └── js/
│       └── vanilla-app.js      # Main application logic
├── tests/
│   ├── app.test.js             # Comprehensive test suite
│   └── setup.js               # Test configuration
├── index.html                  # Single enhanced HTML file
├── package.json               # Dependencies and scripts
├── jest.config.js             # Jest testing configuration
└── README.md                  # This file
```

### Development Scripts
```bash
# Development server with live reload
npm run dev

# Run test suite
npm test

# Run tests in watch mode
npm run test:watch

# Code linting
npm run lint

# Build and validate
npm run build
```

### API Integration
The application integrates with two reliable APIs:

**Zippopotam.us** (No auth required)
* ZIP code to city lookups
* Provides geographic coordinates
* High reliability and fast response

**GeoNames** (Free account required)
* City to ZIP code lookups
* Comprehensive Polish location database
* Supports fuzzy matching

### Browser Support Matrix
| Browser | Minimum Version | Features Supported |
|---------|----------------|-------------------|
| Chrome | 60+ | ✅ All features |
| Firefox | 55+ | ✅ All features |
| Safari | 12+ | ✅ All features |
| Edge | 79+ | ✅ All features |
| IE | ❌ | Not supported |

---

## 🔧 Configuration

### API Configuration
```javascript
// In assets/js/vanilla-app.js
this.config = {
  GEONAMES_USERNAME: 'your_username', // Replace with your GeoNames username
  MAP_CENTER: [52.237049, 21.017532], // Default map center (Warsaw)
  MAP_ZOOM: 6,                        // Default zoom level
  API_TIMEOUT: 30000,                 // Request timeout (ms)
  HISTORY_LIMIT: 1000                 // Maximum history entries
};
```

### Styling Customization
```css
/* In assets/css/styles.css */
:root {
  --primary-color: #007bff;     /* Main brand color */
  --secondary-color: #6c757d;   /* Secondary elements */
  --border-radius: 0.375rem;    /* Border radius */
  --transition: all 0.2s ease;  /* Animation timing */
}
```

### Adding New Languages
```javascript
// Extend translations object
this.translations = {
  // ... existing translations
  'fr': {
    brand: 'Recherche de codes postaux polonais',
    lookup: 'Rechercher',
    // ... more translations
  }
};
```

---

## 🧪 Testing

### Test Coverage
* ✅ Core lookup functionality
* ✅ Batch processing logic
* ✅ History and favorites management
* ✅ Settings persistence
* ✅ Theme switching
* ✅ Internationalization
* ✅ Error handling
* ✅ API integration

### Running Tests
```bash
# Full test suite with coverage
npm test

# Watch mode for development
npm run test:watch

# Specific test files
npm test -- --testNamePattern="batch"
```

---

## 🚀 Deployment Options

### GitHub Pages (Recommended)
Automatic deployment on every push to main branch via GitHub Actions.

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `./`

### Vercel
1. Import project from GitHub
2. Configure build settings (no build step required)
3. Deploy instantly

### Traditional Web Hosting
Simply upload all files to your web server. No server-side processing required.

---

## 🔒 Security & Privacy

### Data Protection
* **Local Storage Only**: All user data stays on your device
* **No Tracking**: Zero analytics or tracking scripts
* **Secure APIs**: All external requests use HTTPS
* **Privacy Controls**: Complete control over data retention

### Content Security Policy
The application implements CSP headers for enhanced security:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://api.zippopotam.us https://secure.geonames.org; 
               img-src 'self' data: https:;">
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute
* 🐛 **Bug Reports**: Open issues for any bugs you find
* 💡 **Feature Requests**: Suggest new features or improvements
* 🔧 **Code Contributions**: Submit pull requests
* 🌍 **Translations**: Help add new languages
* 📖 **Documentation**: Improve guides and examples

### Development Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm test`
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
* Follow existing code style
* Add tests for new features
* Update documentation as needed
* Ensure accessibility compliance

---

## 🏆 Changelog

### Version 2.0.0 (Latest)
* ✨ **New**: Complete rewrite with enhanced features
* ✨ **New**: Search history and favorites system
* ✨ **New**: Advanced settings and customization
* ✨ **New**: Multiple language support (EN, PL, DE)
* ✨ **New**: Theme system with auto-detection
* ✨ **New**: Improved batch processing with progress tracking
* ✨ **New**: Enhanced map functionality
* ✨ **New**: Comprehensive test suite
* 🔧 **Improved**: Better error handling and user feedback
* 🔧 **Improved**: Mobile responsiveness and accessibility
* 🔧 **Improved**: Performance optimization and caching

### Version 1.0.0
* 🎉 Initial release with basic lookup functionality

---

## � License & Credits

**© 2025 Hayk Jomardyan. All rights reserved.**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments
* **APIs**: [Zippopotam.us](http://zippopotam.us/) and [GeoNames](https://www.geonames.org/)
* **Maps**: [OpenStreetMap](https://www.openstreetmap.org/) and [Leaflet](https://leafletjs.com/)
* **UI Framework**: [Bootstrap](https://getbootstrap.com/) and [Bootstrap Icons](https://icons.getbootstrap.com/)
* **Inspiration**: Polish postal system and open data initiatives

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jomardyan/Polish-ZIP-City-Lookup&type=Date)](https://star-history.com/#jomardyan/Polish-ZIP-City-Lookup&Date)

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/jomardyan/Polish-ZIP-City-Lookup/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/jomardyan/Polish-ZIP-City-Lookup/discussions)
- 📧 **Email**: Contact via GitHub profile

---

**Made with ❤️ for the Polish community and developers worldwide**
