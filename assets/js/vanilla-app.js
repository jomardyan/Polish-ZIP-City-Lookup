// Enhanced vanilla JavaScript implementation for Polish ZIP & City Lookup
// Full-featured implementation with history, settings, and advanced features

class PolishZipLookup {
  constructor() {
    this.config = {
      GEONAMES_USERNAME: 'demo', // Replace with actual username
      MAP_CENTER: [52.237049, 21.017532],
      MAP_ZOOM: 6,
      API_TIMEOUT: 30000,
      HISTORY_LIMIT: 1000,
      VERSION: '2.0.0'
    };

    this.state = {
      activeTab: 'single',
      mode: 'zip',
      results: [],
      loading: false,
      locale: 'en',
      theme: 'light',
      map: null,
      markers: [],
      history: [],
      favorites: [],
      settings: this.getDefaultSettings(),
      cache: new Map(),
      isProcessingBatch: false,
      batchPaused: false
    };

    // Translation manager will be handled by the separate translation files
    // The translations object is now managed by TranslationManager
    
    this.init();
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      language: 'en',
      fontSize: 'normal',
      compactMode: false,
      animationsEnabled: true,
      defaultMode: 'auto',
      maxResults: 50,
      autoSuggestions: true,
      fuzzySearch: true,
      instantResults: false,
      saveHistory: true,
      saveSettings: true,
      analytics: false,
      historyRetention: 30,
      mapProvider: 'osm',
      mapZoom: 10,
      autoFit: true,
      showMarkers: true,
      apiTimeout: 30,
      cacheSize: 100,
      debugMode: false,
      offlineMode: false
    };
  }

  init() {
    this.loadPreferences();
    this.loadHistory();
    this.loadFavorites();
    this.setupEventListeners();
    this.initializeMap();
    this.setupDragAndDrop();
    this.updateUI();
    this.updateStats();
  }

  t(key) {
    // Use TranslationManager if available
    if (window.translationManager) {
      return window.translationManager.t(key, this.state.locale);
    }
    
    // Fallback for basic translations if TranslationManager is not loaded
    const basicTranslations = {
      en: { loading: 'Loading...', error: 'Error occurred', clear: 'Clear', results: 'Results' },
      pl: { loading: 'Ładowanie...', error: 'Wystąpił błąd', clear: 'Wyczyść', results: 'Wyniki' }
    };
    
    const translations = basicTranslations[this.state.locale] || basicTranslations['en'];
    return translations[key] || key;
  }

  loadPreferences() {
    try {
      const savedSettings = localStorage.getItem('zipLookupSettings');
      if (savedSettings) {
        this.state.settings = { ...this.getDefaultSettings(), ...JSON.parse(savedSettings) };
      }
      
      this.state.locale = this.state.settings.language;
      this.state.theme = this.state.settings.theme;
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
  }

  loadHistory() {
    try {
      const savedHistory = localStorage.getItem('zipLookupHistory');
      if (savedHistory) {
        this.state.history = JSON.parse(savedHistory);
      }
    } catch (error) {
      console.warn('Failed to load history:', error);
    }
  }

  loadFavorites() {
    try {
      const savedFavorites = localStorage.getItem('zipLookupFavorites');
      if (savedFavorites) {
        this.state.favorites = JSON.parse(savedFavorites);
      }
    } catch (error) {
      console.warn('Failed to load favorites:', error);
    }
  }

  savePreferences() {
    try {
      localStorage.setItem('zipLookupSettings', JSON.stringify(this.state.settings));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  }

  saveHistory() {
    if (!this.state.settings.saveHistory) return;
    
    try {
      // Limit history size
      if (this.state.history.length > this.config.HISTORY_LIMIT) {
        this.state.history = this.state.history.slice(-this.config.HISTORY_LIMIT);
      }
      localStorage.setItem('zipLookupHistory', JSON.stringify(this.state.history));
    } catch (error) {
      console.warn('Failed to save history:', error);
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('zipLookupFavorites', JSON.stringify(this.state.favorites));
    } catch (error) {
      console.warn('Failed to save favorites:', error);
    }
  }

  addToHistory(input, output, type) {
    if (!this.state.settings.saveHistory) return;
    
    const entry = {
      id: Date.now(),
      input,
      output: Array.isArray(output) ? output : [output],
      type,
      timestamp: new Date().toISOString(),
      favorite: false
    };
    
    // Remove duplicate if exists
    this.state.history = this.state.history.filter(h => 
      !(h.input === input && h.type === type)
    );
    
    // Add to beginning
    this.state.history.unshift(entry);
    this.saveHistory();
    this.updateStats();
  }

  toggleFavorite(historyId) {
    const entry = this.state.history.find(h => h.id === historyId);
    if (entry) {
      entry.favorite = !entry.favorite;
      
      if (entry.favorite) {
        this.state.favorites.push({...entry});
      } else {
        this.state.favorites = this.state.favorites.filter(f => f.id !== historyId);
      }
      
      this.saveHistory();
      this.saveFavorites();
      this.updateUI();
      this.updateStats();
    }
  }

  setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('border-primary');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('border-primary');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-primary');
      
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        this.processDroppedFiles(files);
      }
    });

    dropZone.addEventListener('click', () => {
      document.getElementById('fileInput')?.click();
    });
  }

  processDroppedFiles(files) {
    files.forEach(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      if (['csv', 'txt', 'xlsx', 'xls'].includes(extension)) {
        this.importFile({ target: { files: [file] } });
      } else {
        this.showError(`Unsupported file type: ${extension}`);
      }
    });
  }

  updateStats() {
    const totalElement = document.getElementById('totalSearches');
    const totalStatElement = document.getElementById('totalSearchesStat');
    const todayStatElement = document.getElementById('todaySearchesStat');
    const favoritesStatElement = document.getElementById('favoritesStat');
    const memberSinceElement = document.getElementById('memberSince');

    if (totalElement) {
      totalElement.textContent = this.state.history.length;
    }

    if (totalStatElement) {
      totalStatElement.textContent = this.state.history.length;
    }

    if (todayStatElement) {
      const today = new Date().toDateString();
      const todayCount = this.state.history.filter(h => 
        new Date(h.timestamp).toDateString() === today
      ).length;
      todayStatElement.textContent = todayCount;
    }

    if (favoritesStatElement) {
      favoritesStatElement.textContent = this.state.favorites.length;
    }

    if (memberSinceElement && this.state.history.length > 0) {
      const firstSearch = this.state.history[this.state.history.length - 1];
      const date = new Date(firstSearch.timestamp).toLocaleDateString();
      memberSinceElement.textContent = date;
    }
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
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
          this.state.settings.language = locale;
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
      this.state.settings.theme = this.state.theme;
      this.savePreferences();
      this.updateUI();
      this.showSuccess('Theme changed');
    });

    // Fullscreen toggle
    document.getElementById('fullscreenToggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleFullscreen();
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

    // Swap inputs
    document.getElementById('swapInputsBtn')?.addEventListener('click', () => {
      this.swapInputs();
    });

    // Random sample
    document.getElementById('randomSampleBtn')?.addEventListener('click', () => {
      this.loadRandomSample();
    });

    // Enter key handlers
    document.getElementById('zipInput')?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.lookupSingle('zip');
    });

    document.getElementById('cityInput')?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.lookupSingle('city');
    });

    // Input counter for batch textarea
    document.getElementById('batchTextarea')?.addEventListener('input', (e) => {
      this.updateInputCounter(e.target.value);
    });

    // Sample buttons
    document.getElementById('sampleZipsBtn')?.addEventListener('click', () => {
      this.loadSampleData('zips');
    });

    document.getElementById('sampleCitiesBtn')?.addEventListener('click', () => {
      this.loadSampleData('cities');
    });

    document.getElementById('clearTextareaBtn')?.addEventListener('click', () => {
      document.getElementById('batchTextarea').value = '';
      this.updateInputCounter('');
    });

    // Batch processing
    document.getElementById('processBatchBtn')?.addEventListener('click', () => {
      this.processBatch();
    });

    // Batch control buttons
    document.getElementById('pauseBtn')?.addEventListener('click', () => {
      this.pauseBatch();
    });

    document.getElementById('stopBtn')?.addEventListener('click', () => {
      this.stopBatch();
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

    document.getElementById('printBtn')?.addEventListener('click', () => {
      this.printResults();
    });

    // History filters
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.closest('[data-filter]').dataset.filter;
        this.filterHistory(filter);
      });
    });

    // History search
    document.getElementById('historySearch')?.addEventListener('input', (e) => {
      this.searchHistory(e.target.value);
    });

    document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
      document.getElementById('historySearch').value = '';
      this.searchHistory('');
    });

    // History management
    document.getElementById('exportHistoryBtn')?.addEventListener('click', () => {
      this.exportHistory();
    });

    document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
      this.clearHistory();
    });

    document.getElementById('clearFavoritesBtn')?.addEventListener('click', () => {
      this.clearFavorites();
    });

    // Settings
    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
      this.state.settings.theme = e.target.value;
      this.state.theme = e.target.value;
      this.savePreferences();
      this.updateUI();
    });

    document.getElementById('languageSelect')?.addEventListener('change', (e) => {
      this.state.settings.language = e.target.value;
      this.state.locale = e.target.value;
      this.savePreferences();
      this.updateUI();
    });

    document.getElementById('mapZoom')?.addEventListener('input', (e) => {
      document.getElementById('zoomValue').textContent = e.target.value;
      this.state.settings.mapZoom = parseInt(e.target.value);
    });

    document.getElementById('resetSettingsBtn')?.addEventListener('click', () => {
      this.resetSettings();
    });

    document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
      this.applySettings();
    });

    document.getElementById('clearAllDataBtn')?.addEventListener('click', () => {
      this.clearAllData();
    });

    // Settings checkboxes and selects
    this.setupSettingsListeners();
  }

  setupSettingsListeners() {
    const settingsFields = [
      'fontSize', 'compactMode', 'animationsEnabled', 'defaultMode', 'maxResults',
      'autoSuggestions', 'fuzzySearch', 'instantResults', 'saveHistory', 'saveSettings',
      'analytics', 'historyRetention', 'mapProvider', 'autoFit', 'showMarkers',
      'apiTimeout', 'cacheSize', 'debugMode', 'offlineMode'
    ];

    settingsFields.forEach(field => {
      const element = document.getElementById(field);
      if (element) {
        const eventType = element.type === 'checkbox' ? 'change' : 'input';
        element.addEventListener(eventType, (e) => {
          const value = element.type === 'checkbox' ? e.target.checked : e.target.value;
          this.state.settings[field] = value;
        });
      }
    });
  }

  updateUI() {
    // Apply theme
    document.body.className = `theme-${this.state.theme}`;
    if (this.state.settings.compactMode) {
      document.body.classList.add('compact-mode');
    }
    
    // Apply font size
    document.body.classList.add(`font-${this.state.settings.fontSize}`);
    
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
      const navItem = tab.closest('.nav-item');
      if (navItem) {
        navItem.classList.toggle('active', tab.dataset.tab === this.state.activeTab);
      }
      tab.classList.toggle('active', tab.dataset.tab === this.state.activeTab);
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

    // Update clear results button visibility
    const clearBtn = document.getElementById('clearResultsBtn');
    if (clearBtn) {
      clearBtn.style.display = this.state.results.length > 0 ? 'inline-block' : 'none';
    }

    // Update settings form
    this.updateSettingsForm();

    // Update results display
    this.updateResultsDisplay();

    // Update history if on history tab
    if (this.state.activeTab === 'history') {
      this.renderHistoryList();
      this.renderFavoritesList();
    }
  }

  updateSettingsForm() {
    // Update form controls with current settings
    Object.keys(this.state.settings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = this.state.settings[key];
        } else {
          element.value = this.state.settings[key];
        }
      }
    });

    // Update zoom value display
    const zoomValue = document.getElementById('zoomValue');
    const mapZoom = document.getElementById('mapZoom');
    if (zoomValue && mapZoom) {
      zoomValue.textContent = mapZoom.value;
    }
  }

  renderFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    if (this.state.favorites.length === 0) {
      favoritesList.innerHTML = `
        <div class="text-center text-muted py-3">
          <i class="bi bi-star display-4 mb-2"></i>
          <p class="small mb-0">${this.t('noFavorites')}</p>
          <small>${this.t('favoritesHelp')}</small>
        </div>
      `;
      return;
    }

    favoritesList.innerHTML = this.state.favorites.map(entry => `
      <div class="list-group-item">
        <div class="d-flex w-100 justify-content-between">
          <small><strong>${entry.input}</strong> → ${entry.output.join(', ')}</small>
          <button class="btn btn-sm btn-outline-danger" onclick="zipLookupApp.toggleFavorite(${entry.id})">
            <i class="bi bi-star-fill"></i>
          </button>
        </div>
      </div>
    `).join('');
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

    // Auto-detect mode
    if (this.state.settings.defaultMode === 'auto') {
      type = this.detectInputType(input);
    }

    if (type === 'zip' && !this.validateZip(input)) {
      this.showError(this.t('invalidZip'));
      return;
    }

    this.state.loading = true;
    this.updateLoadingState();

    try {
      let result;
      if (type === 'zip') {
        const zip = this.normalizeZip(input);
        result = await this.lookupZipToCity(zip);
        this.state.results = [{
          input: zip,
          output: result.cities,
          lat: result.lat,
          lon: result.lon,
          type: 'zip'
        }];
        this.addToHistory(zip, result.cities, 'zip');
      } else {
        result = await this.lookupCityToZip(input);
        this.state.results = [{
          input: input,
          output: result.postalCodes,
          type: 'city'
        }];
        this.addToHistory(input, result.postalCodes, 'city');
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

  detectInputType(input) {
    return this.validateZip(input) ? 'zip' : 'city';
  }

  swapInputs() {
    const zipInput = document.getElementById('zipInput');
    const cityInput = document.getElementById('cityInput');
    
    if (zipInput && cityInput) {
      const temp = zipInput.value;
      zipInput.value = cityInput.value;
      cityInput.value = temp;
    }
  }

  loadRandomSample() {
    const samples = {
      zips: ['00-001', '02-676', '31-008', '80-001', '50-001'],
      cities: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań']
    };
    
    const isZip = Math.random() > 0.5;
    const sampleArray = isZip ? samples.zips : samples.cities;
    const sample = sampleArray[Math.floor(Math.random() * sampleArray.length)];
    
    if (isZip) {
      document.getElementById('zipInput').value = sample;
      document.getElementById('cityInput').value = '';
    } else {
      document.getElementById('cityInput').value = sample;
      document.getElementById('zipInput').value = '';
    }
  }

  updateInputCounter(text) {
    const lines = text.split('\n').filter(line => line.trim()).length;
    const counter = document.getElementById('inputCounter');
    if (counter) {
      counter.textContent = lines;
    }
  }

  loadSampleData(type) {
    const samples = {
      zips: ['00-001', '02-676', '31-008', '80-001', '50-001', '60-001', '70-001', '90-001'],
      cities: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Łódź', 'Szczecin', 'Lublin']
    };
    
    const textarea = document.getElementById('batchTextarea');
    if (textarea) {
      textarea.value = samples[type].join('\n');
      this.updateInputCounter(textarea.value);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  pauseBatch() {
    this.state.batchPaused = !this.state.batchPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
      pauseBtn.innerHTML = this.state.batchPaused 
        ? '<i class="bi bi-play-circle"></i> Resume'
        : '<i class="bi bi-pause-circle"></i> Pause';
    }
  }

  stopBatch() {
    this.state.isProcessingBatch = false;
    this.state.batchPaused = false;
    this.updateBatchControls();
  }

  updateBatchControls() {
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const processBtn = document.getElementById('processBatchBtn');
    
    if (this.state.isProcessingBatch) {
      pauseBtn?.style.setProperty('display', 'inline-block');
      stopBtn?.style.setProperty('display', 'inline-block');
      processBtn?.setAttribute('disabled', 'true');
    } else {
      pauseBtn?.style.setProperty('display', 'none');
      stopBtn?.style.setProperty('display', 'none');
      processBtn?.removeAttribute('disabled');
    }
  }

  printResults() {
    const printWindow = window.open('', '_blank');
    const resultsHtml = this.generatePrintableResults();
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Polish ZIP & City Lookup Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Polish ZIP & City Lookup Results</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          ${resultsHtml}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  }

  generatePrintableResults() {
    if (this.state.results.length === 0) {
      return '<p>No results to print.</p>';
    }
    
    return `
      <table>
        <thead>
          <tr>
            <th>Input</th>
            <th>Output</th>
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
    `;
  }

  filterHistory(filter) {
    // Update active filter button
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    this.renderHistoryList(filter);
  }

  searchHistory(query) {
    this.renderHistoryList(null, query);
  }

  renderHistoryList(filter = null, searchQuery = '') {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    let filteredHistory = this.state.history;

    // Apply time filter
    if (filter && filter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filter) {
      case 'today':
        cutoff.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      }
      
      filteredHistory = filteredHistory.filter(h => new Date(h.timestamp) >= cutoff);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredHistory = filteredHistory.filter(h => 
        h.input.toLowerCase().includes(query) ||
        h.output.some(o => o.toLowerCase().includes(query))
      );
    }

    if (filteredHistory.length === 0) {
      historyList.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-clock-history display-4 mb-3"></i>
          <p>${this.t('noHistory')}</p>
        </div>
      `;
      return;
    }

    historyList.innerHTML = filteredHistory.map(entry => `
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${entry.input} → ${entry.output.join(', ')}</h6>
          <small>${new Date(entry.timestamp).toLocaleString()}</small>
        </div>
        <p class="mb-1 small text-muted">${entry.type === 'zip' ? 'ZIP → City' : 'City → ZIP'}</p>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-primary" onclick="zipLookupApp.repeatSearch('${entry.input}', '${entry.type}')">
            <i class="bi bi-repeat"></i> Repeat
          </button>
          <button class="btn btn-outline-warning" onclick="zipLookupApp.toggleFavorite(${entry.id})">
            <i class="bi bi-star${entry.favorite ? '-fill' : ''}"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  repeatSearch(input, type) {
    if (type === 'zip') {
      document.getElementById('zipInput').value = input;
      this.lookupSingle('zip');
    } else {
      document.getElementById('cityInput').value = input;
      this.lookupSingle('city');
    }
    
    // Switch to single tab
    this.state.activeTab = 'single';
    this.updateUI();
  }

  exportHistory() {
    try {
      const csvContent = [
        'Timestamp,Input,Output,Type',
        ...this.state.history.map(entry => 
          `"${entry.timestamp}","${entry.input}","${entry.output.join(';')}","${entry.type}"`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'search-history.csv';
      link.click();
      
      this.showSuccess('History exported successfully');
    } catch (error) {
      this.showError('Failed to export history');
    }
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all search history?')) {
      this.state.history = [];
      this.saveHistory();
      this.renderHistoryList();
      this.updateStats();
      this.showSuccess('History cleared');
    }
  }

  clearFavorites() {
    if (confirm('Are you sure you want to clear all favorites?')) {
      this.state.favorites = [];
      this.state.history.forEach(h => h.favorite = false);
      this.saveFavorites();
      this.saveHistory();
      this.updateUI();
      this.showSuccess('Favorites cleared');
    }
  }

  resetSettings() {
    if (confirm('Reset all settings to defaults?')) {
      this.state.settings = this.getDefaultSettings();
      this.state.locale = this.state.settings.language;
      this.state.theme = this.state.settings.theme;
      this.savePreferences();
      this.updateUI();
      this.showSuccess('Settings reset to defaults');
    }
  }

  applySettings() {
    // Apply all settings from form
    this.savePreferences();
    this.updateUI();
    this.showSuccess('Settings saved successfully');
  }

  clearAllData() {
    if (confirm('This will clear ALL data including history, favorites, and settings. Continue?')) {
      localStorage.removeItem('zipLookupHistory');
      localStorage.removeItem('zipLookupFavorites');
      localStorage.removeItem('zipLookupSettings');
      
      this.state.history = [];
      this.state.favorites = [];
      this.state.settings = this.getDefaultSettings();
      
      this.updateUI();
      this.showSuccess('All data cleared');
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
    const maxRowsSelect = document.getElementById('maxRowsSelect');
    const delaySelect = document.getElementById('delaySelect');
    const skipDuplicates = document.getElementById('skipDuplicates')?.checked;
    const continueOnError = document.getElementById('continueOnError')?.checked;
    
    if (!textarea || !modeSelect) return;

    const items = textarea.value
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    if (items.length === 0) {
      this.showError(this.t('pasteInputs'));
      return;
    }

    // Remove duplicates if option is enabled
    const processItems = skipDuplicates ? [...new Set(items)] : items;
    const maxRows = parseInt(maxRowsSelect?.value || 50);
    const delay = parseInt(delaySelect?.value || 100);
    
    // Limit processing
    const itemsToProcess = processItems.slice(0, maxRows);

    this.state.loading = true;
    this.state.isProcessingBatch = true;
    this.state.results = [];
    this.updateLoadingState();
    this.updateBatchControls();

    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    
    if (progressContainer) progressContainer.style.display = 'block';

    for (let i = 0; i < itemsToProcess.length; i++) {
      if (!this.state.isProcessingBatch) break;
      
      // Wait if paused
      while (this.state.batchPaused && this.state.isProcessingBatch) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const item = itemsToProcess[i];
      let mode = modeSelect.value;
      
      try {
        if (mode === 'auto') {
          mode = this.detectInputType(item);
        }

        if (mode === 'zip') {
          if (!this.validateZip(item)) {
            this.state.results.push({
              input: item,
              output: [this.t('invalidFormat')],
              type: 'zip'
            });
            continue;
          }

          const zip = this.normalizeZip(item);
          const result = await this.lookupZipToCity(zip);
          this.state.results.push({
            input: zip,
            output: result.cities,
            lat: result.lat,
            lon: result.lon,
            type: 'zip'
          });
          this.addToHistory(zip, result.cities, 'zip');
        } else {
          const result = await this.lookupCityToZip(item);
          this.state.results.push({
            input: item,
            output: result.postalCodes,
            type: 'city'
          });
          this.addToHistory(item, result.postalCodes, 'city');
        }
      } catch (error) {
        this.state.results.push({
          input: item,
          output: [this.t('notFound')],
          type: mode || 'unknown'
        });
        
        if (!continueOnError) {
          this.showError(`Error processing "${item}": ${error.message}`);
          break;
        }
      }

      // Update progress
      const progress = ((i + 1) / itemsToProcess.length) * 100;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
      }

      // Add delay between requests
      if (delay > 0 && i < itemsToProcess.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    this.state.loading = false;
    this.state.isProcessingBatch = false;
    this.updateLoadingState();
    this.updateBatchControls();
    this.updateMap();
    this.updateUI();
    
    if (progressContainer) progressContainer.style.display = 'none';
    
    this.showSuccess(`Processed ${this.state.results.length} items`);
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

// Make class available globally and for testing
/* eslint-disable no-undef */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PolishZipLookup;
} else if (typeof window !== 'undefined') {
  window.PolishZipLookup = PolishZipLookup;
}

// Note: Application initialization is now handled in the HTML file
// after translation manager is properly loaded
/* eslint-enable no-undef */