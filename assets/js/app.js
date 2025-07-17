// Polish ZIP & City Lookup - Bootstrap 5.3.7 with jQuery Implementation
// Clean, modern web application with proper Bootstrap JS integration

$(document).ready(function() {
    'use strict';
    
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
            
            // Get saved language or default to Polish
            const savedLang = localStorage.getItem('preferred-language') || 'pl';
            this.setLanguage(savedLang);
            
            // Handle language dropdown clicks
            $('.language-option').on('click', function(e) {
                e.preventDefault();
                const lang = $(this).data('locale');
                self.setLanguage(lang);
                self.updateLanguageDropdown(lang);
            });
        },

        // Set language
        setLanguage: function(lang) {
            this.state.locale = lang;
            localStorage.setItem('preferred-language', lang);
            
            // Update HTML lang attribute
            $('html').attr('lang', lang);
            
            // Use translation manager if available
            if (window.translationManager && typeof window.translationManager.setLanguage === 'function') {
                window.translationManager.setLanguage(lang).then(() => {
                    window.translationManager.updateDOM();
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
        },

        // Initialize event handlers
        initEventHandlers: function() {
            const self = this;
            
            // Search form handlers
            $('#zipForm').on('submit', function(e) {
                e.preventDefault();
                self.performZipSearch();
            });
            
            $('#cityForm').on('submit', function(e) {
                e.preventDefault();
                self.performCitySearch();
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
            
            // Tab switching
            $('[data-bs-toggle="tab"]').on('shown.bs.tab', function(e) {
                const tabId = $(e.target).attr('href').replace('#', '');
                self.state.activeTab = tabId;
                self.onTabChange(tabId);
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
            
            // Simulate API call for demonstration
            setTimeout(function() {
                const result = {
                    zipCode: zipCode,
                    city: 'Warszawa',
                    voivodeship: 'Mazowieckie',
                    county: 'warszawa',
                    coordinates: [52.2297, 21.0122]
                };
                
                self.displayResults([result]);
                self.setLoading(false);
                self.addToHistory(result);
            }, 1000);
        },

        // Search by city
        searchByCity: function(cityName) {
            const self = this;
            
            // Simulate API call for demonstration
            setTimeout(function() {
                const results = [
                    {
                        zipCode: '00-001',
                        city: cityName,
                        voivodeship: 'Mazowieckie',
                        county: 'warszawa',
                        coordinates: [52.2297, 21.0122]
                    }
                ];
                
                self.displayResults(results);
                self.setLoading(false);
                self.addToHistory(results[0]);
            }, 1000);
        },

        // Display search results
        displayResults: function(results) {
            const $resultsContainer = $('#resultsContainer');
            $resultsContainer.empty();
            
            if (results.length === 0) {
                $resultsContainer.html('<div class="alert alert-info">No results found.</div>');
                return;
            }
            
            results.forEach(result => {
                const resultHtml = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5 class="card-title">${result.city}</h5>
                                    <p class="card-text">
                                        <strong>ZIP Code:</strong> ${result.zipCode}<br>
                                        <strong>Voivodeship:</strong> ${result.voivodeship}<br>
                                        <strong>County:</strong> ${result.county}
                                    </p>
                                </div>
                                <div class="col-md-4 text-end">
                                    <button class="btn btn-outline-primary btn-sm" onclick="PolishZipApp.showOnMap([${result.coordinates}])">
                                        <i class="bi bi-geo-alt"></i> Show on Map
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                $resultsContainer.append(resultHtml);
            });
            
            this.state.results = results;
        },

        // Show location on map
        showOnMap: function(coordinates) {
            if (this.state.map) {
                // Clear existing markers
                this.state.markers.forEach(marker => this.state.map.removeLayer(marker));
                this.state.markers = [];
                
                // Add new marker
                const marker = L.marker(coordinates).addTo(this.state.map);
                this.state.markers.push(marker);
                
                // Center map on location
                this.state.map.setView(coordinates, 12);
                
                // Switch to map tab
                const mapTab = new bootstrap.Tab($('#map-tab')[0]);
                mapTab.show();
            }
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
        }
    };

    // Make PolishZipApp globally available
    window.PolishZipApp = PolishZipApp;
    
    // Initialize the application
    PolishZipApp.init();
});