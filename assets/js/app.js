// Polish ZIP & City Lookup - Bootstrap 5.3.7 with jQuery Implementation
// Clean, modern web application with proper Bootstrap JS integration

$(document).ready(function() {
    'use strict';
    
    console.log('Document ready fired, initializing Polish ZIP App...');
    
    // Initialize the application
    const PolishZipApp = {
        // Application configuration
        config: {
            GEONAMES_USERNAME: 'demo',
            MAP_CENTER: [52.237049, 21.017532],
            MAP_ZOOM: 6,
            API_TIMEOUT: 30000,
            HISTORY_LIMIT: 1000,
            VERSION: '2.0.1'
        },

        // Polish postal code database (sample data - in real app would be loaded from API/file)
        postalDatabase: {
            // Major cities with their postal codes
            '00-001': { city: 'Warszawa', voivodeship: 'Mazowieckie', county: 'warszawa', coordinates: [52.2297, 21.0122] },
            '00-002': { city: 'Warszawa', voivodeship: 'Mazowieckie', county: 'warszawa', coordinates: [52.2297, 21.0122] },
            '00-003': { city: 'Warszawa', voivodeship: 'Mazowieckie', county: 'warszawa', coordinates: [52.2297, 21.0122] },
            '31-000': { city: 'Kraków', voivodeship: 'Małopolskie', county: 'kraków', coordinates: [50.0647, 19.9450] },
            '31-001': { city: 'Kraków', voivodeship: 'Małopolskie', county: 'kraków', coordinates: [50.0647, 19.9450] },
            '31-002': { city: 'Kraków', voivodeship: 'Małopolskie', county: 'kraków', coordinates: [50.0647, 19.9450] },
            '80-001': { city: 'Gdańsk', voivodeship: 'Pomorskie', county: 'gdańsk', coordinates: [54.3520, 18.6466] },
            '80-002': { city: 'Gdańsk', voivodeship: 'Pomorskie', county: 'gdańsk', coordinates: [54.3520, 18.6466] },
            '80-003': { city: 'Gdańsk', voivodeship: 'Pomorskie', county: 'gdańsk', coordinates: [54.3520, 18.6466] },
            '61-001': { city: 'Poznań', voivodeship: 'Wielkopolskie', county: 'poznań', coordinates: [52.4064, 16.9252] },
            '50-001': { city: 'Wrocław', voivodeship: 'Dolnośląskie', county: 'wrocław', coordinates: [51.1079, 17.0385] },
            '40-001': { city: 'Katowice', voivodeship: 'Śląskie', county: 'katowice', coordinates: [50.2649, 19.0238] },
            '90-001': { city: 'Łódź', voivodeship: 'Łódzkie', county: 'łódź', coordinates: [51.7592, 19.4560] },
            '20-001': { city: 'Lublin', voivodeship: 'Lubelskie', county: 'lublin', coordinates: [51.2465, 22.5684] },
            '85-001': { city: 'Bydgoszcz', voivodeship: 'Kujawsko-Pomorskie', county: 'bydgoszcz', coordinates: [53.1235, 18.0084] },
            '70-001': { city: 'Szczecin', voivodeship: 'Zachodniopomorskie', county: 'szczecin', coordinates: [53.4285, 14.5528] }
        },

        // Reverse lookup: city name to postal codes
        cityDatabase: {
            'Warszawa': ['00-001', '00-002', '00-003', '00-950', '01-001', '02-001'],
            'Kraków': ['31-000', '31-001', '31-002', '30-001', '30-002', '30-003'],
            'Gdańsk': ['80-001', '80-002', '80-003', '80-950', '80-951', '80-952'],
            'Poznań': ['61-001', '60-001', '60-002', '60-003', '61-002', '61-003'],
            'Wrocław': ['50-001', '50-002', '50-003', '51-001', '52-001', '53-001'],
            'Katowice': ['40-001', '40-002', '40-003', '41-001', '42-001', '43-001'],
            'Łódź': ['90-001', '90-002', '90-003', '91-001', '92-001', '93-001'],
            'Lublin': ['20-001', '20-002', '20-003', '21-001', '22-001', '23-001'],
            'Bydgoszcz': ['85-001', '85-002', '85-003', '86-001', '87-001', '88-001'],
            'Szczecin': ['70-001', '70-002', '70-003', '71-001', '72-001', '73-001']
        },

        // Application state
        state: {
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
            cache: new Map(),
            isProcessingBatch: false,
            batchPaused: false
        },

        // Initialize the application
        init: function() {
            console.log('Initializing Polish ZIP App v' + this.config.VERSION);
            console.log('jQuery available:', typeof $ !== 'undefined');
            console.log('Bootstrap available:', typeof bootstrap !== 'undefined');
            
            // Initialize Bootstrap components
            this.initBootstrapComponents();
            
            // Initialize theme system
            this.initThemeSystem();
            
            // Initialize language system
            this.initLanguageSystem();
            
            // Initialize event handlers
            this.initEventHandlers();
            
            // Initialize tabs
            this.initTabs();
            
            // Initialize map
            this.initMap();
            
            // Load user preferences
            this.loadUserPreferences();
            
            // Load settings
            this.loadSettings();
            
            // Update UI displays
            this.updateFavoritesDisplay();
            this.updateHistoryDisplay();
            
            console.log('Polish ZIP App initialized successfully');
        },

        // Initialize Bootstrap components
        initBootstrapComponents: function() {
            // Check if Bootstrap is loaded
            if (typeof bootstrap === 'undefined') {
                console.error('Bootstrap is not loaded!');
                return;
            }

            // Initialize all Bootstrap tooltips
            $('[data-bs-toggle="tooltip"]').each(function() {
                new bootstrap.Tooltip(this);
            });

            // Initialize all Bootstrap dropdowns with explicit configuration
            $('.dropdown-toggle').each(function() {
                try {
                    new bootstrap.Dropdown(this, {
                        boundary: 'viewport',
                        display: 'dynamic'
                    });
                } catch (error) {
                    console.warn('Failed to initialize dropdown:', error);
                }
            });

            // Initialize all Bootstrap tabs
            $('[data-bs-toggle="tab"]').each(function() {
                new bootstrap.Tab(this);
            });

            console.log('Bootstrap components initialized successfully');
        },

        // Initialize theme system using Bootstrap and jQuery
        initThemeSystem: function() {
            const self = this;
            
            // Get saved theme or default to auto
            const savedTheme = localStorage.getItem('preferred-theme') || 'auto';
            this.setTheme(savedTheme);
            
            // Handle theme dropdown clicks using event delegation
            $(document).on('click', '.theme-option', function(e) {
                e.preventDefault();
                const theme = $(this).data('theme');
                console.log('Theme option clicked:', theme);
                self.setTheme(theme);
                self.updateThemeDropdown(theme);
                
                // Close the dropdown after selection
                const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('themeDropdown'));
                if (dropdown) {
                    dropdown.hide();
                }
            });

            // Listen for system theme changes
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                    if (localStorage.getItem('preferred-theme') === 'auto') {
                        self.applySystemTheme();
                    }
                });
            }
        },

        // Set theme
        setTheme: function(theme) {
            this.state.theme = theme;
            localStorage.setItem('preferred-theme', theme);
            
            // Remove all theme classes
            $('html').removeClass('theme-light theme-dark theme-auto');
            $('body').removeClass('theme-light theme-dark theme-auto');
            
            if (theme === 'auto') {
                this.applySystemTheme();
            } else {
                // Apply theme classes to both html and body
                $('html').addClass('theme-' + theme);
                $('body').addClass('theme-' + theme);
                $('body').attr('data-bs-theme', theme);
                
                // Update the document root for CSS custom properties
                document.documentElement.setAttribute('data-theme', theme);
            }
            
            this.updateThemeDropdown(theme);
            console.log('Theme set to:', theme);
        },

        // Apply system theme
        applySystemTheme: function() {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const systemTheme = prefersDark ? 'dark' : 'light';
            
            // Apply theme classes to both html and body
            $('html').addClass('theme-' + systemTheme);
            $('body').addClass('theme-' + systemTheme);
            $('body').attr('data-bs-theme', systemTheme);
            
            // Update the document root for CSS custom properties
            document.documentElement.setAttribute('data-theme', systemTheme);
            
            console.log('System theme applied:', systemTheme);
        },

        // Update theme dropdown
        updateThemeDropdown: function(activeTheme) {
            // Remove active class from all theme options
            $('.theme-option').removeClass('active');
            $('.theme-check').hide();
            
            // Add active class to selected theme
            const $activeOption = $('.theme-option[data-theme="' + activeTheme + '"]');
            $activeOption.addClass('active');
            $activeOption.find('.theme-check').show();
            
            // Update dropdown button text and icon
            const themeText = $activeOption.find('.fw-semibold').text();
            const themeIcon = $activeOption.find('i').first().attr('class');
            
            $('#themeDropdown').html(
                '<i class="' + themeIcon + ' me-1"></i>' +
                '<span class="ms-1">' + themeText + '</span>'
            );
        },

        // Initialize language system
        initLanguageSystem: function() {
            const self = this;
            
            // Don't override if translation manager already set up language
            if (window.translationManager && window.translationManager.currentLanguage) {
                console.log('Translation manager already initialized with language:', window.translationManager.currentLanguage);
                this.updateLanguageDropdown(window.translationManager.currentLanguage);
                return;
            }
            
            // Get saved language or default to Polish
            const savedLang = localStorage.getItem('preferred-language') || 'pl';
            
            // Ensure translation manager is available and set language
            if (window.translationManager) {
                console.log('Setting language to:', savedLang);
                this.setLanguage(savedLang);
            } else {
                console.warn('Translation manager not available during initLanguageSystem');
                // Fallback: try to set language after a short delay
                setTimeout(() => {
                    if (window.translationManager) {
                        console.log('Setting language (delayed) to:', savedLang);
                        this.setLanguage(savedLang);
                    }
                }, 100);
            }
            
            // Handle language dropdown clicks using event delegation
            $(document).on('click', '.language-option', function(e) {
                e.preventDefault();
                const lang = $(this).data('locale');
                console.log('Language option clicked:', lang);
                self.setLanguage(lang);
                
                // Close the dropdown after selection
                const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('langDropdown'));
                if (dropdown) {
                    dropdown.hide();
                }
            });
        },

        // Set language
        setLanguage: function(lang) {
            const self = this;
            this.state.locale = lang;
            localStorage.setItem('preferred-language', lang);
            
            // Update HTML lang attribute
            $('html').attr('lang', lang);
            
            // Use translation manager if available
            if (window.translationManager && typeof window.translationManager.setLanguage === 'function') {
                window.translationManager.setLanguage(lang).then(() => {
                    window.translationManager.updateDOM();
                    console.log('Language updated to:', lang);
                }).catch((error) => {
                    console.warn('Failed to update language:', error);
                });
            } else if (window.translationManager && typeof window.translationManager.loadTranslation === 'function') {
                // Try loading the translation first
                window.translationManager.loadTranslation(lang).then(() => {
                    window.translationManager.currentLanguage = lang;
                    if (typeof window.translationManager.updateDOM === 'function') {
                        window.translationManager.updateDOM();
                    }
                    console.log('Language loaded and updated to:', lang);
                }).catch((error) => {
                    console.warn('Failed to load translation:', error);
                });
            }
            
            this.updateLanguageDropdown(lang);
        },

        // Update language dropdown
        updateLanguageDropdown: function(activeLang) {
            // Remove active class from all language options
            $('.language-option').removeClass('active');
            
            // Add active class to selected language
            const $activeOption = $('.language-option[data-locale="' + activeLang + '"]');
            $activeOption.addClass('active');
            
            // Update dropdown button display
            const flagIcon = $activeOption.find('span').first().text();
            const langCode = activeLang.toUpperCase();
            
            $('#currentLangFlag').text(flagIcon);
            $('#currentLangCode').text(langCode);
            
            console.log('Language dropdown updated to:', activeLang, flagIcon, langCode);
        },

        // Initialize event handlers
        initEventHandlers: function() {
            const self = this;
            
            // Search form handlers
            $('#zipForm').on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('ZIP form submitted');
                self.performZipSearch();
                return false;
            });
            
            $('#cityForm').on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('City form submitted');
                self.performCitySearch();
                return false;
            });
            
            // Make sure buttons don't submit forms
            $('#zipLookupBtn').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('ZIP lookup button clicked');
                self.performZipSearch();
                return false;
            });
            
            $('#cityLookupBtn').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('City lookup button clicked');
                self.performCitySearch();
                return false;
            });
            
            // Example buttons - ZIP codes
            $(document).on('click', '.zip-example', function(e) {
                e.preventDefault();
                console.log('ZIP example clicked');
                const zipCode = $(this).data('zip');
                console.log('ZIP code:', zipCode);
                $('#zipInput').val(zipCode);
                self.performZipSearch();
            });
            
            // Example buttons - Cities
            $(document).on('click', '.city-example', function(e) {
                e.preventDefault();
                console.log('City example clicked');
                const city = $(this).data('city');
                console.log('City:', city);
                $('#cityInput').val(city);
                self.performCitySearch();
            });
            
            // Clear input buttons
            $('#clearZipBtn').on('click', function() {
                $('#zipInput').val('').focus();
                self.hideResults();
            });
            
            $('#clearCityBtn').on('click', function() {
                $('#cityInput').val('').focus();
                self.hideResults();
            });
            
            // Clear results button
            $('#clearResultsBtn').on('click', function() {
                self.hideResults();
            });
            
            // Mode switching
            $('input[name="searchMode"]').on('change', function() {
                const mode = $(this).val();
                self.switchMode(mode);
            });
            
            // Clear buttons
            $('.btn-clear').on('click', function() {
                self.clearForm();
            });
            
            // Tab switching using event delegation for dynamic content
            $(document).on('click', '[data-tab]', function(e) {
                e.preventDefault();
                const tabName = $(this).data('tab');
                console.log('Tab clicked:', tabName);
                self.switchTab(tabName);
            });
            
            // Tab switching for Bootstrap tabs
            $('[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
                const tabId = $(e.target).attr('href').replace('#', '');
                self.state.activeTab = tabId;
                self.onTabChange(tabId);
            });

            // Settings save button
            $('#saveSettingsBtn').on('click', function(e) {
                e.preventDefault();
                self.saveSettings();
            });

            // Reset settings button
            $('#resetSettingsBtn').on('click', function(e) {
                e.preventDefault();
                self.resetSettings();
            });

            // Batch processing
            $('#processBatchBtn').on('click', function(e) {
                e.preventDefault();
                self.processBatch();
            });

            // Sample data buttons
            $('#sampleZipsBtn').on('click', function(e) {
                e.preventDefault();
                $('#batchTextarea').val('00-001\n31-000\n80-001\n61-001\n50-001');
                self.updateInputCounter();
            });

            $('#sampleCitiesBtn').on('click', function(e) {
                e.preventDefault();
                $('#batchTextarea').val('Warszawa\nKraków\nGdańsk\nPoznań\nWrocław');
                self.updateInputCounter();
            });

            $('#clearTextareaBtn').on('click', function(e) {
                e.preventDefault();
                $('#batchTextarea').val('');
                self.updateInputCounter();
            });

            // Input counter
            $('#batchTextarea').on('input', function() {
                self.updateInputCounter();
            });

            // History filter buttons
            $(document).on('click', '[data-filter]', function(e) {
                e.preventDefault();
                const filter = $(this).data('filter');
                $('[data-filter]').removeClass('active');
                $(this).addClass('active');
                self.filterHistory(filter);
            });

            // Clear history
            $('#clearHistoryBtn').on('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to clear all search history?')) {
                    self.state.history = [];
                    self.saveUserPreferences();
                    self.updateHistoryDisplay();
                    self.showAlert('Search history cleared', 'info');
                }
            });

            // Clear favorites
            $('#clearFavoritesBtn').on('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to clear all favorites?')) {
                    self.state.favorites = [];
                    self.saveUserPreferences();
                    self.updateFavoritesDisplay();
                    self.showAlert('Favorites cleared', 'info');
                }
            });
        },

        // Initialize tabs
        initTabs: function() {
            // Set default active tab
            const defaultTab = $('#single-tab');
            if (defaultTab.length) {
                new bootstrap.Tab(defaultTab[0]).show();
            }
        },

        // Initialize map
        initMap: function() {
            try {
                if (typeof L !== 'undefined') {
                    this.state.map = L.map('map').setView(this.config.MAP_CENTER, this.config.MAP_ZOOM);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(this.state.map);
                }
            } catch (error) {
                console.warn('Map initialization failed:', error);
            }
        },

        // Switch search mode
        switchMode: function(mode) {
            this.state.mode = mode;
            
            if (mode === 'zip') {
                $('#zipSection').show();
                $('#citySection').hide();
            } else {
                $('#zipSection').hide();
                $('#citySection').show();
            }
        },

        // Perform ZIP code search
        performZipSearch: function() {
            const zipCode = $('#zipInput').val().trim();
            
            // Add visual feedback
            $('body').append('<div id="debug-feedback" style="position:fixed;top:10px;right:10px;background:blue;color:white;padding:10px;z-index:9999;">ZIP Search: ' + zipCode + '</div>');
            setTimeout(() => $('#debug-feedback').remove(), 2000);
            
            if (!zipCode) {
                this.showAlert('Please enter a ZIP code', 'warning');
                return;
            }
            
            if (!this.validateZipCode(zipCode)) {
                this.showAlert('Please enter a valid Polish ZIP code (format: 00-000)', 'danger');
                return;
            }
            
            this.setLoading(true);
            this.searchByZip(zipCode);
        },

        // Perform city search
        performCitySearch: function() {
            const cityName = $('#cityInput').val().trim();
            
            // Add visual feedback
            $('body').append('<div id="debug-feedback" style="position:fixed;top:10px;right:10px;background:green;color:white;padding:10px;z-index:9999;">City Search: ' + cityName + '</div>');
            setTimeout(() => $('#debug-feedback').remove(), 2000);
            
            if (!cityName) {
                this.showAlert('Please enter a city name', 'warning');
                return;
            }
            
            this.setLoading(true);
            this.searchByCity(cityName);
        },

        // Validate ZIP code format
        validateZipCode: function(zipCode) {
            const zipPattern = /^\d{2}-?\d{3}$/;
            return zipPattern.test(zipCode);
        },

        // Search by ZIP code
        searchByZip: function(zipCode) {
            const self = this;
            
            // Normalize ZIP code (add dash if missing)
            const normalizedZip = this.normalizeZipCode(zipCode);
            
            // Search in database
            setTimeout(function() {
                const result = self.postalDatabase[normalizedZip];
                
                if (result) {
                    const resultData = {
                        zipCode: normalizedZip,
                        city: result.city,
                        voivodeship: result.voivodeship,
                        county: result.county,
                        coordinates: result.coordinates
                    };
                    
                    self.displayResults([resultData]);
                    self.addToHistory(resultData);
                    $('#resultsSection').show();
                    $('#clearResultsBtn, #exportResultsBtn').show();
                } else {
                    // Try fuzzy search for similar ZIP codes
                    const similarResults = self.findSimilarZipCodes(normalizedZip);
                    if (similarResults.length > 0) {
                        self.displayResults(similarResults);
                        self.showAlert(`ZIP code ${normalizedZip} not found. Showing similar results:`, 'warning');
                        $('#resultsSection').show();
                        $('#clearResultsBtn, #exportResultsBtn').show();
                    } else {
                        self.showAlert(`ZIP code ${normalizedZip} not found in database.`, 'danger');
                        self.hideResults();
                    }
                }
                
                self.setLoading(false);
            }, 300); // Reduced delay for better UX
        },

        // Search by city
        searchByCity: function(cityName) {
            const self = this;
            
            // Normalize city name
            const normalizedCity = this.normalizeCityName(cityName);
            
            setTimeout(function() {
                const zipCodes = self.cityDatabase[normalizedCity];
                
                if (zipCodes && zipCodes.length > 0) {
                    const results = zipCodes.map(zip => {
                        const data = self.postalDatabase[zip];
                        return {
                            zipCode: zip,
                            city: data ? data.city : normalizedCity,
                            voivodeship: data ? data.voivodeship : 'Unknown',
                            county: data ? data.county : 'Unknown',
                            coordinates: data ? data.coordinates : [52.2297, 21.0122]
                        };
                    }).filter(result => result.city); // Filter out undefined results
                    
                    if (results.length > 0) {
                        self.displayResults(results);
                        self.addToHistory(results[0]);
                        $('#resultsSection').show();
                        $('#clearResultsBtn, #exportResultsBtn').show();
                    }
                } else {
                    // Try fuzzy search for similar city names
                    const similarResults = self.findSimilarCities(normalizedCity);
                    if (similarResults.length > 0) {
                        self.displayResults(similarResults);
                        self.showAlert(`City "${cityName}" not found. Showing similar results:`, 'warning');
                        $('#resultsSection').show();
                        $('#clearResultsBtn, #exportResultsBtn').show();
                    } else {
                        self.showAlert(`City "${cityName}" not found in database.`, 'danger');
                        self.hideResults();
                    }
                }
                
                self.setLoading(false);
            }, 300);
        },

        // Normalize ZIP code format
        normalizeZipCode: function(zipCode) {
            // Remove any spaces and normalize format
            const cleaned = zipCode.replace(/\s/g, '');
            if (cleaned.length === 5 && !cleaned.includes('-')) {
                return cleaned.substring(0, 2) + '-' + cleaned.substring(2);
            }
            return cleaned;
        },

        // Normalize city name
        normalizeCityName: function(cityName) {
            // Handle common variations and normalize
            const normalized = cityName.trim();
            
            // Handle common city name variations
            const variations = {
                'krakow': 'Kraków',
                'cracow': 'Kraków',
                'warsaw': 'Warszawa',
                'danzig': 'Gdańsk',
                'gdansk': 'Gdańsk',
                'poznan': 'Poznań',
                'wroclaw': 'Wrocław',
                'breslau': 'Wrocław',
                'lodz': 'Łódź'
            };
            
            const lowerCase = normalized.toLowerCase();
            return variations[lowerCase] || 
                   normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
        },

        // Find similar ZIP codes
        findSimilarZipCodes: function(zipCode) {
            const prefix = zipCode.substring(0, 2);
            const similar = [];
            
            Object.keys(this.postalDatabase).forEach(zip => {
                if (zip.startsWith(prefix) && zip !== zipCode) {
                    const data = this.postalDatabase[zip];
                    similar.push({
                        zipCode: zip,
                        city: data.city,
                        voivodeship: data.voivodeship,
                        county: data.county,
                        coordinates: data.coordinates
                    });
                }
            });
            
            return similar.slice(0, 5); // Limit to 5 results
        },

        // Find similar cities
        findSimilarCities: function(cityName) {
            const similar = [];
            const searchTerm = cityName.toLowerCase();
            
            Object.keys(this.cityDatabase).forEach(city => {
                if (city.toLowerCase().includes(searchTerm) || 
                    searchTerm.includes(city.toLowerCase())) {
                    const zipCodes = this.cityDatabase[city];
                    zipCodes.slice(0, 2).forEach(zip => { // Limit to 2 ZIP codes per city
                        const data = this.postalDatabase[zip];
                        if (data) {
                            similar.push({
                                zipCode: zip,
                                city: data.city,
                                voivodeship: data.voivodeship,
                                county: data.county,
                                coordinates: data.coordinates
                            });
                        }
                    });
                }
            });
            
            return similar.slice(0, 5); // Limit to 5 results
        },

        // Display search results
        displayResults: function(results) {
            const $resultsContainer = $('#resultsContainer');
            const $resultsSection = $('#resultsSection');
            $resultsContainer.empty();
            
            if (results.length === 0) {
                $resultsContainer.html('<div class="alert alert-info"><i class="bi bi-info-circle me-2"></i>No results found.</div>');
                $resultsSection.show();
                return;
            }
            
            // Update results metadata
            $('#resultsMetadata').text(`Found ${results.length} result${results.length > 1 ? 's' : ''}`);
            
            results.forEach((result, index) => {
                const resultHtml = `
                    <div class="card mb-3 hover-lift" style="animation: fadeInUp 0.3s ease ${index * 0.1}s both;">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-8">
                                    <div class="d-flex align-items-center mb-2">
                                        <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                            <i class="bi bi-geo-alt-fill text-primary"></i>
                                        </div>
                                        <div>
                                            <h5 class="card-title mb-0 fw-bold">${result.city}</h5>
                                            <small class="text-muted">${result.voivodeship}</small>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p class="card-text mb-1">
                                                <strong><i class="bi bi-mailbox me-1"></i>ZIP Code:</strong> 
                                                <span class="badge bg-primary">${result.zipCode}</span>
                                            </p>
                                        </div>
                                        <div class="col-sm-6">
                                            <p class="card-text mb-1">
                                                <strong><i class="bi bi-building me-1"></i>County:</strong> 
                                                ${result.county}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 text-end">
                                    <div class="btn-group-vertical d-grid gap-2">
                                        <button class="btn btn-outline-primary btn-sm hover-lift" 
                                                onclick="PolishZipApp.showOnMap([${result.coordinates}], '${result.city}')">
                                            <i class="bi bi-geo-alt me-1"></i> Show on Map
                                        </button>
                                        <button class="btn btn-outline-success btn-sm hover-lift" 
                                                onclick="PolishZipApp.addToFavorites(${JSON.stringify(result).replace(/"/g, '&quot;')})">
                                            <i class="bi bi-star me-1"></i> Add to Favorites
                                        </button>
                                        <button class="btn btn-outline-info btn-sm hover-lift" 
                                                onclick="PolishZipApp.copyToClipboard('${result.zipCode} - ${result.city}')">
                                            <i class="bi bi-clipboard me-1"></i> Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $resultsContainer.append(resultHtml);
            });
            
            this.state.results = results;
            $resultsSection.show();
            
            // Scroll to results
            $resultsSection[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        },

        // Hide results section
        hideResults: function() {
            $('#resultsSection').hide();
            $('#clearResultsBtn, #exportResultsBtn').hide();
            this.state.results = [];
        },

        // Show location on map
        showOnMap: function(coordinates, locationName = 'Location') {
            if (this.state.map) {
                // Clear existing markers
                this.state.markers.forEach(marker => this.state.map.removeLayer(marker));
                this.state.markers = [];
                
                // Add new marker with popup
                const marker = L.marker(coordinates)
                    .addTo(this.state.map)
                    .bindPopup(`<strong>${locationName}</strong><br>Coordinates: ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`)
                    .openPopup();
                
                this.state.markers.push(marker);
                
                // Center map on location with nice animation
                this.state.map.setView(coordinates, 12);
                
                // Show success message
                this.showAlert(`Location "${locationName}" shown on map`, 'success');
            } else {
                this.showAlert('Map is not available', 'warning');
            }
        },

        // Add to favorites
        addToFavorites: function(result) {
            // Check if already in favorites
            const exists = this.state.favorites.some(fav => 
                fav.zipCode === result.zipCode && fav.city === result.city
            );
            
            if (!exists) {
                this.state.favorites.push({
                    ...result,
                    addedAt: new Date().toISOString()
                });
                this.saveUserPreferences();
                this.updateFavoritesDisplay(); // Update the favorites display
                this.showAlert(`Added "${result.city} (${result.zipCode})" to favorites`, 'success');
            } else {
                this.showAlert(`"${result.city} (${result.zipCode})" is already in favorites`, 'info');
            }
        },

        // Copy to clipboard
        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showAlert('Copied to clipboard!', 'success');
                }).catch(() => {
                    this.fallbackCopyToClipboard(text);
                });
            } else {
                this.fallbackCopyToClipboard(text);
            }
        },

        // Fallback copy to clipboard for older browsers
        fallbackCopyToClipboard: function(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showAlert('Copied to clipboard!', 'success');
            } catch (err) {
                this.showAlert('Failed to copy to clipboard', 'danger');
            }
            
            document.body.removeChild(textArea);
        },

        // Switch between tabs
        switchTab: function(tabName) {
            console.log('switchTab called with:', tabName);
            console.log('Available tab contents:', $('[data-tab-content]').length);
            
            // Hide all tab contents using CSS display property
            $('[data-tab-content]').each(function() {
                $(this).css({
                    'display': 'none',
                    'visibility': 'hidden'
                });
            });
            
            // Show selected tab content
            const $targetTab = $(`[data-tab-content="${tabName}"]`);
            console.log('Target tab element found:', $targetTab.length > 0);
            if ($targetTab.length > 0) {
                $targetTab.css({
                    'display': 'block',
                    'visibility': 'visible'
                });
                console.log('Showed tab:', tabName);
            }
            
            // Update navigation
            $('[data-tab]').removeClass('active');
            $(`[data-tab="${tabName}"]`).addClass('active');
            
            this.state.activeTab = tabName;
            this.onTabChange(tabName);
            
            console.log('Tab switched to:', tabName, 'Active tab state:', this.state.activeTab);
        },

        // Set loading state
        setLoading: function(loading) {
            this.state.loading = loading;
            
            if (loading) {
                $('.btn-search').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> Searching...');
                $('#progressContainer').show();
                this.updateProgress(0);
            } else {
                $('.btn-search').prop('disabled', false).html('<i class="bi bi-search"></i> Search');
                $('#progressContainer').hide();
            }
        },

        // Update progress
        updateProgress: function(percent) {
            $('#progressBar').css('width', percent + '%').attr('aria-valuenow', percent);
            $('#progressPercent').text(percent + '%');
        },

        // Show alert
        showAlert: function(message, type = 'info') {
            const alertHtml = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            $('#alertContainer').html(alertHtml);
            
            // Auto-dismiss after 5 seconds
            setTimeout(function() {
                $('.alert').alert('close');
            }, 5000);
        },

        // Clear form
        clearForm: function() {
            $('#zipInput, #cityInput').val('');
            $('#resultsContainer').empty();
            this.clearMap();
        },

        // Clear map
        clearMap: function() {
            if (this.state.map) {
                this.state.markers.forEach(marker => this.state.map.removeLayer(marker));
                this.state.markers = [];
            }
        },

        // Add to history
        addToHistory: function(result) {
            this.state.history.unshift(result);
            if (this.state.history.length > this.config.HISTORY_LIMIT) {
                this.state.history = this.state.history.slice(0, this.config.HISTORY_LIMIT);
            }
            this.saveUserPreferences();
        },

        // Handle tab change
        onTabChange: function(tabId) {
            if (tabId === 'map' && this.state.map) {
                // Refresh map when tab is shown
                setTimeout(() => {
                    this.state.map.invalidateSize();
                }, 100);
            }
        },

        // Load user preferences
        loadUserPreferences: function() {
            try {
                const preferences = localStorage.getItem('app-preferences');
                if (preferences) {
                    const parsed = JSON.parse(preferences);
                    this.state.history = parsed.history || [];
                    this.state.favorites = parsed.favorites || [];
                }
            } catch (error) {
                console.warn('Failed to load user preferences:', error);
            }
        },

        // Save user preferences
        saveUserPreferences: function() {
            try {
                const preferences = {
                    history: this.state.history,
                    favorites: this.state.favorites
                };
                localStorage.setItem('app-preferences', JSON.stringify(preferences));
            } catch (error) {
                console.warn('Failed to save user preferences:', error);
            }
        },

        // Save settings
        saveSettings: function() {
            try {
                const settings = {
                    theme: $('#themeSelect').val() || this.state.theme,
                    language: $('#languageSelect').val() || this.state.locale,
                    fontSize: $('#fontSizeSelect').val() || 'normal',
                    compactMode: $('#compactMode').is(':checked'),
                    animationsEnabled: $('#animationsEnabled').is(':checked'),
                    defaultMode: $('#defaultModeSelect').val() || 'auto',
                    maxResults: $('#maxResultsSelect').val() || '50',
                    autoSuggestions: $('#autoSuggestions').is(':checked'),
                    fuzzySearch: $('#fuzzySearch').is(':checked'),
                    instantResults: $('#instantResults').is(':checked'),
                    saveHistory: $('#saveHistory').is(':checked'),
                    saveSettings: $('#saveSettings').is(':checked'),
                    analytics: $('#analytics').is(':checked'),
                    historyRetention: $('#historyRetention').val() || '30',
                    mapProvider: $('#mapProvider').val() || 'osm',
                    mapZoom: $('#mapZoom').val() || '10',
                    autoFit: $('#autoFit').is(':checked'),
                    showMarkers: $('#showMarkers').is(':checked'),
                    apiTimeout: $('#apiTimeout').val() || '30',
                    cacheSize: $('#cacheSize').val() || '100',
                    debugMode: $('#debugMode').is(':checked'),
                    offlineMode: $('#offlineMode').is(':checked')
                };

                // Save to localStorage
                localStorage.setItem('app-settings', JSON.stringify(settings));
                
                // Save to cookies
                this.setCookie('app-settings', JSON.stringify(settings), 365);
                
                // Apply theme if changed
                if (settings.theme !== this.state.theme) {
                    this.setTheme(settings.theme);
                }
                
                // Apply language if changed
                if (settings.language !== this.state.locale) {
                    this.setLanguage(settings.language);
                }

                this.showAlert('Settings saved successfully! Page will refresh to apply changes.', 'success');
                
                // Refresh page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            } catch (error) {
                console.error('Failed to save settings:', error);
                this.showAlert('Failed to save settings. Please try again.', 'danger');
            }
        },

        // Reset settings
        resetSettings: function() {
            if (confirm('Are you sure you want to reset all settings to defaults? This will refresh the page.')) {
                // Clear localStorage
                localStorage.removeItem('app-settings');
                localStorage.removeItem('preferred-theme');
                localStorage.removeItem('preferred-language');
                
                // Clear cookies
                this.deleteCookie('app-settings');
                
                this.showAlert('Settings reset to defaults. Page will refresh.', 'info');
                
                // Refresh page after 1 second
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        },

        // Cookie management functions
        setCookie: function(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
        },

        getCookie: function(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        },

        deleteCookie: function(name) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        },

        // Load settings from cookies and localStorage
        loadSettings: function() {
            try {
                // Try to load from cookies first, then localStorage
                let settings = null;
                const cookieSettings = this.getCookie('app-settings');
                const localSettings = localStorage.getItem('app-settings');
                
                if (cookieSettings) {
                    settings = JSON.parse(cookieSettings);
                } else if (localSettings) {
                    settings = JSON.parse(localSettings);
                }
                
                if (settings) {
                    // Apply settings to form elements
                    $('#themeSelect').val(settings.theme || 'auto');
                    $('#languageSelect').val(settings.language || 'pl');
                    $('#fontSizeSelect').val(settings.fontSize || 'normal');
                    $('#compactMode').prop('checked', settings.compactMode || false);
                    $('#animationsEnabled').prop('checked', settings.animationsEnabled !== false);
                    $('#defaultModeSelect').val(settings.defaultMode || 'auto');
                    $('#maxResultsSelect').val(settings.maxResults || '50');
                    $('#autoSuggestions').prop('checked', settings.autoSuggestions !== false);
                    $('#fuzzySearch').prop('checked', settings.fuzzySearch !== false);
                    $('#instantResults').prop('checked', settings.instantResults || false);
                    $('#saveHistory').prop('checked', settings.saveHistory !== false);
                    $('#saveSettings').prop('checked', settings.saveSettings !== false);
                    $('#analytics').prop('checked', settings.analytics || false);
                    $('#historyRetention').val(settings.historyRetention || '30');
                    $('#mapProvider').val(settings.mapProvider || 'osm');
                    $('#mapZoom').val(settings.mapZoom || '10');
                    $('#autoFit').prop('checked', settings.autoFit !== false);
                    $('#showMarkers').prop('checked', settings.showMarkers !== false);
                    $('#apiTimeout').val(settings.apiTimeout || '30');
                    $('#cacheSize').val(settings.cacheSize || '100');
                    $('#debugMode').prop('checked', settings.debugMode || false);
                    $('#offlineMode').prop('checked', settings.offlineMode || false);
                    
                    console.log('Settings loaded successfully');
                }
            } catch (error) {
                console.warn('Failed to load settings:', error);
            }
        },

        // Update favorites display
        updateFavoritesDisplay: function() {
            const $favoritesList = $('#favoritesList');
            $favoritesList.empty();
            
            if (this.state.favorites.length === 0) {
                $favoritesList.html(`
                    <div class="text-center text-muted py-3">
                        <i class="bi bi-star display-4 mb-2"></i>
                        <p class="small mb-0" data-i18n="noFavorites">No favorites yet</p>
                        <small data-i18n="favoritesHelp">Star searches to save them here</small>
                    </div>
                `);
            } else {
                this.state.favorites.forEach((favorite, index) => {
                    const favoriteHtml = `
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${favorite.city}</strong>
                                <br>
                                <small class="text-muted">${favorite.zipCode} - ${favorite.voivodeship}</small>
                            </div>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary btn-sm" onclick="PolishZipApp.searchFromFavorite(${index})">
                                    <i class="bi bi-search"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="PolishZipApp.removeFromFavorites(${index})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $favoritesList.append(favoriteHtml);
                });
            }
            
            // Update favorites count
            $('#favoritesStat').text(this.state.favorites.length);
        },

        // Search from favorite
        searchFromFavorite: function(index) {
            const favorite = this.state.favorites[index];
            if (favorite) {
                $('#zipInput').val(favorite.zipCode);
                this.switchTab('single');
                this.performZipSearch();
            }
        },

        // Remove from favorites
        removeFromFavorites: function(index) {
            if (index >= 0 && index < this.state.favorites.length) {
                const removed = this.state.favorites.splice(index, 1)[0];
                this.saveUserPreferences();
                this.updateFavoritesDisplay();
                this.showAlert(`Removed "${removed.city}" from favorites`, 'info');
            }
        },

        // Update history display
        updateHistoryDisplay: function() {
            const $historyList = $('#historyList');
            $historyList.empty();
            
            if (this.state.history.length === 0) {
                $historyList.html(`
                    <div class="text-center text-muted py-4">
                        <i class="bi bi-clock-history display-4 mb-3"></i>
                        <p data-i18n="noHistory">No search history found</p>
                        <small data-i18n="historyHelp">Your searches will appear here automatically</small>
                    </div>
                `);
            } else {
                this.state.history.slice(0, 10).forEach((item, index) => {
                    const timestamp = new Date(item.timestamp || Date.now()).toLocaleString();
                    const historyHtml = `
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${item.city}</strong>
                                <span class="badge bg-primary">${item.zipCode}</span>
                                <br>
                                <small class="text-muted">${item.voivodeship} • ${timestamp}</small>
                            </div>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary btn-sm" onclick="PolishZipApp.searchFromHistory(${index})">
                                    <i class="bi bi-search"></i>
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="PolishZipApp.addToFavorites(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                                    <i class="bi bi-star"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    $historyList.append(historyHtml);
                });
            }
            
            // Update history stats
            $('#totalSearchesStat').text(this.state.history.length);
            $('#todaySearchesStat').text(this.state.history.filter(item => {
                const today = new Date().toDateString();
                const itemDate = new Date(item.timestamp || Date.now()).toDateString();
                return today === itemDate;
            }).length);
        },

        // Search from history
        searchFromHistory: function(index) {
            const historyItem = this.state.history[index];
            if (historyItem) {
                $('#zipInput').val(historyItem.zipCode);
                this.switchTab('single');
                this.performZipSearch();
            }
        },

        // Enhanced add to history with timestamp
        addToHistory: function(result) {
            const historyItem = {
                ...result,
                timestamp: new Date().toISOString()
            };
            
            // Remove existing entry if it exists
            this.state.history = this.state.history.filter(item => 
                !(item.zipCode === result.zipCode && item.city === result.city)
            );
            
            // Add to beginning
            this.state.history.unshift(historyItem);
            
            // Limit history size
            if (this.state.history.length > this.config.HISTORY_LIMIT) {
                this.state.history = this.state.history.slice(0, this.config.HISTORY_LIMIT);
            }
            
            this.saveUserPreferences();
            this.updateHistoryDisplay();
        },

        // Update input counter
        updateInputCounter: function() {
            const text = $('#batchTextarea').val().trim();
            const lines = text ? text.split('\n').filter(line => line.trim().length > 0) : [];
            $('#inputCounter').text(lines.length);
        },

        // Process batch
        processBatch: function() {
            const text = $('#batchTextarea').val().trim();
            if (!text) {
                this.showAlert('Please enter some data to process', 'warning');
                return;
            }

            const lines = text.split('\n').filter(line => line.trim().length > 0);
            if (lines.length === 0) {
                this.showAlert('No valid entries found', 'warning');
                return;
            }

            const mode = $('#modeSelect').val();
            const maxResults = parseInt($('#maxRowsSelect').val()) || 50;
            const delay = parseInt($('#delaySelect').val()) || 100;
            const skipDuplicates = $('#skipDuplicates').is(':checked');
            const continueOnError = $('#continueOnError').is(':checked');

            // Limit to max results
            const processLines = lines.slice(0, maxResults);
            
            if (skipDuplicates) {
                const uniqueLines = [...new Set(processLines.map(line => line.trim().toLowerCase()))];
                processLines.length = 0;
                processLines.push(...uniqueLines);
            }

            this.state.isProcessingBatch = true;
            this.showBatchProgress(0, processLines.length);
            
            const results = [];
            let processed = 0;
            let errors = 0;

            const processNext = () => {
                if (processed >= processLines.length || !this.state.isProcessingBatch) {
                    this.finishBatchProcessing(results, processed, errors);
                    return;
                }

                const line = processLines[processed].trim();
                const isZip = this.validateZipCode(line);
                
                setTimeout(() => {
                    if (mode === 'auto') {
                        if (isZip) {
                            this.processBatchItem(line, 'zip', results, () => {
                                processed++;
                                this.updateBatchProgress(processed, processLines.length, errors);
                                processNext();
                            }, (error) => {
                                errors++;
                                if (continueOnError) {
                                    processed++;
                                    this.updateBatchProgress(processed, processLines.length, errors);
                                    processNext();
                                } else {
                                    this.finishBatchProcessing(results, processed, errors);
                                }
                            });
                        } else {
                            this.processBatchItem(line, 'city', results, () => {
                                processed++;
                                this.updateBatchProgress(processed, processLines.length, errors);
                                processNext();
                            }, (error) => {
                                errors++;
                                if (continueOnError) {
                                    processed++;
                                    this.updateBatchProgress(processed, processLines.length, errors);
                                    processNext();
                                } else {
                                    this.finishBatchProcessing(results, processed, errors);
                                }
                            });
                        }
                    } else {
                        this.processBatchItem(line, mode, results, () => {
                            processed++;
                            this.updateBatchProgress(processed, processLines.length, errors);
                            processNext();
                        }, (error) => {
                            errors++;
                            if (continueOnError) {
                                processed++;
                                this.updateBatchProgress(processed, processLines.length, errors);
                                processNext();
                            } else {
                                this.finishBatchProcessing(results, processed, errors);
                            }
                        });
                    }
                }, delay);
            };

            processNext();
        },

        // Process individual batch item
        processBatchItem: function(item, mode, results, successCallback, errorCallback) {
            if (mode === 'zip') {
                const normalizedZip = this.normalizeZipCode(item);
                const result = this.postalDatabase[normalizedZip];
                
                if (result) {
                    results.push({
                        input: item,
                        zipCode: normalizedZip,
                        city: result.city,
                        voivodeship: result.voivodeship,
                        county: result.county,
                        coordinates: result.coordinates,
                        status: 'success'
                    });
                    successCallback();
                } else {
                    results.push({
                        input: item,
                        status: 'error',
                        error: 'ZIP code not found'
                    });
                    errorCallback('ZIP code not found');
                }
            } else {
                const normalizedCity = this.normalizeCityName(item);
                const zipCodes = this.cityDatabase[normalizedCity];
                
                if (zipCodes && zipCodes.length > 0) {
                    zipCodes.slice(0, 3).forEach(zip => { // Limit to 3 ZIP codes per city
                        const data = this.postalDatabase[zip];
                        if (data) {
                            results.push({
                                input: item,
                                zipCode: zip,
                                city: data.city,
                                voivodeship: data.voivodeship,
                                county: data.county,
                                coordinates: data.coordinates,
                                status: 'success'
                            });
                        }
                    });
                    successCallback();
                } else {
                    results.push({
                        input: item,
                        status: 'error',
                        error: 'City not found'
                    });
                    errorCallback('City not found');
                }
            }
        },

        // Show batch progress
        showBatchProgress: function(current, total) {
            $('#progressContainer').show();
            this.updateProgress((current / total) * 100);
            $('#progressText').text(`Processing batch: ${current} of ${total}`);
            $('#progressStats').text(`${current} of ${total} processed`);
            $('#processBatchBtn').prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> Processing...');
        },

        // Update batch progress
        updateBatchProgress: function(current, total, errors) {
            const percent = Math.round((current / total) * 100);
            this.updateProgress(percent);
            $('#progressText').text(`Processing batch: ${current} of ${total}`);
            $('#progressStats').text(`${current} of ${total} processed (${errors} errors)`);
        },

        // Finish batch processing
        finishBatchProcessing: function(results, processed, errors) {
            this.state.isProcessingBatch = false;
            $('#progressContainer').hide();
            $('#processBatchBtn').prop('disabled', false).html('<i class="bi bi-play-circle"></i> Process Batch');
            
            // Display results
            this.displayBatchResults(results);
            
            const successCount = results.filter(r => r.status === 'success').length;
            this.showAlert(
                `Batch processing complete! Processed: ${processed}, Success: ${successCount}, Errors: ${errors}`,
                errors > 0 ? 'warning' : 'success'
            );
        },

        // Display batch results
        displayBatchResults: function(results) {
            const $resultsTable = $('#batchResultsTable');
            $resultsTable.empty().show();
            
            if (results.length === 0) {
                $resultsTable.html('<div class="alert alert-info">No results to display</div>');
                return;
            }

            let tableHtml = `
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Input</th>
                                <th>ZIP Code</th>
                                <th>City</th>
                                <th>Voivodeship</th>
                                <th>County</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            results.forEach((result, index) => {
                const statusClass = result.status === 'success' ? 'success' : 'danger';
                const statusIcon = result.status === 'success' ? 'check-circle' : 'x-circle';
                
                tableHtml += `
                    <tr class="table-${statusClass === 'success' ? 'light' : 'warning'}">
                        <td><strong>${result.input}</strong></td>
                        <td>${result.zipCode || '-'}</td>
                        <td>${result.city || '-'}</td>
                        <td>${result.voivodeship || '-'}</td>
                        <td>${result.county || '-'}</td>
                        <td>
                            <span class="badge bg-${statusClass}">
                                <i class="bi bi-${statusIcon}"></i>
                                ${result.status}
                            </span>
                            ${result.error ? `<br><small class="text-muted">${result.error}</small>` : ''}
                        </td>
                        <td>
                            ${result.status === 'success' ? `
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-outline-primary btn-sm" onclick="PolishZipApp.showOnMap([${result.coordinates}], '${result.city}')">
                                        <i class="bi bi-geo-alt"></i>
                                    </button>
                                    <button class="btn btn-outline-success btn-sm" onclick="PolishZipApp.addToFavorites(${JSON.stringify(result).replace(/"/g, '&quot;')})">
                                        <i class="bi bi-star"></i>
                                    </button>
                                </div>
                            ` : '-'}
                        </td>
                    </tr>
                `;
            });

            tableHtml += `
                        </tbody>
                    </table>
                </div>
            `;

            $resultsTable.html(tableHtml);
        },

        // Filter history
        filterHistory: function(filter) {
            // This is a placeholder - in a real implementation you'd filter the history
            console.log('Filtering history by:', filter);
            this.updateHistoryDisplay();
        }
    };

    // Make PolishZipApp globally available
    window.PolishZipApp = PolishZipApp;
    
    // Initialize the application
    PolishZipApp.init();
});