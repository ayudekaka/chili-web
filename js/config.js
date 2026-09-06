// ========================================
// CHILI Web3 Website - Global Configuration
// ========================================

const CHILI_CONFIG = {

    project: {
        name: "CHILI",
        symbol: "CHILI",
        description: "CHILI — A community-driven token on BNB Chain.",
        chainName: "BNB Chain",
        chainId: 56,
        chainIdHex: "0x38"
    },

    token: {
        // 填入真实地址，避免页面显示占位符
        address: "0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",
        symbol: "CHILI",
        decimals: 18,
        explorer: "https://bscscan.com/token/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",
        contractExplorer: "https://bscscan.com/address/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c#code"
    },

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

    dex: {
        name: "PancakeSwap",
        pair: "CHILI / USDT",
        swapUrl: "https://pancakeswap.finance/swap?outputCurrency=0xed3caca4903256fb3e4997bc0c7830d19fb35f7c"
    },

    social: {
        telegram: "#",
        twitter: "#",
        github: "https://github.com/ayudekaka/chili-web"
    },

    assets: {
        // 修改为根目录路径
        logo: "logo-TOU.png",
        favicon: "logo-TOU.png"
    },

    site: {
        title: "CHILI | Community Driven Token",
        description: "CHILI is a community-driven token built on BNB Chain.",
        themeColor: "#e53935"
    },

    ui: {
        addressStartLength: 6,
        addressEndLength: 4,
        copySuccessDuration: 1800
    }
};

function getTokenAddress() { return CHILI_CONFIG.token.address; }
function getExplorerUrl() { return CHILI_CONFIG.token.contractExplorer; }
function getSwapUrl() { return CHILI_CONFIG.dex.swapUrl; }
function shortenAddress(address) {
    if (!address) return "";
    const start = CHILI_CONFIG.ui.addressStartLength;
    const end = CHILI_CONFIG.ui.addressEndLength;
    if (address.length <= start + end) return address;
    return address.substring(0, start) + "..." + address.substring(address.length - end);
}
function isTokenConfigured() {
    const address = CHILI_CONFIG.token.address;
    if (!address) return false;
    if (address === "YOUR_CHILI_CONTRACT_ADDRESS" || address.includes("YOUR_")) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
function getChainId() { return CHILI_CONFIG.network.chainId; }
function getNetworkName() { return CHILI_CONFIG.network.chainName; }
