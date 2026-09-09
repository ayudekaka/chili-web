/**
 * ============================================================
 * CHILI WEB — Market Data Service
 * ============================================================
 * Handles all market data fetching, caching, and updates.
 * Abstracts API interactions from UI logic.
 */

class MarketDataService {
  constructor(config = CONFIG) {
    this.config = config;
    this.currentMarketData = null;
    this.priceHistory = [];
    this.isLoading = false;
    this.lastUpdateTime = null;
    this.listeners = [];
    this.refreshInterval = null;
  }

  /**
   * Subscribe to market data updates
   */
  onChange(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  }

  /**
   * Unsubscribe from market data updates
   */
  offChange(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  /**
   * Notify all listeners of data change
   */
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentMarketData);
      } catch (error) {
        console.error("Error in market data listener:", error);
      }
    });
  }

  /**
   * Fetch market pairs from DexScreener
   */
  async fetchPairs() {
    const address = this.config.token.address;

    if (!Utils.Address.isValid(address)) {
      throw new Error("Invalid token address");
    }

    const url =
      `https://api.dexscreener.com/latest/dex/tokens/${address}`;

    try {
      const response = await Utils.Async.fetchWithTimeout(
        url,
        {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "application/json" },
        },
        this.config.ui.requestTimeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data?.pairs) ? data.pairs : [];
    } catch (error) {
      console.error("Failed to fetch pairs:", error);
      throw error;
    }
  }

  /**
   * Select best pair based on priority rules
   */
  selectBestPair(pairs) {
    if (!Array.isArray(pairs) || pairs.length === 0) {
      return null;
    }

    // Filter BSC pairs only
    const bscPairs = pairs.filter(
      (p) => String(p.chainId || "").toLowerCase() === "bsc"
    );

    if (bscPairs.length === 0) return null;

    // Check for configured pair address
    const configuredAddr = Utils.Address.normalize(
      this.config.dex.pairAddress
    );
    if (configuredAddr) {
      const exactMatch = bscPairs.find(
        (p) =>
          Utils.Address.normalize(p.pairAddress) === configuredAddr
      );
      if (exactMatch) return exactMatch;
    }

    // Filter pairs containing CHILI token
    const chiliPairs = bscPairs.filter((p) => {
      const baseAddr = Utils.Address.normalize(
        p.baseToken?.address
      );
      const quoteAddr = Utils.Address.normalize(
        p.quoteToken?.address
      );
      const tokenAddr = Utils.Address.normalize(
        this.config.token.address
      );
      return baseAddr === tokenAddr || quoteAddr === tokenAddr;
    });

    if (chiliPairs.length === 0) return null;

    // Priority 1: USDT pair
    const usdtAddr = Utils.Address.normalize(
      this.config.dex.quoteTokens.USDT
    );
    const usdtPairs = chiliPairs.filter(
      (p) =>
        Utils.Address.normalize(p.baseToken?.address) === usdtAddr ||
        Utils.Address.normalize(p.quoteToken?.address) === usdtAddr
    );

    if (usdtPairs.length > 0) {
      return this.getHighestLiquidityPair(usdtPairs);
    }

    // Priority 2: WBNB pair
    const wbnbAddr = Utils.Address.normalize(
      this.config.dex.quoteTokens.WBNB
    );
    const wbnbPairs = chiliPairs.filter(
      (p) =>
        Utils.Address.normalize(p.baseToken?.address) === wbnbAddr ||
        Utils.Address.normalize(p.quoteToken?.address) === wbnbAddr
    );

    if (wbnbPairs.length > 0) {
      return this.getHighestLiquidityPair(wbnbPairs);
    }

    // Priority 3: Any pair with highest liquidity
    return this.getHighestLiquidityPair(chiliPairs);
  }

  /**
   * Get pair with highest liquidity
   */
  getHighestLiquidityPair(pairs) {
    if (!Array.isArray(pairs) || pairs.length === 0) return null;

    return pairs.reduce((best, current) => {
      const bestLiq = Number(best.liquidity?.usd || 0);
      const currLiq = Number(current.liquidity?.usd || 0);
      return currLiq > bestLiq ? current : best;
    });
  }

  /**
   * Get current block number via RPC
   */
  async getBlockNumber() {
    const rpcUrls = this.config.network.rpcUrls;

    if (!Array.isArray(rpcUrls) || rpcUrls.length === 0) {
      throw new Error("No RPC endpoints configured");
    }

    for (const rpcUrl of rpcUrls) {
      try {
        const response = await Utils.Async.fetchWithTimeout(
          rpcUrl,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: Date.now(),
              method: "eth_blockNumber",
              params: [],
            }),
          },
          this.config.ui.requestTimeout
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        if (!data.result) throw new Error("No result");

        return String(BigInt(data.result));
      } catch (error) {
        console.warn(`RPC endpoint failed: ${rpcUrl}`, error);
      }
    }

    throw new Error("All RPC endpoints failed");
  }

  /**
   * Refresh market data
   */
  async refresh() {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const pairs = await this.fetchPairs();
      const pair = this.selectBestPair(pairs);

      if (!pair) {
        throw new Error("No trading pair found");
      }

      const price = Number(pair.priceUsd);
      if (!Number.isFinite(price) || price <= 0) {
        throw new Error("Invalid price");
      }

      let blockNumber = "—";
      try {
        blockNumber = await this.getBlockNumber();
      } catch (error) {
        console.warn("Failed to fetch block number:", error);
      }

      this.currentMarketData = {
        pair,
        blockNumber,
        price,
        updatedAt: Date.now(),
        status: "success",
      };

      this.lastUpdateTime = Date.now();
      this.savePriceSample(price);
      this.notifyListeners();
    } catch (error) {
      console.error("Market data refresh failed:", error);

      this.currentMarketData = {
        status: "error",
        error: error.message,
        updatedAt: Date.now(),
      };

      this.notifyListeners();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Save price sample to history
   */
  savePriceSample(price) {
    if (!Number.isFinite(price) || price <= 0) return;

    this.priceHistory.push({
      time: Date.now(),
      price,
    });

    const maxPoints = this.config.ui.chartMaxPoints;
    if (this.priceHistory.length > maxPoints) {
      this.priceHistory = this.priceHistory.slice(-maxPoints);
    }

    // Persist to storage
    Utils.Storage.set("price-history", this.priceHistory, "chili");
  }

  /**
   * Load price history from storage
   */
  loadPriceHistory() {
    const history = Utils.Storage.get("price-history", [], "chili");

    if (!Array.isArray(history)) return [];

    return history.filter(
      (item) =>
        item &&
        Number.isFinite(Number(item.time)) &&
        Number.isFinite(Number(item.price))
    );
  }

  /**
   * Start auto-refresh interval
   */
  startRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(() => {
      this.refresh().catch((error) => {
        console.error("Auto-refresh error:", error);
      });
    }, this.config.ui.marketRefreshInterval);

    // Initial refresh
    this.refresh().catch((error) => {
      console.error("Initial refresh error:", error);
    });
  }

  /**
   * Stop auto-refresh interval
   */
  stopRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Get current market data
   */
  getMarketData() {
    return this.currentMarketData;
  }

  /**
   * Get price history
   */
  getPriceHistory() {
    return this.priceHistory;
  }

  /**
   * Get loading state
   */
  isRefreshing() {
    return this.isLoading;
  }
}

// Export singleton
const marketService = new MarketDataService();
