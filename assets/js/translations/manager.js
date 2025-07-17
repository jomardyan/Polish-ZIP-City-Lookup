/**
 * Translation Manager for Polish ZIP & City Lookup
 * Handles loading and managing translations from separate files
 */

class TranslationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.loadedLanguages = new Set();
    this.translations = window.translations || {};
    this.fallbackLanguage = 'en';
    
    // Initialize with empty translation object
    if (!window.translations) {
      window.translations = {};
    }
  }

  /**
   * Load a translation file dynamically
   * @param {string} lang - Language code (e.g., 'en', 'pl', 'de')
   * @returns {Promise} Promise that resolves when translation is loaded
   */
  async loadTranslation(lang) {
    if (this.loadedLanguages.has(lang)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `assets/js/translations/${lang}.js`;
      script.async = true;
      
      script.onload = () => {
        this.loadedLanguages.add(lang);
        // eslint-disable-next-line no-console
        console.log(`Translation loaded: ${lang}`);
        resolve();
      };
      
      script.onerror = () => {
        console.warn(`Failed to load translation: ${lang}`);
        reject(new Error(`Failed to load translation: ${lang}`));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Set the current language and load it if necessary
   * @param {string} lang - Language code
   * @returns {Promise} Promise that resolves when language is set
   */
  async setLanguage(lang) {
    try {
      await this.loadTranslation(lang);
      this.currentLanguage = lang;
      this.updateDOM(); // Automatically update DOM when language changes
      return true;
    } catch (error) {
      console.warn(`Failed to set language to ${lang}, falling back to ${this.fallbackLanguage}`);
      if (lang !== this.fallbackLanguage) {
        await this.setLanguage(this.fallbackLanguage);
      }
      return false;
    }
  }

  /**
   * Get a translated string
   * @param {string} key - Translation key
   * @param {string} [lang] - Language code (defaults to current language)
   * @returns {string} Translated string or key if not found
   */
  t(key, lang = null) {
    const targetLang = lang || this.currentLanguage;
    
    // Use window.translations directly to get the latest translations
    const translations = window.translations || {};
    
    // Try current/specified language first
    if (translations[targetLang] && translations[targetLang][key]) {
      return translations[targetLang][key];
    }
    
    // Fallback to fallback language
    if (targetLang !== this.fallbackLanguage && 
        translations[this.fallbackLanguage] && 
        translations[this.fallbackLanguage][key]) {
      return translations[this.fallbackLanguage][key];
    }
    
    // Return key if no translation found (reduce console spam in production)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn(`Translation not found: ${key} (${targetLang})`);
    }
    return key;
  }

  /**
   * Get all available languages
   * @returns {Array} Array of language codes
   */
  getAvailableLanguages() {
    return Object.keys(window.translations || {});
  }

  /**
   * Check if a language is loaded
   * @param {string} lang - Language code
   * @returns {boolean} True if language is loaded
   */
  isLanguageLoaded(lang) {
    return this.loadedLanguages.has(lang);
  }

  /**
   * Preload multiple languages
   * @param {Array} langs - Array of language codes
   * @returns {Promise} Promise that resolves when all languages are loaded
   */
  async preloadLanguages(langs) {
    const promises = langs.map(lang => this.loadTranslation(lang).catch(() => {}));
    await Promise.all(promises);
  }

  /**
   * Get browser language preference
   * @returns {string} Browser language code
   */
  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    if (!browserLang) {
      return 'en';
    }
    return browserLang.split('-')[0]; // Return just the language part (e.g., 'en' from 'en-US')
  }

  /**
   * Auto-detect and set the best language based on browser preferences
   * @returns {Promise} Promise that resolves when language is set
   */
  async autoDetectLanguage() {
    const browserLang = this.getBrowserLanguage();
    const supportedLanguages = ['en', 'pl', 'de', 'fr', 'es', 'it', 'nl', 'ru', 'zh'];
    
    if (supportedLanguages.includes(browserLang)) {
      await this.setLanguage(browserLang);
    } else {
      await this.setLanguage(this.fallbackLanguage);
    }
  }

  /**
   * Update all elements with data-i18n attributes
   */
  updateDOM() {
    // Update elements with data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Update text content or placeholder based on element type
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.type === 'text' || element.type === 'search' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.value = translation;
        }
      } else {
        element.textContent = translation;
      }
    });

    // Update elements with data-i18n-placeholder attributes
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      element.placeholder = translation;
    });

    // Update meta tags for SEO
    this.updateMetaTags();
  }

  /**
   * Update meta tags with translated content
   */
  updateMetaTags() {
    const updateMeta = (name, key) => {
      const element = document.querySelector(`meta[name="${name}"]`) || 
                     document.querySelector(`meta[property="${name}"]`);
      if (element) {
        element.setAttribute('content', this.t(key));
      }
    };

    updateMeta('description', 'metaDescription');
    updateMeta('keywords', 'metaKeywords');
    updateMeta('og:title', 'brand');
    updateMeta('og:description', 'metaDescription');
    updateMeta('twitter:title', 'brand');
    updateMeta('twitter:description', 'metaDescription');

    // Update page title
    document.title = this.t('brand');
  }
}

// Create global translation manager instance
window.translationManager = new TranslationManager();
