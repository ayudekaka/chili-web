/**
 * ============================================================
 * CHILI WEB — Utility Functions
 * ============================================================
 * Reusable helpers for addresses, formatting, validation, etc.
 * Pure functions with no side effects.
 */

/**
 * Address Utilities
 */
class AddressUtils {
  static isValid(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(String(address || ""));
  }

  static normalize(address) {
    return String(address || "").trim().toLowerCase();
  }

  static shorten(address, startLen = 6, endLen = 4) {
    if (!address || address.length <= startLen + endLen) {
      return address || "—";
    }
    return `${address.substring(0, startLen)}...${address.substring(
      address.length - endLen
    )}`;
  }

  static getShortenedFromConfig(address) {
    const start = CONFIG.ui.addressStartLength;
    const end = CONFIG.ui.addressEndLength;
    return this.shorten(address, start, end);
  }
}

/**
 * Number Formatting Utilities
 */
class FormatUtils {
  static price(value, minFrac = 2, maxFrac = 4) {
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) return "—";

    if (num >= 1) {
      return (
        "$" +
        num.toLocaleString("en-US", {
          minimumFractionDigits: minFrac,
          maximumFractionDigits: maxFrac,
        })
      );
    }
    if (num >= 0.01) return "$" + num.toFixed(6);
    return "$" + num.toFixed(10);
  }

  static usd(value, maxFrac = 2) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "—";
    if (num === 0) return "$0";
    if (Math.abs(num) < 0.01) return "$" + num.toFixed(8);
    return (
      "$" +
      num.toLocaleString("en-US", { maximumFractionDigits: maxFrac })
    );
  }

  static number(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num.toLocaleString("en-US") : "—";
  }

  static tokenAmount(raw, decimals) {
    try {
      const value = BigInt(raw);
      const decimalCount = Number(decimals);

      if (decimalCount <= 0) {
        return value.toLocaleString("en-US");
      }

      const base = 10n ** BigInt(decimalCount);
      const whole = value / base;
      const fraction = value % base;

      if (fraction === 0n) {
        return whole.toLocaleString("en-US");
      }

      const fractionText = fraction
        .toString()
        .padStart(decimalCount, "0")
        .replace(/0+$/, "");

      return (
        whole.toLocaleString("en-US") +
        "." +
        fractionText
      );
    } catch (error) {
      console.warn("Token amount format error:", error);
      return "—";
    }
  }

  static time(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return "—";
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  static capitalize(value) {
    const text = String(value || "");
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  }
}

/**
 * DOM Manipulation Utilities
 */
class DOMUtils {
  static setText(idOrElement, value) {
    const element =
      typeof idOrElement === "string"
        ? document.getElementById(idOrElement)
        : idOrElement;

    if (!element) return;

    if (value === undefined || value === null || value === "") {
      element.textContent = "—";
      return;
    }

    element.textContent = String(value);
  }

  static setAttr(idOrElement, attr, value) {
    const element =
      typeof idOrElement === "string"
        ? document.getElementById(idOrElement)
        : idOrElement;

    if (!element) return;
    if (value === null) {
      element.removeAttribute(attr);
    } else {
      element.setAttribute(attr, String(value));
    }
  }

  static setLink(idOrElement, url) {
    const element =
      typeof idOrElement === "string"
        ? document.getElementById(idOrElement)
        : idOrElement;

    if (!element || !url) return;

    element.href = url;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }

  static toggleClass(element, className, force) {
    if (typeof element === "string") {
      element = document.getElementById(element);
    }
    if (element) {
      element.classList.toggle(className, force);
    }
  }

  static query(selector) {
    return document.querySelector(selector);
  }

  static queryAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  }
}

/**
 * Event & Async Utilities
 */
class AsyncUtils {
  static async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timer);
    }
  }

  static async retry(fn, maxAttempts = 3, delayMs = 1000) {
    let lastError;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < maxAttempts - 1) {
          await this.delay(delayMs);
        }
      }
    }
    throw lastError;
  }
}

/**
 * Copy to Clipboard Utility
 */
class ClipboardUtils {
  static async copy(text) {
    if (!text) return false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const result = document.execCommand("copy");
      textarea.remove();
      return result;
    } catch (error) {
      console.warn("Clipboard copy failed:", error);
      return false;
    }
  }
}

/**
 * Storage Utility
 */
class StorageUtils {
  static set(key, value, namespace = "chili") {
    try {
      const fullKey = `${namespace}-${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Storage set error:", error);
      return false;
    }
  }

  static get(key, defaultValue = null, namespace = "chili") {
    try {
      const fullKey = `${namespace}-${key}`;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn("Storage get error:", error);
      return defaultValue;
    }
  }

  static remove(key, namespace = "chili") {
    try {
      const fullKey = `${namespace}-${key}`;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.warn("Storage remove error:", error);
      return false;
    }
  }

  static clear(namespace = "chili") {
    try {
      const prefix = `${namespace}-`;
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith(prefix)
      );
      keys.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (error) {
      console.warn("Storage clear error:", error);
      return false;
    }
  }
}

/**
 * Validation Utilities
 */
class ValidationUtils {
  static isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isHexString(value) {
    return /^0x[a-fA-F0-9]*$/.test(value);
  }

  static isNumber(value) {
    return !isNaN(value) && isFinite(value);
  }
}

/**
 * Export utilities as namespace
 */
const Utils = {
  Address: AddressUtils,
  Format: FormatUtils,
  DOM: DOMUtils,
  Async: AsyncUtils,
  Clipboard: ClipboardUtils,
  Storage: StorageUtils,
  Validation: ValidationUtils,
};
