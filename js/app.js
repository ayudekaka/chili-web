// ======================================================
// CHILI WEB3 WEBSITE
// app.js
// ======================================================

(function () {
    "use strict";

    // ==================================================
    // DOM READY
    // ==================================================
    document.addEventListener("DOMContentLoaded", initApp);

    async function initApp() {
        initProjectInfo();
        initLogo();
        initContract();
        initTokenInfo();
        loadTokenomics();
        initMarketInfo();
        loadMarketData();
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

        console.log("🌶️ CHILI website initialized.");
    }

    // ==================================================
    // PROJECT INFO
    // ==================================================
    function initProjectInfo() {
        if (CHILI_CONFIG.site.title) document.title = CHILI_CONFIG.site.title;
        const description = document.querySelector('meta[name="description"]');
        if (description && CHILI_CONFIG.site.description) {
            description.setAttribute("content", CHILI_CONFIG.site.description);
        }
    }

    // ==================================================
    // LOGO
    // ==================================================
    function initLogo() {
        document.querySelectorAll("[data-chili-logo]").forEach(el => {
            if (el.tagName === "IMG") {
                el.src = CHILI_CONFIG.assets.logo;
                el.alt = CHILI_CONFIG.project.name + " Logo";
            }
        });
    }

    // ==================================================
    // CONTRACT + HERO CONTRACT（修复合并）
    // ==================================================
    function initContract() {
        const address = getTokenAddress();
        if (!isTokenConfigured()) {
            document.getElementById("heroContract")?.textContent = "Contract Address";
            document.getElementById("contractAddress")?.textContent = "YOUR_CHILI_CONTRACT_ADDRESS";
            return;
        }
        document.getElementById("heroContract")?.textContent = shortenAddress(address);
        document.getElementById("contractAddress")?.textContent = address;
    }

    // ==================================================
    // TOKEN INFO
    // ==================================================
    function initTokenInfo() {
        const { tokenSymbol, reactorSymbol, coreToken, tokenDecimals, networkValue, chainId } = getTokenElements();
        if (tokenSymbol) tokenSymbol.textContent = CHILI_CONFIG.token.symbol;
        if (reactorSymbol) reactorSymbol.textContent = CHILI_CONFIG.token.symbol;
        if (coreToken) coreToken.textContent = CHILI_CONFIG.token.symbol;
        if (tokenDecimals) tokenDecimals.textContent = CHILI_CONFIG.token.decimals;
        if (networkValue) networkValue.textContent = CHILI_CONFIG.network.chainName;
        if (chainId) chainId.textContent = CHILI_CONFIG.network.chainId;
    }

    function getTokenElements() {
        return {
            tokenSymbol: document.getElementById("tokenSymbol"),
            reactorSymbol: document.getElementById("reactorSymbol"),
            coreToken: document.getElementById("coreToken"),
            tokenDecimals: document.getElementById("tokenDecimals"),
            networkValue: document.getElementById("networkValue"),
            chainId: document.getElementById("chainId")
        };
    }

    // ==================================================
    // TOKENOMICS 动态加载
    // ==================================================
    async function loadTokenomics() {
        if (!isTokenConfigured()) return;
        try {
            const contract = new window.ethereum?.Contract
                ? new window.ethereum.Contract(CHILI_CONFIG.token.address, [
                    { constant: true, inputs: [], name: "totalSupply", outputs: [{ type: "uint256" }], type: "function" }
                  ])
                : null;

            if (contract) {
                const supply = await contract.methods.totalSupply().call();
                const supplyEl = document.getElementById("tokenSupply");
                if (supplyEl) {
                    supplyEl.textContent = (supply / 10 ** CHILI_CONFIG.token.decimals).toLocaleString("en-US", { maximumFractionDigits: 0 });
                }
            }
        } catch (e) {
            console.warn("Tokenomics 加载失败（使用静态数据）");
        }
    }

    // ==================================================
    // MARKET
    // ==================================================
    function initMarketInfo() {
        document.getElementById("pair")?.textContent = CHILI_CONFIG.dex.pair;
        document.getElementById("dex")?.textContent = CHILI_CONFIG.dex.name;
        document.getElementById("marketStatusText")?.textContent = "LIVE";
        document.getElementById("pairAddress")?.textContent = "ON-CHAIN";
        document.getElementById("lastUpdate")?.textContent = formatTime(new Date());
    }

    async function loadMarketData() {
        console.log("Market data loaded (real-time placeholder)");
    }

    // ==================================================
    // NAVIGATION / MOBILE / COPY / WALLET / EXTERNAL
    // ==================================================
    function initNavigation() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const target = document.querySelector(targetId);
                if (!target) return;
                event.preventDefault();
                const header = document.querySelector(".nav");
                const offset = header ? header.offsetHeight + 10 : 20;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: "smooth" });
                closeMobileMenu();
            });
        });
    }

    function initMobileMenu() {
        const button = document.getElementById("mobileToggle");
        const menu = document.getElementById("navLinks");
        if (!button || !menu) return;
        button.addEventListener("click", function () {
            const opened = menu.classList.toggle("open");
            button.classList.toggle("is-active", opened);
            button.setAttribute("aria-expanded", String(opened));
        });
    }

    function closeMobileMenu() {
        const menu = document.getElementById("navLinks");
        const button = document.getElementById("mobileToggle");
        if (menu) menu.classList.remove("open");
        if (button) {
            button.classList.remove("is-active");
            button.setAttribute("aria-expanded", "false");
        }
    }

    function initCopyButtons() {
        const copyHero = document.getElementById("copyHero");
        const copyContract = document.getElementById("copyContract");
        if (copyHero) copyHero.addEventListener("click", () => copyContractAddress(copyHero));
        if (copyContract) copyContract.addEventListener("click", () => copyContractAddress(copyContract));
    }

    async function copyContractAddress(button) {
        if (!isTokenConfigured()) {
            showToast("Contract address is not configured.");
            return;
        }
        await copyText(getTokenAddress(), button);
    }

    async function copyText(text, button) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                fallbackCopy(text);
            }
            setCopySuccess(button);
            showToast("Copied successfully!");
        } catch (error) {
            console.error("Copy failed:", error);
            showToast("Copy failed. Please copy manually.");
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    }

    function setCopySuccess(button) {
        if (!button) return;
        const original = button.dataset.originalText || button.textContent;
        button.dataset.originalText = original;
        button.classList.add("copied");
        button.textContent = "COPIED";
        setTimeout(() => {
            button.classList.remove("copied");
            button.textContent = original;
        }, CHILI_CONFIG.ui.copySuccessDuration);
    }

    function initWalletButtons() {
        document.querySelectorAll("[data-connect-wallet]").forEach(btn => {
            btn.addEventListener("click", () => connectWallet(btn));
        });
    }

    async function connectWallet(button) {
        if (!window.ethereum) {
            showToast("Please install MetaMask or another Web3 wallet.");
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            if (!accounts || !accounts.length) return;
            const account = accounts[0];
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            if (chainId.toLowerCase() !== CHILI_CONFIG.network.chainId.toLowerCase()) {
                await switchToBNBChain();
            }
            updateWalletUI(account);
            showToast("Wallet connected.");
        } catch (error) {
            console.error("Wallet connection failed:", error);
            if (error && error.code === 4001) {
                showToast("Wallet connection cancelled.");
            } else {
                showToast("Unable to connect wallet.");
            }
        }
    }

    async function switchToBNBChain() {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: CHILI_CONFIG.network.chainId }]
            });
        } catch (error) {
            if (error && error.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [CHILI_CONFIG.network]
                });
            } else {
                throw error;
            }
        }
    }

    function updateWalletUI(account) {
        const short = shortenAddress(account);
        document.querySelectorAll("[data-wallet-address]").forEach(el => el.textContent = short); // 修复
        document.querySelectorAll("[data-connect-wallet]").forEach(btn => {
            btn.textContent = short;
            btn.classList.add("connected");
        });
        document.body.classList.add("wallet-connected");
        window.CHILI_WALLET = account;
    }

    function initExternalLinks() {
        document.querySelectorAll("[data-contract-link]").forEach(link => {
            link.href = getExplorerUrl();
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-swap-link]").forEach(link => {
            link.href = getSwapUrl();
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-dexscreener]").forEach(link => {
            link.href = getDexScreenerUrl();
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-telegram-link]").forEach(link => {
            link.href = CHILI_CONFIG.social.telegram;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-twitter-link]").forEach(link => {
            link.href = CHILI_CONFIG.social.twitter;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-github-link]").forEach(link => {
            link.href = CHILI_CONFIG.social.github;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
    }

    // ==================================================
    // SCROLL / OBSERVER / BACK TO TOP / YEAR / LANGUAGE / ETHEREUM / TOAST / TIME
    // ==================================================
    function initScrollEffects() {
        const header = document.querySelector(".nav");
        if (!header) return;
        function update() {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    function initSectionObserver() {
        const sections = document.querySelectorAll("section[id]");
        const links = document.querySelectorAll(".nav-link[data-section]");
        if (!sections.length || !links.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle("active", link.dataset.section === id);
                    });
                }
            });
        }, { rootMargin: "-40% 0px -40% 0px" });
        sections.forEach(section => observer.observe(section));
    }

    function initBackToTop() {
        const button = document.querySelector("[data-back-to-top]");
        if (!button) return;
        window.addEventListener("scroll", () => button.classList.toggle("show", window.scrollY > 500), { passive: true });
        button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    function initYear() {
        const year = new Date().getFullYear();
        document.querySelectorAll("[data-current-year]").forEach(el => el.textContent = year);
    }

    function initLanguage() {
        const button = document.getElementById("langBtn");
        if (!button) return;
        let currentLanguage = localStorage.getItem("chili-language") || "en";
        function applyLanguage() {
            if (currentLanguage === "zh") {
                document.documentElement.setAttribute("lang", "zh-CN");
                button.textContent = "EN";
            } else {
                document.documentElement.setAttribute("lang", "en");
                button.textContent = "中文";
            }
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.dataset.i18n;
                if (translations[currentLanguage] && translations[currentLanguage][key]) {
                    element.textContent = translations[currentLanguage][key];
                }
            });
        }
        button.addEventListener("click", () => {
            currentLanguage = currentLanguage === "en" ? "zh" : "en";
            localStorage.setItem("chili-language", currentLanguage);
            applyLanguage();
        });
        applyLanguage();
    }

    const translations = {
        en: {
            "logo-small": "ON-CHAIN",
            "nav-market": "MARKET",
            "nav-about": "ABOUT",
            "nav-tokenomics": "TOKENOMICS",
            "nav-story": "STORY",
            "nav-security": "SECURITY",
            "nav-contract": "CONTRACT",
            "hero-kicker": "BNB SMART CHAIN // SYSTEM ONLINE",
            "hero-subtitle": "A community-driven token built for the next wave of on-chain culture.",
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
            "hero-subtitle": "一个由社区驱动，为下一阶段链上文化而生的代币。",
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

    function initEthereumListeners() {
        if (!window.ethereum) return;
        if (typeof window.ethereum.on === "function") {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts && accounts.length) {
                    updateWalletUI(accounts[0]);
                } else {
                    document.body.classList.remove("wallet-connected");
                }
            });
            window.ethereum.on("chainChanged", () => window.location.reload());
        }
    }

    function showToast(message) {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove("show"), CHILI_CONFIG.ui.toastDuration);
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }

    window.CHILI_APP = {
        connectWallet, copyContractAddress, copyText, showToast, shortenAddress, switchToBNBChain
    };
})();
