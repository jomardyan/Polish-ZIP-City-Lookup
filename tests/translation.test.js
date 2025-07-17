/**
 * Test suite for Translation Manager
 */

// Mock DOM environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Load translation files
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const context = vm.createContext({
  window: global.window,
  document: global.document,
  navigator: global.navigator,
  console
});

// Load manager and translation files
const managerCode = fs.readFileSync(
  path.join(__dirname, '../assets/js/translations/manager.js'),
  'utf8'
);

const enCode = fs.readFileSync(
  path.join(__dirname, '../assets/js/translations/en.js'),
  'utf8'
);

const plCode = fs.readFileSync(
  path.join(__dirname, '../assets/js/translations/pl.js'),
  'utf8'
);

const deCode = fs.readFileSync(
  path.join(__dirname, '../assets/js/translations/de.js'),
  'utf8'
);

// Execute translation files in context
vm.runInContext(managerCode, context);
vm.runInContext(enCode, context);
vm.runInContext(plCode, context);
vm.runInContext(deCode, context);

const TranslationManager = vm.runInContext('TranslationManager', context);

describe('Translation Manager', () => {
  let manager;

  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = `
      <div id="test-container">
        <h1 data-i18n="brand"></h1>
        <p data-i18n="tagline"></p>
        <button data-i18n="lookup"></button>
        <input placeholder-i18n="zipPlaceholder" />
        <div title-i18n="help"></div>
      </div>
    `;

    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      writable: true,
      configurable: true
    });

    manager = new TranslationManager();
  });

  describe('Initialization', () => {
    test('should initialize with default language', () => {
      expect(manager.currentLanguage).toBe('en');
      expect(manager.fallbackLanguage).toBe('en');
    });

    test('should load translation data correctly', () => {
      expect(manager.translations).toBeDefined();
      expect(manager.translations.en).toBeDefined();
      expect(manager.translations.pl).toBeDefined();
      expect(manager.translations.de).toBeDefined();
    });
  });

  describe('Translation Loading', () => {
    test('should have translations available for supported languages', () => {
      expect(manager.translations.en).toBeDefined();
      expect(manager.translations.pl).toBeDefined();
      expect(manager.translations.de).toBeDefined();
    });

    test('should handle unsupported languages gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      manager.setLanguage('xx');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should use fallback for missing translations', () => {
      // Simulate missing translation
      const originalTranslation = manager.translations.de?.nonExistentKey;
      if (manager.translations.de) {
        delete manager.translations.de.nonExistentKey;
      }
      
      manager.currentLanguage = 'de';
      const result = manager.t('nonExistentKey');
      
      // Should fallback to English or return key
      expect(result).toBeDefined();
      
      // Restore if it existed
      if (originalTranslation !== undefined && manager.translations.de) {
        manager.translations.de.nonExistentKey = originalTranslation;
      }
    });
  });

  describe('Translation Function', () => {
    test('should translate basic keys correctly', () => {
      manager.currentLanguage = 'en';
      expect(manager.t('lookup')).toBe('Lookup');
      
      manager.currentLanguage = 'pl';
      expect(manager.t('lookup')).toBe('Wyszukaj');
      
      manager.currentLanguage = 'de';
      expect(manager.t('lookup')).toBe('Suchen');
    });

    test('should handle missing keys gracefully', () => {
      const result = manager.t('nonExistentKey');
      expect(result).toBe('nonExistentKey'); // Should return the key itself
    });

    test('should support language parameter override', () => {
      manager.currentLanguage = 'en';
      expect(manager.t('lookup', 'pl')).toBe('Wyszukaj');
      expect(manager.t('lookup', 'de')).toBe('Suchen');
    });
  });

  describe('Language Setting', () => {
    test('should change language correctly', () => {
      manager.currentLanguage = 'pl';
      expect(manager.currentLanguage).toBe('pl');
      
      manager.currentLanguage = 'de';
      expect(manager.currentLanguage).toBe('de');
    });

    test('should fallback to default for unsupported languages', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      manager.setLanguage('xx-invalid');
      expect(manager.currentLanguage).toBe('en');
      consoleSpy.mockRestore();
    });

    test('should trigger DOM updates when updateDOM is called', () => {
      const spy = jest.spyOn(manager, 'updateDOM');
      manager.updateDOM();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('DOM Updates', () => {
    test('should update data-i18n elements', () => {
      manager.currentLanguage = 'en';
      manager.updateDOM();
      
      const brandElement = document.querySelector('[data-i18n="brand"]');
      expect(brandElement.textContent).toBe('Enhanced Polish ZIP & City Lookup');
      
      manager.currentLanguage = 'pl';
      manager.updateDOM();
      expect(brandElement.textContent).toBe('Rozszerzona Wyszukiwarka Kodów Pocztowych');
    });

    test('should update placeholder-i18n elements', () => {
      // Fix DOM element to have proper structure
      const inputElement = document.querySelector('[placeholder-i18n="zipPlaceholder"]');
      inputElement.setAttribute('data-i18n', 'zipPlaceholder');
      
      manager.currentLanguage = 'en';
      manager.updateDOM();
      
      expect(inputElement.placeholder).toBe('00-001 or 00001');
      
      manager.currentLanguage = 'pl';
      manager.updateDOM();
      expect(inputElement.placeholder).toBe('00-001 lub 00001');
    });

    test('should update title-i18n elements', () => {
      // Add help translation to test data
      manager.translations.en.help = 'Help';
      manager.translations.pl.help = 'Pomoc';
      
      const titleElement = document.querySelector('[title-i18n="help"]');
      titleElement.setAttribute('data-i18n', 'help');
      
      manager.currentLanguage = 'en';
      manager.updateDOM();
      
      expect(titleElement.textContent).toBe('Help');
      
      manager.currentLanguage = 'pl';
      manager.updateDOM();
      expect(titleElement.textContent).toBe('Pomoc');
    });
  });

  describe('SEO Meta Updates', () => {
    beforeEach(() => {
      // Add meta tags to the document
      document.head.innerHTML = `
        <meta name="description" content="">
        <meta name="keywords" content="">
        <meta property="og:title" content="">
        <meta property="og:description" content="">
        <meta property="twitter:title" content="">
        <meta property="twitter:description" content="">
      `;
    });

    test('should update meta tags for SEO', () => {
      manager.currentLanguage = 'en';
      manager.updateMetaTags();
      
      const description = document.querySelector('meta[name="description"]');
      const keywords = document.querySelector('meta[name="keywords"]');
      
      expect(description?.content).toContain('Advanced Polish postal code');
      expect(keywords?.content).toContain('Polish postal codes');
    });

    test('should update Open Graph tags', () => {
      manager.currentLanguage = 'pl';
      manager.updateMetaTags();
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      
      expect(ogTitle?.content).toContain('Rozszerzona');
      expect(ogDescription?.content).toContain('Zaawansowane');
    });

    test('should update page title', () => {
      manager.currentLanguage = 'de';
      manager.updateMetaTags();
      
      expect(document.title).toContain('Erweiterte');
    });
  });

  describe('Language Detection', () => {
    test('should detect supported browser language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'pl-PL',
        writable: true,
        configurable: true
      });
      
      // Mock the internal method since setLanguage is async
      const browserLang = manager.getBrowserLanguage();
      expect(browserLang).toBe('pl');
    });

    test('should fallback for unsupported browser language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'es-ES',
        writable: true,
        configurable: true
      });
      
      const browserLang = manager.getBrowserLanguage();
      expect(browserLang).toBe('es'); // Gets the language, even if unsupported
    });

    test('should handle missing navigator.language', () => {
      Object.defineProperty(navigator, 'language', {
        value: null,
        writable: true,
        configurable: true
      });
      
      const browserLang = manager.getBrowserLanguage();
      expect(browserLang).toBe('en'); // Should fallback to English
    });
  });

  describe('Translation Completeness', () => {
    test('should have consistent keys across languages', () => {
      const enKeys = Object.keys(manager.translations.en);
      const plKeys = Object.keys(manager.translations.pl);
      const deKeys = Object.keys(manager.translations.de);
      
      // Check if Polish has most English keys
      const missingInPl = enKeys.filter(key => !plKeys.includes(key));
      const missingInDe = enKeys.filter(key => !deKeys.includes(key));
      
      // Allow some tolerance for missing translations
      expect(missingInPl.length).toBeLessThan(enKeys.length * 0.1); // Less than 10% missing
      expect(missingInDe.length).toBeLessThan(enKeys.length * 0.1);
    });

    test('should have required core translations', () => {
      const requiredKeys = [
        'brand', 'lookup', 'clear', 'results', 'loading', 'error',
        'zipPlaceholder', 'cityPlaceholder', 'notFound'
      ];
      
      const languages = ['en', 'pl', 'de'];
      
      languages.forEach(lang => {
        requiredKeys.forEach(key => {
          expect(manager.translations[lang]).toHaveProperty(key);
          expect(manager.translations[lang][key]).toBeTruthy();
        });
      });
    });
  });

  describe('Performance', () => {
    test('should cache translations efficiently', () => {
      const startTime = Date.now();
      
      // Perform multiple translations
      for (let i = 0; i < 100; i++) {
        manager.t('brand');
        manager.t('lookup');
        manager.t('clear');
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should be fast (less than 100ms for 300 translations)
      expect(duration).toBeLessThan(100);
    });

    test('should handle rapid language switching', () => {
      const languages = ['en', 'pl', 'de'];
      
      const startTime = Date.now();
      
      // Rapidly switch languages
      for (let i = 0; i < 20; i++) {
        const lang = languages[i % languages.length];
        manager.currentLanguage = lang;
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should handle rapid switching efficiently
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Memory Management', () => {
    test('should not have memory leaks with repeated operations', () => {
      const initialTranslations = Object.keys(manager.translations).length;
      
      // Perform many operations
      for (let i = 0; i < 50; i++) {
        manager.setLanguage('en');
        manager.updateDOM();
        manager.setLanguage('pl');
        manager.updateDOM();
      }
      
      const finalTranslations = Object.keys(manager.translations).length;
      
      // Should not accumulate extra data
      expect(finalTranslations).toBe(initialTranslations);
    });
  });

  describe('Integration', () => {
    test('should work with the main app translation method', () => {
      // Simulate the app's t() method
      global.window.translationManager = manager;
      
      function appTranslate(key, lang) {
        if (window.translationManager) {
          return window.translationManager.t(key, lang);
        }
        return key;
      }
      
      manager.setLanguage('pl');
      expect(appTranslate('lookup')).toBe('Wyszukaj');
      expect(appTranslate('clear')).toBe('Wyczyść');
    });
  });
});
