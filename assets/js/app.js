// Configuration
const CONFIG = {
  GEONAMES_USERNAME: 'demo', // Use 'demo' for testing, replace with actual username
  MAP_CENTER: [52.237049, 21.017532],
  MAP_ZOOM: 6,
  API_TIMEOUT: 10000
};

// Translation messages
const messages = {
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
    languageChanged: 'Language changed',
    themeChanged: 'Theme changed',
    copied: 'Copied to clipboard',
    error: 'An error occurred',
    loading: 'Loading...',
    changeLanguage: 'Change language',
    toggleTheme: 'Toggle theme'
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
    languageChanged: 'Język zmieniony',
    themeChanged: 'Motyw zmieniony',
    copied: 'Skopiowano do schowka',
    error: 'Wystąpił błąd',
    loading: 'Ładowanie...',
    changeLanguage: 'Zmień język',
    toggleTheme: 'Przełącz motyw'
  }
};

// Utility functions
const Utils = {
  validateZip(zip) {
    const cleaned = zip.trim();
    return /^\d{2}-\d{3}$|^\d{5}$/.test(cleaned);
  },

  normalizeZip(zip) {
    const cleaned = zip.trim();
    return /^\d{5}$/.test(cleaned) 
      ? cleaned.slice(0, 2) + '-' + cleaned.slice(2) 
      : cleaned;
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  async timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// API service
const ApiService = {
  async lookupZipToCity(zip) {
    try {
      const response = await axios.get(`https://api.zippopotam.us/pl/${zip}`, {
        timeout: CONFIG.API_TIMEOUT
      });
      const cities = [...new Set(response.data.places.map(p => p['place name']))];
      const lat = parseFloat(response.data.places[0].latitude);
      const lon = parseFloat(response.data.places[0].longitude);
      return { cities, lat, lon };
    } catch (error) {
      console.error('ZIP lookup error:', error);
      throw new Error('ZIP code not found');
    }
  },

  async lookupCityToZip(city) {
    try {
      const response = await axios.get('https://secure.geonames.org/postalCodeSearchJSON', {
        params: {
          placename: city,
          country: 'PL',
          maxRows: 200,
          username: CONFIG.GEONAMES_USERNAME
        },
        timeout: CONFIG.API_TIMEOUT
      });
      
      if (!response.data.postalCodes || response.data.postalCodes.length === 0) {
        throw new Error('City not found');
      }
      
      const postalCodes = [...new Set(response.data.postalCodes.map(pc => pc.postalCode))];
      return { postalCodes };
    } catch (error) {
      console.error('City lookup error:', error);
      throw new Error('City not found');
    }
  }
};

// Initialize Vue.js application
function initializeApp() {
  // Check if required libraries are loaded
  if (typeof Vue === 'undefined') {
    console.error('Vue.js is not loaded');
    return;
  }
  
  if (typeof VueI18n === 'undefined') {
    console.error('Vue I18n is not loaded');
    return;
  }

  // Initialize Vue I18n
  const i18n = new VueI18n({
    locale: 'en',
    messages
  });

  // Create Vue application
  const app = new Vue({
    i18n,
    el: '#app',
    data: {
      activeTab: 'single',
      mode: 'zip',
      singleZip: '',
      singleCity: '',
      batchInputs: '',
      results: [],
      map: null,
      markers: [],
      loading: false,
      lookupType: '',
      batchMode: false,
      errorMessage: '',
      successMessage: '',
      locale: 'en',
      theme: 'light',
      zipValidationError: '',
      cityValidationError: ''
    },
    watch: {
      locale(newVal) {
        this.$i18n.locale = newVal;
        localStorage.setItem('locale', newVal);
      },
      theme(newVal) {
        document.body.className = newVal;
        localStorage.setItem('theme', newVal);
      }
    },
    mounted() {
      // Initialize map
      this.initializeMap();
      
      // Load saved preferences
      this.loadPreferences();
      
      // Add keyboard shortcuts
      this.addKeyboardShortcuts();
    },
    methods: {
      initializeMap() {
        try {
          this.map = L.map('map').setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);
        } catch (error) {
          console.error('Map initialization error:', error);
          this.showError('Map initialization failed');
        }
      },

      loadPreferences() {
        const savedLocale = localStorage.getItem('locale');
        const savedTheme = localStorage.getItem('theme');
        
        if (savedLocale && ['en', 'pl'].includes(savedLocale)) {
          this.locale = savedLocale;
        }
        
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          this.theme = savedTheme;
        }
      },

      addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
          if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
            case '1':
              e.preventDefault();
              this.activeTab = 'single';
              break;
            case '2':
              e.preventDefault();
              this.activeTab = 'batch';
              break;
            case 'k':
              e.preventDefault();
              this.clearResults();
              break;
            }
          }
        });
      },

      setLocale(locale) {
        this.locale = locale;
        this.showSuccess(this.$t('languageChanged'));
      },

      toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.showSuccess(this.$t('themeChanged'));
      },

      clearResults() {
        this.results = [];
        this.clearMapMarkers();
        this.showSuccess(this.$t('clearResults'));
      },

      clearMapMarkers() {
        if (this.markers.length > 0) {
          this.markers.forEach(marker => this.map.removeLayer(marker));
          this.markers = [];
        }
      },

      showError(message) {
        this.errorMessage = message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },

      showSuccess(message) {
        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },

      async lookupSingle(type) {
        this.results = [];
        this.lookupType = type;
        this.loading = true;

        try {
          if (type === 'zip') {
            if (!Utils.validateZip(this.singleZip)) {
              throw new Error(this.$t('invalidZip'));
            }

            const zip = Utils.normalizeZip(this.singleZip);
            const { cities, lat, lon } = await ApiService.lookupZipToCity(zip);
            
            this.results.push({
              input: zip,
              output: cities,
              lat,
              lon
            });
          } else {
            const city = this.singleCity.trim();
            if (!city) {
              throw new Error(this.$t('invalidCity'));
            }

            const { postalCodes } = await ApiService.lookupCityToZip(city);
            
            this.results.push({
              input: city,
              output: postalCodes
            });
          }

          this.updateMap();
          this.showSuccess(this.$t('results'));
        } catch (error) {
          this.clearResults();
          this.showError(error.message || this.$t('error'));
        } finally {
          this.loading = false;
        }
      },

      async processBatch() {
        this.results = [];
        this.batchMode = true;
        this.loading = true;

        const items = this.batchInputs
          .split('\n')
          .map(line => line.trim())
          .filter(line => line);

        if (items.length === 0) {
          this.showError(this.$t('pasteInputs'));
          this.loading = false;
          this.batchMode = false;
          return;
        }

        for (const item of items) {
          try {
            if (this.mode === 'zip') {
              if (!Utils.validateZip(item)) {
                this.results.push({
                  input: item,
                  output: [this.$t('invalidFormat')]
                });
                continue;
              }

              const zip = Utils.normalizeZip(item);
              const { cities, lat, lon } = await ApiService.lookupZipToCity(zip);
              
              this.results.push({
                input: zip,
                output: cities,
                lat,
                lon
              });
            } else {
              const { postalCodes } = await ApiService.lookupCityToZip(item);
              
              this.results.push({
                input: item,
                output: postalCodes
              });
            }
          } catch (error) {
            this.results.push({
              input: item,
              output: [this.$t('notFound')]
            });
          }

          // Small delay to prevent rate limiting
          await Utils.timeout(100);
        }

        this.updateMap();
        this.showSuccess(this.$t('batchResults'));
        this.loading = false;
        this.batchMode = false;
      },

      importFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (e) => {
          let rows = [];
          
          try {
            if (extension === 'csv') {
              rows = Papa.parse(e.target.result, { header: false }).data;
            } else if (['xlsx', 'xls'].includes(extension)) {
              const arrayBuffer = new Uint8Array(e.target.result);
              const workbook = XLSX.read(arrayBuffer, { type: 'array' });
              rows = XLSX.utils.sheet_to_json(
                workbook.Sheets[workbook.SheetNames[0]], 
                { header: 1 }
              );
            }

            this.batchInputs = rows
              .map(row => row[0] || '')
              .filter(item => item)
              .join('\n');
              
            document.querySelector('.custom-file-label').textContent = file.name;
            this.showSuccess('File imported successfully');
          } catch (error) {
            this.showError('Failed to import file');
          }
        };

        if (extension === 'csv') {
          reader.readAsText(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      },

      updateMap() {
        this.clearMapMarkers();
        
        const validResults = this.results.filter(result => result.lat && result.lon);
        
        validResults.forEach(result => {
          const marker = L.marker([result.lat, result.lon])
            .addTo(this.map)
            .bindPopup(`<strong>${result.input}</strong><br>${result.output.join(', ')}`);
          
          this.markers.push(marker);
        });

        if (this.markers.length > 0) {
          const group = L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds().pad(0.1));
        }
      },

      async copyToClipboard() {
        try {
          const text = this.results
            .map(result => `${result.input},${result.output.join(';')}`)
            .join('\n');
          
          await navigator.clipboard.writeText(text);
          this.showSuccess(this.$t('copied'));
        } catch (error) {
          this.showError('Failed to copy to clipboard');
        }
      },

      exportCSV() {
        try {
          const csv = Papa.unparse(
            this.results.map(result => ({
              Input: result.input,
              Output: result.output.join(';')
            }))
          );
          
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, 'zip-city-lookup-results.csv');
        } catch (error) {
          this.showError('Failed to export CSV');
        }
      },

      exportExcel() {
        try {
          const worksheet = XLSX.utils.json_to_sheet(
            this.results.map(result => ({
              Input: result.input,
              Output: result.output.join(';')
            }))
          );
          
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
          
          const excelBuffer = XLSX.write(workbook, { 
            bookType: 'xlsx', 
            type: 'array' 
          });
          
          const blob = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          
          saveAs(blob, 'zip-city-lookup-results.xlsx');
        } catch (error) {
          this.showError('Failed to export Excel');
        }
      }
    }
  });

  return app;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});