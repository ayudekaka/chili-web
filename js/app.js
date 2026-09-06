(function () {
  "use strict";

  /*
   * CHILI WEBSITE
   * Main application logic
   *
   * Network: BNB Smart Chain
   * Token: CHILI
   */

  const ABI_TOTAL_SUPPLY = "0x18160ddd";

  const I18N = {
    en: {
      "logo-small": "ON-CHAIN",

      "nav-market": "MARKET",
      "nav-about": "ABOUT",
      "nav-tokenomics": "TOKENOMICS",
      "nav-story": "STORY",
      "nav-security": "SECURITY",
      "nav-contract": "CONTRACT",

      "hero-kicker": "BNB SMART CHAIN // SYSTEM ONLINE",
      "hero-subtitle":
        "A community-driven token built for the next wave of on-chain culture.",
      "hero-enter": "ENTER TERMINAL →",
      "hero-contract": "VIEW CONTRACT ↗",
      "hero-ca": "CA:",
      "hero-copy": "COPY",

      "core-label": "CHILI CORE",
      "core-network": "NETWORK",
      "core-status": "STATUS",
      "core-tax": "TAX",
      "core-token": "TOKEN",

      "terminal-title": "LIVE MARKET TERMINAL"
    },

    zh: {
      "logo-small": "链上核心",

      "nav-market": "行情",
      "nav-about": "关于",
      "nav-tokenomics": "代币经济",
      "nav-story": "故事",
      "nav-security": "安全",
      "nav-contract": "合约",

      "hero-kicker": "BNB 智能链 // 系统在线",
      "hero-subtitle":
        "一个由社区驱动，为下一阶段链上文化而生的代币。",
      "hero-enter": "进入终端 →",
      "hero-contract": "查看合约 ↗",
      "hero-ca": "合约：",
      "hero-copy": "复制",

      "core-label": "CHILI 核心",
      "core-network": "网络",
      "core-status": "状态",
      "core-tax": "税率",
      "core-token": "代币",

      "terminal-title": "实时市场终端"
    }
  };

  /*
   * Static text dictionary.
   * This also handles existing HTML text that does not yet
   * have a data-i18n attribute.
   */
  const TEXT = {
    en: {
      "ON-CHAIN": "ON-CHAIN",
      "LIVE": "LIVE",
      "ONLINE": "ONLINE",
      "REALTIME": "REALTIME",
      "SYSTEM ONLINE": "SYSTEM ONLINE",

      "MARKET SYNC": "MARKET SYNC",
      "LIQUIDITY MATRIX": "LIQUIDITY MATRIX",
      "BSC BLOCK SYNC": "BSC BLOCK SYNC",
      "REALTIME DATA": "REALTIME DATA",
      "ON-CHAIN ACTIVE": "ON-CHAIN ACTIVE",

      "CURRENT MARKET PRICE": "CURRENT MARKET PRICE",
      "USD / CHILI": "USD / CHILI",
      "LIVE PRICE PULSE": "LIVE PRICE PULSE",

      "PAIR": "PAIR",
      "DEX": "DEX",
      "BLOCK": "BLOCK",
      "LIQUIDITY": "LIQUIDITY",
      "24H VOLUME": "24H VOLUME",
      "MARKET CAP": "MARKET CAP",
      "24H TXNS": "24H TXNS",
      "BUY / SELL": "BUY / SELL",

      "PAIR ADDRESS:": "PAIR ADDRESS:",
      "LAST UPDATE:": "LAST UPDATE:",
      "OPEN LIVE CHART ↗": "OPEN LIVE CHART ↗",

      "CHILI // MARKET DATA FEED": "CHILI // MARKET DATA FEED",
      "BNB SMART CHAIN // ● REALTIME":
        "BNB SMART CHAIN // ● REALTIME",

      "CHILI // ON-CHAIN CORE": "CHILI // ON-CHAIN CORE",

      "BSC": "BSC",
      "TAX": "TAX",
      "TOKEN": "TOKEN",

      "COPY": "COPY",
      "COPIED": "COPIED",

      "Contract Address": "Contract Address",
      "CONTRACT ADDRESS": "CONTRACT ADDRESS",

      "TOKEN SUPPLY": "TOKEN SUPPLY",
      "DECIMALS": "DECIMALS",
      "NETWORK": "NETWORK",
      "CHAIN ID": "CHAIN ID",

      "SWAP": "SWAP",
      "BUY CHILI": "BUY CHILI",
      "VIEW CONTRACT": "VIEW CONTRACT",

      "SECURITY": "SECURITY",
      "TRANSPARENCY": "TRANSPARENCY",
      "ABOUT CHILI": "ABOUT CHILI",
      "TOKENOMICS": "TOKENOMICS",
      "STORY": "STORY",

      "CONNECT WALLET": "CONNECT WALLET"
    },

    zh: {
      "ON-CHAIN": "链上核心",
      "LIVE": "实时",
      "ONLINE": "在线",
      "REALTIME": "实时",
      "SYSTEM ONLINE": "系统在线",

      "MARKET SYNC": "行情同步",
      "LIQUIDITY MATRIX": "流动性矩阵",
      "BSC BLOCK SYNC": "BSC 区块同步",
      "REALTIME DATA": "实时数据",
      "ON-CHAIN ACTIVE": "链上活跃",

      "CURRENT MARKET PRICE": "当前市场价格",
      "USD / CHILI": "美元 / CHILI",
      "LIVE PRICE PULSE": "实时价格脉冲",

      "PAIR": "交易对",
      "DEX": "去中心化交易所",
      "BLOCK": "区块",
      "LIQUIDITY": "流动性",
      "24H VOLUME": "24小时成交量",
      "MARKET CAP": "市值",
      "24H TXNS": "24小时交易",
      "BUY / SELL": "买入 / 卖出",

      "PAIR ADDRESS:": "交易对地址：",
      "LAST UPDATE:": "最后更新：",
      "OPEN LIVE CHART ↗": "打开实时图表 ↗",

      "CHILI // MARKET DATA FEED":
        "CHILI // 行情数据流",

      "BNB SMART CHAIN // ● REALTIME":
        "BNB 智能链 // ● 实时",

      "CHILI // ON-CHAIN CORE":
        "CHILI // 链上核心",

      "BSC": "BSC",
      "TAX": "税率",
      "TOKEN": "代币",

      "COPY": "复制",
      "COPIED": "已复制",

      "Contract Address": "合约地址",
      "CONTRACT ADDRESS": "合约地址",

      "TOKEN SUPPLY": "代币总量",
      "DECIMALS": "精度",
      "NETWORK": "网络",
      "CHAIN ID": "链 ID",

      "SWAP": "兑换",
      "BUY CHILI": "购买 CHILI",
      "VIEW CONTRACT": "查看合约",

      "SECURITY": "安全",
      "TRANSPARENCY": "透明度",
      "ABOUT CHILI": "关于 CHILI",
      "TOKENOMICS": "代币经济",
      "STORY": "故事",

      "CONNECT WALLET": "连接钱包"
    }
  };

  let language = "en";

  /*
   * Start application
   */
  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initProjectInfo();
    initLogo();
    initContract();
    initTokenInfo();

    initNavigation();
    initMobileMenu();

    initCopyButtons();
    initWalletButtons();
    initExternalLinks();

    initScrollEffects();
    initSectionObserver();
    initBackToTop();

    initYear();
    initLanguage();
    initEthereumListeners();

    /*
     * Load blockchain / market data asynchronously.
     */
    loadTokenomics();
    loadMarketData();
  }

  /*
   * ---------------------------------------------------------
   * PROJECT
   * ---------------------------------------------------------
   */

  function initProjectInfo() {
    if (CHILI_CONFIG.site.title) {
      document.title = CHILI_CONFIG.site.title;
    }

    const meta = document.querySelector(
      'meta[name="description"]'
    );

    if (meta && CHILI_CONFIG.site.description) {
      meta.content = CHILI_CONFIG.site.description;
    }
  }

  function initLogo() {
    document
      .querySelectorAll("[data-chili-logo]")
      .forEach((el) => {
        if (el.tagName === "IMG") {
          el.src = CHILI_CONFIG.assets.logo;
          el.alt = `${CHILI_CONFIG.project.name} Logo`;
        }
      });
  }

  /*
   * ---------------------------------------------------------
   * CONTRACT
   * ---------------------------------------------------------
   */

  function initContract() {
    const address = getTokenAddress();

    const hero = document.getElementById(
      "heroContract"
    );

    const full = document.getElementById(
      "contractAddress"
    );

    if (!isTokenConfigured()) {
      if (hero) hero.textContent = "—";
      if (full) full.textContent = "—";
      return;
    }

    if (hero) {
      hero.textContent = shortenAddress(address);
    }

    if (full) {
      full.textContent = address;
    }
  }

  /*
   * ---------------------------------------------------------
   * TOKEN INFO
   * ---------------------------------------------------------
   */

  function initTokenInfo() {
    const symbolIds = [
      "tokenSymbol",
      "reactorSymbol",
      "coreToken"
    ];

    symbolIds.forEach((id) => {
      const el = document.getElementById(id);

      if (el) {
        el.textContent = CHILI_CONFIG.token.symbol;
      }
    });

    const decimals = document.getElementById(
      "tokenDecimals"
    );

    if (decimals) {
      decimals.textContent =
        CHILI_CONFIG.token.decimals;
    }

    const network = document.getElementById(
      "networkValue"
    );

    if (network) {
      network.textContent =
        CHILI_CONFIG.network.chainName;
    }

    const chain = document.getElementById(
      "chainId"
    );

    if (chain) {
      chain.textContent =
        CHILI_CONFIG.network.chainId;
    }

    const pair = document.getElementById("pair");

    if (pair) {
      pair.textContent = CHILI_CONFIG.dex.pair;
    }

    const dex = document.getElementById("dex");

    if (dex) {
      dex.textContent = CHILI_CONFIG.dex.name;
    }

    const status = document.getElementById(
      "marketStatusText"
    );

    if (status) {
      status.textContent = TEXT[language].LIVE;
    }

    const update = document.getElementById(
      "lastUpdate"
    );

    if (update) {
      update.textContent = formatTime(
        new Date()
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * TOKENOMICS
   *
   * ERC20 totalSupply() selector:
   * 0x18160ddd
   *
   * This uses the BSC public RPC directly.
   * It does NOT require MetaMask.
   * ---------------------------------------------------------
   */

  async function loadTokenomics() {
    if (!isTokenConfigured()) {
      return;
    }

    const rpc =
      CHILI_CONFIG.network.rpcUrls?.[0];

    const supplyEl =
      document.getElementById("tokenSupply");

    if (!rpc || !supplyEl) {
      return;
    }

    try {
      const result = await rpcCall(
        rpc,
        "eth_call",
        [
          {
            to: CHILI_CONFIG.token.address,
            data: ABI_TOTAL_SUPPLY
          },
          "latest"
        ]
      );

      if (!result || result === "0x") {
        return;
      }

      const raw = BigInt(result);

      const decimals = Number(
        CHILI_CONFIG.token.decimals || 18
      );

      const base =
        10n ** BigInt(decimals);

      const whole = raw / base;
      const fraction = raw % base;

      let value;

      if (fraction === 0n) {
        value =
          whole.toLocaleString("en-US");
      } else {
        value =
          `${whole.toLocaleString(
            "en-US"
          )}.${fraction
            .toString()
            .padStart(decimals, "0")
            .replace(/0+$/, "")}`;
      }

      supplyEl.textContent = value;
    } catch (error) {
      console.warn(
        "CHILI token supply unavailable:",
        error
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * MARKET DATA
   *
   * DexScreener:
   * - price
   * - liquidity
   * - volume
   * - market cap
   * - transactions
   * - buys
   * - sells
   *
   * BSC RPC:
   * - block number
   * ---------------------------------------------------------
   */

  async function loadMarketData() {
    const address = getTokenAddress();

    if (!isTokenConfigured()) {
      return;
    }

    try {
      const [
        pairs,
        block
      ] = await Promise.all([
        fetchDexScreener(address),
        fetchBlockNumber()
      ]);

      const pair = selectPair(pairs);

      if (pair) {
        /*
         * PRICE
         */
        if (pair.priceUsd) {
          setText(
            "price",
            `$${formatNumber(
              pair.priceUsd,
              10
            )}`
          );
        } else {
          setText("price", "—");
        }

        /*
         * LIQUIDITY
         */
        if (pair.liquidity?.usd) {
          setText(
            "liquidity",
            formatUsd(
              pair.liquidity.usd
            )
          );
        } else {
          setText("liquidity", "—");
        }

        /*
         * 24H VOLUME
         */
        if (pair.volume?.h24) {
          setText(
            "volume",
            formatUsd(
              pair.volume.h24
            )
          );
        } else {
          setText("volume", "—");
        }

        /*
         * MARKET CAP
         */
        if (pair.marketCap) {
          setText(
            "marketCap",
            formatUsd(
              pair.marketCap
            )
          );
        } else if (pair.fdv) {
          setText(
            "marketCap",
            formatUsd(pair.fdv)
          );
        } else {
          setText("marketCap", "—");
        }

        /*
         * TRANSACTIONS
         */
        if (pair.txns?.h24) {
          setText(
            "txns",
            formatNumber(
              Number(pair.txns.h24.buys || 0) +
                Number(
                  pair.txns.h24.sells || 0
                ),
              0
            )
          );

          setText(
            "buys",
            pair.txns.h24.buys ?? "—"
          );

          setText(
            "sells",
            pair.txns.h24.sells ?? "—"
          );
        } else {
          setText("txns", "—");
          setText("buys", "—");
          setText("sells", "—");
        }

        /*
         * PAIR ADDRESS
         */
        if (pair.pairAddress) {
          setText(
            "pairAddress",
            shortenAddress(
              pair.pairAddress
            )
          );

          /*
           * Make "Open Live Chart" point
           * to the actual pair instead of
           * the token page.
           */
          document
            .querySelectorAll(
              "[data-dexscreener]"
            )
            .forEach((link) => {
              link.href =
                `https://dexscreener.com/bsc/${pair.pairAddress}`;

              link.target = "_blank";
              link.rel =
                "noopener noreferrer";
            });
        } else {
          setText(
            "pairAddress",
            "—"
          );
        }
      }

      /*
       * BLOCK NUMBER
       */
      if (block) {
        const blockNumber =
          Number.parseInt(
            block,
            16
          );

        if (
          Number.isFinite(
            blockNumber
          )
        ) {
          setText(
            "block",
            blockNumber.toLocaleString(
              "en-US"
            )
          );
        }
      }

      /*
       * LAST UPDATE
       */
      setText(
        "lastUpdate",
        formatTime(new Date())
      );

      /*
       * MARKET STATUS
       */
      setText(
        "marketStatusText",
        TEXT[language].LIVE
      );
    } catch (error) {
      console.warn(
        "CHILI market data unavailable:",
        error
      );

      setText(
        "marketStatusText",
        "—"
      );
    }
  }

  /*
   * Fetch token pairs from DexScreener.
   */
  async function fetchDexScreener(
    address
  ) {
    const url =
      `https://api.dexscreener.com/latest/dex/tokens/${address}`;

    const response = await fetch(
      url,
      {
        headers: {
          Accept:
            "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `DexScreener HTTP ${response.status}`
      );
    }

    const data =
      await response.json();

    return Array.isArray(
      data.pairs
    )
      ? data.pairs
      : [];
  }

  /*
   * Select BSC pair with highest USD liquidity.
   *
   * If several BSC pairs exist,
   * CHILI website will use the most liquid one.
   */
  function selectPair(pairs) {
    return pairs
      .filter(
        (pair) =>
          String(
            pair.chainId
          ).toLowerCase() ===
          "bsc"
      )
      .sort(
        (a, b) =>
          Number(
            b.liquidity?.usd || 0
          ) -
          Number(
            a.liquidity?.usd || 0
          )
      )[0] || null;
  }

  /*
   * Get latest BSC block number.
   */
  async function fetchBlockNumber() {
    const rpc =
      CHILI_CONFIG.network.rpcUrls?.[0];

    if (!rpc) {
      return null;
    }

    return rpcCall(
      rpc,
      "eth_blockNumber",
      []
    );
  }

  /*
   * Generic JSON-RPC request.
   */
  async function rpcCall(
    url,
    method,
    params
  ) {
    const response =
      await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now(),
            method,
            params
          })
        }
      );

    if (!response.ok) {
      throw new Error(
        `RPC HTTP ${response.status}`
      );
    }

    const data =
      await response.json();

    if (data.error) {
      throw new Error(
        data.error.message ||
          "RPC error"
      );
    }

    return data.result;
  }

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  function initNavigation() {
    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach((link) => {
        link.addEventListener(
          "click",
          (event) => {
            const id =
              link.getAttribute(
                "href"
              );

            if (!id || id === "#") {
              return;
            }

            const target =
              document.querySelector(
                id
              );

            if (!target) {
              return;
            }

            event.preventDefault();

            const header =
              document.querySelector(
                ".nav"
              );

            const offset =
              (header?.offsetHeight ||
                0) + 10;

            window.scrollTo({
              top:
                target.getBoundingClientRect()
                  .top +
                window.scrollY -
                offset,

              behavior:
                "smooth"
            });

            closeMobileMenu();
          }
        );
      });
  }

  /*
   * ---------------------------------------------------------
   * MOBILE MENU
   * ---------------------------------------------------------
   */

  function initMobileMenu() {
    const button =
      document.getElementById(
        "mobileToggle"
      );

    const menu =
      document.getElementById(
        "navLinks"
      );

    if (!button || !menu) {
      return;
    }

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.addEventListener(
      "click",
      () => {
        const open =
          menu.classList.toggle(
            "open"
          );

        button.classList.toggle(
          "is-active",
          open
        );

        button.setAttribute(
          "aria-expanded",
          String(open)
        );
      }
    );
  }

  function closeMobileMenu() {
    const menu =
      document.getElementById(
        "navLinks"
      );

    const button =
      document.getElementById(
        "mobileToggle"
      );

    menu?.classList.remove(
      "open"
    );

    button?.classList.remove(
      "is-active"
    );

    button?.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  /*
   * ---------------------------------------------------------
   * COPY CONTRACT
   * ---------------------------------------------------------
   */

  function initCopyButtons() {
    document
      .querySelectorAll(
        "#copyHero, #copyContract"
      )
      .forEach((button) => {
        button.addEventListener(
          "click",
          () =>
            copyContractAddress(
              button
            )
        );
      });
  }

  async function copyContractAddress(
    button
  ) {
    if (!isTokenConfigured()) {
      showToast(
        language === "zh"
          ? "合约地址尚未配置。"
          : "Contract address is not configured."
      );

      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          getTokenAddress()
        );
      } else {
        fallbackCopy(
          getTokenAddress()
        );
      }

      const original =
        button.dataset
          .originalText ||
        button.textContent;

      button.dataset.originalText =
        original;

      button.classList.add(
        "copied"
      );

      button.textContent =
        TEXT[language].COPIED;

      showToast(
        language === "zh"
          ? "合约地址已复制。"
          : "Contract address copied."
      );

      clearTimeout(
        button._copyTimer
      );

      button._copyTimer =
        setTimeout(
          () => {
            button.classList.remove(
              "copied"
            );

            button.textContent =
              button.dataset
                .originalText ||
              TEXT[language].COPY;
          },
          CHILI_CONFIG.ui
            .copySuccessDuration
        );
    } catch (error) {
      console.error(
        "Copy error:",
        error
      );

      showToast(
        language === "zh"
          ? "复制失败，请手动复制。"
          : "Copy failed. Please copy manually."
      );
    }
  }

  /*
   * Clipboard fallback for older browsers.
   */
  function fallbackCopy(text) {
    const textarea =
      document.createElement(
        "textarea"
      );

    textarea.value = text;

    textarea.style.position =
      "fixed";

    textarea.style.opacity =
      "0";

    textarea.style.pointerEvents =
      "none";

    document.body.appendChild(
      textarea
    );

    textarea.focus();
    textarea.select();

    const success =
      document.execCommand(
        "copy"
      );

    textarea.remove();

    if (!success) {
      throw new Error(
        "Copy command failed"
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * WALLET
   * ---------------------------------------------------------
   */

  function initWalletButtons() {
    document
      .querySelectorAll(
        "[data-connect-wallet]"
      )
      .forEach((btn) => {
        btn.addEventListener(
          "click",
          () => connectWallet()
        );
      });
  }

  async function connectWallet() {
    if (!window.ethereum) {
      showToast(
        language === "zh"
          ? "请安装 MetaMask 或其他 Web3 钱包。"
          : "Please install MetaMask or another Web3 wallet."
      );

      return;
    }

    try {
      /*
       * Request wallet connection.
       */
      const accounts =
        await window.ethereum.request({
          method:
            "eth_requestAccounts"
        });

      if (!accounts?.length) {
        return;
      }

      /*
       * Check current chain.
       */
      let chainId =
        await window.ethereum.request({
          method:
            "eth_chainId"
        });

      /*
       * Switch to BNB Smart Chain.
       */
      if (
        chainId.toLowerCase() !==
        CHILI_CONFIG.network.chainId.toLowerCase()
      ) {
        await switchToBNBChain();

        chainId =
          await window.ethereum.request({
            method:
              "eth_chainId"
          });
      }

      if (
        chainId.toLowerCase() !==
        CHILI_CONFIG.network.chainId.toLowerCase()
      ) {
        throw new Error(
          "Wrong network"
        );
      }

      updateWalletUI(
        accounts[0]
      );

      showToast(
        language === "zh"
          ? "钱包已连接。"
          : "Wallet connected."
      );
    } catch (error) {
      console.error(
        "Wallet connection error:",
        error
      );

      if (
        error?.code === 4001
      ) {
        showToast(
          language === "zh"
            ? "已取消钱包连接。"
            : "Wallet connection cancelled."
        );
      } else {
        showToast(
          language === "zh"
            ? "无法连接钱包。"
            : "Unable to connect wallet."
        );
      }
    }
  }

  /*
   * Switch wallet to BNB Smart Chain.
   */
  async function switchToBNBChain() {
    try {
      await window.ethereum.request({
        method:
          "wallet_switchEthereumChain",

        params: [
          {
            chainId:
              CHILI_CONFIG.network.chainId
          }
        ]
      });
    } catch (error) {
      /*
       * Chain does not exist in wallet.
       */
      if (error?.code !== 4902) {
        throw error;
      }

      await window.ethereum.request({
        method:
          "wallet_addEthereumChain",

        params: [
          CHILI_CONFIG.network
        ]
      });
    }
  }

  /*
   * Update connected wallet UI.
   */
  function updateWalletUI(account) {
    const short =
      shortenAddress(account);

    document
      .querySelectorAll(
        "[data-wallet-address]"
      )
      .forEach((el) => {
        el.textContent = short;
      });

    document
      .querySelectorAll(
        "[data-connect-wallet]"
      )
      .forEach((btn) => {
        btn.textContent = short;
        btn.classList.add(
          "connected"
        );
      });

    document.body.classList.add(
      "wallet-connected"
    );

    window.CHILI_WALLET =
      account;
  }

  /*
   * ---------------------------------------------------------
   * EXTERNAL LINKS
   * ---------------------------------------------------------
   */

  function initExternalLinks() {
    const mappings = [
      [
        "[data-contract-link]",
        getExplorerUrl()
      ],

      [
        "[data-bscscan]",
        getExplorerUrl()
      ],

      [
        "[data-swap-link]",
        getSwapUrl()
      ],

      [
        "[data-dexscreener]",
        getDexScreenerUrl()
      ],

      [
        "[data-telegram-link]",
        CHILI_CONFIG.social.telegram
      ],

      [
        "[data-twitter-link]",
        CHILI_CONFIG.social.twitter
      ],

      [
        "[data-github-link]",
        CHILI_CONFIG.social.github
      ]
    ];

    mappings.forEach(
      ([selector, url]) => {
        document
          .querySelectorAll(
            selector
          )
          .forEach((link) => {
            /*
             * Do not activate empty "#"
             * social links.
             */
            if (
              url &&
              url !== "#"
            ) {
              link.href = url;

              link.target =
                "_blank";

              link.rel =
                "noopener noreferrer";
            }
          });
      }
    );
  }

  /*
   * ---------------------------------------------------------
   * SCROLL EFFECT
   * ---------------------------------------------------------
   */

  function initScrollEffects() {
    const header =
      document.querySelector(
        ".nav"
      );

    if (!header) {
      return;
    }

    const update = () => {
      header.classList.toggle(
        "scrolled",
        window.scrollY > 20
      );
    };

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true
      }
    );

    update();
  }

  /*
   * ---------------------------------------------------------
   * SECTION OBSERVER
   * ---------------------------------------------------------
   */

  function initSectionObserver() {
    const sections =
      document.querySelectorAll(
        "section[id]"
      );

    const links =
      document.querySelectorAll(
        ".nav-link[data-section]"
      );

    if (
      !sections.length ||
      !links.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              links.forEach(
                (link) => {
                  link.classList.toggle(
                    "active",
                    link.dataset.section ===
                      entry.target.id
                  );
                }
              );
            }
          );
        },
        {
          rootMargin:
            "-40% 0px -40% 0px"
        }
      );

    sections.forEach(
      (section) =>
        observer.observe(section)
    );
  }

  /*
   * ---------------------------------------------------------
   * BACK TO TOP
   * ---------------------------------------------------------
   */

  function initBackToTop() {
    const button =
      document.querySelector(
        "[data-back-to-top]"
      );

    if (!button) {
      return;
    }

    const update = () => {
      button.classList.toggle(
        "show",
        window.scrollY > 500
      );
    };

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true
      }
    );

    update();

    button.addEventListener(
      "click",
      () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    );
  }

  /*
   * ---------------------------------------------------------
   * YEAR
   * ---------------------------------------------------------
   */

  function initYear() {
    document
      .querySelectorAll(
        "[data-current-year]"
      )
      .forEach((el) => {
        el.textContent =
          new Date().getFullYear();
      });
  }

  /*
   * ---------------------------------------------------------
   * LANGUAGE
   * ---------------------------------------------------------
   */

  function initLanguage() {
    const button =
      document.getElementById(
        "langBtn"
      );

    /*
     * Load saved language.
     */
    language =
      localStorage.getItem(
        "chili-language"
      ) === "zh"
        ? "zh"
        : "en";

    const apply =
      () => {
        /*
         * HTML language.
         */
        document.documentElement.lang =
          language === "zh"
            ? "zh-CN"
            : "en";

        /*
         * Language switch button.
         */
        if (button) {
          button.textContent =
            language === "zh"
              ? "EN"
              : "中文";
        }

        /*
         * data-i18n elements.
         */
        document
          .querySelectorAll(
            "[data-i18n]"
          )
          .forEach((el) => {
            const key =
              el.dataset.i18n;

            const value =
              I18N[language][key];

            if (
              value != null
            ) {
              el.textContent =
                value;
            }
          });

        /*
         * Existing hard-coded
         * text nodes.
         */
        translateStaticText();

        /*
         * Dynamic project info.
         */
        initTokenInfo();
      };

    button?.addEventListener(
      "click",
      () => {
        language =
          language === "en"
            ? "zh"
            : "en";

        localStorage.setItem(
          "chili-language",
          language
        );

        apply();
      }
    );

    apply();
  }

  /*
   * Translate exact static text nodes.
   *
   * We intentionally only translate
   * exact text matches so addresses,
   * prices and dynamic values are untouched.
   */
  function translateStaticText() {
    const dictionary =
      TEXT[language];

    const walker =
      document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );

    const nodes = [];

    while (
      walker.nextNode()
    ) {
      nodes.push(
        walker.currentNode
      );
    }

    nodes.forEach(
      (node) => {
        const raw =
          node.nodeValue;

        const trimmed =
          raw.trim();

        if (
          !trimmed ||
          !dictionary[trimmed]
        ) {
          return;
        }

        node.nodeValue =
          raw.replace(
            trimmed,
            dictionary[trimmed]
          );
      }
    );
  }

  /*
   * ---------------------------------------------------------
   * ETHEREUM EVENTS
   * ---------------------------------------------------------
   */

  function initEthereumListeners() {
    if (
      !window.ethereum?.on
    ) {
      return;
    }

    /*
     * Account changed.
     */
    window.ethereum.on(
      "accountsChanged",
      (accounts) => {
        if (
          accounts?.length
        ) {
          updateWalletUI(
            accounts[0]
          );
        } else {
          document.body.classList.remove(
            "wallet-connected"
          );

          document
            .querySelectorAll(
              "[data-connect-wallet]"
            )
            .forEach((btn) => {
              btn.textContent =
                language === "zh"
                  ? "连接钱包"
                  : "CONNECT WALLET";

              btn.classList.remove(
                "connected"
              );
            });

          window.CHILI_WALLET =
            null;
        }
      }
    );

    /*
     * Chain changed.
     */
    window.ethereum.on(
      "chainChanged",
      () => {
        initTokenInfo();
        loadTokenomics();
        loadMarketData();
      }
    );
  }

  /*
   * ---------------------------------------------------------
   * TOAST
   * ---------------------------------------------------------
   */

  function showToast(message) {
    let toast =
      document.getElementById(
        "chiliToast"
      );

    if (!toast) {
      toast =
        document.createElement(
          "div"
        );

      toast.id =
        "chiliToast";

      toast.className =
        "chili-toast";

      document.body.appendChild(
        toast
      );
    }

    toast.textContent =
      message;

    toast.classList.add(
      "show"
    );

    clearTimeout(
      toast._timer
    );

    toast._timer =
      setTimeout(
        () => {
          toast.classList.remove(
            "show"
          );
        },
        CHILI_CONFIG.ui
          .toastDuration
      );
  }

  /*
   * ---------------------------------------------------------
   * FORMATTING
   * ---------------------------------------------------------
   */

  function formatTime(date) {
    return date.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );
  }

  /*
   * Format USD values:
   *
   * 1,500      -> $1.50K
   * 1,500,000  -> $1.50M
   * 1,500,000,000 -> $1.50B
   */
  function formatUsd(value) {
    const number =
      Number(value);

    if (
      !Number.isFinite(
        number
      )
    ) {
      return "—";
    }

    if (number >= 1e9) {
      return `$${(
        number / 1e9
      ).toFixed(2)}B`;
    }

    if (number >= 1e6) {
      return `$${(
        number / 1e6
      ).toFixed(2)}M`;
    }

    if (number >= 1e3) {
      return `$${(
        number / 1e3
      ).toFixed(2)}K`;
    }

    return `$${number.toFixed(
      2
    )}`;
  }

  /*
   * Generic number formatting.
   */
  function formatNumber(
    value,
    max = 2
  ) {
    const number =
      Number(value);

    if (
      !Number.isFinite(
        number
      )
    ) {
      return "—";
    }

    return number.toLocaleString(
      "en-US",
      {
        maximumFractionDigits:
          max
      }
    );
  }

  /*
   * Safely set text content.
   */
  function setText(
    id,
    value
  ) {
    const el =
      document.getElementById(
        id
      );

    if (el) {
      el.textContent =
        value;
    }
  }

  /*
   * ---------------------------------------------------------
   * CONFIG HELPERS
   * ---------------------------------------------------------
   */

  function getTokenAddress() {
    return CHILI_CONFIG.token
      .address;
  }

  function getExplorerUrl() {
    return CHILI_CONFIG.token
      .contractExplorer;
  }

  function getSwapUrl() {
    return CHILI_CONFIG.dex
      .swapUrl;
  }

  function getDexScreenerUrl() {
    return CHILI_CONFIG.dex
      .dexScreenerUrl;
  }

  /*
   * Shorten blockchain address.
   *
   * Example:
   * 0xed3caca4...5f7c
   */
  function shortenAddress(
    address
  ) {
    if (!address) {
      return "";
    }

    const start =
      CHILI_CONFIG.ui
        .addressStartLength;

    const end =
      CHILI_CONFIG.ui
        .addressEndLength;

    if (
      address.length <=
      start + end
    ) {
      return address;
    }

    return (
      address.slice(
        0,
        start
      ) +
      "..." +
      address.slice(
        -end
      )
    );
  }

  /*
   * Validate ERC20 address.
   */
  function isTokenConfigured() {
    const address =
      getTokenAddress();

    return /^0x[a-fA-F0-9]{40}$/.test(
      address || ""
    );
  }
})();
