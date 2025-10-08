import { ERROR_MESSAGES, STORAGE_KEYS, VALIDATION } from "./constants";

// Local Storage Utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },
};

// OAuth Utilities
export const oauth = {
  generateCodeVerifier: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  },

  generateCodeChallenge: async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(
      String.fromCharCode.apply(null, Array.from(new Uint8Array(digest)))
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  },

  generateState: () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  },

  saveOAuthData: (state, codeVerifier) => {
    storage.set(STORAGE_KEYS.OAUTH_STATE, state);
    storage.set(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
  },

  getOAuthData: () => {
    return {
      state: storage.get(STORAGE_KEYS.OAUTH_STATE),
      codeVerifier: storage.get(STORAGE_KEYS.CODE_VERIFIER),
    };
  },

  clearOAuthData: () => {
    storage.remove(STORAGE_KEYS.OAUTH_STATE);
    storage.remove(STORAGE_KEYS.CODE_VERIFIER);
  },
};

// Form Validation Utilities
export const validation = {
  required: (value) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return VALIDATION.REQUIRED_FIELD;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : VALIDATION.INVALID_EMAIL;
  },

  number: (value) => {
    if (!value) return null;
    return !isNaN(parseFloat(value)) && isFinite(value)
      ? null
      : VALIDATION.INVALID_NUMBER;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : VALIDATION.MIN_LENGTH(min);
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : VALIDATION.MAX_LENGTH(max);
  },

  minValue: (min) => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    return !isNaN(num) && num >= min ? null : VALIDATION.MIN_VALUE(min);
  },

  maxValue: (max) => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    return !isNaN(num) && num <= max ? null : VALIDATION.MAX_VALUE(max);
  },

  validateForm: (data, rules) => {
    const errors = {};
    for (const [field, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules) {
        const error = rule(data[field]);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for each field
        }
      }
    }
    return Object.keys(errors).length === 0 ? null : errors;
  },
};

// API Utilities
export const api = {
  formatResponse: (response, data) => {
    return {
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      data: data,
      timestamp: new Date().toISOString(),
    };
  },

  formatError: (error) => {
    return {
      status: 0,
      statusText: "Network Error",
      success: false,
      error: error.message || ERROR_MESSAGES.NETWORK_ERROR,
      timestamp: new Date().toISOString(),
    };
  },

  isSuccess: (response) => {
    return (
      response &&
      response.success &&
      response.status >= 200 &&
      response.status < 300
    );
  },

  getErrorMessage: (response) => {
    if (response?.data?.message) return response.data.message;
    if (response?.data?.error) return response.data.error;
    if (response?.error) return response.error;
    return ERROR_MESSAGES.SERVER_ERROR;
  },
};

// String Utilities
export const strings = {
  capitalize: (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  truncate: (str, length) => {
    if (!str || str.length <= length) return str;
    return str.substring(0, length) + "...";
  },

  slugify: (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  formatCurrency: (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },

  formatNumber: (number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  },
};

// Date Utilities
export const dates = {
  format: (date, options = {}) => {
    if (!date) return "";
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(new Date(date));
  },

  formatDate: (date) => {
    return dates.format(date, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  formatTime: (date) => {
    return dates.format(date, { hour: "2-digit", minute: "2-digit" });
  },

  formatDateTime: (date) => {
    return dates.format(date);
  },

  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  },

  isYesterday: (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const checkDate = new Date(date);
    return yesterday.toDateString() === checkDate.toDateString();
  },
};

// Array Utilities
export const arrays = {
  unique: (arr) => {
    return [...new Set(arr)];
  },

  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  sortBy: (arr, key, direction = "asc") => {
    return [...arr].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  },

  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
};

// Object Utilities
export const objects = {
  pick: (obj, keys) => {
    const result = {};
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  },

  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },
};

// URL Utilities
export const urls = {
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },

  parseQueryString: (queryString) => {
    const params = {};
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  },
};

// Copy to Clipboard
export const clipboard = {
  copy: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  },
};

// Debounce Utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle Utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
