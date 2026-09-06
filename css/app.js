// ========================================
// CHILI Web3 Website
// app.js
// ========================================

(function () {

    "use strict";


    // ========================================
    // DOM Ready
    // ========================================

    document.addEventListener("DOMContentLoaded", function () {

        initApp();

    });


    // ========================================
    // 初始化
    // ========================================

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


    // ========================================
    // 项目信息
    // ========================================

    function initProjectInfo() {

        // 页面 Title
        if (CHILI_CONFIG.site.title) {

            document.title = CHILI_CONFIG.site.title;

        }


        // Meta Description
        const description =
            document.querySelector('meta[name="description"]');

        if (description) {

            description.setAttribute(
                "content",
                CHILI_CONFIG.site.description
            );

        }


        // 所有 data-project-name
        document
            .querySelectorAll("[data-project-name]")
            .forEach(function (element) {

                element.textContent =
                    CHILI_CONFIG.project.name;

            });


        // 所有 data-token-symbol
        document
            .querySelectorAll("[data-token-symbol]")
            .forEach(function (element) {

                element.textContent =
                    CHILI_CONFIG.token.symbol;

            });


        // Chain
        document
            .querySelectorAll("[data-chain-name]")
            .forEach(function (element) {

                element.textContent =
                    CHILI_CONFIG.project.chainName;

            });

    }


    // ========================================
    // Logo
    // ========================================

    function initLogo() {

        document
            .querySelectorAll("[data-chili-logo]")
            .forEach(function (element) {

                if (element.tagName === "IMG") {

                    element.src =
                        CHILI_CONFIG.assets.logo;

                    element.alt =
                        CHILI_CONFIG.project.name + " Logo";

                }

            });

    }


    // ========================================
    // 合约地址
    // ========================================

    function initContractAddress() {

        const address =
            getTokenAddress();


        document
            .querySelectorAll("[data-contract-address]")
            .forEach(function (element) {

                if (isTokenConfigured()) {

                    element.textContent =
                        shortenAddress(address);

                    element.setAttribute(
                        "title",
                        address
                    );

                    element.dataset.fullAddress =
                        address;

                } else {

                    element.textContent =
                        "Contract Address";

                }

            });


        // 完整地址
        document
            .querySelectorAll("[data-contract-full]")
            .forEach(function (element) {

                if (isTokenConfigured()) {

                    element.textContent =
                        address;

                }

            });

    }


    // ========================================
    // 导航栏
    // ========================================

    function initNavigation() {

        const links =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    const targetId =
                        link.getAttribute("href");

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


                    const header =
                        document.querySelector(
                            ".site-header"
                        );


                    let offset = 20;


                    if (header) {

                        offset =
                            header.offsetHeight + 15;

                    }


                    const position =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        offset;


                    window.scrollTo({

                        top: position,

                        behavior: "smooth"

                    });


                    // 手机菜单点击后自动关闭
                    closeMobileMenu();

                });

        });

    }


    // ========================================
    // 手机菜单
    // ========================================

    function initMobileMenu() {

        const menuButton =
            document.querySelector(
                "[data-menu-toggle]"
            );

        const menu =
            document.querySelector(
                "[data-mobile-menu]"
            );


        if (!menuButton || !menu) {

            return;

        }


        menuButton.addEventListener(
            "click",
            function () {

                const opened =
                    menu.classList.toggle(
                        "is-open"
                    );


                menuButton.classList.toggle(
                    "is-active",
                    opened
                );


                menuButton.setAttribute(
                    "aria-expanded",
                    opened
                );

            }
        );

    }


    function closeMobileMenu() {

        const menu =
            document.querySelector(
                "[data-mobile-menu]"
            );

        const menuButton =
            document.querySelector(
                "[data-menu-toggle]"
            );


        if (!menu) {

            return;

        }


        menu.classList.remove(
            "is-open"
        );


        if (menuButton) {

            menuButton.classList.remove(
                "is-active"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    // ========================================
    // 复制合约地址
    // ========================================

    function initCopyButtons() {

        document
            .querySelectorAll("[data-copy-address]")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        copyContractAddress(
                            button
                        );

                    }
                );

            });


        // 通用复制按钮
        document
            .querySelectorAll("[data-copy]")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const value =
                            button.dataset.copy;

                        if (!value) {

                            return;

                        }

                        copyText(
                            value,
                            button
                        );

                    }
                );

            });

    }


    async function copyContractAddress(button) {

        if (!isTokenConfigured()) {

            showToast(
                "Please configure the contract address first."
            );

            return;

        }


        const address =
            getTokenAddress();


        await copyText(
            address,
            button
        );

    }


    async function copyText(text, button) {

        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    text
                );

            } else {

                fallbackCopy(text);

            }


            setCopySuccess(button);

            showToast(
                "Copied successfully!"
            );

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

            showToast(
                "Copy failed. Please copy manually."
            );

        }

    }


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

        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();

    }


    function setCopySuccess(button) {

        if (!button) {

            return;

        }


        const originalText =
            button.dataset.originalText ||
            button.textContent;


        button.dataset.originalText =
            originalText;


        button.classList.add(
            "copied"
        );


        button.textContent =
            "Copied";


        setTimeout(
            function () {

                button.classList.remove(
                    "copied"
                );

                button.textContent =
                    originalText;

            },
            CHILI_CONFIG.ui.copySuccessDuration
        );

    }


    // ========================================
    // Wallet
    // ========================================

    function initWalletButtons() {

        document
            .querySelectorAll(
                "[data-connect-wallet]"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        connectWallet(
                            button
                        );

                    }
                );

            });

    }


    async function connectWallet(button) {

        if (!window.ethereum) {

            showToast(
                "Please install MetaMask or another Web3 wallet."
            );

            return;

        }


        try {

            const accounts =
                await window.ethereum.request({

                    method:
                        "eth_requestAccounts"

                });


            if (
                !accounts ||
                !accounts.length
            ) {

                return;

            }


            const account =
                accounts[0];


            // 检查 BNB Chain
            const chainId =
                await window.ethereum.request({

                    method:
                        "eth_chainId"

                });


            if (
                chainId.toLowerCase() !==
                CHILI_CONFIG.network.chainId.toLowerCase()
            ) {

                await switchToBNBChain();

            }


            updateWalletUI(
                account
            );


            showToast(
                "Wallet connected."
            );


        } catch (error) {

            console.error(
                "Wallet connection failed:",
                error
            );


            if (
                error.code === 4001
            ) {

                showToast(
                    "Wallet connection cancelled."
                );

            } else {

                showToast(
                    "Unable to connect wallet."
                );

            }

        }

    }


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

            // BNB Chain 不存在时添加网络
            if (
                error.code === 4902
            ) {

                await window.ethereum.request({

                    method:
                        "wallet_addEthereumChain",

                    params: [
                        CHILI_CONFIG.network
                    ]

                });

            } else {

                throw error;

            }

        }

    }


    function updateWalletUI(account) {

        const short =
            shortenAddress(
                account
            );


        document
            .querySelectorAll(
                "[data-wallet-address]"
            )
            .forEach(function (element) {

                element.textContent =
                    short;

            });


        document
            .querySelectorAll(
                "[data-connect-wallet]"
            )
            .forEach(function (button) {

                button.textContent =
                    short;

                button.classList.add(
                    "connected"
                );

            });


        document.body.classList.add(
            "wallet-connected"
        );


        window.CHILI_WALLET =
            account;

    }


    // ========================================
    // 外部链接
    // ========================================

    function initExternalLinks() {

        // BscScan
        document
            .querySelectorAll(
                "[data-contract-link]"
            )
            .forEach(function (link) {

                link.href =
                    getExplorerUrl();

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            });


        // PancakeSwap
        document
            .querySelectorAll(
                "[data-swap-link]"
            )
            .forEach(function (link) {

                link.href =
                    getSwapUrl();

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            });


        // Telegram
        document
            .querySelectorAll(
                "[data-telegram-link]"
            )
            .forEach(function (link) {

                link.href =
                    CHILI_CONFIG.social.telegram;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            });


        // Twitter / X
        document
            .querySelectorAll(
                "[data-twitter-link]"
            )
            .forEach(function (link) {

                link.href =
                    CHILI_CONFIG.social.twitter;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            });


        // GitHub
        document
            .querySelectorAll(
                "[data-github-link]"
            )
            .forEach(function (link) {

                link.href =
                    CHILI_CONFIG.social.github;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

            });

    }


    // ========================================
    // 滚动效果
    // ========================================

    function initScrollEffects() {

        const header =
            document.querySelector(
                ".site-header"
            );


        if (!header) {

            return;

        }


        window.addEventListener(
            "scroll",
            function () {

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

            },
            {
                passive: true
            }
        );

    }


    // ========================================
    // Back To Top
    // ========================================

    function initBackToTop() {

        const button =
            document.querySelector(
                "[data-back-to-top]"
            );


        if (!button) {

            return;

        }


        window.addEventListener(
            "scroll",
            function () {

                if (
                    window.scrollY > 500
                ) {

                    button.classList.add(
                        "show"
                    );

                } else {

                    button.classList.remove(
                        "show"
                    );

                }

            },
            {
                passive: true
            }
        );


        button.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    // ========================================
    // Footer 年份
    // ========================================

    function initYear() {

        const year =
            new Date().getFullYear();


        document
            .querySelectorAll(
                "[data-current-year]"
            )
            .forEach(function (element) {

                element.textContent =
                    year;

            });

    }


    // ========================================
    // Toast
    // ========================================

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


        clearTimeout(
            toast._timer
        );


        toast._timer =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                2500
            );

    }


    // ========================================
    // 钱包监听
    // ========================================

    if (window.ethereum) {

        window.ethereum.on(
            "accountsChanged",
            function (accounts) {

                if (
                    accounts &&
                    accounts.length
                ) {

                    updateWalletUI(
                        accounts[0]
                    );

                } else {

                    document.body.classList.remove(
                        "wallet-connected"
                    );

                }

            }
        );


        window.ethereum.on(
            "chainChanged",
            function () {

                window.location.reload();

            }
        );

    }


    // ========================================
    // 暴露给其他 JS 文件
    // ========================================

    window.CHILI_APP = {

        connectWallet:
            connectWallet,

        copyContractAddress:
            copyContractAddress,

        copyText:
            copyText,

        showToast:
            showToast,

        shortenAddress:
            shortenAddress,

        switchToBNBChain:
            switchToBNBChain

    };


})();
