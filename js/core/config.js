/**
 * ============================================================
 * CHILI WEB — Core Configuration
 * ============================================================
 * Single source of truth for all application settings.
 * All values configurable, no hardcoded strings in app logic.
 */

class ChiliConfig {
  constructor() {
    // Global config from window or defaults
    const windowConfig = window.CHILI_CONFIG || {};

    this.project = {
      name: "CHILI",
      symbol: "CHILI",
      description: "Community-driven token on BNB Smart Chain",
      ...windowConfig.project,
    };

    this.token = {
      address: "0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",
      symbol: "CHILI",
      decimals: 18,
      explorer: "https://bscscan.com/token/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",
      contractExplorer: "https://bscscan.com/address/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c#code",
      ...windowConfig.token,
    };

    this.network = {
      chainId: 56,
      chainIdHex: "0x38",
      chainName: "BNB Smart Chain",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: [
        "https://bsc-dataseed.binance.org/",
        "https://bsc-dataseed1.defibit.io/",
        "https://bsc-dataseed1.ninicoin.io/",
      ],
      blockExplorerUrls: ["https://bscscan.com/"],
      ...windowConfig.network,
    };

    this.dex = {
      name: "PancakeSwap",
      pair: "CHILI / USDT",
      pairAddress: "",
      quoteTokens: {
        USDT: "0x55d398326f99059ff775485246999027b3197955",
        WBNB: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      },
      swapUrl: "https://pancakeswap.finance/swap?outputCurrency=0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",
      dexScreenerUrl: "https://dexscreener.com/bsc/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",
      ...windowConfig.dex,
    };

    this.social = {
      telegram: "",
      twitter: "",
      github: "https://github.com/ayudekaka/chili-web",
      ...windowConfig.social,
    };

    this.ui = {
      addressStartLength: 6,
      addressEndLength: 4,
      copySuccessDuration: 1800,
      toastDuration: 2500,
      marketRefreshInterval: 60000,
      chartMaxPoints: 48,
      requestTimeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...windowConfig.ui,
    };
  }

  isTokenConfigured() {
    const addr = this.token.address;
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  }

  getContractUrl() {
    return this.token.contractExplorer || this.token.explorer;
  }

  getSwapUrl() {
    return this.dex.swapUrl;
  }

  getDexScreenerUrl() {
    return this.dex.dexScreenerUrl;
  }
}

// Export singleton
const CONFIG = new ChiliConfig();
