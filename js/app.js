// ======================================================
// CHILI WEB
// Application
// Wallet integration intentionally disabled.
// ======================================================

(function () {

    "use strict";


    // ==================================================
    // CONFIG
    // ==================================================

    const CONFIG =
        window.CHILI_CONFIG;


    if (!CONFIG) {

        console.error(
            "CHILI_CONFIG not found."
        );

        return;
    }


    // ==================================================
    // CONSTANTS
    // ==================================================

    const TOKEN_ADDRESS =
        String(
            CONFIG.token.address || ""
        ).toLowerCase();


    const TOKEN_SYMBOL =
        CONFIG.token.symbol || "CHILI";


    const DEX_API =
        `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`;


    const ABI_TOTAL_SUPPLY =
        "0x18160ddd";


    const PRICE_HISTORY_KEY =
        "chili-price-history-v3";


    const MAX_CHART_POINTS =
        Number(
            CONFIG.ui.chartMaxPoints || 48
        );


    const REQUEST_TIMEOUT =
        Number(
            CONFIG.ui.requestTimeout || 10000
        );


    let marketTimer = null;

    let marketRequestRunning = false;

    let language =
        getStoredLanguage();


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
                "LIVE PRICE PULSE · SESSION SAMPLES",

            "market-unavailable":
                "MARKET DATA UNAVAILABLE",

            "copy-failed":
                "COPY FAILED",

            "rpc-error":
                "NETWORK DATA UNAVAILABLE"
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
                "实时价格脉冲 · 本次访问采样",

            "market-unavailable":
                "市场数据暂不可用",

            "copy-failed":
                "复制失败",

            "rpc-error":
                "网络数据暂不可用"
        }
    };


    // ==================================================
    // START
    // ==================================================

    document.addEventListener(
        "DOMContentLoaded",
        init
    );


    async function init() {

        initProject();

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

        await loadTokenomics();

        await refreshMarket();

        startMarketRefresh();
    }


    // ==================================================
    // PROJECT
    // ==================================================

    function initProject() {

        if (
            CONFIG.site &&
            CONFIG.site.title
        ) {

            document.title =
                CONFIG.site.title;
        }


        const description =
            document.querySelector(
                'meta[name="description"]'
            );


        if (
            description &&
            CONFIG.site.description
        ) {

            description.content =
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
            .forEach(
                function (element) {

                    if (
                        element.tagName
                        === "IMG"
                    ) {

                        element.src =
                            CONFIG.assets.logo;

                        element.alt =
                            `${CONFIG.project.name} Logo`;
                    }
                }
            );
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

            setText(
                hero,
                "—"
            );

            setText(
                full,
                "—"
            );

            return;
        }


        setText(
            hero,
            shortenAddress(address)
        );


        setText(
            full,
            address
        );
    }


    // ==================================================
    // TOKEN INFO
    // ==================================================

    function initTokenInfo() {

        const tokenElements = [

            "tokenSymbol",

            "reactorSymbol",

            "coreToken"
        ];


        tokenElements.forEach(
            function (id) {

                setText(
                    document.getElementById(id),
                    TOKEN_SYMBOL
                );
            }
        );


        setText(
            document.getElementById(
                "tokenDecimals"
            ),
            CONFIG.token.decimals
        );


        setText(
            document.getElementById(
                "networkValue"
            ),
            CONFIG.network.chainName
        );


        setText(
            document.getElementById(
                "chainId"
            ),
            CONFIG.network.chainId
        );


        setText(
            document.getElementById(
                "pair"
            ),
            CONFIG.dex.pair
        );


        setText(
            document.getElementById(
                "dex"
            ),
            CONFIG.dex.name
        );


        setText(
            document.getElementById(
                "marketStatusText"
            ),
            t("live")
        );
    }


    // ==================================================
    // TOKEN SUPPLY
    // ==================================================

    async function loadTokenomics() {

        if (
            !isTokenConfigured()
        ) {
            return;
        }


        const element =
            document.getElementById(
                "tokenSupply"
            );


        if (!element) {
            return;
        }


        try {

            const result =
                await rpcCall(
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


            const raw =
                BigInt(result);


            element.textContent =
                formatTokenAmount(
                    raw,
                    CONFIG.token.decimals
                );

        } catch (error) {

            console.warn(
                "Unable to load token supply:",
                error
            );
        }
    }


    // ==================================================
    // MARKET
    // ==================================================

    async function refreshMarket() {

        if (
            marketRequestRunning
        ) {
            return;
        }


        marketRequestRunning = true;


        try {

            const result =
                await fetchDexScreener();


            const pair =
                selectPair(
                    result
                );


            if (!pair) {

                setMarketUnavailable();

                return;
            }


            const block =
                await getBlockNumberSafe();


            updateMarket(
                pair,
                block
            );


        } catch (error) {

            console.warn(
                "Market refresh failed:",
                error
            );

            setMarketUnavailable();

        } finally {

            marketRequestRunning =
                false;
        }
    }


    function startMarketRefresh() {

        if (
            marketTimer
        ) {

            clearInterval(
                marketTimer
            );
        }


        const interval =
            Math.max(
                30000,
                Number(
                    CONFIG.ui.marketRefreshInterval
                    || 60000
                )
            );


        marketTimer =
            window.setInterval(
                refreshMarket,
                interval
            );
    }


    // ==================================================
    // DEXSCREENER
    // ==================================================

    async function fetchDexScreener() {

        const response =
            await fetchWithTimeout(
                DEX_API,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {
                        Accept:
                            "application/json"
                    }
                },
                REQUEST_TIMEOUT
            );


        if (!response.ok) {

            throw new Error(
                `DexScreener HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(
                data.pairs
            )
        ) {

            return [];
        }


        return data.pairs;
    }


    // ==================================================
    // PAIR SELECTION
    // ==================================================

    function selectPair(pairs) {

        if (
            !Array.isArray(pairs)
        ) {

            return null;
        }


        const bscPairs =
            pairs.filter(
                function (pair) {

                    return (
                        String(
                            pair.chainId || ""
                        ).toLowerCase()
                        === "bsc"
                    );
                }
            );


        if (
            !bscPairs.length
        ) {

            return null;
        }


        /*
         * If an official pair address has
         * been configured, use it first.
         */

        const configuredPair =
            normalizeAddress(
                CONFIG.dex.pairAddress
            );


        if (
            configuredPair
        ) {

            const exact =
                bscPairs.find(
                    function (pair) {

                        return (
                            normalizeAddress(
                                pair.pairAddress
                            )
                            === configuredPair
                        );
                    }
                );


            if (exact) {

                return exact;
            }
        }


        /*
         * Only accept pairs where CHILI
         * is actually one side of the pair.
         */

        const tokenPairs =
            bscPairs.filter(
                function (pair) {

                    const base =
                        normalizeAddress(
                            pair.baseToken &&
                            pair.baseToken.address
                        );


                    const quote =
                        normalizeAddress(
                            pair.quoteToken &&
                            pair.quoteToken.address
                        );


                    return (
                        base === TOKEN_ADDRESS ||
                        quote === TOKEN_ADDRESS
                    );
                }
            );


        if (
            !tokenPairs.length
        ) {

            return null;
        }


        const usdt =
            normalizeAddress(
                CONFIG.dex.quoteTokens.USDT
            );


        const wbnb =
            normalizeAddress(
                CONFIG.dex.quoteTokens.WBNB
            );


        /*
         * USDT pairs have priority.
         */

        const usdtPairs =
            tokenPairs.filter(
                function (pair) {

                    const base =
                        normalizeAddress(
                            pair.baseToken &&
                            pair.baseToken.address
                        );

                    const quote =
                        normalizeAddress(
                            pair.quoteToken &&
                            pair.quoteToken.address
                        );


                    return (
                        base === usdt ||
                        quote === usdt
                    );
                }
            );


        if (
            usdtPairs.length
        ) {

            return getHighestLiquidityPair(
                usdtPairs
            );
        }


        /*
         * WBNB fallback.
         */

        const wbnbPairs =
            tokenPairs.filter(
                function (pair) {

                    const base =
                        normalizeAddress(
                            pair.baseToken &&
                            pair.baseToken.address
                        );

                    const quote =
                        normalizeAddress(
                            pair.quoteToken &&
                            pair.quoteToken.address
                        );


                    return (
                        base === wbnb ||
                        quote === wbnb
                    );
                }
            );


        if (
            wbnbPairs.length
        ) {

            return getHighestLiquidityPair(
                wbnbPairs
            );
        }


        /*
         * Last fallback:
         * only a verified CHILI pair.
         */

        return getHighestLiquidityPair(
            tokenPairs
        );
    }


    function getHighestLiquidityPair(
        pairs
    ) {

        return pairs
            .slice()
            .sort(
                function (a, b) {

                    const aLiquidity =
                        Number(
                            a.liquidity &&
                            a.liquidity.usd
                            || 0
                        );


                    const bLiquidity =
                        Number(
                            b.liquidity &&
                            b.liquidity.usd
                            || 0
                        );


                    return (
                        bLiquidity -
                        aLiquidity
                    );
                }
            )[0] || null;
    }


    // ==================================================
    // MARKET UI
    // ==================================================

    function updateMarket(
        pair,
        block
    ) {

        const price =
            Number(
                pair.priceUsd
            );


        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {

            setMarketUnavailable();

            return;
        }


        setPrice(
            price
        );


        setText(
            document.getElementById(
                "liquidity"
            ),
            formatUSD(
                pair.liquidity &&
                pair.liquidity.usd
            )
        );


        setText(
            document.getElementById(
                "volume24h"
            ),
            formatUSD(
                pair.volume &&
                pair.volume.h24
            )
        );


        const marketCap =
            getValidNumber(
                pair.marketCap
            );


        const fdv =
            getValidNumber(
                pair.fdv
            );


        setText(
            document.getElementById(
                "marketCap"
            ),
            marketCap !== null
                ? formatUSD(
                    marketCap
                )
                : "—"
        );


        setText(
            document.getElementById(
                "fdv"
            ),
            fdv !== null
                ? formatUSD(
                    fdv
                )
                : "—"
        );


        const buys =
            getValidNumber(
                pair.txns &&
                pair.txns.h24 &&
                pair.txns.h24.buys
            ) || 0;


        const sells =
            getValidNumber(
                pair.txns &&
                pair.txns.h24 &&
                pair.txns.h24.sells
            ) || 0;


        setText(
            document.getElementById(
                "txns24h"
            ),
            formatNumber(
                buys + sells
            )
        );


        setText(
            document.getElementById(
                "buySell"
            ),
            `${formatNumber(
                buys
            )} / ${formatNumber(
                sells
            )}`
        );


        setText(
            document.getElementById(
                "pairAddress"
            ),
            shortenAddress(
                pair.pairAddress
            )
        );


        setText(
            document.getElementById(
                "lastUpdate"
            ),
            formatTime(
                new Date()
            )
        );


        setText(
            document.getElementById(
                "blockValue"
            ),
            block || "—"
        );


        updateChart(
            price
        );


        updateExternalMarketLinks(
            pair
        );
    }


    function setMarketUnavailable() {

        setText(
            document.getElementById(
                "marketStatusText"
            ),
            t("market-unavailable")
        );


        setText(
            document.getElementById(
                "currentPrice"
            ),
            "—"
        );
    }


    function setPrice(
        price
    ) {

        const priceElement =
            document.getElementById(
                "currentPrice"
            );


        if (!priceElement) {
            return;
        }


        priceElement.textContent =
            formatPrice(
                price
            );
    }


    // ==================================================
    // CHART
    // ==================================================

    function updateChart(
        price
    ) {

        if (
            !Number.isFinite(price)
        ) {

            return;
        }


        let history =
            readPriceHistory();


        history.push({

            time:
                Date.now(),

            price:
                price
        });


        if (
            history.length >
            MAX_CHART_POINTS
        ) {

            history =
                history.slice(
                    -MAX_CHART_POINTS
                );
        }


        savePriceHistory(
            history
        );


        renderChart(
            history
        );
    }


    function readPriceHistory() {

        try {

            const stored =
                localStorage.getItem(
                    PRICE_HISTORY_KEY
                );


            if (!stored) {
                return [];
            }


            const parsed =
                JSON.parse(
                    stored
                );


            if (
                !Array.isArray(parsed)
            ) {

                return [];
            }


            return parsed.filter(
                function (item) {

                    return (
                        item &&
                        Number.isFinite(
                            Number(
                                item.price
                            )
                        ) &&
                        Number.isFinite(
                            Number(
                                item.time
                            )
                        )
                    );
                }
            );

        } catch (error) {

            console.warn(
                "Price history read failed:",
                error
            );

            return [];
        }
    }


    function savePriceHistory(
        history
    ) {

        try {

            localStorage.setItem(
                PRICE_HISTORY_KEY,
                JSON.stringify(
                    history
                )
            );

        } catch (error) {

            console.warn(
                "Price history save failed:",
                error
            );
        }
    }


    function renderChart(
        history
    ) {

        const canvas =
            document.getElementById(
                "priceChart"
            );


        if (!canvas) {
            return;
        }


        const context =
            canvas.getContext(
                "2d"
            );


        if (!context) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const dpr =
            window.devicePixelRatio
            || 1;


        const width =
            Math.max(
                1,
                Math.floor(
                    rect.width * dpr
                )
            );


        const height =
            Math.max(
                1,
                Math.floor(
                    rect.height * dpr
                )
            );


        if (
            canvas.width !== width ||
            canvas.height !== height
        ) {

            canvas.width =
                width;

            canvas.height =
                height;
        }


        context.clearRect(
            0,
            0,
            width,
            height
        );


        if (
            history.length < 2
        ) {

            return;
        }


        const values =
            history.map(
                function (item) {

                    return Number(
                        item.price
                    );
                }
            );


        const min =
            Math.min.apply(
                null,
                values
            );


        const max =
            Math.max.apply(
                null,
                values
            );


        const range =
            max - min || 1;


        const padding =
            16 * dpr;


        const chartWidth =
            width -
            padding * 2;


        const chartHeight =
            height -
            padding * 2;


        context.beginPath();


        values.forEach(
            function (
                value,
                index
            ) {

                const x =
                    padding +
                    (
                        index /
                        (
                            values.length - 1
                        )
                    ) *
                    chartWidth;


                const y =
                    padding +
                    (
                        1 -
                        (
                            (
                                value -
                                min
                            ) /
                            range
                        )
                    ) *
                    chartHeight;


                if (
                    index === 0
                ) {

                    context.moveTo(
                        x,
                        y
                    );

                } else {

                    context.lineTo(
                        x,
                        y
                    );
                }
            }
        );


        context.strokeStyle =
            getCssVariable(
                "--accent",
                "#ef2637"
            );


        context.lineWidth =
            2 * dpr;


        context.stroke();
    }


    // ==================================================
    // BLOCK NUMBER
    // ==================================================

    async function getBlockNumberSafe() {

        try {

            const result =
                await rpcCall(
                    "eth_blockNumber",
                    []
                );


            if (!result) {
                return "—";
            }


            return String(
                BigInt(result)
            );

        } catch (error) {

            console.warn(
                "Block number unavailable:",
                error
            );

            return "—";
        }
    }


    // ==================================================
    // RPC
    // ==================================================

    async function rpcCall(
        method,
        params
    ) {

        const urls =
            Array.isArray(
                CONFIG.network.rpcUrls
            )
                ? CONFIG.network.rpcUrls
                : [];


        let lastError =
            null;


        for (
            const url of urls
        ) {

            try {

                const response =
                    await fetchWithTimeout(
                        url,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    jsonrpc:
                                        "2.0",

                                    id:
                                        Date.now(),

                                    method:
                                        method,

                                    params:
                                        params
                                })
                        },
                        REQUEST_TIMEOUT
                    );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        `RPC HTTP ${response.status}`
                    );
                }


                const data =
                    await response.json();


                if (
                    data.error
                ) {

                    throw new Error(
                        data.error.message
                        ||
                        "RPC request failed"
                    );
                }


                return data.result;

            } catch (error) {

                lastError =
                    error;

                console.warn(
                    `RPC failed: ${url}`,
                    error
                );
            }
        }


        throw (
            lastError
            ||
            new Error(
                "All RPC endpoints failed"
            )
        );
    }


    // ==================================================
    // NAVIGATION
    // ==================================================

    function initNavigation() {

        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function (event) {

                            const targetId =
                                link
                                    .getAttribute(
                                        "href"
                                    );


                            if (
                                !targetId ||
                                targetId === "#"
                            ) {

                                return;
                            }


                            const target =
                                document.querySelector(
                                    targetId
                                );


                            if (!target) {
                                return;
                            }


                            event.preventDefault();


                            target.scrollIntoView({

                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            });
                        }
                    );
                }
            );
    }


    // ==================================================
    // MOBILE MENU
    // ==================================================

    function initMobileMenu() {

        const buttons =
            document.querySelectorAll(
                "[data-menu-toggle]"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document.body.classList.toggle(
                            "menu-open"
                        );
                    }
                );
            }
        );


        document
            .querySelectorAll(
                ".nav a"
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            document.body.classList.remove(
                                "menu-open"
                            );
                        }
                    );
                }
            );
    }


    // ==================================================
    // COPY
    // ==================================================

    function initCopyButtons() {

        document
            .querySelectorAll(
                "[data-copy]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        async function () {

                            const value =
                                button.getAttribute(
                                    "data-copy"
                                )
                                ||
                                CONFIG.token.address;


                            const success =
                                await copyText(
                                    value
                                );


                            if (
                                success
                            ) {

                                const original =
                                    button.textContent;


                                button.textContent =
                                    t("copied");


                                window.setTimeout(
                                    function () {

                                        button.textContent =
                                            original
                                            ||
                                            t("copy");

                                    },
                                    CONFIG.ui.copySuccessDuration
                                    || 1800
                                );

                            } else {

                                showToast(
                                    t("copy-failed")
                                );
                            }
                        }
                    );
                }
            );
    }


    async function copyText(
        value
    ) {

        if (!value) {
            return false;
        }


        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    value
                );

                return true;
            }


            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                value;


            textarea.style.position =
                "fixed";


            textarea.style.opacity =
                "0";


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


            return success;

        } catch (error) {

            console.warn(
                "Clipboard failed:",
                error
            );

            return false;
        }
    }


    // ==================================================
    // EXTERNAL LINKS
    // ==================================================

    function initExternalLinks() {

        setHref(
            "heroContractLink",
            getExplorerUrl()
        );


        setHref(
            "contractLink",
            getExplorerUrl()
        );


        setHref(
            "swapLink",
            getSwapUrl()
        );


        setHref(
            "buyChiliLink",
            getSwapUrl()
        );


        setHref(
            "chartLink",
            getDexScreenerUrl()
        );


        setSocialLink(
            "telegramLink",
            CONFIG.social.telegram
        );


        setSocialLink(
            "twitterLink",
            CONFIG.social.twitter
        );


        setSocialLink(
            "githubLink",
            CONFIG.social.github
        );
    }


    function updateExternalMarketLinks(
        pair
    ) {

        if (
            !pair ||
            !pair.url
        ) {

            return;
        }


        setHref(
            "chartLink",
            pair.url
        );
    }


    function setSocialLink(
        id,
        url
    ) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {
            return;
        }


        if (
            typeof url !== "string" ||
            !url.trim() ||
            url.trim() === "#"
        ) {

            element.removeAttribute(
                "href"
            );


            element.setAttribute(
                "aria-disabled",
                "true"
            );


            element.classList.add(
                "is-disabled"
            );


            return;
        }


        setHref(
            id,
            url
        );
    }


    function setHref(
        id,
        url
    ) {

        const element =
            document.getElementById(
                id
            );


        if (!element) {
            return;
        }


        if (
            !url
        ) {

            element.removeAttribute(
                "href"
            );

            return;
        }


        element.href =
            url;


        if (
            /^https?:\/\//i.test(
                url
            )
        ) {

            element.target =
                "_blank";


            element.rel =
                "noopener noreferrer";
        }
    }


    // ==================================================
    // LANGUAGE
    // ==================================================

    function initLanguage() {

        applyLanguage(
            language
        );


        document
            .querySelectorAll(
                "[data-lang]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const next =
                                button.getAttribute(
                                    "data-lang"
                                );


                            if (
                                next !== "en" &&
                                next !== "zh"
                            ) {

                                return;
                            }


                            language =
                                next;


                            localStorage.setItem(
                                "chili-language",
                                language
                            );


                            applyLanguage(
                                language
                            );
                        }
                    );
                }
            );
    }


    function applyLanguage(
        lang
    ) {

        const dictionary =
            I18N[lang] ||
            I18N.en;


        document
            .querySelectorAll(
                "[data-i18n]"
            )
            .forEach(
                function (element) {

                    const key =
                        element.getAttribute(
                            "data-i18n"
                        );


                    if (
                        Object.prototype.hasOwnProperty.call(
                            dictionary,
                            key
                        )
                    ) {

                        element.textContent =
                            dictionary[key];
                    }
                }
            );


        document.documentElement.lang =
            lang === "zh"
                ? "zh-CN"
                : "en";


        document
            .querySelectorAll(
                "[data-lang]"
            )
            .forEach(
                function (button) {

                    button.classList.toggle(
                        "active",
                        button.getAttribute(
                            "data-lang"
                        ) === lang
                    );
                }
            );
    }


    // ==================================================
    // SCROLL
    // ==================================================

    function initScrollEffects() {

        window.addEventListener(
            "scroll",
            function () {

                document.body.classList.toggle(
                    "is-scrolled",
                    window.scrollY > 20
                );
            },
            {
                passive: true
            }
        );
    }


    // ==================================================
    // SECTION OBSERVER
    // ==================================================

    function initSectionObserver() {

        if (
            !("IntersectionObserver" in window)
        ) {

            return;
        }


        const sections =
            document.querySelectorAll(
                "section[id]"
            );


        if (
            !sections.length
        ) {

            return;
        }


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );
                            }
                        }
                    );
                },
                {
                    threshold:
                        0.12
                }
            );


        sections.forEach(
            function (section) {

                observer.observe(
                    section
                );
            }
        );
    }


    // ==================================================
    // YEAR
    // ==================================================

    function initYear() {

        const year =
            new Date()
                .getFullYear();


        document
            .querySelectorAll(
                "[data-year]"
            )
            .forEach(
                function (element) {

                    element.textContent =
                        year;
                }
            );
    }


    // ==================================================
    // BACK TO TOP
    // ==================================================

    function initBackToTop() {

        document
            .querySelectorAll(
                "[data-back-to-top]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            window.scrollTo({

                                top: 0,

                                behavior:
                                    "smooth"
                            });
                        }
                    );
                }
            );
    }


    // ==================================================
    // TOAST
    // ==================================================

    function showToast(
        message
    ) {

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


            toast.setAttribute(
                "role",
                "status"
            );


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
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                CONFIG.ui.toastDuration
                || 2500
            );
    }


    // ==================================================
    // HELPERS
    // ==================================================

    function getStoredLanguage() {

        const value =
            localStorage.getItem(
                "chili-language"
            );


        return (
            value === "zh" ||
            value === "en"
        )
            ? value
            : "en";
    }


    function t(
        key
    ) {

        return (
            I18N[language] &&
            I18N[language][key]
        )
        ||
        I18N.en[key]
        ||
        key;
    }


    function setText(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        element.textContent =
            value === undefined