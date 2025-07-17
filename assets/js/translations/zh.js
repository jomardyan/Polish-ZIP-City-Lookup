/**
 * Chinese translations for Polish ZIP & City Lookup
 * Language: 中文 (zh)
 */

window.translations = window.translations || {};
window.translations.zh = {
  brand: '高级波兰邮政编码和城市查询',
  brandShort: '波兰邮编查询',
  tagline: '即时查找波兰邮政编码和城市',
  metaDescription: '具有批处理、历史记录、收藏夹和交互式地图的高级波兰邮政编码和城市查询工具。',
  metaKeywords: '波兰邮政编码, 波兰ZIP代码, 波兰城市查询, kod pocztowy, miejscowość Polska',
  
  // Navigation
  lookup: '查询',
  batch: '批处理',
  history: '历史',
  settings: '设置',
  
  // Input fields
  zipPlaceholder: '00-001 或 00001',
  cityPlaceholder: '华沙',
  lookupCity: '查询城市',
  lookupZip: '查询邮编',
  
  // Actions
  clear: '清除',
  clearResults: '清除结果',
  search: '搜索',
  filter: '筛选',
  sort: '排序',
  copy: '复制',
  print: '打印',
  export: '导出',
  import: '导入',
  save: '保存',
  cancel: '取消',
  close: '关闭',
  minimize: '最小化',
  maximize: '最大化',
  
  // Results
  results: '结果',
  input: '输入',
  output: '输出',
  batchResults: '批处理结果',
  noResults: '未找到结果',
  
  // File operations
  importFile: '导入 CSV / Excel',
  chooseFile: '选择文件...',
  pasteInputs: '或粘贴输入（每行一个）',
  pastePlaceholder: '邮编或城市',
  supportedFormats: '支持的格式',
  dragDrop: '拖放文件到此处或点击选择',
  
  // Processing modes
  mode: '模式',
  zipCity: '邮编 → 城市',
  cityZip: '城市 → 邮编',
  autoDetect: '自动检测',
  
  // Batch processing
  processBatch: '处理批次',
  batchProcessing: '批处理',
  batchProcessingDesc: '使用文件导入或手动输入一次处理多个邮政编码或城市',
  importData: '导入数据',
  manualInput: '手动输入',
  onePerLine: '每行一个条目',
  itemsEntered: '已输入项目',
  processingOptions: '处理选项',
  maxResultsBatch: '最大结果',
  requestDelay: '请求延迟（毫秒）',
  skipDuplicates: '跳过重复项',
  continueOnError: '出错时继续处理',
  pause: '暂停',
  stop: '停止',
  
  // Map
  mapView: '地图视图',
  mapSettings: '地图设置',
  mapProvider: '地图提供商',
  defaultZoom: '默认缩放级别',
  autoFit: '自动调整地图到结果',
  showMarkers: '显示位置标记',
  
  // Messages
  invalidZip: '无效的邮政编码格式',
  invalidCity: '请输入城市名称',
  notFound: '未找到',
  invalidFormat: '无效格式',
  error: '发生错误',
  loading: '加载中...',
  success: '操作成功完成',
  
  // History and favorites
  searchHistory: '搜索历史',
  historyDesc: '查看和管理您的最近搜索和收藏夹',
  searchHistoryPlaceholder: '搜索历史...',
  favorites: '收藏夹',
  noHistory: '未找到搜索历史',
  historyHelp: '您的搜索将自动显示在这里',
  noFavorites: '暂无收藏',
  favoritesHelp: '给搜索加星以保存到这里',
  clearHistory: '清除历史',
  
  // Time periods
  today: '今天',
  thisWeek: '本周',
  thisMonth: '本月',
  all: '全部',
  days7: '7天',
  days30: '30天',
  days90: '90天',
  year1: '1年',
  forever: '永远',
  
  // Statistics
  statistics: '统计',
  totalSearches: '总搜索次数',
  memberSince: '成员自',
  
  // Settings
  applicationSettings: '应用程序设置',
  settingsDesc: '自定义您的体验并管理首选项',
  
  // Appearance
  appearance: '外观',
  theme: '主题',
  lightTheme: '浅色',
  darkTheme: '深色',
  autoTheme: '自动（系统）',
  
  // Language and localization
  language: '语言',
  
  // Typography
  fontSize: '字体大小',
  small: '小',
  normal: '正常',
  large: '大',
  extraLarge: '特大',
  
  // UI modes
  compactMode: '紧凑模式',
  animations: '启用动画',
  
  // Search settings
  searchSettings: '搜索设置',
  defaultMode: '默认搜索模式',
  maxResults: '默认最大结果数',
  autoSuggestions: '启用自动建议',
  fuzzySearch: '启用模糊搜索',
  instantResults: '输入时显示结果',
  
  // Privacy and data
  privacy: '隐私和数据',
  saveHistory: '保存搜索历史',
  saveSettings: '本地保存设置',
  analytics: '允许使用分析',
  historyRetention: '历史保留',
  clearAllData: '清除所有数据',
  
  // Advanced settings
  advanced: '高级',
  apiTimeout: 'API超时（秒）',
  cacheSize: '缓存大小（条目）',
  debugMode: '启用调试模式',
  offlineMode: '离线模式（仅缓存）',
  resetSettings: '重置为默认',
  saveSettingsButton: '保存设置',
  
  // Utilities
  swap: '交换',
  sample: '示例',
  sampleZips: '示例邮编',
  sampleCities: '示例城市',
  
  // File formats
  csv: 'CSV',
  excel: 'Excel',
  
  // About
  aboutApp: '关于应用程序',
  version: '版本',
  developer: '开发者',
  license: '许可证',
  sourceCode: '源代码',
  reportIssue: '报告问题',
  userGuide: '用户指南',
  feedback: '反馈',
  
  // Sorting
  ascending: '升序',
  descending: '降序',
  name: '名称',
  date: '日期',
  type: '类型',
  size: '大小',
  
  // Location data
  location: '位置',
  coordinates: '坐标',
  latitude: '纬度',
  longitude: '经度',
  elevation: '海拔',
  population: '人口',
  area: '面积',
  timezone: '时区',
  currency: '货币',
  country: '国家',
  region: '地区',
  province: '省',
  district: '区',
  municipality: '市',
  
  // Address components
  street: '街道',
  number: '号码',
  building: '建筑',
  apartment: '公寓',
  floor: '楼层',
  entranceCode: '入口密码',
  
  // Contact information
  phoneNumber: '电话号码',
  website: '网站',
  email: '邮箱',
  businessHours: '营业时间',
  
  // Services and facilities
  services: '服务',
  facilities: '设施',
  accessibility: '无障碍',
  parking: '停车',
  publicTransport: '公共交通',
  nearbyPlaces: '附近地点'
};
