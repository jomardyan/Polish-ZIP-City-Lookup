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

## 🚀 Features

* **Single Lookup**: Convert a ZIP code to its corresponding city (and vice versa).
* **Batch Processing**: Import CSV or Excel files—or paste multiple entries—to process ZIP ⇄ city conversions in bulk.
* **Interactive Map**: Visualize lookup results on a Leaflet-powered map, with auto-zoom and markers.
* **Theme Toggle**: Switch between light and dark modes for comfortable viewing.
* **Internationalization**: English and Polish language support via Vue I18n.

---

## 📦 Getting Started

### Prerequisites

* A modern web browser (Chrome, Firefox, Edge, Safari).
* (Optional) A simple HTTP server to serve static files (e.g., [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or `http-server` via npm).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/zip-city-lookup.git
   cd zip-city-lookup
   ```

2. **Configure GeoNames API**:

   * Obtain a free account from [GeoNames](https://www.geonames.org/login).
   * In `index.html` (or your main script), replace:

     ```js
     const GEONAMES_USERNAME = 'your_username';
     ```

     with your actual GeoNames username.

3. **Serve or open**:

   * Open `index.html` directly in your browser, or
   * Run a local server:

     ```bash
     npx http-server .
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

* **Map Initial View**: Change the default center and zoom in the `mounted()` hook of the Vue instance.
* **Theme Colors**: Edit CSS variables or classes in the `<style>` block.
* **Language Packs**: Extend `messages` in the Vue I18n setup for additional languages.

---

## 📚 Dependencies

* [Bootstrap 4.6](https://getbootstrap.com/)
* [Bootstrap Icons](https://icons.getbootstrap.com/)
* [Vue.js 2](https://vuejs.org/)
* [Vue I18n](https://kazupon.github.io/vue-i18n/)
* [Axios](https://axios-http.com/)
* [PapaParse](https://www.papaparse.com/)
* [SheetJS (XLSX)](https://github.com/SheetJS/sheetjs)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
* [Leaflet](https://leafletjs.com/)

---

## 📝 License & Rights

© iCredit Hayk Jomardyan 2025. All rights reserved.
![License](https://img.shields.io/github/license/jomardyan/Polish-ZIP-City-Lookup)


---

*Made with ❤️ for easy postal code and city lookups in Poland.*
