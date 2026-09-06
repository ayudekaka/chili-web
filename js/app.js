(function () {
    "use strict";

    // ==================================================
    // CHILI WEBSITE V2
    // ==================================================

    const CONFIG = window.CHILI_CONFIG;

    if (!CONFIG) {
        console.error("CHILI_CONFIG not found.");
        return;
    }


    // ==================================================
    // CONSTANTS
    // ==================================================

    const ABI_TOTAL_SUPPLY = "0x18160ddd";

    const TOKEN_ADDRESS =
        String(CONFIG.token.address || "").toLowerCase();

    const DEX_API =
        `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`;

    const PRICE_HISTORY_KEY =
        "chili-price-history-v2";

    const MAX_CHART_POINTS =
        CONFIG.ui.chartMaxPoints || 48;


    // ==================================================
    // I18N
    // ==================================================

    const I18N = {

        en: {

            "logo-small":
                "ON-CHAIN",

            "nav-market":
                "MARKET",

            "nav-about":
                "ABOUT",

            "nav-tokenomics":
                "TOKENOMICS",

            "nav-story":
                "STORY",

            "nav-security":
                "SECURITY",

            "nav-contract":
                "CONTRACT",

            "hero-kicker":
                "BNB SMART CHAIN // SYSTEM ONLINE",

            "hero-subtitle":
                "A community-driven token built for the next wave of on-chain culture.",

            "hero-enter":
                "ENTER TERMINAL →",

            "hero-contract":
                "VIEW CONTRACT ↗",

            "hero-ca":
                "CA:",

            "hero-copy":
                "COPY",

            "core-label":
                "CHILI CORE",

            "core-network":
                "NETWORK",

            "core-status":
                "STATUS",

            "core-tax":
                "TAX",

            "core-token":
                "TOKEN",

            "terminal-title":
                "LIVE MARKET TERMINAL",

            "market-current":
                "CURRENT MARKET PRICE",

            "market-unit":
                "USD / CHILI",

            "market-pulse":
                "LIVE PRICE PULSE",

            "market-pair":
                "PAIR",

            "market-dex":
                "DEX",

            "market-block":
                "BLOCK",

            "market-liquidity":
                "LIQUIDITY",

            "market-volume":
                "24H VOLUME",

            "market-cap":
                "MARKET CAP",

            "market-fdv":
                "FDV",

            "market-txns":
                "24H TXNS",

            "market-buy-sell":
                "BUY / SELL",

            "market-pair-address":
                "PAIR ADDRESS:",

            "market-last-update":
                "LAST UPDATE:",

            "market-open-chart":
                "OPEN LIVE CHART ↗",

            "token-supply":
                "TOKEN SUPPLY",

            "token-decimals":
                "DECIMALS",

            "token-network":
                "NETWORK",

            "token-chain":
                "CHAIN ID",

            "copy":
                "COPY",

            "copied":
                "COPIED",

            "online":
                "ONLINE",

            "live":
                "LIVE",

            "realtime":
                "REALTIME",

            "security":
                "SECURITY",

            "transparency":
                "TRANSPARENCY",

            "about":
                "ABOUT CHILI",

            "tokenomics":
                "TOKENOMICS",

            "story":
                "STORY",

            "swap":
                "SWAP",

            "buy-chili":
                "BUY CHILI",

            "view-contract":
                "VIEW CONTRACT",

            "chart-session":
                "LIVE PRICE PULSE · SESSION SAMPLES"
        },


        zh: {

            "logo-small":
                "链上核心",

            "nav-market":
                "行情",

            "nav-about":
                "关于",

            "nav-tokenomics":
                "代币经济",

            "nav-story":
                "故事",

            "nav-security":
                "安全",

            "nav-contract":
                "合约",

            "hero-kicker":
                "BNB 智能链 // 系统在线",

            "hero-subtitle":
                "一个由社区驱动，为下一阶段链上文化而生的代币。",

            "hero-enter":
                "进入终端 →",

            "hero-contract":
                "查看合约 ↗",

            "hero-ca":
                "合约：",

            "hero-copy":
                "复制",

            "core-label":
                "CHILI 核心",

            "core-network":
                "网络",

            "core-status":
                "状态",

            "core-tax":
                "税率",

            "core-token":
                "代币",

            "terminal-title":
                "实时市场终端",

            "market-current":
                "当前市场价格",

            "market-unit":
                "美元 / CHILI",

            "market-pulse":
                "实时价格脉冲",

            "market-pair":
                "交易对",

            "market-dex":
                "去中心化交易所",

            "market-block":
                "区块",

            "market-liquidity":
                "流动性",

            "market-volume":
                "24小时成交量",

            "market-cap":
                "市值",

            "market-fdv":
                "完全稀释估值",

            "market-txns":
                "24小时交易",

            "market-buy-sell":
                "买入 / 卖出",

            "market-pair-address":
                "交易对地址：",

            "market-last-update":
                "最后更新：",

            "market-open-chart":
                "打开实时图表 ↗",

            "token-supply":
                "代币总量",

            "token-decimals":
                "精度",

            "token-network":
                "网络",

            "token-chain":
                "链 ID",

            "copy":
                "复制",

            "copied":
                "已复制",

            "online":
                "在线",

            "live":
                "实时",

            "realtime":
                "实时",

            "security":
                "安全",

            "transparency":
                "透明度",

            "about":
                "关于 CHILI",

            "tokenomics":
                "代币经济",

            "story":
                "故事",

            "swap":
                "兑换",

            "buy-chili":
                "购买 CHILI",

            "view-contract":
                "查看合约",

            "chart-session":
                "实时价格脉冲 · 本次访问采样"
        }
    };


    // ==================================================
    // LANGUAGE
    // ==================================================

    let language =
        localStorage.getItem("chili-language") || "en";


    if (
        language !== "en" &&
        language !== "zh"
    ) {
        language = "en";
    }


    // ==================================================
    // INIT
    // ==================================================

    document.addEventListener(
        "DOMContentLoaded",
        init
    );


    function init() {

        initProjectInfo();

        initLogo();

        initContract();

        initTokenInfo();

        initNavigation();

        initMobileMenu();

        initCopyButtons();

        initExternalLinks();

        initScrollEffects();

        initSectionObserver();

        initYear();

        initLanguage();

        initBackToTop();

        initEthereumListeners();

        loadTokenomics();

        loadMarketData();

    }


    // ==================================================
    // PROJECT
    // ==================================================

    function initProjectInfo() {

        if (CONFIG.site.title) {
            document.title =
                CONFIG.site.title;
        }

        const meta =
            document.querySelector(
                'meta[name="description"]'
            );

        if (
            meta &&
            CONFIG.site.description
        ) {
            meta.content =
                CONFIG.site.description;
        }

        const theme =
            document.querySelector(
                'meta[name="theme-color"]'
            );

        if (
            theme &&
            CONFIG.site.themeColor
        ) {
            theme.content =
                CONFIG.site.themeColor;
        }
    }


    // ==================================================
    // LOGO
    // ==================================================

    function initLogo() {

        document
            .querySelectorAll(
                "[data-chili-logo]"
            )
            .forEach((el) => {

                if (
                    el.tagName === "IMG"
                ) {

                    el.src =
                        CONFIG.assets.logo;

                    el.alt =
                        `${CONFIG.project.name} Logo`;
                }
            });
    }


    // ==================================================
    // CONTRACT
    // ==================================================

    function initContract() {

        const address =
            getTokenAddress();

        const hero =
            document.getElementById(
                "heroContract"
            );

        const full =
            document.getElementById(
                "contractAddress"
            );

        if (!isTokenConfigured()) {

            if (hero) {
                hero.textContent = "—";
            }

            if (full) {
                full.textContent = "—";
            }

            return;
        }


        if (hero) {
            hero.textContent =
                shortenAddress(address);
        }


        if (full) {
            full.textContent =
                address;
        }
    }


    // ==================================================
    // TOKEN INFO
    // ==================================================

    function initTokenInfo() {

        const symbols = [
            "tokenSymbol",
            "reactorSymbol",
            "coreToken"
        ];


        symbols.forEach((id) => {

            const el =
                document.getElementById(id);

            if (el) {
                el.textContent =
                    CONFIG.token.symbol;
            }
        });


        const decimals =
            document.getElementById(
                "tokenDecimals"
            );

        if (decimals) {

            decimals.textContent =
                CONFIG.token.decimals;
        }


        const network =
            document.getElementById(
                "networkValue"
            );

        if (network) {

            network.textContent =
                CONFIG.network.chainName;
        }


        const chain =
            document.getElementById(
                "chainId"
            );

        if (chain) {

            chain.textContent =
                CONFIG.network.chainId;
        }


        const pair =
            document.getElementById(
                "pair"
            );

        if (pair) {

            pair.textContent =
                CONFIG.dex.pair;
        }


        const dex =
            document.getElementById(
                "dex"
            );

        if (dex) {

            dex.textContent =
                CONFIG.dex.name;
        }


        set(
            "marketStatusText",
            t("live")
        );


        set(
            "lastUpdate",
            formatTime(new Date())
        );
    }


    // ==================================================
    // TOKENOMICS
    // ==================================================

    async function loadTokenomics() {

        if (!isTokenConfigured()) {
            return;
        }

        const supplyEl =
            document.getElementById(
                "tokenSupply"
            );

        if (!supplyEl) {
            return;
        }


        const result =
            await rpcCallMulti(
                "eth_call",
                [
                    {
                        to:
                            CONFIG.token.address,

                        data:
                            ABI_TOTAL_SUPPLY
                    },

                    "latest"
                ]
            );


        if (
            !result ||
            result === "0x"
        ) {
            return;
        }


        try {

            const raw =
                BigInt(result);

            const decimals =
                BigInt(
                    CONFIG.token.decimals
                );

            const base =
                10n ** decimals;

            const whole =
                raw / base;

            const fraction =
                raw % base;


            if (fraction === 0n) {

                supplyEl.textContent =
                    whole.toLocaleString(
                        "en-US"
                    );

                return;
            }


            const fractionText =
                fraction
                    .toString()
                    .padStart(
                        Number(decimals),
                        "0"
                    )
                    .replace(
                        /0+$/,
                        ""
                    );


            supplyEl.textContent =
                `${whole.toLocaleString(
                    "en-US"
                )}.${fractionText}`;

        } catch (error) {

            console.warn(
                "CHILI supply parse error:",
                error
            );
        }
    }


    // ==================================================
    // MARKET DATA
    // ==================================================

    async function loadMarketData() {

        if (!isTokenConfigured()) {
            return;
        }


        await refreshMarket();


        const interval =
            CONFIG.ui.marketRefreshInterval ||
            60000;


        window.setInterval(
            refreshMarket,
            interval
        );
    }


    async function refreshMarket() {

        try {

            const [
                pairs,
                block
            ] = await Promise.all([
                fetchDexScreener(),
                fetchBlockNumber()
            ]);


            const pair =
                selectPair(pairs);


            if (!pair) {

                console.warn(
                    "CHILI pair not found."
                );

                return;
            }


            updateMarket(pair, block);

        } catch (error) {

            console.warn(
                "CHILI market data unavailable:",
                error
            );
        }
    }


    // ==================================================
    // DEXSCREENER
    // ==================================================

    async function fetchDexScreener() {

        const response =
            await fetch(
                DEX_API,
                {
                    cache: "no-store",

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


    // ==================================================
    // PAIR SELECTOR
    // ==================================================

    function selectPair(pairs) {

        const bscPairs =
            pairs.filter((pair) => {

                return (
                    String(
                        pair.chainId || ""
                    ).toLowerCase()
                    === "bsc"
                );
            });


        const usdtAddress =
            String(
                CONFIG.dex.quoteTokens?.USDT ||
                ""
            ).toLowerCase();


        const wbnbAddress =
            String(
                CONFIG.dex.quoteTokens?.WBNB ||
                ""
            ).toLowerCase();


        function isQuote(
            pair,
            symbol,
            address
        ) {

            const pairSymbol =
                String(
                    pair.quoteToken?.symbol ||
                    ""
                ).toUpperCase();


            const pairAddress =
                String(
                    pair.quoteToken?.address ||
                    ""
                ).toLowerCase();


            return (
                pairSymbol === symbol ||
                (
                    address &&
                    pairAddress === address
                )
            );
        }


        // ----------------------------------------------
        // 1. USDT FIRST
        // ----------------------------------------------

        const usdtPairs =
            bscPairs
                .filter((pair) =>
                    isQuote(
                        pair,
                        "USDT",
                        usdtAddress
                    )
                )
                .sort(
                    (a, b) =>
                        Number(
                            b.liquidity?.usd || 0
                        ) -
                        Number(
                            a.liquidity?.usd || 0
                        )
                );


        if (usdtPairs.length) {

            return usdtPairs[0];
        }


        // ----------------------------------------------
        // 2. WBNB SECOND
        // ----------------------------------------------

        const wbnbPairs =
            bscPairs
                .filter((pair) =>
                    isQuote(
                        pair,
                        "WBNB",
                        wbnbAddress
                    )
                )
                .sort(
                    (a, b) =>
                        Number(
                            b.liquidity?.usd || 0
                        ) -
                        Number(
                            a.liquidity?.usd || 0
                        )
                );


        if (wbnbPairs.length) {

            return wbnbPairs[0];
        }


        // ----------------------------------------------
        // 3. FALLBACK
        // ----------------------------------------------

        return (
            bscPairs.sort(
                (a, b) =>
                    Number(
                        b.liquidity?.usd || 0
                    ) -
                    Number(
                        a.liquidity?.usd || 0
                    )
            )[0] || null
        );
    }


    // ==================================================
    // MARKET UPDATE
    // ==================================================

    function updateMarket(
        pair,
        block
    ) {

        // ----------------------------------------------
        // PRICE
        // ----------------------------------------------

        const price =
            Number(
                pair.priceUsd
            );


        if (
            Number.isFinite(price) &&
            price > 0
        ) {

            set(
                "price",
                formatPrice(price)
            );


            const history =
                savePrice(price);


            drawChart(history);
        }


        // ----------------------------------------------
        // PAIR
        // ----------------------------------------------

        const baseSymbol =
            pair.baseToken?.symbol ||
            CONFIG.token.symbol;


        const quoteSymbol =
            pair.quoteToken?.symbol ||
            "USDT";


        set(
            "pair",
            `${baseSymbol} / ${quoteSymbol}`
        );


        // ----------------------------------------------
        // DEX
        // ----------------------------------------------

        set(
            "dex",
            pair.dexId
                ? String(pair.dexId)
                : CONFIG.dex.name
        );


        // ----------------------------------------------
        // BLOCK
        // ----------------------------------------------

        if (block) {

            const number =
                parseInt(
                    block,
                    16
                );


            if (
                Number.isFinite(number)
            ) {

                set(
                    "block",
                    number.toLocaleString(
                        "en-US"
                    )
                );
            }
        }


        // ----------------------------------------------
        // LIQUIDITY
        // ----------------------------------------------

        set(
            "liquidity",
            pair.liquidity?.usd != null
                ? formatUsd(
                    pair.liquidity.usd
                )
                : "—"
        );


        // ----------------------------------------------
        // VOLUME
        // ----------------------------------------------

        set(
            "volume",
            pair.volume?.h24 != null
                ? formatUsd(
                    pair.volume.h24
                )
                : "—"
        );


        // ----------------------------------------------
        // MARKET CAP / FDV
        // ----------------------------------------------

        const marketCap =
            Number(
                pair.marketCap
            );


        const fdv =
            Number(
                pair.fdv
            );


        const marketCard =
            document.getElementById(
                "marketCap"
            );


        const marketLabel =
            marketCard
                ?.closest(
                    ".market-card"
                )
                ?.querySelector(
                    ".market-card-label"
                );


        if (
            Number.isFinite(
                marketCap
            ) &&
            marketCap > 0
        ) {

            set(
                "marketCap",
                formatUsd(
                    marketCap
                )
            );


            if (marketLabel) {

                marketLabel.textContent =
                    t("market-cap");
            }

        } else if (
            Number.isFinite(fdv) &&
            fdv > 0
        ) {

            set(
                "marketCap",
                formatUsd(fdv)
            );


            if (marketLabel) {

                marketLabel.textContent =
                    t("market-fdv");
            }

        } else {

            set(
                "marketCap",
                "—"
            );
        }


        // ----------------------------------------------
        // TXNS
        // ----------------------------------------------

        const buys =
            Number(
                pair.txns?.h24?.buys ||
                0
            );


        const sells =
            Number(
                pair.txns?.h24?.sells ||
                0
            );


        set(
            "txns",
            Number.isFinite(
                buys + sells
            )
                ? (
                    buys + sells
                ).toLocaleString(
                    "en-US"
                )
                : "—"
        );


        set(
            "buys",
            Number.isFinite(buys)
                ? buys.toLocaleString(
                    "en-US"
                )
                : "—"
        );


        set(
            "sells",
            Number.isFinite(sells)
                ? sells.toLocaleString(
                    "en-US"
                )
                : "—"
        );


        // ----------------------------------------------
        // PAIR ADDRESS
        // ----------------------------------------------

        set(
            "pairAddress",
            pair.pairAddress || "—"
        );


        // ----------------------------------------------
        // UPDATE TIME
        // ----------------------------------------------

        set(
            "lastUpdate",
            formatTime(new Date())
        );


        // ----------------------------------------------
        // DEXSCREENER LINK
        // ----------------------------------------------

        document
            .querySelectorAll(
                "[data-dexscreener]"
            )
            .forEach((el) => {

                if (
                    pair.pairAddress
                ) {

                    el.href =
                        `https://dexscreener.com/bsc/${pair.pairAddress}`;
                }
            });


        // ----------------------------------------------
        // STATUS
        // ----------------------------------------------

        set(
            "marketStatusText",
            t("live")
        );
    }


    // ==================================================
    // PRICE HISTORY
    // ==================================================

    function loadPriceHistory() {

        try {

            const history =
                JSON.parse(
                    localStorage.getItem(
                        PRICE_HISTORY_KEY
                    ) || "[]"
                );


            if (
                Array.isArray(history)
            ) {

                return history
                    .filter(
                        item =>
                            Number.isFinite(
                                Number(item.p)
                            )
                    )
                    .slice(
                        -MAX_CHART_POINTS
                    );
            }

        } catch (_) {}

        return [];
    }


    function savePrice(price) {

        let history =
            loadPriceHistory();


        history.push({
            t: Date.now(),
            p: Number(price)
        });


        history =
            history.slice(
                -MAX_CHART_POINTS
            );


        try {

            localStorage.setItem(
                PRICE_HISTORY_KEY,
                JSON.stringify(
                    history
                )
            );

        } catch (_) {}


        return history;
    }


    // ==================================================
    // REAL SESSION CHART
    // ==================================================

    function drawChart(history) {

        const svg =
            document.querySelector(
                ".chart-wrap svg"
            );


        if (
            !svg ||
            history.length < 2
        ) {
            return;
        }


        const width = 900;

        const height = 220;

        const padding = 12;


        const prices =
            history.map(
                item =>
                    Number(item.p)
            );


        const min =
            Math.min(...prices);


        const max =
            Math.max(...prices);


        const range =
            max - min ||
            Math.max(
                max * 0.01,
                0.000000001
            );


        const points =
            history.map(
                (item, index) => {

                    const x =
                        padding +
                        (
                            index /
                            (
                                history.length -
                                1
                            )
                        ) *
                        (
                            width -
                            padding * 2
                        );


                    const y =
                        height -
                        padding -
                        (
                            (
                                item.p -
                                min
                            ) /
                            range
                        ) *
                        (
                            height -
                            padding * 2
                        );


                    return [
                        x,
                        y
                    ];
                }
            );


        const line =
            points
                .map(
                    ([x, y], index) =>
                        `${
                            index
                                ? "L"
                                : "M"
                        }${x.toFixed(1)},${y.toFixed(1)}`
                )
                .join(" ");


        const area =
            `${line} ` +
            `L${points.at(-1)[0].toFixed(1)},${height} ` +
            `L${points[0][0].toFixed(1)},${height} Z`;


        svg.innerHTML = `

            <defs>

                <linearGradient
                    id="chiliChartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#ef2637"
                        stop-opacity=".18"
                    />

                    <stop
                        offset="100%"
                        stop-color="#ef2637"
                        stop-opacity="0"
                    />

                </linearGradient>

            </defs>


            <path
                d="${area}"
                fill="url(#chiliChartFill)"
            ></path>


            <path
                d="${line}"
                fill="none"
                stroke="#ef2637"
                stroke-width="2"
            ></path>
        `;


        const wrap =
            document.querySelector(
                ".chart-wrap"
            );


        if (!wrap) {
            return;
        }


        let note =
            wrap.querySelector(
                ".chili-chart-note"
            );


        if (!note) {

            note =
                document.createElement(
                    "div"
                );

            note.className =
                "chili-chart-note";

            wrap.appendChild(note);
        }


        note.textContent =
            t("chart-session");
    }


    // ==================================================
    // RPC
    // ==================================================

    async function rpcCall(
        rpc,
        method,
        params
    ) {

        const response =
            await fetch(
                rpc,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
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


    async function rpcCallMulti(
        method,
        params
    ) {

        const rpcs =
            CONFIG.network.rpcUrls || [];


        for (
            const rpc of rpcs
        ) {

            try {

                return await rpcCall(
                    rpc,
                    method,
                    params
                );

            } catch (error) {

                console.warn(
                    "RPC failed:",
                    rpc,
                    error
                );
            }
        }


        return null;
    }


    async function fetchBlockNumber() {

        return rpcCallMulti(
            "eth_blockNumber",
            []
        );
    }


    // ==================================================
    // NAVIGATION
    // ==================================================

    function initNavigation() {

        document
            .querySelectorAll(
                ".nav-link"
            )
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();
                    }
                );
            });
    }


    // ==================================================
    // MOBILE MENU
    // ==================================================

    function initMobileMenu() {

        const toggle =
            document.getElementById(
                "mobileToggle"
            );


        const nav =
            document.getElementById(
                "navLinks"
            );


        if (!toggle || !nav) {
            return;
        }


        toggle.addEventListener(
            "click",
            () => {

                const open =
                    nav.classList.toggle(
                        "open"
                    );


                toggle.setAttribute(
                    "aria-expanded",
                    open
                        ? "true"
                        : "false"
                );
            }
        );
    }


    function closeMobileMenu() {

        const nav =
            document.getElementById(
                "navLinks"
            );


        const toggle =
            document.getElementById(
                "mobileToggle"
            );


        if (nav) {

            nav.classList.remove(
                "open"
            );
        }


        if (toggle) {

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    // ==================================================
    // COPY
    // ==================================================

    function initCopyButtons() {

        const buttons =
            document.querySelectorAll(
                "[id^='copy'], [data-copy]"
            );


        buttons.forEach((button) => {

            button.addEventListener(
                "click",
                async () => {

                    let value =
                        button.dataset.copy;


                    if (!value) {

                        value =
                            getTokenAddress();
                    }


                    if (!value) {
                        return;
                    }


                    try {

                        await navigator.clipboard.writeText(
                            value
                        );

                        const original =
                            button.textContent;


                        button.textContent =
                            t("copied");


                        showToast(
                            t("copied")
                        );


                        window.setTimeout(
                            () => {

                                button.textContent =
                                    original ||
                                    t("copy");

                            },

                            CONFIG.ui.copySuccessDuration ||
                            1800
                        );

                    } catch (error) {

                        console.warn(
                            "Clipboard unavailable:",
                            error
                        );
                    }
                }
            );
        });
    }


    // ==================================================
    // EXTERNAL LINKS
    // ==================================================

    function initExternalLinks() {

        document
            .querySelectorAll(
                "[data-bscscan]"
            )
            .forEach((el) => {

                el.href =
                    getExplorerUrl();
            });


        document
            .querySelectorAll(
                "[data-contract]"
            )
            .forEach((el) => {

                el.href =
                    getExplorerUrl();
            });


        document
            .querySelectorAll(
                "[data-swap]"
            )
            .forEach((el) => {

                el.href =
                    getSwapUrl();
            });


        document
            .querySelectorAll(
                "[data-dexscreener]"
            )
            .forEach((el) => {

                el.href =
                    getDexScreenerUrl();
            });


        document
            .querySelectorAll(
                "[data-telegram]"
            )
            .forEach((el) => {

                el.href =
                    CONFIG.social.telegram;
            });


        document
            .querySelectorAll(
                "[data-twitter]"
            )
            .forEach((el) => {

                el.href =
                    CONFIG.social.twitter;
            });


        document
            .querySelectorAll(
                "[data-github]"
            )
            .forEach((el) => {

                el.href =
                    CONFIG.social.github;
            });
    }


    // ==================================================
    // SCROLL EFFECTS
    // ==================================================

    function initScrollEffects() {

        const header =
            document.getElementById(
                "siteHeader"
            );


        if (!header) {
            return;
        }


        const update =
            () => {

                if (
                    window.scrollY > 20
                ) {

                    header.classList.add(
                        "scrolled"
                    );

                } else {

                    header.classList.remove(
                        "scrolled"
                    );
                }
            };


        update();


        window.addEventListener(
            "scroll",
            update,
            {
                passive: true
            }
        );
    }


    // ==================================================
    // SECTION OBSERVER
    // ==================================================

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
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const id =
                                entry.target.id;


                            links.forEach(
                                link => {

                                    link.classList.toggle(
                                        "active",
                                        link.dataset.section ===
                                        id
                                    );
                                }
                            );
                        }
                    );
                },

                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );


        sections.forEach(
            section =>
                observer.observe(
                    section
                )
        );
    }


    // ==================================================
    // BACK TO TOP
    // ==================================================

    function initBackToTop() {

        const button =
            document.querySelector(
                "[data-back-to-top]"
            );


        if (!button) {
            return;
        }


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


    // ==================================================
    // YEAR
    // ==================================================

    function initYear() {

        document
            .querySelectorAll(
                "[data-year]"
            )
            .forEach(
                el =>
                    el.textContent =
                        new Date().getFullYear()
            );
    }


    // ==================================================
    // LANGUAGE
    // ==================================================

    function initLanguage() {

        const button =
            document.getElementById(
                "langBtn"
            );


        applyLanguage();


        if (!button) {
            return;
        }


        button.addEventListener(
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


                applyLanguage();
            }
        );
    }


    function applyLanguage() {

        document.documentElement.lang =
            language;


        document
            .querySelectorAll(
                "[data-i18n]"
            )
            .forEach((el) => {

                const key =
                    el.dataset.i18n;


                if (
                    I18N[language]?.[key]
                ) {

                    el.textContent =
                        I18N[language][key];
                }
            });


        const langButton =
            document.getElementById(
                "langBtn"
            );


        if (langButton) {

            langButton.textContent =
                language === "en"
                    ? "中文"
                    : "EN";
        }


        updateDynamicTranslations();
    }


    function updateDynamicTranslations() {

        const marketLabel =
            document
                .getElementById(
                    "marketCap"
                )
                ?.closest(
                    ".market-card"
                )
                ?.querySelector(
                    ".market-card-label"
                );


        if (marketLabel) {

            const value =
                document.getElementById(
                    "marketCap"
                )?.dataset?.metric;


            if (value === "fdv") {

                marketLabel.textContent =
                    t("market-fdv");

            } else {

                marketLabel.textContent =
                    t("market-cap");
            }
        }


        const chartNote =
            document.querySelector(
                ".chili-chart-note"
            );


        if (chartNote) {

            chartNote.textContent =
                t("chart-session");
        }


        const status =
            document.getElementById(
                "marketStatusText"
            );


        if (status) {

            status.textContent =
                t("live");
        }
    }


    // ==================================================
    // ETHEREUM / WALLET
    // ==================================================

    function initEthereumListeners() {

        if (!window.ethereum) {
            return;
        }


        window.ethereum.on?.(
            "chainChanged",
            () => {

                window.setTimeout(
                    () => {
                        refreshMarket();
                    },
                    500
                );
            }
        );


        window.ethereum.on?.(
            "accountsChanged",
            () => {}
        );
    }


    // ==================================================
    // WALLET PLACEHOLDER
    // ==================================================

    function initWalletButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-connect-wallet]"
            );


        if (!buttons.length) {
            return;
        }


        buttons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    connectWallet
                );
            }
        );
    }


    async function connectWallet() {

        if (!window.ethereum) {

            showToast(
                "MetaMask / Wallet not found"
            );

            return;
        }


        try {

            await window.ethereum.request({
                method:
                    "eth_requestAccounts"
            });


            await switchToBsc();


        } catch (error) {

            console.warn(
                "Wallet connection failed:",
                error
            );
        }
    }


    async function switchToBsc() {

        const chainId =
            CONFIG.network.chainIdHex;


        try {

            await window.ethereum.request({
                method:
                    "wallet_switchEthereumChain",

                params: [
                    {
                        chainId
                    }
                ]
            });

        } catch (error) {

            if (
                error.code === 4902
            ) {

                await window.ethereum.request({
                    method:
                        "wallet_addEthereumChain",

                    params: [
                        {
                            chainId,

                            chainName:
                                CONFIG.network.chainName,

                            nativeCurrency:
                                CONFIG.network.nativeCurrency,

                            rpcUrls:
                                CONFIG.network.rpcUrls,

                            blockExplorerUrls:
                                CONFIG.network.blockExplorerUrls
                        }
                    ]
                });
            }
        }
    }


    // ==================================================
    // TOAST
    // ==================================================

    function showToast(message) {

        let toast =
            document.querySelector(
                ".chili-toast"
            );


        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );

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


        window.clearTimeout(
            toast._timer
        );


        toast._timer =
            window.setTimeout(
                () => {

                    toast.classList.remove(
                        "show"
                    );

                },

                CONFIG.ui.toastDuration ||
                2500
            );
    }


    // ==================================================
    // HELPERS
    // ==================================================

    function t(key) {

        return (
            I18N[language]?.[key] ||
            I18N.en[key] ||
            key
        );
    }


    function set(
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


    function formatTime(date) {

        return date.toLocaleTimeString(
            language === "zh"
                ? "zh-CN"
                : "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );
    }


    function formatPrice(value) {

        const number =
            Number(value);


        if (
            !Number.isFinite(
                number
            )
        ) {
            return "—";
        }


        if (
            number >= 1
        ) {

            return `$${number.toFixed(4)}`;
        }


        if (
            number >= 0.01
        ) {

            return `$${number.toFixed(6)}`;
        }


        return `$${number.toPrecision(5)}`;
    }


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


        if (
            number >= 1_000_000_000
        ) {

            return `$${(
                number / 1_000_000_000
            ).toFixed(2)}B`;
        }


        if (
            number >= 1_000_000
        ) {

            return `$${(
                number / 1_000_000
            ).toFixed(2)}M`;
        }


        if (
            number >= 1_000
        ) {

            return `$${(
                number / 1_000
            ).toFixed(2)}K`;
        }


        if (
            number >= 1
        ) {

            return `$${number.toFixed(2)}`;
        }


        if (
            number >= 0.01
        ) {

            return `$${number.toFixed(4)}`;
        }


        return `$${number.toPrecision(4)}`;
    }

})();