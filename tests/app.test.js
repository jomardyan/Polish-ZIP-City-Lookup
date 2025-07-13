// Simple tests for the Polish ZIP & City Lookup application
describe('Polish ZIP & City Lookup', () => {
  let app;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="app">
        <div data-tab-content="single">Single tab content</div>
        <div data-tab-content="batch">Batch tab content</div>
        <div id="alertContainer"></div>
        <span data-i18n="brand">Test</span>
      </div>
    `;
    
    // Initialize app
    app = new PolishZipLookup();
  });

  test('should initialize with default state', () => {
    expect(app.state.activeTab).toBe('single');
    expect(app.state.locale).toBe('en');
    expect(app.state.theme).toBe('light');
  });

  test('should validate ZIP codes correctly', () => {
    expect(app.validateZip('00-001')).toBe(true);
    expect(app.validateZip('00001')).toBe(true);
    expect(app.validateZip('invalid')).toBe(false);
    expect(app.validateZip('12345')).toBe(true);
    expect(app.validateZip('12-345')).toBe(true);
  });

  test('should normalize ZIP codes', () => {
    expect(app.normalizeZip('00001')).toBe('00-001');
    expect(app.normalizeZip('00-001')).toBe('00-001');
  });

  test('should translate text correctly', () => {
    expect(app.t('brand')).toBe('Polish ZIP & City Lookup');
    
    app.state.locale = 'pl';
    expect(app.t('brand')).toBe('Wyszukiwarka Kodów Pocztowych i Miast');
  });

  test('should switch tabs correctly', () => {
    app.state.activeTab = 'batch';
    app.updateUI();
    
    const singleTab = document.querySelector('[data-tab-content="single"]');
    const batchTab = document.querySelector('[data-tab-content="batch"]');
    
    expect(singleTab.style.display).toBe('none');
    expect(batchTab.style.display).toBe('block');
  });

  test('should show alerts correctly', () => {
    app.showSuccess('Test message');
    
    const alertContainer = document.getElementById('alertContainer');
    expect(alertContainer.children.length).toBe(1);
    expect(alertContainer.children[0].className).toContain('alert-success');
  });
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PolishZipLookup };
}