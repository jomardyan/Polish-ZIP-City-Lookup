# Polish ZIP & City Lookup 📮
![License](https://img.shields.io/github/license/jomardyan/Polish-ZIP-City-Lookup)
![Last Commit](https://img.shields.io/github/last-commit/jomardyan/Polish-ZIP-City-Lookup)
![Repo Size](https://img.shields.io/github/repo-size/jomardyan/Polish-ZIP-City-Lookup)
![Languages](https://img.shields.io/github/languages/top/jomardyan/Polish-ZIP-City-Lookup)
![Stars](https://img.shields.io/github/stars/jomardyan/Polish-ZIP-City-Lookup?style=social)
![Forks](https://img.shields.io/github/forks/jomardyan/Polish-ZIP-City-Lookup?style=social)
![GitHub issues](https://img.shields.io/github/issues/jomardyan/Polish-ZIP-City-Lookup)

A lightweight, user-friendly web application for looking up Polish postal ZIP codes and cities. It supports both single and batch lookups, interactive map visualization, dark/light themes, and bilingual (English/Polish) interfaces.

Use Hosted version: https://jomardyan.github.io/Polish-ZIP-City-Lookup/ 

---

## Features

* **Single Lookup**: Convert a ZIP code to its corresponding city (and vice versa).
* **Batch Processing**: Import CSV or Excel files—or paste multiple entries—to process ZIP ⇄ city conversions in bulk.
* **Interactive Map**: Visualize lookup results on a Leaflet-powered map, with auto-zoom and markers.
* **Theme Toggle**: Switch between light and dark modes for comfortable viewing.
* **Internationalization**: English and Polish language support via Vue I18n.

---

## Getting Started

### Prerequisites

* A modern web browser (Chrome, Firefox, Edge, Safari).
* (Optional) A simple HTTP server to serve static files (e.g., [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or `http-server` via npm).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jomardyan/Polish-ZIP-City-Lookup.git
   cd Polish-ZIP-City-Lookup
   ```

2. **Install development dependencies** (optional):

   ```bash
   npm install
   ```

3. **Configure GeoNames API**:

   * Obtain a free account from [GeoNames](https://www.geonames.org/login).
   * In `assets/js/vanilla-app.js`, replace:

     ```js
     const CONFIG = {
       GEONAMES_USERNAME: 'demo', // Replace with your actual username
       // ...
     };
     ```

4. **Serve or open**:

   * **Option A**: Open `index.html` directly in your browser, or
   * **Option B**: Run a local server:

     ```bash
     npm run dev
     # or manually:
     npx http-server . -p 8000
     ```

---

## 🖥️ Usage

### Single Lookup

1. Select the **Lookup** tab.
2. Enter a valid Polish ZIP (e.g., `00-001` or `00001`) to find its city, or enter a city name (e.g., `Warszawa`) to find matching ZIP codes.
3. Press **Enter** or click the **Lookup** button.
4. Results appear in a table and on the map.

### Batch Processing

1. Switch to the **Batch** tab.
2. Either:

   * **Import** a CSV/Excel file (one ZIP or city per row), or
   * **Paste** multiple entries (one per line).
3. Choose mode: **ZIP → City** or **City → ZIP**.
4. Click **Process Batch**. Results populate the table and map.
5. Export results as CSV/Excel or copy to clipboard.

---

## 🔧 Configuration & Customization

### API Configuration

The application uses two APIs:
- **Zippopotam.us** for ZIP to City lookups (no API key required)
- **GeoNames** for City to ZIP lookups (requires free account)

To configure the GeoNames API:

1. Create a free account at [GeoNames](https://www.geonames.org/login)
2. Edit `assets/js/vanilla-app.js` and update the configuration:

```javascript
const CONFIG = {
  GEONAMES_USERNAME: 'your_actual_username', // Replace with your GeoNames username
  // ... other config
};
```

### Development Setup

1. **Clone and Install**:
```bash
git clone https://github.com/jomardyan/Polish-ZIP-City-Lookup.git
cd Polish-ZIP-City-Lookup
npm install
```

2. **Development Server**:
```bash
npm run dev
# Opens http://localhost:8000
```

3. **Build and Test**:
```bash
npm run build  # Runs linting and tests
npm run test   # Run test suite
npm run lint   # Check code quality
```

### Project Structure

```
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom styles and themes
│   └── js/
│       ├── app.js          # Vue.js version (for environments with CDN access)
│       └── vanilla-app.js  # Vanilla JS version (current default)
├── tests/
│   ├── app.test.js         # Test suite
│   └── setup.js           # Test configuration
├── index.html              # Main application (vanilla JS)
├── index-vue.html          # Vue.js version (requires CDN access)
├── package.json            # Dependencies and scripts
└── README.md
```

### Customization Options

* **Map Settings**: Change default center and zoom in `CONFIG` object
* **Theme Colors**: Edit CSS variables in `assets/css/styles.css`
* **Languages**: Extend the `translations` object for additional languages
* **API Timeouts**: Adjust `API_TIMEOUT` in the configuration

---

## 📚 Dependencies

### Runtime Dependencies
* [Bootstrap 4.6](https://getbootstrap.com/) - UI Framework
* [Bootstrap Icons](https://icons.getbootstrap.com/) - Icons
* [Leaflet](https://leafletjs.com/) - Interactive Maps

### Development Dependencies
* [ESLint](https://eslint.org/) - Code Quality
* [Jest](https://jestjs.io/) - Testing Framework
* [HTTP Server](https://www.npmjs.com/package/http-server) - Development Server

### Browser Compatibility
* Chrome 60+
* Firefox 55+
* Safari 12+
* Edge 79+

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### GitHub Pages (Automatic)
The project is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

### Manual Deployment
For other hosting platforms:

1. Ensure all files are present
2. Configure the GeoNames API username
3. Upload files to your web server
4. The application runs entirely client-side (no server required)

## 🔒 Security & Privacy

* All processing happens client-side
* No user data is stored on servers
* API calls are made directly to public APIs
* Local storage only used for user preferences (theme, language)

---

## 📝 License & Rights

© iCredit Hayk Jomardyan 2025. All rights reserved.
![License](https://img.shields.io/github/license/jomardyan/Polish-ZIP-City-Lookup)


---
