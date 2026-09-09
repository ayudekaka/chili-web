/**
 * ============================================================
 * CHILI WEB — UI Manager
 * ============================================================
 * Centralized DOM updates and component synchronization.
 * Decouples data updates from UI rendering.
 */

class UIManager {
  constructor(i18nManager = i18n) {
    this.i18n = i18nManager;
    this.elementCache = new Map();
    this.setupObservers();
  }

  /**
   * Cache DOM elements for performance
   */
  getElement(id) {
    if (!this.elementCache.has(id)) {
      const element = document.getElementById(id);
      if (element) {
        this.elementCache.set(id, element);
      }
    }
    return this.elementCache.has(id) ? this.elementCache.get(id) : null;
  }

  /**
   * Clear element cache
   */
  clearCache() {
    this.elementCache.clear();
  }

  /**
   * Update market display
   */
  updateMarketDisplay(marketData) {
    if (!marketData) return;

    if (marketData.status === "error") {
      this.setMarketError();
      return;
    }

    const { pair, blockNumber, price } = marketData;

    if (!pair) {
      this.setMarketError();
      return;
    }

    // Price
    Utils.DOM.setText("price", Utils.Format.price(price));

    // Pair info
    Utils.DOM.setText("pair", this.formatPairDisplay(pair));
    Utils.DOM.setText("dex", Utils.Format.capitalize(pair.dexId || "PancakeSwap"));
    Utils.DOM.setText("block", blockNumber);

    // Liquidity & Volume
    Utils.DOM.setText("liquidity", Utils.Format.usd(pair.liquidity?.usd));
    Utils.DOM.setText("volume", Utils.Format.usd(pair.volume?.h24));
    Utils.DOM.setText("marketCap", this.formatMarketCap(pair.marketCap));

    // Transactions
    const buys = Number(pair.txns?.h24?.buys || 0);
    const sells = Number(pair.txns?.h24?.sells || 0);
    Utils.DOM.setText("txns", Utils.Format.number(buys + sells));
    Utils.DOM.setText("buys", Utils.Format.number(buys));
    Utils.DOM.setText("sells", Utils.Format.number(sells));

    // Pair address & timestamp
    Utils.DOM.setText(
      "pairAddress",
      Utils.Address.getShortenedFromConfig(pair.pairAddress)
    );
    Utils.DOM.setText("lastUpdate", Utils.Format.time(new Date(marketData.updatedAt)));

    // Status
    Utils.DOM.setText("marketStatusText", this.i18n.t("live"));

    // Update chart link
    this.updateChartLink(pair.url);
  }

  /**
   * Set market error state
   */
  setMarketError() {
    Utils.DOM.setText("price", "—");
    Utils.DOM.setText(
      "marketStatusText",
      this.i18n.t("market-unavailable")
    );
  }

  /**
   * Format pair display string
   */
  formatPairDisplay(pair) {
    if (pair?.baseToken?.symbol && pair?.quoteToken?.symbol) {
      return `${pair.baseToken.symbol} / ${pair.quoteToken.symbol}`;
    }
    return CONFIG.dex.pair;
  }

  /**
   * Format market cap with fallback
   */
  formatMarketCap(marketCap) {
    const num = Number(marketCap);
    if (!Number.isFinite(num) || num <= 0) {
      return "—";
    }
    return Utils.Format.usd(num);
  }

  /**
   * Update chart link
   */
  updateChartLink(url) {
    const chartUrl = url || CONFIG.dex.dexScreenerUrl;
    document.querySelectorAll("[data-dexscreener]").forEach((link) => {
      if (chartUrl) {
        link.href = chartUrl;
      }
    });
  }

  /**
   * Update language UI
   */
  applyLanguage(langCode) {
    // Update data-i18n elements
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      element.textContent = this.i18n.t(key);
    });

    // Update language button
    const langBtn = this.getElement("langBtn");
    if (langBtn) {
      langBtn.textContent = langCode === "en" ? "中文" : "EN";
      langBtn.setAttribute(
        "aria-label",
        langCode === "en" ? "切换到中文" : "Switch to English"
      );
    }

    // Update HTML lang attribute
    document.documentElement.lang = langCode === "zh" ? "zh-CN" : "en";

    // Update terminal titles
    const terminalTitle = Utils.DOM.query(".terminal-title");
    if (terminalTitle) {
      terminalTitle.textContent =
        langCode === "zh"
          ? "CHILI // 市场数据"
          : "CHILI // MARKET DATA FEED";
    }

    const terminalChain = Utils.DOM.query(".terminal-chain");
    if (terminalChain) {
      terminalChain.textContent =
        langCode === "zh"
          ? "BNB 智能链 // ● 实时"
          : "BNB SMART CHAIN // ● REALTIME";
    }

    // Update market card labels
    this.updateMarketCardLabels();
  }

  /**
   * Update market card labels
   */
  updateMarketCardLabels() {
    const labels = Utils.DOM.queryAll(".market-card-label");
    const keys = [
      "market-pair",
      "market-dex",
      "market-block",
      "market-liquidity",
      "market-volume",
      "market-cap",
      "market-txns",
      "market-buy-sell",
    ];

    labels.forEach((element, index) => {
      if (keys[index]) {
        element.textContent = this.i18n.t(keys[index]);
      }
    });
  }

  /**
   * Setup static data displays
   */
  setupStaticData() {
    Utils.DOM.setText(
      "heroContract",
      Utils.Address.isValid(CONFIG.token.address)
        ? Utils.Address.getShortenedFromConfig(CONFIG.token.address)
        : "—"
    );

    Utils.DOM.setText("coreToken", CONFIG.token.symbol);
    Utils.DOM.setText("networkValue", CONFIG.network.chainName);
    Utils.DOM.setText("chainId", CONFIG.network.chainId);
    Utils.DOM.setText("pair", CONFIG.dex.pair);
    Utils.DOM.setText("dex", CONFIG.dex.name);
    Utils.DOM.setText("coreStatus", this.i18n.t("online"));
    Utils.DOM.setText("marketStatusText", this.i18n.t("live"));

    // Setup contract links
    document.querySelectorAll("[data-bscscan]").forEach((link) => {
      link.href = CONFIG.getContractUrl();
    });
  }

  /**
   * Show toast notification
   */
  showToast(message, duration = CONFIG.ui.toastDuration) {
    let toast = document.getElementById("chiliToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "chiliToast";
      toast.setAttribute("role", "status");
      toast.style.position = "fixed";
      toast.style.left = "50%";
      toast.style.bottom = "30px";
      toast.style.transform = "translateX(-50%)";
      toast.style.zIndex = "99999";
      toast.style.padding = "10px 16px";
      toast.style.border = "1px solid rgba(239,38,55,.35)";
      toast.style.background = "#111";
      toast.style.color = "#fff";
      toast.style.fontSize = "12px";
      toast.style.transition = "opacity .2s ease";
      toast.style.opacity = "0";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = "0";
    }, duration);
  }

  /**
   * Setup scroll effects
   */
  setupObservers() {
    const header = this.getElement("siteHeader");
    const updateScroll = () => {
      const scrolled = window.scrollY > 20;
      document.body.classList.toggle("is-scrolled", scrolled);
      if (header) {
        header.classList.toggle("scrolled", scrolled);
      }
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
  }

  /**
   * Update year in footer
   */
  updateYear() {
    const year = new Date().getFullYear().toString();
    Utils.DOM.queryAll("[data-year]").forEach((element) => {
      element.textContent = year;
    });
  }
}

// Export singleton
const uiManager = new UIManager();
