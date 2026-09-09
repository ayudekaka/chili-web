/**
 * ============================================================
 * CHILI WEB — Internationalization System
 * ============================================================
 * Handles multi-language support (English, Chinese, etc.)
 * Extensible for additional languages.
 */

class I18nManager {
  constructor() {
    this.currentLanguage = "en";
    this.languages = new Map();
    this.listeners = [];
    this.storageKey = "chili-language";
  }

  /**
   * Register language dictionary
   */
  register(langCode, dictionary) {
    if (!dictionary || typeof dictionary !== "object") {
      console.warn(`Invalid dictionary for language: ${langCode}`);
      return;
    }
    this.languages.set(langCode, dictionary);
  }

  /**
   * Set current language and notify listeners
   */
  setLanguage(langCode) {
    if (!this.languages.has(langCode)) {
      console.warn(`Language not registered: ${langCode}`);
      return false;
    }

    this.currentLanguage = langCode;
    this.saveLanguage(langCode);
    this.notifyListeners();
    return true;
  }

  /**
   * Get current language
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Translate key
   */
  t(key, defaultValue = null) {
    const dict = this.languages.get(this.currentLanguage);
    if (!dict) return defaultValue || key;
    return dict[key] || defaultValue || key;
  }

  /**
   * Translate with fallback chain
   */
  tFallback(key, fallbackLangs = ["en"]) {
    const dict = this.languages.get(this.currentLanguage);
    if (dict && dict[key]) return dict[key];

    for (const lang of fallbackLangs) {
      const fallbackDict = this.languages.get(lang);
      if (fallbackDict && fallbackDict[key]) return fallbackDict[key];
    }

    return key;
  }

  /**
   * Load language from storage or default
   */
  loadLanguage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && this.languages.has(saved)) {
        this.currentLanguage = saved;
        return saved;
      }
    } catch (error) {
      console.warn("Failed to load language from storage:", error);
    }

    // Detect browser language
    const browserLang = navigator.language?.split("-")[0];
    if (browserLang && this.languages.has(browserLang)) {
      this.currentLanguage = browserLang;
    }

    return this.currentLanguage;
  }

  /**
   * Save language to storage
   */
  saveLanguage(langCode) {
    try {
      localStorage.setItem(this.storageKey, langCode);
    } catch (error) {
      console.warn("Failed to save language to storage:", error);
    }
  }

  /**
   * Subscribe to language changes
   */
  onChange(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  }

  /**
   * Unsubscribe from language changes
   */
  offChange(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  /**
   * Notify all listeners of language change
   */
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentLanguage);
      } catch (error) {
        console.error("Error in language change listener:", error);
      }
    });
  }

  /**
   * Get all registered languages
   */
  getAvailableLanguages() {
    return Array.from(this.languages.keys());
  }

  /**
   * Check if language is registered
   */
  hasLanguage(langCode) {
    return this.languages.has(langCode);
  }
}

/**
 * Translation dictionaries
 */
const translations = {
  en: {
    // Navigation
    "nav-market": "MARKET",
    "nav-about": "ABOUT",
    "nav-tokenomics": "TOKENOMICS",
    "nav-story": "STORY",
    "nav-security": "SECURITY",
    "nav-contract": "CONTRACT",
    "logo-small": "ON-CHAIN",

    // Hero
    "hero-kicker": "BNB SMART CHAIN // SYSTEM ONLINE",
    "hero-subtitle":
      "A community-driven token built for the next wave of on-chain culture.",
    "hero-enter": "ENTER TERMINAL →",
    "hero-contract": "VIEW CONTRACT ↗",
    "hero-ca": "CA:",
    "hero-copy": "COPY",

    // Core
    "core-label": "CHILI CORE",
    "core-network": "NETWORK",
    "core-status": "STATUS",
    "core-tax": "TAX",
    "core-token": "TOKEN",

    // Terminal
    "terminal-title": "LIVE MARKET TERMINAL",
    "market-current": "CURRENT MARKET PRICE",
    "market-unit": "USD / CHILI",
    "market-pulse": "LIVE PRICE PULSE",
    "market-pair": "PAIR",
    "market-dex": "DEX",
    "market-block": "BLOCK",
    "market-liquidity": "LIQUIDITY",
    "market-volume": "24H VOLUME",
    "market-cap": "MARKET CAP",
    "market-fdv": "FDV",
    "market-txns": "24H TXNS",
    "market-buy-sell": "BUY / SELL",
    "market-pair-address": "PAIR ADDRESS:",
    "market-last-update": "LAST UPDATE:",
    "market-open-chart": "OPEN LIVE CHART ↗",

    // Token Info
    "token-supply": "TOKEN SUPPLY",
    "token-decimals": "DECIMALS",
    "token-network": "NETWORK",
    "token-chain": "CHAIN ID",

    // Status
    "copy": "COPY",
    "copied": "COPIED",
    "live": "LIVE",
    "online": "ONLINE",
    "realtime": "REALTIME",
    "security": "SECURITY",
    "transparency": "TRANSPARENCY",

    // Section Titles
    "about": "ABOUT CHILI",
    "tokenomics": "TOKENOMICS",
    "story": "STORY",

    // Actions
    "swap": "SWAP",
    "buy-chili": "BUY CHILI",
    "view-contract": "VIEW CONTRACT",

    // Errors
    "market-unavailable": "MARKET DATA UNAVAILABLE",
    "rpc-error": "NETWORK DATA UNAVAILABLE",
    "copy-failed": "COPY FAILED",
    "session-chart": "LIVE PRICE PULSE · SESSION SAMPLES",
  },

  zh: {
    // Navigation
    "nav-market": "行情",
    "nav-about": "关于",
    "nav-tokenomics": "代币经济",
    "nav-story": "故事",
    "nav-security": "安全",
    "nav-contract": "合约",
    "logo-small": "链上核心",

    // Hero
    "hero-kicker": "BNB 智能链 // 系统在线",
    "hero-subtitle":
      "一个由社区驱动，为下一阶段链上文化而生的代币。",
    "hero-enter": "进入终端 →",
    "hero-contract": "查看合约 ↗",
    "hero-ca": "合约：",
    "hero-copy": "复制",

    // Core
    "core-label": "CHILI 核心",
    "core-network": "网络",
    "core-status": "状态",
    "core-tax": "税率",
    "core-token": "代币",

    // Terminal
    "terminal-title": "实时市场终端",
    "market-current": "当前市场价格",
    "market-unit": "美元 / CHILI",
    "market-pulse": "实时价格脉冲",
    "market-pair": "交易对",
    "market-dex": "DEX",
    "market-block": "区块",
    "market-liquidity": "流动性",
    "market-volume": "24小时成交量",
    "market-cap": "市值",
    "market-fdv": "完全稀释估值",
    "market-txns": "24小时交易",
    "market-buy-sell": "买入 / 卖出",
    "market-pair-address": "交易对地址：",
    "market-last-update": "最后更新：",
    "market-open-chart": "打开实时图表 ↗",

    // Token Info
    "token-supply": "代币总量",
    "token-decimals": "精度",
    "token-network": "网络",
    "token-chain": "链 ID",

    // Status
    "copy": "复制",
    "copied": "已复制",
    "live": "实时",
    "online": "在线",
    "realtime": "实时",
    "security": "安全",
    "transparency": "透明度",

    // Section Titles
    "about": "关于 CHILI",
    "tokenomics": "代币经济",
    "story": "故事",

    // Actions
    "swap": "兑换",
    "buy-chili": "购买 CHILI",
    "view-contract": "查看合约",

    // Errors
    "market-unavailable": "市场数据暂不可用",
    "rpc-error": "网络数据暂不可用",
    "copy-failed": "复制失败",
    "session-chart": "实时价格脉冲 · 本次访问采样",
  },
};

/**
 * Initialize i18n manager and register languages
 */
const i18n = new I18nManager();
Object.entries(translations).forEach(([lang, dict]) => {
  i18n.register(lang, dict);
});

// Load saved language or browser default
i18n.loadLanguage();
