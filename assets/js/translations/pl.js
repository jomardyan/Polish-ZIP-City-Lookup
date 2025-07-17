/**
 * Polish translations for Polish ZIP & City Lookup
 * Language: Polski (pl)
 */

window.translations = window.translations || {};
window.translations.pl = {
  brand: 'Rozszerzona Wyszukiwarka Kodów Pocztowych',
  brandShort: 'Kody Pocztowe PL',
  tagline: 'Znajdź polskie kody pocztowe i miasta natychmiast',
  metaDescription: 'Zaawansowane narzędzie do wyszukiwania polskich kodów pocztowych i miast z przetwarzaniem wsadowym, historią, ulubionymi i interaktywnymi mapami.',
  metaKeywords: 'polskie kody pocztowe, kody ZIP Polska, wyszukiwanie miast Polska, kod pocztowy, miejscowość Polska',
  
  // Navigation
  lookup: 'Wyszukaj',
  batch: 'Wsadowo',
  history: 'Historia',
  settings: 'Ustawienia',
  
  // Input fields
  zipPlaceholder: '00-001 lub 00001',
  cityPlaceholder: 'Warszawa',
  lookupCity: 'Szukaj Miasta',
  lookupZip: 'Szukaj Kodu',
  
  // Single lookup section
  singleLookup: 'Pojedyncze Wyszukiwanie',
  singleLookupDesc: 'Wprowadź kod pocztowy, aby znaleźć miasto, lub nazwę miasta, aby znaleźć kody pocztowe.',
  
  // Form fields
  zipCode: 'Kod Pocztowy',
  zipHelp: 'Format: 00-001 lub 00001',
  cityName: 'Nazwa Miasta',
  cityHelp: 'Wprowadź polską nazwę miasta',
  
  // Actions
  clear: 'Wyczyść',
  clearResults: 'Wyczyść Wyniki',
  search: 'Szukaj',
  filter: 'Filtruj',
  sort: 'Sortuj',
  copy: 'Kopiuj',
  print: 'Drukuj',
  export: 'Eksportuj',
  import: 'Importuj',
  save: 'Zapisz',
  cancel: 'Anuluj',
  close: 'Zamknij',
  minimize: 'Minimalizuj',
  maximize: 'Maksymalizuj',
  validate: 'Waliduj',
  
  // Results
  results: 'Wyniki',
  search_results: 'Wyniki Wyszukiwania',
  input: 'Wejście',
  output: 'Wyjście',
  batchResults: 'Wyniki Wsadowe',
  noResults: 'Nie znaleziono wyników',
  
  // File operations
  importFile: 'Importuj CSV / Excel',
  chooseFile: 'Wybierz plik...',
  pasteInputs: 'Lub wklej dane (po jednym wierszu)',
  pastePlaceholder: 'Kody lub Miasta',
  supportedFormats: 'Obsługiwane formaty',
  dragDrop: 'Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać',
  
  // Processing modes
  mode: 'Tryb',
  zipCity: 'Kod → Miasto',
  cityZip: 'Miasto → Kod',
  autoDetect: 'Auto Wykryj',
  
  // Batch processing
  processBatch: 'Przetwórz',
  batchProcessing: 'Przetwarzanie wsadowe',
  batchProcessingDesc: 'Przetwarzaj wiele kodów pocztowych lub miast jednocześnie używając importu plików lub wprowadzania ręcznego',
  importData: 'Importuj dane',
  manualInput: 'Wprowadzanie ręczne',
  onePerLine: 'Jeden wpis na linię',
  itemsEntered: 'wprowadzonych pozycji',
  processingOptions: 'Opcje przetwarzania',
  maxResultsBatch: 'Maks wyników',
  requestDelay: 'Opóźnienie żądań (ms)',
  skipDuplicates: 'Pomiń duplikaty',
  continueOnError: 'Kontynuuj przetwarzanie przy błędach',
  pause: 'Pauza',
  stop: 'Stop',
  
  // Map
  mapView: 'Mapa',
  mapSettings: 'Ustawienia mapy',
  mapProvider: 'Dostawca mapy',
  defaultZoom: 'Domyślny poziom powiększenia',
  autoFit: 'Automatyczne dopasowanie mapy do wyników',
  showMarkers: 'Pokaż znaczniki lokalizacji',
  
  // Messages
  invalidZip: 'Nieprawidłowy format kodu pocztowego',
  invalidCity: 'Proszę podać nazwę miasta',
  notFound: 'Nie znaleziono',
  invalidFormat: 'Nieprawidłowy format',
  error: 'Wystąpił błąd',
  loading: 'Ładowanie...',
  success: 'Operacja zakończona pomyślnie',
  
  // History and favorites
  searchHistory: 'Historia Wyszukiwania',
  historyDesc: 'Przeglądaj i zarządzaj swoimi ostatnimi wyszukiwaniami i ulubionymi',
  searchHistoryPlaceholder: 'Szukaj w historii...',
  favorites: 'Ulubione',
  noHistory: 'Nie znaleziono historii wyszukiwań',
  historyHelp: 'Twoje wyszukiwania pojawią się tutaj automatycznie',
  noFavorites: 'Brak ulubionych',
  favoritesHelp: 'Oznacz wyszukiwania gwiazdką, aby zapisać je tutaj',
  clearHistory: 'Wyczyść historię',
  
  // Time periods
  today: 'Dzisiaj',
  thisWeek: 'Ten tydzień',
  thisMonth: 'Ten miesiąc',
  all: 'Wszystkie',
  days7: '7 dni',
  days30: '30 dni',
  days90: '90 dni',
  year1: '1 rok',
  forever: 'Na zawsze',
  
  // Statistics
  statistics: 'Statystyki',
  totalSearches: 'Łączne wyszukiwania',
  memberSince: 'Członek od',
  
  // Settings
  applicationSettings: 'Ustawienia Aplikacji',
  settingsDesc: 'Dostosuj swoje doświadczenie i zarządzaj preferencjami',
  
  // Appearance
  appearance: 'Wygląd',
  theme: 'Motyw',
  lightTheme: 'Jasny',
  darkTheme: 'Ciemny',
  autoTheme: 'Auto (System)',
  
  // Language and localization
  language: 'Język',
  
  // Typography
  fontSize: 'Rozmiar czcionki',
  small: 'Mały',
  normal: 'Normalny',
  large: 'Duży',
  extraLarge: 'Bardzo duży',
  
  // UI modes
  compactMode: 'Tryb kompaktowy',
  animations: 'Włącz animacje',
  
  // Search settings
  searchSettings: 'Ustawienia wyszukiwania',
  defaultMode: 'Domyślny tryb wyszukiwania',
  maxResults: 'Domyślna maksymalna liczba wyników',
  autoSuggestions: 'Włącz automatyczne sugestie',
  fuzzySearch: 'Włącz wyszukiwanie rozmyte',
  instantResults: 'Pokaż wyniki podczas pisania',
  
  // Privacy and data
  privacy: 'Prywatność i Dane',
  saveHistory: 'Zapisuj historię wyszukiwań',
  saveSettings: 'Zapisuj ustawienia lokalnie',
  analytics: 'Zezwól na analitykę użytkowania',
  historyRetention: 'Przechowywanie historii',
  clearAllData: 'Wyczyść wszystkie dane',
  
  // Advanced settings
  advanced: 'Zaawansowane',
  apiTimeout: 'Limit czasu API (sekundy)',
  cacheSize: 'Rozmiar pamięci podręcznej (wpisy)',
  debugMode: 'Włącz tryb debugowania',
  offlineMode: 'Tryb offline (tylko cache)',
  resetSettings: 'Przywróć domyślne',
  saveSettingsButton: 'Zapisz Ustawienia',
  
  // Utilities
  swap: 'Zamień',
  sample: 'Przykład',
  sampleZips: 'Przykładowe kody',
  sampleCities: 'Przykładowe miasta',
  
  // File formats
  csv: 'CSV',
  excel: 'Excel',
  
  // About
  aboutApp: 'O aplikacji',
  version: 'Wersja',
  developer: 'Deweloper',
  license: 'Licencja',
  sourceCode: 'Kod źródłowy',
  reportIssue: 'Zgłoś problem',
  userGuide: 'Przewodnik użytkownika',
  feedback: 'Opinia',
  
  // Sorting
  ascending: 'Rosnąco',
  descending: 'Malejąco',
  name: 'Nazwa',
  date: 'Data',
  type: 'Typ',
  size: 'Rozmiar',
  
  // Location data
  location: 'Lokalizacja',
  coordinates: 'Współrzędne',
  latitude: 'Szerokość geograficzna',
  longitude: 'Długość geograficzna',
  elevation: 'Wysokość',
  population: 'Populacja',
  area: 'Obszar',
  timezone: 'Strefa czasowa',
  currency: 'Waluta',
  country: 'Kraj',
  region: 'Region',
  province: 'Województwo',
  district: 'Powiat',
  municipality: 'Gmina',
  
  // Address components
  street: 'Ulica',
  number: 'Numer',
  building: 'Budynek',
  apartment: 'Mieszkanie',
  floor: 'Piętro',
  entranceCode: 'Kod bramy',
  
  // Contact information
  phoneNumber: 'Numer telefonu',
  website: 'Strona internetowa',
  email: 'Email',
  businessHours: 'Godziny otwarcia',
  
  // Services and facilities
  services: 'Usługi',
  facilities: 'Udogodnienia',
  accessibility: 'Dostępność',
  parking: 'Parking',
  publicTransport: 'Transport publiczny',
  nearbyPlaces: 'Pobliskie miejsca'
};
