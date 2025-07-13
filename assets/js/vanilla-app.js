// Simple vanilla JavaScript implementation for Polish ZIP & City Lookup
// This serves as a fallback when Vue.js CDN is not available

class PolishZipLookup {
  constructor() {
    this.config = {
      GEONAMES_USERNAME: 'demo', // Replace with actual username
      MAP_CENTER: [52.237049, 21.017532],
      MAP_ZOOM: 6,
      API_TIMEOUT: 10000
    };

    this.state = {
      activeTab: 'single',
      mode: 'zip',
      results: [],
      loading: false,
      locale: 'en',
      theme: 'light',
      map: null,
      markers: []
    };

    this.translations = {
      en: {
        brand: 'Polish ZIP & City Lookup',
        lookup: 'Lookup',
        batch: 'Batch',
        zipPlaceholder: '00-001 or 00001',
        cityPlaceholder: 'Warszawa',
        lookupCity: 'Lookup City',
        lookupZip: 'Lookup ZIP',
        clear: 'Clear',
        clearResults: 'Clear Results',
        results: 'Results',
        input: 'Input',
        output: 'Output',
        importFile: 'Import CSV / Excel',
        chooseFile: 'Choose file...',
        pasteInputs: 'Or Paste Inputs (one per line)',
        pastePlaceholder: 'ZIPs or Cities',
        mode: 'Mode',
        zipCity: 'ZIP → City',
        cityZip: 'City → ZIP',
        processBatch: 'Process Batch',
        copy: 'Copy',
        csv: 'CSV',
        excel: 'Excel',
        batchResults: 'Batch Results',
        mapView: 'Map View',
        invalidZip: 'Invalid ZIP code format',
        invalidCity: 'Please enter a city name',
        notFound: 'Not found',
        invalidFormat: 'Invalid format',
        error: 'An error occurred',
        loading: 'Loading...',
        success: 'Operation completed successfully'
      },
      pl: {
        brand: 'Wyszukiwarka Kodów Pocztowych i Miast',
        lookup: 'Wyszukaj',
        batch: 'Wsadowo',
        zipPlaceholder: '00-001 lub 00001',
        cityPlaceholder: 'Warszawa',
        lookupCity: 'Szukaj Miasta',
        lookupZip: 'Szukaj Kodu',
        clear: 'Wyczyść',
        clearResults: 'Wyczyść Wyniki',
        results: 'Wyniki',
        input: 'Wejście',
        output: 'Wyjście',
        importFile: 'Importuj CSV / Excel',
        chooseFile: 'Wybierz plik...',
        pasteInputs: 'Lub wklej dane (po jednym wierszu)',
        pastePlaceholder: 'Kody lub Miasta',
        mode: 'Tryb',
        zipCity: 'Kod → Miasto',
        cityZip: 'Miasto → Kod',
        processBatch: 'Przetwórz',
        copy: 'Kopiuj',
        csv: 'CSV',
        excel: 'Excel',
        batchResults: 'Wyniki Wsadowe',
        mapView: 'Mapa',
        invalidZip: 'Nieprawidłowy format kodu pocztowego',
        invalidCity: 'Proszę podać nazwę miasta',
        notFound: 'Nie znaleziono',
        invalidFormat: 'Nieprawidłowy format',
        error: 'Wystąpił błąd',
        loading: 'Ładowanie...',
        success: 'Operacja zakończona pomyślnie'
      }
    };

    this.init();
  }

  init() {
    this.loadPreferences();
    this.setupEventListeners();
    this.initializeMap();
    this.updateUI();
  }

  t(key) {
    return this.translations[this.state.locale][key] || key;
  }

  loadPreferences() {
    const savedLocale = localStorage.getItem('locale');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedLocale && ['en', 'pl'].includes(savedLocale)) {
      this.state.locale = savedLocale;
    }
    
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      this.state.theme = savedTheme;
    }
  }

  savePreferences() {
    localStorage.setItem('locale', this.state.locale);
    localStorage.setItem('theme', this.state.theme);
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        // Look for the data-tab attribute on the clicked element or its closest parent
        const tabElement = e.target.closest('[data-tab]') || e.target;
        const tabName = tabElement.dataset.tab;
        if (tabName) {
          this.state.activeTab = tabName;
          this.updateUI();
        }
      });
    });

    // Language switching
    document.querySelectorAll('[data-locale]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const localeElement = e.target.closest('[data-locale]') || e.target;
        const locale = localeElement.dataset.locale;
        if (locale) {
          this.state.locale = locale;
          this.savePreferences();
          this.updateUI();
          this.showSuccess('Language changed');
        }
      });
    });

    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
      this.savePreferences();
      this.updateUI();
      this.showSuccess('Theme changed');
    });

    // Single lookup
    document.getElementById('zipLookupBtn')?.addEventListener('click', () => {
      this.lookupSingle('zip');
    });

    document.getElementById('cityLookupBtn')?.addEventListener('click', () => {
      this.lookupSingle('city');
    });

    // Clear buttons
    document.getElementById('clearZipBtn')?.addEventListener('click', () => {
      document.getElementById('zipInput').value = '';
    });

    document.getElementById('clearCityBtn')?.addEventListener('click', () => {
      document.getElementById('cityInput').value = '';
    });

    // Enter key handlers
    document.getElementById('zipInput')?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.lookupSingle('zip');
    });

    document.getElementById('cityInput')?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.lookupSingle('city');
    });

    // Batch processing
    document.getElementById('processBatchBtn')?.addEventListener('click', () => {
      this.processBatch();
    });

    // Clear results
    document.getElementById('clearResultsBtn')?.addEventListener('click', () => {
      this.clearResults();
    });

    // File import
    document.getElementById('fileInput')?.addEventListener('change', (e) => {
      this.importFile(e);
    });

    // Export functions
    document.getElementById('copyBtn')?.addEventListener('click', () => {
      this.copyToClipboard();
    });

    document.getElementById('csvBtn')?.addEventListener('click', () => {
      this.exportCSV();
    });

    document.getElementById('excelBtn')?.addEventListener('click', () => {
      this.exportExcel();
    });
  }

  updateUI() {
    document.body.className = this.state.theme;
    
    // Update text content based on locale
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = this.t(key);
    });

    // Update tab visibility
    document.querySelectorAll('[data-tab-content]').forEach(tab => {
      tab.style.display = tab.dataset.tabContent === this.state.activeTab ? 'block' : 'none';
    });

    // Update active tab styling
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.parentElement.classList.toggle('active', tab.dataset.tab === this.state.activeTab);
    });

    // Update locale indicator
    const localeBtn = document.getElementById('langDropdown');
    if (localeBtn) {
      localeBtn.innerHTML = `<i class="bi bi-translate"></i> ${this.state.locale.toUpperCase()}`;
    }

    // Update theme icon
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      const icon = this.state.theme === 'light' ? 'bi-moon' : 'bi-sun';
      themeBtn.innerHTML = `<i class="bi ${icon}"></i>`;
    }

    // Update results display
    this.updateResultsDisplay();
  }

  initializeMap() {
    if (typeof L !== 'undefined') {
      try {
        this.state.map = L.map('map').setView(this.config.MAP_CENTER, this.config.MAP_ZOOM);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.state.map);
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    }
  }

  validateZip(zip) {
    const cleaned = zip.trim();
    return /^\d{2}-\d{3}$|^\d{5}$/.test(cleaned);
  }

  normalizeZip(zip) {
    const cleaned = zip.trim();
    return /^\d{5}$/.test(cleaned) 
      ? cleaned.slice(0, 2) + '-' + cleaned.slice(2) 
      : cleaned;
  }

  async lookupSingle(type) {
    const input = type === 'zip' 
      ? document.getElementById('zipInput')?.value || ''
      : document.getElementById('cityInput')?.value || '';

    if (!input.trim()) {
      this.showError(this.t(type === 'zip' ? 'invalidZip' : 'invalidCity'));
      return;
    }

    if (type === 'zip' && !this.validateZip(input)) {
      this.showError(this.t('invalidZip'));
      return;
    }

    this.state.loading = true;
    this.updateLoadingState();

    try {
      if (type === 'zip') {
        const zip = this.normalizeZip(input);
        const result = await this.lookupZipToCity(zip);
        this.state.results = [{
          input: zip,
          output: result.cities,
          lat: result.lat,
          lon: result.lon
        }];
      } else {
        const result = await this.lookupCityToZip(input);
        this.state.results = [{
          input: input,
          output: result.postalCodes
        }];
      }

      this.updateMap();
      this.showSuccess(this.t('success'));
    } catch (error) {
      this.showError(error.message || this.t('error'));
      this.state.results = [];
    } finally {
      this.state.loading = false;
      this.updateLoadingState();
      this.updateUI();
    }
  }

  async lookupZipToCity(zip) {
    const response = await fetch(`https://api.zippopotam.us/pl/${zip}`);
    if (!response.ok) throw new Error(this.t('notFound'));
    
    const data = await response.json();
    const cities = [...new Set(data.places.map(p => p['place name']))];
    const lat = parseFloat(data.places[0].latitude);
    const lon = parseFloat(data.places[0].longitude);
    
    return { cities, lat, lon };
  }

  async lookupCityToZip(city) {
    const url = new URL('https://secure.geonames.org/postalCodeSearchJSON');
    url.searchParams.set('placename', city);
    url.searchParams.set('country', 'PL');
    url.searchParams.set('maxRows', '200');
    url.searchParams.set('username', this.config.GEONAMES_USERNAME);

    const response = await fetch(url);
    if (!response.ok) throw new Error(this.t('notFound'));
    
    const data = await response.json();
    if (!data.postalCodes || data.postalCodes.length === 0) {
      throw new Error(this.t('notFound'));
    }
    
    const postalCodes = [...new Set(data.postalCodes.map(pc => pc.postalCode))];
    return { postalCodes };
  }

  async processBatch() {
    const textarea = document.getElementById('batchTextarea');
    const modeSelect = document.getElementById('modeSelect');
    
    if (!textarea || !modeSelect) return;

    const items = textarea.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    if (items.length === 0) {
      this.showError(this.t('pasteInputs'));
      return;
    }

    this.state.loading = true;
    this.state.results = [];
    this.updateLoadingState();

    for (const item of items) {
      try {
        if (modeSelect.value === 'zip') {
          if (!this.validateZip(item)) {
            this.state.results.push({
              input: item,
              output: [this.t('invalidFormat')]
            });
            continue;
          }

          const zip = this.normalizeZip(item);
          const result = await this.lookupZipToCity(zip);
          this.state.results.push({
            input: zip,
            output: result.cities,
            lat: result.lat,
            lon: result.lon
          });
        } else {
          const result = await this.lookupCityToZip(item);
          this.state.results.push({
            input: item,
            output: result.postalCodes
          });
        }
      } catch (error) {
        this.state.results.push({
          input: item,
          output: [this.t('notFound')]
        });
      }

      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.state.loading = false;
    this.updateLoadingState();
    this.updateMap();
    this.updateUI();
    this.showSuccess(this.t('success'));
  }

  clearResults() {
    this.state.results = [];
    this.clearMapMarkers();
    this.updateUI();
    this.showSuccess(this.t('clearResults'));
  }

  clearMapMarkers() {
    if (this.state.markers.length > 0 && this.state.map) {
      this.state.markers.forEach(marker => this.state.map.removeLayer(marker));
      this.state.markers = [];
    }
  }

  updateMap() {
    if (!this.state.map) return;

    this.clearMapMarkers();
    
    const validResults = this.state.results.filter(result => result.lat && result.lon);
    
    validResults.forEach(result => {
      const marker = L.marker([result.lat, result.lon])
        .addTo(this.state.map)
        .bindPopup(`<strong>${result.input}</strong><br>${result.output.join(', ')}`);
      
      this.state.markers.push(marker);
    });

    if (this.state.markers.length > 0) {
      const group = L.featureGroup(this.state.markers);
      this.state.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  updateResultsDisplay() {
    const resultsContainer = document.getElementById('resultsTable');
    const batchResultsContainer = document.getElementById('batchResultsTable');
    
    if (this.state.results.length === 0) {
      if (resultsContainer) resultsContainer.style.display = 'none';
      if (batchResultsContainer) batchResultsContainer.style.display = 'none';
      return;
    }

    const tableHtml = this.generateResultsTableHTML();
    
    if (this.state.activeTab === 'single' && resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.innerHTML = tableHtml;
    }
    
    if (this.state.activeTab === 'batch' && batchResultsContainer) {
      batchResultsContainer.style.display = 'block';
      batchResultsContainer.innerHTML = tableHtml;
    }
  }

  generateResultsTableHTML() {
    return `
      <div class="table-responsive">
        <table class="table table-hover table-striped ${this.state.theme === 'dark' ? 'dark' : ''}">
          <thead>
            <tr>
              <th scope="col">${this.t('input')}</th>
              <th scope="col">${this.t('output')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.state.results.map(result => `
              <tr>
                <td>${result.input}</td>
                <td>${result.output.join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  updateLoadingState() {
    const buttons = document.querySelectorAll('[data-loading]');
    buttons.forEach(btn => {
      btn.disabled = this.state.loading;
      if (this.state.loading) {
        btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> ${this.t('loading')}`;
      } else {
        const key = btn.dataset.loading;
        btn.textContent = this.t(key);
      }
    });
  }

  importFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        let rows = [];
        
        if (extension === 'csv') {
          // Simple CSV parsing
          rows = e.target.result.split('\n').map(line => line.split(','));
        } else if (['xlsx', 'xls'].includes(extension)) {
          this.showError('Excel files require additional library. Please use CSV format.');
          return;
        }

        const textarea = document.getElementById('batchTextarea');
        if (textarea) {
          textarea.value = rows
            .map(row => row[0] || '')
            .filter(item => item.trim())
            .join('\n');
        }

        const label = document.querySelector('.custom-file-label');
        if (label) label.textContent = file.name;
        
        this.showSuccess('File imported successfully');
      } catch (error) {
        this.showError('Failed to import file');
      }
    };

    reader.readAsText(file);
  }

  async copyToClipboard() {
    try {
      const text = this.state.results
        .map(result => `${result.input},${result.output.join(';')}`)
        .join('\n');
      
      await navigator.clipboard.writeText(text);
      this.showSuccess(this.t('copy'));
    } catch (error) {
      this.showError('Failed to copy to clipboard');
    }
  }

  exportCSV() {
    try {
      const csvContent = [
        'Input,Output',
        ...this.state.results.map(result => 
          `"${result.input}","${result.output.join(';')}"`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'zip-city-lookup-results.csv';
      link.click();
    } catch (error) {
      this.showError('Failed to export CSV');
    }
  }

  exportExcel() {
    this.showError('Excel export requires additional library. Please use CSV export.');
  }

  showError(message) {
    this.showAlert(message, 'danger');
  }

  showSuccess(message) {
    this.showAlert(message, 'success');
  }

  showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}"></i> ${message}
      <button type="button" class="close" onclick="this.parentElement.remove()">
        <span aria-hidden="true">&times;</span>
      </button>
    `;

    container.appendChild(alert);

    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 5000);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.zipLookupApp = new PolishZipLookup();
});