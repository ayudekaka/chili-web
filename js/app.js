/* =========================================================
   CHILI WEB
   Application (FIXED)
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIG
    ===================================================== */

    const CONFIG = window.CHILI_CONFIG || {};

    const TOKEN_ADDRESS = String(
        CONFIG.token?.address || ""
    ).trim();

    const TOKEN_SYMBOL =
        CONFIG.token?.symbol || "CHILI";

    const TOKEN_DECIMALS =
        Number(CONFIG.token?.decimals ?? 18);

    const RPC_URLS = Array.isArray(
        CONFIG.network?.rpcUrls
    )
        ? CONFIG.network.rpcUrls.filter(Boolean)
        : [];

    const REQUEST_TIMEOUT =
        Number(CONFIG.ui?.requestTimeout || 10000);

    const MARKET_REFRESH_INTERVAL =
        Math.max(
            30000,
            Number(
                CONFIG.ui?.marketRefreshInterval || 60000
            )
        );

    const MAX_CHART_POINTS =
        Math.max(
            2,
            Number(
                CONFIG.ui?.chartMaxPoints || 48
            )
        );

    const PRICE_HISTORY_KEY =
        "chili-price-history-v4";


    /* =====================================================
       STATE
    ===================================================== */

    let currentLanguage = "en";

    let marketRefreshTimer = null;

    let marketRequestRunning = false;

    let lastPair = null;

    let lastMarketData = null;


    /* =====================================================
       TRANSLATIONS
    ===================================================== */

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

            "terminal-feed":
                "CHILI // MARKET DATA FEED",

            "terminal-chain":
                "BNB SMART CHAIN // ● REALTIME",

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


            "token-symbol-label":
                "TOKEN SYMBOL",

            "token-supply-label":
                "TOTAL SUPPLY",

            "token-decimals-label":
                "DECIMALS",

            "token-network-label":
                "NETWORK",

            "token-chain-label":
                "CHAIN ID",


            "about-title":
                "ABOUT<br>CHILI",

            "about-desc":
                "CHILI is designed around community, transparency and on-chain participation.",

            "about-block1-title":
                "SIMPLE.<br>VISIBLE.<br>ON-CHAIN.",

            "about-block1-text":
                "CHILI keeps the core idea simple: build a recognizable community token with transparent on-chain information.",

            "about-block2-title":
                "BUILT FOR<br>COMMUNITY.",

            "about-block2-text":
                "The CHILI identity is powered by the people who participate, create, share and build around the ecosystem.",


            "why-title":
                "WHY<br>CHILI?",

            "why-community":
                "COMMUNITY",

            "why-onchain":
                "ON-CHAIN",

            "why-evolution":
                "EVOLUTION",

            "why-culture":
                "CULTURE",


            "tokenomics-title":
                "TOKENOMICS",

            "story-title":
                "STORY",

            "story-text1":
                "CHILI begins with a simple idea: make on-chain participation visible, recognizable and community-driven.",

            "story-text2":
                "A clean identity, transparent information and a culture that can grow with its community.",

            "story-text3":
                "The next chapter is written on-chain, one block and one participant at a time.",


            "security-title":
                "SECURITY",

            "security-card1-title":
                "PUBLIC CONTRACT",

            "security-card1-text":
                "The CHILI contract address is publicly visible on BNB Smart Chain.",

            "security-card2-title":
                "ON-CHAIN DATA",

            "security-card2-text":
                "Token activity can be independently verified directly on-chain.",

            "security-card3-title":
                "BNB SMART CHAIN",

            "security-card3-text":
                "CHILI operates on BNB Smart Chain, providing transparent public blockchain data.",

            "security-card4-title":
                "TRANSPARENCY",

            "security-card4-text":
                "Contract information, market information and ecosystem links are designed to remain visible.",


            "contract-title":
                "CONTRACT",

            "contract-label":
                "CHILI CONTRACT",

            "copy":
                "COPY",

            "copied":
                "COPIED",

            "view-contract":
                "VIEW CONTRACT",

            "live":
                "LIVE",

            "online":
                "ONLINE",

            "realtime":
                "REALTIME",

            "community-title":
                "THE NEXT<br>BLOCK STARTS<br>WITH YOU.",

            "footer-github":
                "GITHUB ↗",

            "market-unavailable":
                "MARKET DATA UNAVAILABLE",

            "rpc-error":
                "NETWORK DATA UNAVAILABLE",

            "copy-failed":
                "COPY FAILED",

            "session-chart":
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

            "terminal-feed":
                "CHILI // 市场数据",

            "terminal-chain":
                "BNB 智能链 // ● 实时",

            "market-current":
                "当前市场价格",

            "market-unit":
                "美元 / CHILI",

            "market-pulse":
                "实时价格脉冲",

            "market-pair":
                "交易对",

            "market-dex":
                "DEX",

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


            "token-symbol-label":
                "代币符号",

            "token-supply-label":
                "总供应量",

            "token-decimals-label":
                "精度",

            "token-network-label":
                "网络",

            "token-chain-label":
                "链 ID",


            "about-title":
                "关于<br>CHILI",

            "about-desc":
                "CHILI 围绕社区、透明度和链上参与而设计。",

            "about-block1-title":
                "简单。<br>可见。<br>链上。",

            "about-block1-text":
                "CHILI 保持核心思想简单：构建一个具有透明链上信息的、可识别的社区代币。",

            "about-block2-title":
                "为社区<br>而生。",

            "about-block2-text":
                "CHILI 的身份由参与、创造、分享和围绕生态系统建设的人们赋予力量。",


            "why-title":
                "为什么<br>CHILI？",

            "why-community":
                "社区",

            "why-onchain":
                "链上",

            "why-evolution":
                "演进",

            "why-culture":
                "文化",


            "tokenomics-title":
                "代币经济",

            "story-title":
                "故事",

            "story-text1":
                "CHILI 从一个简单的想法开始：让链上参与变得可见、可识别且由社区驱动。",

            "story-text2":
                "一个清晰的标识、透明的信息，以及一个能与社区共同成长的文化。",

            "story-text3":
                "下一章写在链上，一个区块一个参与者地书写。",


            "security-title":
                "安全",

            "security-card1-title":
                "公开合约",

            "security-card1-text":
                "CHILI 合约地址在 BNB 智能链上公开可见。",

            "security-card2-title":
                "链上数据",

            "security-card2-text":
                "代币活动可直接在链上独立验证。",

            "security-card3-title":
                "BNB 智能链",

            "security-card3-text":
                "CHILI 运行在 BNB 智能链上，提供透明的公共区块链数据。",

            "security-card4-title":
                "透明度",

            "security-card4-text":
                "合约信息、市场信息和生态系统链接设计为始终可见。",


            "contract-title":
                "合约",

            "contract-label":
                "CHILI 合约",

            "copy":
                "复制",

            "copied":
                "已复制",

            "view-contract":
                "查看合约",

            "live":
                "实时",

            "online":
                "在线",

            "realtime":
                "实时",

            "community-title":
                "下一区块<br>由你<br>开启。",

            "footer-github":
                "GITHUB ↗",

            "market-unavailable":
                "市场数据暂不可用",

            "rpc-error":
                "网络数据暂不可用",

            "copy-failed":
                "复制失败",

            "session-chart":
                "实时价格脉冲 · 本次访问采样"
        }
    };


    /* =====================================================
       DOM READY
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        init
    );


    async function init() {

        currentLanguage =
            loadLanguage();

        initializeStaticData();

        initializeLanguage();

        initializeNavigation();

        initializeMobileMenu();

        initializeCopy();

        initializeExternalLinks();

        initializeScrollEffects();

        initializeSectionObserver();

        initializeYear();

        initializeBackToTop();

        initializeResize();

        await loadTokenSupply();

        await refreshMarket();

        startMarketRefresh();
    }


    /* =====================================================
       STATIC DATA
    ===================================================== */

    function initializeStaticData() {

        setText(
            "heroContract",
            isValidAddress(TOKEN_ADDRESS)
                ? shortenAddress(TOKEN_ADDRESS)
                : "—"
        );

        setText(
            "coreToken",
            TOKEN_SYMBOL
        );

        setText(
            "networkValue",
            CONFIG.network?.chainName ||
            "BNB Smart Chain"
        );

        setText(
            "chainId",
            CONFIG.network?.chainId ??
            56
        );

        setText(
            "pair",
            CONFIG.dex?.pair ||
            "CHILI / USDT"
        );

        setText(
            "dex",
            CONFIG.dex?.name ||
            "PancakeSwap"
        );

        setText(
            "coreStatus",
            translate("online")
        );

        setText(
            "marketStatusText",
            translate("live")
        );


        const heroLink =
            document.querySelector(
                "[data-bscscan]"
            );

        if (heroLink) {

            heroLink.href =
                getContractUrl();
        }
    }


    /* =====================================================
       LANGUAGE
    ===================================================== */

    function initializeLanguage() {

        const button =
            document.getElementById(
                "langBtn"
            );


        if (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    currentLanguage =
                        currentLanguage === "en"
                            ? "zh"
                            : "en";

                    saveLanguage(
                        currentLanguage
                    );

                    applyLanguage(
                        currentLanguage
                    );
                }
            );
        }


        applyLanguage(
            currentLanguage
        );
    }


    function applyLanguage(
        language
    ) {

        const dictionary =
            I18N[language] ||
            I18N.en;


        // Translate all elements with data-i18n
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

                        // If innerHTML contains <br>, preserve it
                        if (key === "about-title" || key === "why-title" || key === "community-title") {
                            element.innerHTML = dictionary[key];
                        } else {
                            element.textContent = dictionary[key];
                        }
                    }
                }
            );


        // Language button
        const langButton =
            document.getElementById(
                "langBtn"
            );


        if (langButton) {

            langButton.textContent =
                language === "en"
                    ? "中文"
                    : "EN";


            langButton.setAttribute(
                "aria-label",
                language === "en"
                    ? "切换到中文"
                    : "Switch to English"
            );
        }


        // HTML language
        document.documentElement.lang =
            language === "zh"
                ? "zh-CN"
                : "en";


        // Restore dynamic market values after translation
        if (lastMarketData) {
            updateDynamicMarketFields(
                lastMarketData
            );
        }
    }


    function translate(
        key
    ) {

        return (
            I18N[currentLanguage]?.[key]
            ||
            I18N.en[key]
            ||
            key
        );
    }


    function loadLanguage() {

        try {

            const saved =
                localStorage.getItem(
                    "chili-language"
                );


            if (
                saved === "zh" ||
                saved === "en"
            ) {

                return saved;
            }

        } catch (error) {

            console.warn(
                "Unable to read language:",
                error
            );
        }


        return "en";
    }


    function saveLanguage(
        language
    ) {

        try {

            localStorage.setItem(
                "chili-language",
                language
            );

        } catch (error) {

            console.warn(
                "Unable to save language:",
                error
            );
        }
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function initializeMobileMenu() {

        const button =
            document.getElementById(
                "mobileToggle"
            );

        const nav =
            document.getElementById(
                "navLinks"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function () {

                const isOpen =
                    document.body.classList.toggle(
                        "menu-open"
                    );


                button.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                if (nav) {

                    nav.classList.toggle(
                        "open",
                        isOpen
                    );
                }
            }
        );


        document
            .querySelectorAll(
                "#navLinks a"
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            document.body.classList.remove(
                                "menu-open"
                            );


                            if (nav) {

                                nav.classList.remove(
                                    "open"
                                );
                            }


                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                    );
                }
            );
    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function initializeNavigation() {

        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function (event) {

                            const href =
                                link.getAttribute(
                                    "href"
                                );


                            if (
                                !href ||
                                href === "#"
                            ) {

                                return;
                            }


                            const target =
                                document.querySelector(
                                    href
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


    /* =====================================================
       COPY
    ===================================================== */

    function initializeCopy() {

        const heroButton =
            document.getElementById(
                "copyHero"
            );


        if (heroButton) {

            heroButton.addEventListener(
                "click",
                async function () {

                    const success =
                        await copyText(
                            TOKEN_ADDRESS
                        );


                    if (success) {

                        flashButton(
                            heroButton,
                            "copied"
                        );

                    } else {

                        showToast(
                            translate(
                                "copy-failed"
                            )
                        );
                    }
                }
            );
        }


        document
            .querySelectorAll(
                "[data-copy]"
            )
            .forEach(
                function (button) {

                    if (
                        button.id ===
                        "copyHero"
                    ) {

                        return;
                    }


                    button.addEventListener(
                        "click",
                        async function () {

                            const value =
                                button.getAttribute(
                                    "data-copy"
                                )
                                ||
                                TOKEN_ADDRESS;


                            const success =
                                await copyText(
                                    value
                                );


                            if (success) {

                                flashButton(
                                    button,
                                    "copied"
                                );

                            } else {

                                showToast(
                                    translate(
                                        "copy-failed"
                                    )
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


            textarea.setAttribute(
                "readonly",
                ""
            );


            textarea.style.position =
                "fixed";

            textarea.style.left =
                "-9999px";

            textarea.style.top =
                "0";


            document.body.appendChild(
                textarea
            );


            textarea.focus();

            textarea.select();


            const result =
                document.execCommand(
                    "copy"
                );


            textarea.remove();


            return result;

        } catch (error) {

            console.warn(
                "Copy failed:",
                error
            );

            return false;
        }
    }


    function flashButton(
        button,
        key
    ) {

        const original =
            button.textContent;


        button.textContent =
            translate(key);


        window.setTimeout(
            function () {

                button.textContent =
                    original ||
                    translate("copy");

            },
            Number(
                CONFIG.ui?.copySuccessDuration
                || 1800
            )
        );
    }


    /* =====================================================
       EXTERNAL LINKS
    ===================================================== */

    function initializeExternalLinks() {

        const contractUrl =
            getContractUrl();


        const swapUrl =
            CONFIG.dex?.swapUrl ||
            "";


        const dexUrl =
            CONFIG.dex?.dexScreenerUrl ||
            "";


        document
            .querySelectorAll(
                "[data-bscscan]"
            )
            .forEach(
                function (link) {

                    link.href =
                        contractUrl;
                }
            );


        document
            .querySelectorAll(
                "[data-dexscreener]"
            )
            .forEach(
                function (link) {

                    if (dexUrl) {

                        link.href =
                            dexUrl;
                    }
                }
            );


        setLinkById(
            "swapLink",
            swapUrl
        );

        setLinkById(
            "buyChiliLink",
            swapUrl
        );

        setLinkById(
            "contractLink",
            contractUrl
        );

        setLinkById(
            "chartLink",
            dexUrl
        );


        setSocialLink(
            "telegramLink",
            CONFIG.social?.telegram
        );

        setSocialLink(
            "twitterLink",
            CONFIG.social?.twitter
        );

        setSocialLink(
            "githubLink",
            CONFIG.social?.github
        );
    }


    function setLinkById(
        id,
        url
    ) {

        const element =
            document.getElementById(
                id
            );


        if (
            !element ||
            !url
        ) {

            return;
        }


        element.href =
            url;


        element.target =
            "_blank";


        element.rel =
            "noopener noreferrer";
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


        element.href =
            url;


        element.target =
            "_blank";


        element.rel =
            "noopener noreferrer";
    }


    function getContractUrl() {

        return (
            CONFIG.token?.contractExplorer
            ||
            CONFIG.token?.explorer
            ||
            (
                "https://bscscan.com/address/" +
                TOKEN_ADDRESS
            )
        );
    }


    /* =====================================================
       TOKEN SUPPLY
    ===================================================== */

    async function loadTokenSupply() {

        const element =
            document.getElementById(
                "tokenSupply"
            );


        if (!element) {
            return;
        }


        if (
            !isValidAddress(
                TOKEN_ADDRESS
            )
        ) {

            element.textContent =
                "—";

            return;
        }


        try {

            const result =
                await rpcCall(
                    "eth_call",
                    [
                        {
                            to:
                                TOKEN_ADDRESS,

                            data:
                                "0x18160ddd"
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
                    TOKEN_DECIMALS
                );

        } catch (error) {

            console.warn(
                "Token supply unavailable:",
                error
            );
        }
    }


    /* =====================================================
       MARKET REFRESH
    ===================================================== */

    async function refreshMarket() {

        if (
            marketRequestRunning
        ) {

            return;
        }


        marketRequestRunning =
            true;


        try {

            const pairs =
                await fetchDexPairs();


            const pair =
                selectBestPair(
                    pairs
                );


            if (!pair) {

                setMarketUnavailable();

                return;
            }


            lastPair =
                pair;


            const block =
                await getBlockNumberSafe();


            const marketData = {

                pair,

                block,

                updatedAt:
                    Date.now()
            };


            lastMarketData =
                marketData;


            updateDynamicMarketFields(
                marketData
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
            marketRefreshTimer
        ) {

            clearInterval(
                marketRefreshTimer
            );
        }


        marketRefreshTimer =
            window.setInterval(
                refreshMarket,
                MARKET_REFRESH_INTERVAL
            );
    }


    /* =====================================================
       DEXSCREENER
    ===================================================== */

    async function fetchDexPairs() {

        if (
            !isValidAddress(
                TOKEN_ADDRESS
            )
        ) {

            return [];
        }


        const url =
            "https://api.dexscreener.com/latest/dex/tokens/" +
            TOKEN_ADDRESS;


        const response =
            await fetchWithTimeout(
                url,
                {

                    method:
                        "GET",

                    cache:
                        "no-store",

                    headers: {

                        Accept:
                            "application/json"
                    }
                },
                REQUEST_TIMEOUT
            );


        if (!response.ok) {

            throw new Error(
                "DexScreener HTTP " +
                response.status
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


    /* =====================================================
       PAIR SELECTION
    ===================================================== */

    function selectBestPair(
        pairs
    ) {

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


        const configuredPair =
            normalizeAddress(
                CONFIG.dex?.pairAddress
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
                            ) ===
                            configuredPair
                        );
                    }
                );


            if (exact) {

                return exact;
            }
        }


        const chiliPairs =
            bscPairs.filter(
                function (pair) {

                    const base =
                        normalizeAddress(
                            pair.baseToken?.address
                        );

                    const quote =
                        normalizeAddress(
                            pair.quoteToken?.address
                        );


                    return (
                        base ===
                        TOKEN_ADDRESS.toLowerCase()
                        ||
                        quote ===
                        TOKEN_ADDRESS.toLowerCase()
                    );
                }
            );


        if (
            !chiliPairs.length
        ) {

            return null;
        }


        const usdtAddress =
            normalizeAddress(
                CONFIG.dex?.quoteTokens?.USDT
            );


        const wbnbAddress =
            normalizeAddress(
                CONFIG.dex?.quoteTokens?.WBNB
            );


        const usdtPairs =
            chiliPairs.filter(
                function (pair) {

                    const base =
                        normalizeAddress(
                            pair.baseToken?.address
                        );

                    const quote =
                        normalizeAddress(
                            pair.quoteToken?.address
                        );


                    return (
                        base === usdtAddress
                        ||
                        quote === usdtAddress
                    );
                }
            );


        if (
            usdtPairs.length
        ) {

            return highestLiquidity(
                usdtPairs
            );
        }


        const wbnbPairs =
            chiliPairs.filter(
                function (pair) {

                    const base =
                        normalizeAddress(
                            pair.baseToken?.address
                        );

                    const quote =
                        normalizeAddress(
                            pair.quoteToken?.address
                        );


                    return (
                        base === wbnbAddress
                        ||
                        quote === wbnbAddress
                    );
                }
            );


        if (
            wbnbPairs.length
        ) {

            return highestLiquidity(
                wbnbPairs
            );
        }


        return highestLiquidity(
            chiliPairs
        );
    }


    function highestLiquidity(
        pairs
    ) {

        return pairs
            .slice()
            .sort(
                function (a, b) {

                    const aLiquidity =
                        Number(
                            a.liquidity?.usd || 0
                        );


                    const bLiquidity =
                        Number(
                            b.liquidity?.usd || 0
                        );


                    return (
                        bLiquidity -
                        aLiquidity
                    );
                }
            )[0] || null;
    }


    /* =====================================================
       MARKET UI
    ===================================================== */

    function updateDynamicMarketFields(
        marketData
    ) {

        if (
            !marketData ||
            !marketData.pair
        ) {

            return;
        }


        const pair =
            marketData.pair;


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


        lastMarketData =
            marketData;


        setText(
            "price",
            formatPrice(price)
        );


        setText(
            "pair",
            formatPair(pair)
        );


        setText(
            "dex",
            pair.dexId
                ? capitalize(
                    pair.dexId
                )
                : (
                    CONFIG.dex?.name ||
                    "PancakeSwap"
                )
        );


        setText(
            "block",
            marketData.block ||
            "—"
        );


        setText(
            "liquidity",
            formatUSD(
                pair.liquidity?.usd
            )
        );


        setText(
            "volume",
            formatUSD(
                pair.volume?.h24
            )
        );


        setText(
            "marketCap",
            formatUSDOrDash(
                pair.marketCap
            )
        );


        const buys =
            Number(
                pair.txns?.h24?.buys || 0
            );


        const sells =
            Number(
                pair.txns?.h24?.sells || 0
            );


        setText(
            "txns",
            formatNumber(
                buys + sells
            )
        );


        setText(
            "buys",
            formatNumber(
                buys
            )
        );


        setText(
            "sells",
            formatNumber(
                sells
            )
        );


        setText(
            "pairAddress",
            shortenAddress(
                pair.pairAddress
            )
        );


        setText(
            "lastUpdate",
            formatTime(
                new Date(
                    marketData.updatedAt
                )
            )
        );


        updateChartLink(
            pair
        );


        savePriceSample(
            price
        );


        setText(
            "marketStatusText",
            translate("live")
        );
    }


    function setMarketUnavailable() {

        setText(
            "price",
            "—"
        );


        setText(
            "marketStatusText",
            translate(
                "market-unavailable"
            )
        );
    }


    function updateChartLink(
        pair
    ) {

        const url =
            pair?.url ||
            CONFIG.dex?.dexScreenerUrl ||
            "";


        document
            .querySelectorAll(
                "[data-dexscreener]"
            )
            .forEach(
                function (link) {

                    if (url) {

                        link.href =
                            url;
                    }
                }
            );
    }


    /* =====================================================
       PRICE HISTORY
    ===================================================== */

    function savePriceSample(
        price
    ) {

        if (
            !Number.isFinite(price) ||
            price <= 0
        ) {

            return;
        }


        let history =
            loadPriceHistory();


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


        try {

            localStorage.setItem(
                PRICE_HISTORY_KEY,
                JSON.stringify(
                    history
                )
            );

        } catch (error) {

            console.warn(
                "Unable to save price history:",
                error
            );
        }
    }


    function loadPriceHistory() {

        try {

            const raw =
                localStorage.getItem(
                    PRICE_HISTORY_KEY
                );


            if (!raw) {
                return [];
            }


            const parsed =
                JSON.parse(
                    raw
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
                                item.time
                            )
                        ) &&
                        Number.isFinite(
                            Number(
                                item.price
                            )
                        )
                    );
                }
            );

        } catch (error) {

            return [];
        }
    }


    /* =====================================================
       RPC
    ===================================================== */

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
                "Unable to get block:",
                error
            );


            return "—";
        }
    }


    async function rpcCall(
        method,
        params
    ) {

        if (
            !RPC_URLS.length
        ) {

            throw new Error(
                "No RPC endpoint configured"
            );
        }


        let lastError =
            null;


        for (
            const rpcUrl of RPC_URLS
        ) {

            try {

                const response =
                    await fetchWithTimeout(
                        rpcUrl,
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
                        "RPC HTTP " +
                        response.status
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
                    "RPC endpoint failed:",
                    rpcUrl,
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


    /* =====================================================
       FETCH WITH TIMEOUT
    ===================================================== */

    async function fetchWithTimeout(
        url,
        options,
        timeout
    ) {

        const controller =
            new AbortController();


        const timer =
            window.setTimeout(
                function () {

                    controller.abort();

                },
                timeout
            );


        try {

            return await fetch(
                url,
                {
                    ...(options || {}),
                    signal:
                        controller.signal
                }
            );

        } finally {

            window.clearTimeout(
                timer
            );
        }
    }


    /* =====================================================
       SCROLL EFFECTS
    ===================================================== */

    function initializeScrollEffects() {

        const header =
            document.getElementById(
                "siteHeader"
            );


        const update =
            function () {

                const scrolled =
                    window.scrollY > 20;


                document.body.classList.toggle(
                    "is-scrolled",
                    scrolled
                );


                if (header) {

                    header.classList.toggle(
                        "scrolled",
                        scrolled
                    );
                }
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


    /* =====================================================
       SECTION OBSERVER
    ===================================================== */

    function initializeSectionObserver() {

        if (
            !("IntersectionObserver" in window)
        ) {

            return;
        }


        const sections =
            document.querySelectorAll(
                "section[id]"
            );


        const navLinks =
            document.querySelectorAll(
                ".nav-link[data-section]"
            );


        if (
            !sections.length ||
            !navLinks.length
        ) {

            return;
        }


        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;
                            }


                            const id =
                                entry.target.id;


                            navLinks.forEach(
                                function (link) {

                                    link.classList.toggle(
                                        "active",
                                        link.getAttribute(
                                            "data-section"
                                        ) === id
                                    );
                                }
                            );
                        }
                    );
                },
                {
                    rootMargin:
                        "-20% 0px -65% 0px",

                    threshold:
                        0
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


    /* =====================================================
       RESIZE
    ===================================================== */

    function initializeResize() {

        let resizeTimer =
            null;


        window.addEventListener(
            "resize",
            function () {

                window.clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    window.setTimeout(
                        function () {

                            // reserved

                        },
                        150
                    );
            }
        );
    }


    /* =====================================================
       YEAR
    ===================================================== */

    function initializeYear() {

        const year =
            String(
                new Date()
                    .getFullYear()
            );


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


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    function initializeBackToTop() {

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

                                top:
                                    0,

                                behavior:
                                    "smooth"
                            });
                        }
                    );
                }
            );
    }


    /* =====================================================
       TOAST
    ===================================================== */

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


            toast.style.position =
                "fixed";


            toast.style.left =
                "50%";


            toast.style.bottom =
                "30px";


            toast.style.transform =
                "translateX(-50%)";


            toast.style.zIndex =
                "99999";


            toast.style.padding =
                "10px 16px";


            toast.style.border =
                "1px solid rgba(239,38,55,.35)";


            toast.style.background =
                "#111";


            toast.style.color =
                "#fff";


            toast.style.fontSize =
                "12px";


            toast.style.transition =
                "opacity .2s ease";


            toast.style.opacity =
                "0";


            document.body.appendChild(
                toast
            );
        }


        toast.textContent =
            message;


        toast.style.opacity =
            "1";


        window.clearTimeout(
            toast._timer
        );


        toast._timer =
            window.setTimeout(
                function () {

                    toast.style.opacity =
                        "0";

                },
                Number(
                    CONFIG.ui?.toastDuration
                    || 2500
                )
            );
    }


    /* =====================================================
       FORMATTERS
    ===================================================== */

    function formatPrice(
        value
    ) {

        const number =
            Number(value);


        if (
            !Number.isFinite(number) ||
            number <= 0
        ) {

            return "—";
        }


        if (
            number >= 1
        ) {

            return (
                "$" +
                number.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits:
                            2,

                        maximumFractionDigits:
                            4
                    }
                )
            );
        }


        if (
            number >= 0.01
        ) {

            return (
                "$" +
                number.toFixed(6)
            );
        }


        return (
            "$" +
            number.toFixed(10)
        );
    }


    function formatUSD(
        value
    ) {

        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {

            return "—";
        }


        if (
            number === 0
        ) {

            return "$0";
        }


        if (
            Math.abs(number) < 0.01
        ) {

            return (
                "$" +
                number.toFixed(8)
            );
        }


        return (
            "$" +
            number.toLocaleString(
                "en-US",
                {
                    maximumFractionDigits:
                        2
                }
            )
        );
    }


    function formatUSDOrDash(
        value
    ) {

        const number =
            Number(value);


        if (
            !Number.isFinite(number) ||
            number <= 0
        ) {

            return "—";
        }


        return formatUSD(
            number
        );
    }


    function formatNumber(
        value
    ) {

        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {

            return "—";
        }


        return number.toLocaleString(
            "en-US"
        );
    }


    function formatTokenAmount(
        raw,
        decimals
    ) {

        try {

            const value =
                BigInt(raw);


            const decimalCount =
                Number(decimals);


            if (
                decimalCount <= 0
            ) {

                return value.toLocaleString(
                    "en-US"
                );
            }


            const base =
                10n **
                BigInt(
                    decimalCount
                );


            const whole =
                value / base;


            const fraction =
                value % base;


            if (
                fraction === 0n
            ) {

                return whole.toLocaleString(
                    "en-US"
                );
            }


            const fractionText =
                fraction
                    .toString()
                    .padStart(
                        decimalCount,
                        "0"
                    )
                    .replace(
                        /0+$/,
                        ""
                    );


            return (
                whole.toLocaleString(
                    "en-US"
                ) +
                "." +
                fractionText
            );

        } catch (error) {

            return "—";
        }
    }


    function formatPair(
        pair
    ) {

        if (
            pair?.baseToken?.symbol &&
            pair?.quoteToken?.symbol
        ) {

            return (
                pair.baseToken.symbol +
                " / " +
                pair.quoteToken.symbol
            );
        }


        return (
            CONFIG.dex?.pair ||
            "CHILI / USDT"
        );
    }


    function formatTime(
        date
    ) {

        if (
            !(date instanceof Date) ||
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";
        }


        return date.toLocaleTimeString(
            [],
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit"
            }
        );
    }


    function capitalize(
        value
    ) {

        const text =
            String(
                value || ""
            );


        if (!text) {
            return "";
        }


        return (
            text.charAt(0).toUpperCase() +
            text.slice(1)
        );
    }


    /* =====================================================
       ADDRESS
    ===================================================== */

    function isValidAddress(
        address
    ) {

        return /^0x[a-fA-F0-9]{40}$/.test(
            String(
                address || ""
            )
        );
    }


    function normalizeAddress(
        address
    ) {

        return String(
            address || ""
        )
            .trim()
            .toLowerCase();
    }


    function shortenAddress(
        address
    ) {

        if (!address) {
            return "—";
        }


        const start =
            Number(
                CONFIG.ui?.addressStartLength
                || 6
            );


        const end =
            Number(
                CONFIG.ui?.addressEndLength
                || 4
            );


        if (
            address.length <=
            start + end
        ) {

            return address;
        }


        return (
            address.substring(
                0,
                start
            ) +
            "..." +
            address.substring(
                address.length - end
            )
        );
    }


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    function setText(
        id,
        value
    ) {

        const element =
            typeof id === "string"
                ? document.getElementById(id)
                : id;


        if (!element) {
            return;
        }


        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {

            element.textContent =
                "—";

            return;
        }


        element.textContent =
            String(value);
    }


})();
