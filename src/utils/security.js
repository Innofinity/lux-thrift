/**
 * Security Utilities for LuxThrift
 * Implements various security measures to protect against common web attacks
 */

// Content Security Policy Headers (to be implemented in production backend)
export const CSP_DIRECTIVES = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'"], // Remove unsafe-inline in production
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https:", "blob:"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": ["'self'"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"]
};

// XSS Protection - Sanitize user inputs
export const sanitizeHTML = (str) => {
    if (typeof str !== 'string') return str;

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };

    return str.replace(/[&<>"'/]/g, (char) => map[char]);
};

// SQL Injection Protection (for when backend is implemented)
export const sanitizeSQL = (input) => {
    if (typeof input !== 'string') return input;

    // Remove SQL keywords and special characters
    return input
        .replace(/('|(--)|;|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter|union|script)/gi, '')
        .trim();
};

// Validate and sanitize URLs
export const sanitizeURL = (url) => {
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return '';
        }
        return parsed.href;
    } catch {
        return '';
    }
};

// Rate Limiting (client-side)
class RateLimiter {
    constructor(maxAttempts = 5, windowMs = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = new Map();
    }

    isAllowed(key) {
        const now = Date.now();
        const userAttempts = this.attempts.get(key) || [];

        // Remove old attempts outside the time window
        const recentAttempts = userAttempts.filter(time => now - time < this.windowMs);

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);
        return true;
    }

    reset(key) {
        this.attempts.delete(key);
    }
}

export const loginRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes
export const otpRateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

// CSRF Token Generation (for forms)
export const generateCSRFToken = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSRF Token
export const validateCSRFToken = (token, storedToken) => {
    return token === storedToken;
};

// Password Strength Validator
export const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = {
        isValid: password.length >= minLength,
        score: 0,
        feedback: []
    };

    if (password.length < minLength) {
        strength.feedback.push(`Password must be at least ${minLength} characters`);
    } else {
        strength.score += 25;
    }

    if (hasUpperCase) strength.score += 25;
    else strength.feedback.push('Add uppercase letters');

    if (hasLowerCase) strength.score += 25;
    else strength.feedback.push('Add lowercase letters');

    if (hasNumbers) strength.score += 15;
    else strength.feedback.push('Add numbers');

    if (hasSpecialChar) strength.score += 10;
    else strength.feedback.push('Add special characters');

    return strength;
};

// Secure Session Storage
export const secureStorage = {
    set: (key, value) => {
        try {
            const encrypted = btoa(JSON.stringify(value)); // Basic encoding, use proper encryption in production
            localStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('Storage error:', e);
        }
    },

    get: (key) => {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            return JSON.parse(atob(encrypted));
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Prevent Clickjacking
export const preventClickjacking = () => {
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
};

// Input Validation Patterns
export const VALIDATION_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[+]?[\d\s-()]{10,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    alphanumericWithSpaces: /^[a-zA-Z0-9\s]+$/,
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Validate input against pattern
export const validateInput = (input, pattern) => {
    return VALIDATION_PATTERNS[pattern]?.test(input) || false;
};

// Audit Log (for tracking security events)
export const auditLog = {
    log: (event, details) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // In production, send to backend
        console.log('[AUDIT]', logEntry);

        // Store locally for demo
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);
        // Keep only last 100 logs
        if (logs.length > 100) logs.shift();
        localStorage.setItem('security_logs', JSON.stringify(logs));
    }
};

// Initialize security measures
export const initSecurity = () => {
    // Prevent clickjacking
    preventClickjacking();

    // Log page load
    auditLog.log('PAGE_LOAD', { path: window.location.pathname });

    // Disable right-click in production (optional)
    // document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable F12 and other dev tools shortcuts (optional, for extra security)
    // document.addEventListener('keydown', (e) => {
    //     if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
    //         e.preventDefault();
    //     }
    // });
};

export default {
    sanitizeHTML,
    sanitizeSQL,
    sanitizeURL,
    loginRateLimiter,
    otpRateLimiter,
    generateCSRFToken,
    validateCSRFToken,
    validatePasswordStrength,
    secureStorage,
    preventClickjacking,
    validateInput,
    VALIDATION_PATTERNS,
    auditLog,
    initSecurity
};
