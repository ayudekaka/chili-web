// ========================================
// CHILI Web3 Website - Global Configuration
// ========================================

const CHILI_CONFIG = {

    // ----------------------------------------
    // 项目基本信息
    // ----------------------------------------
    project: {
        name: "CHILI",
        symbol: "CHILI",
        description: "CHILI — A community-driven token on BNB Chain.",
        chainName: "BNB Chain",
        chainId: 56,
        chainIdHex: "0x38"
    },


    // ----------------------------------------
    // CHILI Token 合约
    // ----------------------------------------
    token: {

        // ⚠️ 把这里替换成你的 CHILI 实际合约地址
        address: "YOUR_CHILI_CONTRACT_ADDRESS",

        symbol: "CHILI",

        decimals: 18,

        // BscScan Token 页面
        explorer: "https://bscscan.com/token/YOUR_CHILI_CONTRACT_ADDRESS",

        // BscScan 合约页面
        contractExplorer:
            "https://bscscan.com/address/YOUR_CHILI_CONTRACT_ADDRESS#code"
    },


    // ----------------------------------------
    // BNB Chain RPC
    // ----------------------------------------
    network: {

        chainId: "0x38",

        chainName: "BNB Smart Chain",

        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
        },

        rpcUrls: [
            "https://bsc-dataseed.binance.org/"
        ],

        blockExplorerUrls: [
            "https://bscscan.com/"
        ]
    },


    // ----------------------------------------
    // DEX
    // ----------------------------------------
    dex: {

        name: "PancakeSwap",

        // CHILI / USDT
        pair: "CHILI / USDT",

        // ⚠️ 如果你已经有实际 PancakeSwap 交易链接，
        // 可以把这里替换成实际链接
        swapUrl:
            "https://pancakeswap.finance/swap?outputCurrency=YOUR_CHILI_CONTRACT_ADDRESS"
    },


    // ----------------------------------------
    // 社区
    // ----------------------------------------
    social: {

        telegram: "#",

        twitter: "#",

        github: "https://github.com/ayudekaka/chili-web"
    },


    // ----------------------------------------
    // 网站 Logo
    // ----------------------------------------
    assets: {

        logo: "assets/logo-TOU.png",

        favicon: "assets/logo-TOU.png"
    },


    // ----------------------------------------
    // 网站设置
    // ----------------------------------------
    site: {

        title: "CHILI | Community Driven Token",

        description:
            "CHILI is a community-driven token built on BNB Chain.",

        themeColor: "#e53935"
    },


    // ----------------------------------------
    // UI 设置
    // ----------------------------------------
    ui: {

        // 合约地址显示长度
        addressStartLength: 6,

        addressEndLength: 4,

        // 复制成功后显示时间
        copySuccessDuration: 1800
    }
};


// ========================================
// 工具函数
// ========================================

/**
 * 获取 CHILI 合约地址
 */
function getTokenAddress() {
    return CHILI_CONFIG.token.address;
}


/**
 * 获取 BscScan 合约地址
 */
function getExplorerUrl() {
    return CHILI_CONFIG.token.contractExplorer;
}


/**
 * 获取 PancakeSwap 地址
 */
function getSwapUrl() {
    return CHILI_CONFIG.dex.swapUrl;
}


/**
 * 缩短钱包/合约地址
 */
function shortenAddress(address) {

    if (!address) {
        return "";
    }

    const start = CHILI_CONFIG.ui.addressStartLength;
    const end = CHILI_CONFIG.ui.addressEndLength;

    if (address.length <= start + end) {
        return address;
    }

    return (
        address.substring(0, start) +
        "..." +
        address.substring(address.length - end)
    );
}


/**
 * 判断是否已经配置真实合约地址
 */
function isTokenConfigured() {

    const address = CHILI_CONFIG.token.address;

    if (!address) {
        return false;
    }

    if (
        address === "YOUR_CHILI_CONTRACT_ADDRESS" ||
        address.includes("YOUR_")
    ) {
        return false;
    }

    return /^0x[a-fA-F0-9]{40}$/.test(address);
}


/**
 * 获取当前网络 Chain ID
 */
function getChainId() {
    return CHILI_CONFIG.network.chainId;
}


/**
 * 获取当前网络名称
 */
function getNetworkName() {
    return CHILI_CONFIG.network.chainName;
}
