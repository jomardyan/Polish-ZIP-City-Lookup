/**
 * Dutch (Nederlands) translations for Polish ZIP & City Lookup
 */

// Ensure global translations object exists
if (typeof window !== 'undefined') {
  window.translations = window.translations || {};
  
  window.translations.nl = {
    brand: 'Geavanceerde Poolse Postcode & Stad Zoeken',
    brandShort: 'Poolse Postcodes',
    loading: 'Laden...',
    tagline: 'Vind Poolse postcodes en steden onmiddellijk',
    metaDescription: 'Geavanceerde toepassing voor het zoeken van Poolse postcodes en steden met batchverwerking, geschiedenis, favorieten en interactieve kaarten.',
    metaKeywords: 'Poolse postcodes, postcodes Polen, stad zoeken Polen, kod pocztowy, miejscowość Polska',
    
    // Navigation
    lookup: 'Zoeken',
    batch: 'Batch',
    history: 'Geschiedenis',
    settings: 'Instellingen',
    
    // Input placeholders
    zipPlaceholder: '00-001 of 00001',
    cityPlaceholder: 'Warschau',
    pastePlaceholder: 'Postcodes of Steden',
    
    // Buttons and actions
    lookupCity: 'Zoek Stad',
    lookupZip: 'Zoek Postcode',
    clear: 'Wissen',
    clearResults: 'Resultaten Wissen',
    clearAllData: 'Alle Gegevens Wissen',
    search: 'Zoeken',
    filter: 'Filteren',
    sort: 'Sorteren',
    copy: 'Kopiëren',
    csv: 'CSV',
    excel: 'Excel',
    print: 'Afdrukken',
    export: 'Exporteren',
    import: 'Importeren',
    save: 'Opslaan',
    cancel: 'Annuleren',
    close: 'Sluiten',
    pause: 'Pauze',
    stop: 'Stop',
    swap: 'Wisselen',
    sample: 'Voorbeeld',
    validate: 'Valideren',
    
    // Results and data
    results: 'Resultaten',
    search_results: 'Zoekresultaten',
    input: 'Invoer',
    output: 'Uitvoer',
    batchResults: 'Batch Resultaten',
    noResults: 'Geen resultaten gevonden',
    success: 'Succes',
    error: 'Fout',
    
    // File operations
    importFile: 'Importeer CSV / Excel',
    chooseFile: 'Kies bestand...',
    importData: 'Gegevens Importeren',
    pasteInputs: 'Of plak invoer (één per regel)',
    supportedFormats: 'Ondersteunde formaten',
    dragDrop: 'Sleep bestanden hierheen of klik om te selecteren',
    
    // Batch processing
    batchProcessing: 'Batchverwerking',
    batchProcessingDesc: 'Verwerk meerdere postcodes of steden tegelijk via bestandsimport of handmatige invoer',
    manualInput: 'Handmatige Invoer',
    processingOptions: 'Verwerkingsopties',
    onePerLine: 'Één item per regel',
    itemsEntered: 'items ingevoerd',
    
    // Processing modes
    mode: 'Modus',
    zipCity: 'Postcode → Stad',
    cityZip: 'Stad → Postcode',
    autoDetect: 'Automatische Detectie',
    processBatch: 'Verwerk Batch',
    
    // Settings
    maxResults: 'Maximum Resultaten',
    requestDelay: 'Verzoek Vertraging (ms)',
    skipDuplicates: 'Duplicaten overslaan',
    continueOnError: 'Doorgaan bij fouten',
    
    // Map related
    mapView: 'Kaartweergave',
    mapSettings: 'Kaartinstellingen',
    mapProvider: 'Kaartprovider',
    defaultZoom: 'Standaard zoomniveau',
    autoFit: 'Kaart automatisch aanpassen aan resultaten',
    showMarkers: 'Locatiemarkering tonen',
    
    // Status messages
    invalidZip: 'Ongeldig postcode formaat',
    invalidCity: 'Voer een stadsnaam in',
    notFound: 'Niet gevonden',
    invalidFormat: 'Ongeldig formaat',
    
    // History and favorites
    searchHistory: 'Zoekgeschiedenis',
    historyDesc: 'Bekijk en beheer je recente zoekopdrachten en favorieten',
    searchHistoryPlaceholder: 'Zoek in geschiedenis...',
    favorites: 'Favorieten',
    noHistory: 'Geen zoekgeschiedenis gevonden',
    historyHelp: 'Je zoekopdrachten verschijnen hier automatisch',
    noFavorites: 'Nog geen favorieten',
    favoritesHelp: 'Markeer zoekopdrachten met sterren om ze hier op te slaan',
    clearHistory: 'Geschiedenis wissen',
    
    // Time periods
    today: 'Vandaag',
    thisWeek: 'Deze week',
    thisMonth: 'Deze maand',
    all: 'Alle',
    days7: '7 dagen',
    days30: '30 dagen',
    days90: '90 dagen',
    year1: '1 jaar',
    forever: 'Voor altijd',
    
    // Statistics
    statistics: 'Statistieken',
    totalSearches: 'Totaal zoekopdrachten',
    memberSince: 'Lid sinds',
    
    // Settings
    applicationSettings: 'Toepassingsinstellingen',
    settingsDesc: 'Pas je ervaring aan en beheer voorkeuren',
    
    // Appearance
    appearance: 'Uiterlijk',
    theme: 'Thema',
    lightTheme: 'Licht',
    light_theme: 'Licht',
    darkTheme: 'Donker',
    dark_theme: 'Donker',
    autoTheme: 'Auto (Systeem)',
    auto_theme: 'Auto',
    
    // Language and localization
    language: 'Taal',
    
    // Typography
    fontSize: 'Lettergrootte',
    small: 'Klein',
    normal: 'Normaal',
    large: 'Groot',
    extraLarge: 'Extra groot',
    
    // UI modes
    compactMode: 'Compacte modus',
    animations: 'Animaties inschakelen',
    
    // Search settings
    searchSettings: 'Zoekinstellingen',
    defaultMode: 'Standaard zoekmodus',
    autoSuggestions: 'Auto-suggesties inschakelen',
    fuzzySearch: 'Fuzzy zoeken inschakelen',
    instantResults: 'Resultaten tonen tijdens typen',
    
    // Privacy and data
    privacy: 'Privacy & Gegevens',
    saveHistory: 'Zoekgeschiedenis opslaan',
    saveSettings: 'Instellingen lokaal opslaan',
    analytics: 'Gebruiksanalyse toestaan',
    historyRetention: 'Geschiedenis bewaren',
    
    // Advanced settings
    advanced: 'Geavanceerd',
    apiTimeout: 'API Time-out (seconden)',
    cacheSize: 'Cache grootte (items)',
    debugMode: 'Debug modus inschakelen',
    offlineMode: 'Offline modus (alleen cache)',
    resetSettings: 'Standaard herstellen',
    saveSettingsButton: 'Instellingen Opslaan',
    
    // Sample data
    sampleZips: 'Voorbeeld postcodes',
    sampleCities: 'Voorbeeldsteden',
    
    // About
    aboutApp: 'Over de applicatie',
    
    // Lookup sections
    singleLookup: 'Enkele zoekopdracht',
    singleLookupDesc: 'Voer een postcode in om de stad te vinden, of een stadsnaam om postcodes te vinden',
    
    // Form labels and help
    zipCode: 'Postcode',
    zipHelp: 'Formaat: 00-001 of 00001',
    cityName: 'Stadsnaam',
    cityHelp: 'Voer Poolse stadsnaam in',
    
    // General terms
    name: 'Naam',
    date: 'Datum',
    type: 'Type',
    size: 'Grootte',
    location: 'Locatie'
  };
}
