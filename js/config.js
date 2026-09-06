// ======================================================
// CHILI WEB3 WEBSITE
// Global Configuration
// ======================================================

const CHILI_CONFIG = {

    // --------------------------------------------------
    // PROJECT
    // --------------------------------------------------

    project: {

        name: "CHILI",

        symbol: "CHILI",

        description:
            "CHILI — A community-driven token on BNB Smart Chain.",

        chainName:
            "BNB Smart Chain",

        chainId:
            56,

        chainIdHex:
            "0x38"

    },


    // --------------------------------------------------
    // TOKEN
    // --------------------------------------------------

    token: {

        address:
            "0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",

        symbol:
            "CHILI",

        decimals:
            18,

        explorer:
            "https://bscscan.com/token/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",

        contractExplorer:
            "https://bscscan.com/address/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c#code"

    },


    // --------------------------------------------------
    // NETWORK
    // --------------------------------------------------

    network: {

        chainId:
            "0x38",

        chainName:
            "BNB Smart Chain",

        nativeCurrency: {

            name:
                "BNB",

            symbol:
                "BNB",

            decimals:
                18

        },

        rpcUrls: [

            "https://bsc-dataseed.binance.org/"

        ],

        blockExplorerUrls: [

            "https://bscscan.com/"

        ]

    },


    // --------------------------------------------------
    // DEX
    // --------------------------------------------------

    dex: {

        name:
            "PancakeSwap",

        pair:
            "CHILI / USDT",

        swapUrl:
            "https://pancakeswap.finance/swap?outputCurrency=0xed3caca4903256fb3e4997bc0c7830d19fb35f7c",

        dexScreenerUrl:
            "https://dexscreener.com/bsc/0xed3caca4903256fb3e4997bc0c7830d19fb35f7c"

    },


    // --------------------------------------------------
    // SOCIAL
    // --------------------------------------------------

    social: {

        telegram:
            "#",

        twitter:
            "#",

        github:
            "https://github.com/ayudekaka/chili-web"

    },


    // --------------------------------------------------
    // ASSETS
    // --------------------------------------------------

    assets: {

        logo:
            "assets/logo-TOU.png",

        favicon:
            "assets/logo-TOU.png"

    },


    // --------------------------------------------------
    // WEBSITE
    // --------------------------------------------------

    site: {

        title:
            "CHILI | Community Driven Token",

        description:
            "CHILI is a community-driven token built on BNB Smart Chain.",

        themeColor:
            "#ef2637"

    },


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    ui: {

        addressStartLength:
            6,

        addressEndLength:
            4,

        copySuccessDuration:
            1800,

        toastDuration:
            2500

    }

};


// ======================================================
// HELPERS
// ======================================================

function getTokenAddress() {

    return CHILI_CONFIG.token.address;

}


function getExplorerUrl() {

    return CHILI_CONFIG.token.contractExplorer;

}


function getSwapUrl() {

    return CHILI_CONFIG.dex.swapUrl;

}


function getDexScreenerUrl() {

    return CHILI_CONFIG.dex.dexScreenerUrl;

}


function shortenAddress(address) {

    if (!address) {
        return "";
    }

    const start =
        CHILI_CONFIG.ui.addressStartLength;

    const end =
        CHILI_CONFIG.ui.addressEndLength;

    if (address.length <= start + end) {
        return address;
    }

    return (
        address.substring(0, start) +
        "..." +
        address.substring(address.length - end)
    );

}


function isTokenConfigured() {

    const address =
        CHILI_CONFIG.token.address;

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


function getChainId() {

    return CHILI_CONFIG.network.chainId;

}


function getNetworkName() {

    return CHILI_CONFIG.network.chainName;

}
