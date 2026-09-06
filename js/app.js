(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initApp();
    });

    function initApp() {
        initProjectInfo();
        initLogo();
        initContractAddress();
        initNavigation();
        initMobileMenu();
        initCopyButtons();
        initWalletButtons();
        initExternalLinks();
        initScrollEffects();
        initBackToTop();
        initYear();
        console.log("🌶️ CHILI website initialized.");
    }

    function initProjectInfo() {
        if (CHILI_CONFIG.site.title) document.title = CHILI_CONFIG.site.title;
        const description = document.querySelector('meta[name="description"]');
        if (description) description.setAttribute("content", CHILI_CONFIG.site.description);
    }

    function initLogo() {
        document.querySelectorAll("[data-chili-logo]").forEach(function (element) {
            if (element.tagName === "IMG") {
                element.src = CHILI_CONFIG.assets.logo;
                element.alt = CHILI_CONFIG.project.name + " Logo";
            }
        });
    }

    function initContractAddress() {
        const address = getTokenAddress();
        const heroContract = document.getElementById("heroContract");
        const contractAddress = document.getElementById("contractAddress");
        
        if (isTokenConfigured()) {
            if (heroContract) heroContract.textContent = shortenAddress(address);
            if (contractAddress) contractAddress.textContent = address;
        } else {
            if (heroContract) heroContract.textContent = "Contract Address";
            if (contractAddress) contractAddress.textContent = "YOUR_CHILI_CONTRACT_ADDRESS";
        }
    }

    function initNavigation() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href");
                if (!targetId || targetId === "#") return;
                const target = document.querySelector(targetId);
                if (!target) return;
                event.preventDefault();
                const header = document.querySelector(".nav");
                let offset = 20;
                if (header) offset = header.offsetHeight + 15;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: "smooth" });
                closeMobileMenu();
            });
        });
    }

    function initMobileMenu() {
        const menuButton = document.getElementById("mobileToggle");
        const menu = document.getElementById("navLinks");
        if (!menuButton || !menu) return;
        menuButton.addEventListener("click", function () {
            const opened = menu.classList.toggle("open");
            menuButton.classList.toggle("is-active", opened);
            menuButton.setAttribute("aria-expanded", opened);
        });
    }

    function closeMobileMenu() {
        const menu = document.getElementById("navLinks");
        const menuButton = document.getElementById("mobileToggle");
        if (!menu) return;
        menu.classList.remove("open");
        if (menuButton) {
            menuButton.classList.remove("is-active");
            menuButton.setAttribute("aria-expanded", "false");
        }
    }

    function initCopyButtons() {
        const copyHero = document.getElementById("copyHero");
        const copyContract = document.getElementById("copyContract");
        if (copyHero) copyHero.addEventListener("click", function() { copyContractAddress(copyHero); });
        if (copyContract) copyContract.addEventListener("click", function() { copyContractAddress(copyContract); });
    }

    async function copyContractAddress(button) {
        if (!isTokenConfigured()) {
            showToast("Please configure the contract address first.");
            return;
        }
        const address = getTokenAddress();
        await copyText(address, button);
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
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    }

    function setCopySuccess(button) {
        if (!button) return;
        const originalText = button.dataset.originalText || button.textContent;
        button.dataset.originalText = originalText;
        button.classList.add("copied");
        button.textContent = "Copied";
        setTimeout(function () {
            button.classList.remove("copied");
            button.textContent = originalText;
        }, CHILI_CONFIG.ui.copySuccessDuration);
    }

    function initWalletButtons() {
        document.querySelectorAll("[data-connect-wallet]").forEach(function (button) {
            button.addEventListener("click", function () { connectWallet(button); });
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
            if (error.code === 4001) {
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
            if (error.code === 4902) {
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
        document.querySelectorAll("[data-wallet-address]").forEach(function (element) {
            element.textContent = short;
        });
        document.querySelectorAll("[data-connect-wallet]").forEach(function (button) {
            button.textContent = short;
            button.classList.add("connected");
        });
        document.body.classList.add("wallet-connected");
        window.CHILI_WALLET = account;
    }

    function initExternalLinks() {
        document.querySelectorAll("[data-contract-link]").forEach(function (link) {
            link.href = getExplorerUrl(); link.target = "_blank"; link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-swap-link]").forEach(function (link) {
            link.href = getSwapUrl(); link.target = "_blank"; link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-telegram-link]").forEach(function (link) {
            link.href = CHILI_CONFIG.social.telegram; link.target = "_blank"; link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-twitter-link]").forEach(function (link) {
            link.href = CHILI_CONFIG.social.twitter; link.target = "_blank"; link.rel = "noopener noreferrer";
        });
        document.querySelectorAll("[data-github-link]").forEach(function (link) {
            link.href = CHILI_CONFIG.social.github; link.target = "_blank"; link.rel = "noopener noreferrer";
        });
    }

    function initScrollEffects() {
        const header = document.querySelector(".nav");
        if (!header) return;
        window.addEventListener("scroll", function () {
            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    function initBackToTop() {
        const button = document.querySelector("[data-back-to-top]");
        if (!button) return;
        window.addEventListener("scroll", function () {
            if (window.scrollY > 500) button.classList.add("show");
            else button.classList.remove("show");
        }, { passive: true });
        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    function initYear() {
        const year = new Date().getFullYear();
        document.querySelectorAll("[data-current-year]").forEach(function (element) {
            element.textContent = year;
        });
    }

    function showToast(message) {
        let toast = document.querySelector(".toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    if (window.ethereum) {
        window.ethereum.on("accountsChanged", function (accounts) {
            if (accounts && accounts.length) updateWalletUI(accounts[0]);
            else document.body.classList.remove("wallet-connected");
        });
        window.ethereum.on("chainChanged", function () {
            window.location.reload();
        });
    }

    window.CHILI_APP = {
        connectWallet: connectWallet,
        copyContractAddress: copyContractAddress,
        copyText: copyText,
        showToast: showToast,
        shortenAddress: shortenAddress,
        switchToBNBChain: switchToBNBChain
    };
})();
