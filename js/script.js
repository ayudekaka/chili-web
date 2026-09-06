/* =========================================================
   CONFIG
========================================================= */

const CHILI_ADDRESS = "0xed3caca4903256fb3e4997bc0c7830d19fb35f7c";
const DEX_API = `https://api.dexscreener.com/token-pairs/v1/bsc/${CHILI_ADDRESS}`;
const RPC_LIST = [
  "https://bsc-dataseed.binance.org/",
  "https://bsc-dataseed1.binance.org/",
  "https://bsc-dataseed2.binance.org/",
  "https://bsc-dataseed3.binance.org/",
  "https://bsc-dataseed1.defibit.io/",
  "https://bsc-dataseed1.ninicoin.io/"
];

let currentLang = "en";
let lastPair = null;
let reconnectTimer = null;


/* =========================================================
   TRANSLATION ENGINE
========================================================= */

function applyLanguage() {
  const dict = translations[currentLang];

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = dict["page-title"];
  document.querySelector('meta[name="description"]')
    .setAttribute("content", dict["page-description"]);

  document.getElementById("langBtn").textContent = currentLang === "en" ? "中文" : "EN";
  updateStatus(lastPair ? "live" : "sync");
}


/* =========================================================
   LANGUAGE BUTTON
========================================================= */

document.getElementById("langBtn").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "zh" : "en";
  applyLanguage();
});


/* =========================================================
   MOBILE NAV
========================================================= */

const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");

mobileToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});


/* =========================================================
   ACTIVE NAV
========================================================= */

const sections = ["market", "about", "tokenomics", "story", "security", "contract"];
const navItems = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        item.classList.toggle("active", item.dataset.section === entry.target.id);
      });
    }
  });
}, {
  threshold: .25,
  rootMargin: "-90px 0px -45% 0px"
});

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});


/* =========================================================
   COPY
========================================================= */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast();
}

function showToast() {
  const toast = document.getElementById("toast");
  const text = translations[currentLang]["copied"];
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

document.getElementById("copyHero").addEventListener("click", () => copyText(CHILI_ADDRESS));
document.getElementById("copyContract").addEventListener("click", () => copyText(CHILI_ADDRESS));


/* =========================================================
   NUMBER FORMAT
========================================================= */

function money(value) {
  if (value === null || value === undefined || !isFinite(value)) return "—";
  if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return "$" + (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return "$" + (value / 1e3).toFixed(2) + "K";
  if (value >= 1) return "$" + value.toFixed(2);
  if (value >= 0.01) return "$" + value.toFixed(4);
  if (value >= 0.000001) return "$" + value.toFixed(8);
  return "$" + value.toExponential(4);
}

function integer(value) {
  if (value === null || value === undefined) return "—";
  return Number(value).toLocaleString("en-US");
}

function supplyFormat(value) {
  if (value === null || value === undefined || !isFinite(value)) return "—";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(2) + "K";
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
}


/* =========================================================
   MARKET STATUS
========================================================= */

function updateStatus(state) {
  const box = document.getElementById("marketStatus");
  const text = document.getElementById("marketStatusText");
  const dict = translations[currentLang];
  box.className = "market-status status-" + state;
  const map = {
    live: dict["terminal-live"],
    offline: dict["terminal-offline"],
    reconnecting: dict["terminal-reconnecting"],
    sync: dict["terminal-sync"]
  };
  text.textContent = map[state] || map.sync;

  const coreStatus = document.getElementById("coreStatus");
  if (coreStatus) {
    coreStatus.textContent = state === "live"
      ? dict["core-online"]
      : state === "offline"
        ? dict["terminal-offline"]
        : dict["terminal-sync"];
  }
}


/* =========================================================
   DEXSCREENER
========================================================= */

async function loadMarket() {
  updateStatus(lastPair ? "reconnecting" : "sync");
  try {
    const response = await fetch(DEX_API, { cache: "no-store" });
    if (!response.ok) throw new Error("DexScreener HTTP " + response.status);
    const data = await response.json();
    const pairs = Array.isArray(data) ? data : [];
    if (!pairs.length) throw new Error("No pair data");

    const preferredQuotes = ["USDT", "USDC", "BUSD", "WBNB", "BNB"];
    pairs.sort((a, b) => {
      const aq = preferredQuotes.indexOf(String(a?.quoteToken?.symbol || "").toUpperCase());
      const bq = preferredQuotes.indexOf(String(b?.quoteToken?.symbol || "").toUpperCase());
      const ar = Number(a?.liquidity?.usd || 0);
      const br = Number(b?.liquidity?.usd || 0);
      return (aq < 0 ? 99 : aq) - (bq < 0 ? 99 : bq) || (br - ar);
    });

    const pair = pairs[0];
    lastPair = pair;

    const price = Number(pair.priceUsd);
    const liquidity = Number(pair.liquidity?.usd);
    const volume = Number(pair.volume?.h24);
    const marketCap = Number(pair.marketCap ?? pair.fdv);
    const txns = Number(pair.txns?.h24?.buys || 0) + Number(pair.txns?.h24?.sells || 0);
    const buys = Number(pair.txns?.h24?.buys || 0);
    const sells = Number(pair.txns?.h24?.sells || 0);

    document.getElementById("price").textContent = isFinite(price) ? money(price) : "—";
    document.getElementById("pair").textContent = pair.baseToken?.symbol && pair.quoteToken?.symbol
      ? `${pair.baseToken.symbol} / ${pair.quoteToken.symbol}`
      : "—";
    document.getElementById("dex").textContent = pair.dexId || "—";
    document.getElementById("liquidity").textContent = money(liquidity);
    document.getElementById("volume").textContent = money(volume);
    document.getElementById("marketCap").textContent = money(marketCap);
    document.getElementById("txns").textContent = integer(txns);
    document.getElementById("buys").textContent = integer(buys);
    document.getElementById("sells").textContent = integer(sells);
    document.getElementById("pairAddress").textContent = pair.pairAddress || "—";
    document.getElementById("lastUpdate").textContent = new Date().toLocaleTimeString();

    updateStatus("live");
  } catch (error) {
    console.warn("Market sync failed:", error);
    updateStatus("offline");
  }
}


/* =========================================================
   BSC RPC
========================================================= */

async function rpcCall(method, params = []) {
  let lastError = null;
  for (const rpc of RPC_LIST) {
    try {
      const response = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        cache: "no-store"
      });
      if (!response.ok) throw new Error("RPC HTTP " + response.status);
      const json = await response.json();
      if (json.error) throw new Error(json.error.message || "RPC error");
      return json.result;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("RPC unavailable");
}


/* =========================================================
   BLOCK
========================================================= */

async function loadBlock() {
  try {
    const hex = await rpcCall("eth_blockNumber", []);
    const block = parseInt(hex, 16);
    document.getElementById("block").textContent = integer(block);
  } catch (error) {
    console.warn("Block sync failed:", error);
  }
}


/* =========================================================
   ERC20 CALL HELPERS
========================================================= */

function padAddress(address) {
  return address.replace(/^0x/, "").toLowerCase().padStart(64, "0");
}

async function erc20Call(data) {
  return rpcCall("eth_call", [{
    to: CHILI_ADDRESS,
    data
  }, "latest"]);
}


async function loadTokenMetadata() {
  try {
    // symbol()
    const symbolHex = await erc20Call("0x95d89b41");
    let symbol = "CHILI";
    try {
      const bytes = symbolHex.startsWith("0x") ? symbolHex.slice(2) : symbolHex;
      if (bytes.length >= 128) {
        const offset = parseInt(bytes.slice(0, 64), 16);
        const length = parseInt(bytes.slice(64, 128), 16);
        const hex = bytes.slice(128, 128 + length * 2);
        symbol = decodeURIComponent(hex.replace(/(..)/g, "%$1")) || "CHILI";
      }
    } catch { symbol = "CHILI"; }

    // decimals()
    const decimalsHex = await erc20Call("0x313ce567");
    const decimals = parseInt(decimalsHex, 16);

    // totalSupply()
    const supplyHex = await erc20Call("0x18160ddd");
    const rawSupply = BigInt(supplyHex);
    const divisor = 10n ** BigInt(decimals);
    const whole = rawSupply / divisor;
    const remainder = rawSupply % divisor;
    const supplyNumber = Number(whole.toString()) + Number(remainder.toString()) / Number(divisor.toString());

    document.getElementById("tokenSymbol").textContent = symbol;
    document.getElementById("reactorSymbol").textContent = symbol;
    document.getElementById("coreToken").textContent = symbol;
    document.getElementById("tokenDecimals").textContent = decimals;
    document.getElementById("tokenSupply").textContent = supplyFormat(supplyNumber);
    document.getElementById("supplyCenter").textContent = supplyFormat(supplyNumber);
  } catch (error) {
    console.warn("Token metadata sync failed:", error);
  }
}


/* =========================================================
   INITIAL LOAD
========================================================= */

async function initialLoad() {
  applyLanguage();
  await Promise.all([
    loadMarket(),
    loadBlock(),
    loadTokenMetadata()
  ]);
}

initialLoad();


/* =========================================================
   REFRESH
========================================================= */

setInterval(loadMarket, 15000);
setInterval(loadBlock, 15000);
setInterval(loadTokenMetadata, 120000);
