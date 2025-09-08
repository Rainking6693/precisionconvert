// CRITICAL FIXES IMPLEMENTATION
// Addresses critical issues identified in comprehensive audits

// ============================================================================
// FIX 1: SUBSCRIPTION MANAGER WITH PROPER ERROR HANDLING
// ============================================================================

class SubscriptionManager {
    constructor() {
        this.status = this.loadSubscriptionStatus();
    }
    
    loadSubscriptionStatus() {
        try {
            const stored = localStorage.getItem('subscription_status');
            return stored ? JSON.parse(stored) : this.getDefaultStatus();
        } catch (error) {
            console.warn('Failed to parse subscription status:', error);
            // Clear corrupted data
            localStorage.removeItem('subscription_status');
            return this.getDefaultStatus();
        }
    }
    
    getDefaultStatus() {
        return {
            isPremium: false,
            subscriptionId: null,
            expiresAt: null,
            lastChecked: null
        };
    }
    
    saveSubscriptionStatus(status) {
        try {
            this.status = { ...this.status, ...status };
            localStorage.setItem('subscription_status', JSON.stringify(this.status));
        } catch (error) {
            console.error('Failed to save subscription status:', error);
        }
    }
    
    isPremiumUser() {
        if (!this.status.isPremium) return false;
        
        // Check if subscription is still valid
        if (this.status.expiresAt && new Date() > new Date(this.status.expiresAt)) {
            this.saveSubscriptionStatus({ isPremium: false });
            return false;
        }
        
        return true;
    }
}

// ============================================================================
// FIX 2: EVENT MANAGER WITH CLEANUP SYSTEM
// ============================================================================

class EventManager {
    constructor() {
        this.listeners = [];
        this.isCleanedUp = false;
        
        // Register cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
        window.addEventListener('pagehide', () => this.cleanup());
        
        // Also cleanup on visibility change (for PWA)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.cleanup();
            }
        });
    }
    
    addListener(element, event, handler, options = {}) {
        if (this.isCleanedUp) {
            console.warn('EventManager: Attempting to add listener after cleanup');
            return;
        }
        
        try {
            element.addEventListener(event, handler, options);
            this.listeners.push({ element, event, handler, options });
        } catch (error) {
            console.error('EventManager: Failed to add event listener:', error);
        }
    }
    
    removeListener(element, event, handler) {
        try {
            element.removeEventListener(event, handler);
            this.listeners = this.listeners.filter(listener => 
                !(listener.element === element && 
                  listener.event === event && 
                  listener.handler === handler)
            );
        } catch (error) {
            console.error('EventManager: Failed to remove event listener:', error);
        }
    }
    
    cleanup() {
        if (this.isCleanedUp) return;
        
        console.log('EventManager: Cleaning up event listeners');
        
        this.listeners.forEach(({ element, event, handler }) => {
            try {
                element.removeEventListener(event, handler);
            } catch (error) {
                console.warn('EventManager: Failed to remove listener during cleanup:', error);
            }
        });
        
        this.listeners = [];
        this.isCleanedUp = true;
    }
    
    getListenerCount() {
        return this.listeners.length;
    }
}

// ============================================================================
// FIX 3: ENHANCED INPUT VALIDATOR WITH BETTER ERROR HANDLING
// ============================================================================

class InputValidator {
    static validate(input) {
        try {
            // Sanitize input
            const sanitized = this.sanitizeInput(input);
            
            // Validate format
            if (!this.isValidFormat(sanitized)) {
                throw new Error('Please enter a valid number');
            }
            
            // Validate range
            const number = this.parseNumber(sanitized);
            if (!this.isValidRange(number)) {
                throw new Error('Number is too large or too small');
            }
            
            return number;
        } catch (error) {
            // Re-throw with user-friendly message
            throw new Error(error.message || 'Invalid input');
        }
    }
    
    static sanitizeInput(input) {
        if (typeof input !== 'string') {
            input = String(input);
        }
        
        // Remove common formatting but preserve scientific notation
        return input
            .trim()
            .replace(/[$%,\\s]/g, '') // Remove currency, percent, commas, spaces
            .replace(/[^\\d.eE+-]/g, ''); // Keep only valid number characters
    }
    
    static isValidFormat(input) {
        if (!input || input === '') return false;
        
        // Allow integers, decimals, and scientific notation
        const validPattern = /^-?(\\d+\\.?\\d*|\\.\\d+)([eE][+-]?\\d+)?$/;
        return validPattern.test(input);
    }
    
    static parseNumber(input) {
        const number = parseFloat(input);
        if (!isFinite(number) || isNaN(number)) {
            throw new Error('Invalid number value');
        }
        return number;
    }
    
    static isValidRange(number) {
        // Reasonable limits for unit conversions
        const MAX_VALUE = 1e50;
        const MIN_VALUE = -1e50;
        
        if (number > MAX_VALUE) {
            throw new Error('Number is too large (maximum: 1e50)');
        }
        if (number < MIN_VALUE) {
            throw new Error('Number is too small (minimum: -1e50)');
        }
        
        return true;
    }
}

// ============================================================================
// FIX 4: MODAL MANAGER WITH FOCUS TRAPPING
// ============================================================================

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.previousFocus = null;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])';
    }
    
    showModal(modalElement) {
        try {
            // Store previous focus
            this.previousFocus = document.activeElement;
            
            // Show modal
            modalElement.style.display = 'block';
            modalElement.setAttribute('aria-hidden', 'false');
            
            // Set up focus trapping
            this.activeModal = modalElement;
            this.trapFocus(modalElement);
            
            // Focus first focusable element
            const firstFocusable = modalElement.querySelector(this.focusableElements);
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            console.error('ModalManager: Failed to show modal:', error);
        }
    }
    
    hideModal(modalElement) {
        try {
            // Hide modal
            modalElement.style.display = 'none';
            modalElement.setAttribute('aria-hidden', 'true');
            
            // Remove focus trapping
            this.activeModal = null;
            
            // Restore previous focus
            if (this.previousFocus && this.previousFocus.focus) {
                this.previousFocus.focus();
            }
            
            // Restore body scroll
            document.body.style.overflow = 'auto';
            
        } catch (error) {
            console.error('ModalManager: Failed to hide modal:', error);
        }
    }
    
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(this.focusableElements);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        
        const handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.hideModal(element);
            }
        };
        
        element.addEventListener('keydown', handleTabKey);
        element.addEventListener('keydown', handleEscapeKey);
        
        // Store handlers for cleanup
        element._focusTrapHandlers = { handleTabKey, handleEscapeKey };
    }
    
    cleanup() {
        if (this.activeModal) {
            this.hideModal(this.activeModal);
        }
    }
}

// ============================================================================
// FIX 5: PWA MANAGER WITH PROPER ERROR HANDLING
// ============================================================================

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.initializePWA();
    }
    
    initializePWA() {
        try {
            // Register service worker
            if ('serviceWorker' in navigator) {
                this.registerServiceWorker();
            }
            
            // Handle install prompt
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this.showInstallPrompt();
            });
            
            // Handle app installed
            window.addEventListener('appinstalled', () => {
                this.isInstalled = true;
                this.hideInstallPrompt();
                console.log('PWA: App installed successfully');
            });
            
        } catch (error) {
            console.error('PWAManager: Initialization failed:', error);
        }
    }
    
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('PWA: Service Worker registered successfully:', registration);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New version available
                        this.showUpdatePrompt();
                    }
                });
            });
            
        } catch (error) {
            console.error('PWA: Service Worker registration failed:', error);
        }
    }
    
    showInstallPrompt() {
        try {
            const prompt = document.getElementById('pwaInstallPrompt');
            if (prompt && !this.isInstalled) {
                prompt.classList.add('show');
            }
        } catch (error) {
            console.error('PWAManager: Failed to show install prompt:', error);
        }
    }
    
    hideInstallPrompt() {
        try {
            const prompt = document.getElementById('pwaInstallPrompt');
            if (prompt) {
                prompt.classList.remove('show');
            }
        } catch (error) {
            console.error('PWAManager: Failed to hide install prompt:', error);
        }
    }
    
    async installPWA() {
        try {
            if (!this.deferredPrompt) {
                console.warn('PWA: No install prompt available');
                return;
            }
            
            this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('PWA: User accepted install prompt');
            } else {
                console.log('PWA: User dismissed install prompt');
            }
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
            
        } catch (error) {
            console.error('PWAManager: Install failed:', error);
        }
    }
    
    showUpdatePrompt() {
        try {
            const updatePrompt = document.createElement('div');
            updatePrompt.className = 'update-prompt';
            updatePrompt.innerHTML = `
                <div style=\"position: fixed; top: 1rem; right: 1rem; background: var(--primary-color); color: white; padding: 1rem; border-radius: 0.5rem; z-index: 1001;\">
                    <div style=\"font-weight: 600; margin-bottom: 0.5rem;\">Update Available</div>
                    <div style=\"font-size: 0.9rem; margin-bottom: 1rem;\">A new version is available</div>
                    <div style=\"display: flex; gap: 0.5rem;\">
                        <button onclick=\"location.reload()\" style=\"background: white; color: var(--primary-color); border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; font-weight: 600; cursor: pointer;\">Update</button>
                        <button onclick=\"this.closest('.update-prompt').remove()\" style=\"background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;\">Later</button>
                    </div>
                </div>
            `;
            document.body.appendChild(updatePrompt);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (updatePrompt.parentNode) {
                    updatePrompt.remove();
                }
            }, 10000);
            
        } catch (error) {
            console.error('PWAManager: Failed to show update prompt:', error);
        }
    }
}

// ============================================================================
// FIX 6: ENHANCED CONVERTER APP WITH ALL FIXES INTEGRATED
// ============================================================================

class ConverterApp {
    constructor() {
        this.eventManager = new EventManager();
        this.subscriptionManager = new SubscriptionManager();
        this.modalManager = new ModalManager();
        this.pwaManager = new PWAManager();
        this.featureGate = new FeatureGate(this.subscriptionManager);
        
        this.elements = {};
        this.currentCategory = 'length';
        this.isInitialized = false;
        
        this.initialize();
    }
    
    initialize() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('ConverterApp: Initialization failed:', error);
        }
    }
    
    initializeApp() {
        try {
            // Get DOM elements
            this.getDOMElements();
            
            // Initialize with length units
            this.updateUnits('length');
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Initialize analytics
            this.initializeAnalytics();
            
            this.isInitialized = true;
            console.log('ConverterApp: Initialized successfully');
            
        } catch (error) {
            console.error('ConverterApp: App initialization failed:', error);
        }
    }
    
    getDOMElements() {
        const elementIds = [
            'inputValue', 'fromUnit', 'toUnit', 'resultDisplay',
            'precision', 'scientificNotation', 'swapBtn',
            'copyResult', 'favoriteBtn', 'inputError'
        ];
        
        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
            if (!this.elements[id]) {
                console.warn(`ConverterApp: Element with id '${id}' not found`);
            }
        });
    }
    
    setupEventListeners() {
        try {
            // Core conversion listeners
            if (this.elements.inputValue) {
                this.eventManager.addListener(this.elements.inputValue, 'input', () => this.convert());
            }
            if (this.elements.fromUnit) {
                this.eventManager.addListener(this.elements.fromUnit, 'change', () => this.convert());
            }
            if (this.elements.toUnit) {
                this.eventManager.addListener(this.elements.toUnit, 'change', () => this.convert());
            }
            if (this.elements.precision) {
                this.eventManager.addListener(this.elements.precision, 'change', () => this.convert());
            }
            if (this.elements.scientificNotation) {
                this.eventManager.addListener(this.elements.scientificNotation, 'change', () => this.convert());
            }
            if (this.elements.swapBtn) {
                this.eventManager.addListener(this.elements.swapBtn, 'click', () => this.swapUnits());
            }
            if (this.elements.copyResult) {
                this.eventManager.addListener(this.elements.copyResult, 'click', () => this.copyResult());
            }
            
            // Category button listeners
            document.querySelectorAll('.category-btn').forEach(btn => {
                this.eventManager.addListener(btn, 'click', (e) => {
                    const category = e.target.dataset.category;
                    if (category) {
                        this.switchCategory(category);
                        this.updateCategoryButtons(e.target);
                    }
                });
            });
            
        } catch (error) {
            console.error('ConverterApp: Failed to setup event listeners:', error);
        }
    }
    
    convert() {
        try {
            // Clear previous errors
            if (this.elements.inputError) {
                this.elements.inputError.style.display = 'none';
            }
            if (this.elements.inputValue) {
                this.elements.inputValue.classList.remove('input-error');
            }
            
            // Get input value with validation
            const inputText = this.elements.inputValue?.value || '';
            if (!inputText) {
                if (this.elements.resultDisplay) {
                    this.elements.resultDisplay.textContent = '0';
                }
                return;
            }
            
            const value = InputValidator.validate(inputText);
            const fromUnit = this.elements.fromUnit?.value;
            const toUnit = this.elements.toUnit?.value;
            let precision = parseInt(this.elements.precision?.value) || 2;
            const useScientific = this.elements.scientificNotation?.checked || false;
            
            if (!fromUnit || !toUnit) return;
            
            // Apply feature gating for precision
            precision = this.featureGate.checkPrecisionAccess(precision);
            
            let result = 0;
            
            if (this.currentCategory === 'temperature') {
                result = this.convertTemperature(value, fromUnit, toUnit);
            } else {
                const units = window.unitData?.[this.currentCategory];
                if (units && units[fromUnit] && units[toUnit]) {
                    const fromFactor = units[fromUnit].factor;
                    const toFactor = units[toUnit].factor;
                    result = (value / fromFactor) * toFactor;
                }
            }
            
            // Format result with proper precision
            let formattedResult = '';
            if (useScientific && (Math.abs(result) >= 1e6 || Math.abs(result) <= 1e-6)) {
                formattedResult = result.toExponential(precision);
            } else {
                formattedResult = result.toFixed(precision);
            }
            
            if (this.elements.resultDisplay) {
                this.elements.resultDisplay.textContent = formattedResult;
            }
            
            // Add to history if available
            if (window.conversionHistory) {
                window.conversionHistory.addConversion({
                    value: value,
                    fromUnit: fromUnit,
                    toUnit: toUnit,
                    result: formattedResult,
                    category: this.currentCategory,
                    precision: precision
                });
            }
            
        } catch (error) {
            // Show error message
            if (this.elements.inputError) {
                this.elements.inputError.textContent = error.message;
                this.elements.inputError.style.display = 'block';
            }
            if (this.elements.inputValue) {
                this.elements.inputValue.classList.add('input-error');
            }
            if (this.elements.resultDisplay) {
                this.elements.resultDisplay.textContent = 'Error';
            }
        }
    }
    
    convertTemperature(value, from, to) {
        let celsius;
        
        // Convert to Celsius first
        switch (from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            default:
                celsius = value;
        }
        
        // Convert from Celsius to target
        switch (to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9/5 + 32;
            case 'kelvin':
                return celsius + 273.15;
            default:
                return celsius;
        }
    }
    
    swapUnits() {
        try {
            if (!this.elements.fromUnit || !this.elements.toUnit) return;
            
            const fromValue = this.elements.fromUnit.value;
            const toValue = this.elements.toUnit.value;
            
            this.elements.fromUnit.value = toValue;
            this.elements.toUnit.value = fromValue;
            
            this.convert();
        } catch (error) {
            console.error('ConverterApp: Failed to swap units:', error);
        }
    }
    
    copyResult() {
        try {
            const resultText = this.elements.resultDisplay?.textContent || '';
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(resultText).then(() => {
                    this.showCopyFeedback(true);
                }).catch(() => {
                    this.fallbackCopy(resultText);
                });
            } else {
                this.fallbackCopy(resultText);
            }
        } catch (error) {
            console.error('ConverterApp: Failed to copy result:', error);
        }
    }
    
    fallbackCopy(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyFeedback(true);
        } catch (error) {
            console.error('ConverterApp: Fallback copy failed:', error);
            this.showCopyFeedback(false);
        }
    }
    
    showCopyFeedback(success) {
        if (!this.elements.copyResult) return;
        
        const originalText = this.elements.copyResult.textContent;
        this.elements.copyResult.textContent = success ? '✅ Copied!' : '❌ Failed';
        
        setTimeout(() => {
            if (this.elements.copyResult) {
                this.elements.copyResult.textContent = originalText;
            }
        }, 2000);
    }
    
    switchCategory(category) {
        try {
            this.currentCategory = category;
            this.updateUnits(category);
            this.convert();
        } catch (error) {
            console.error('ConverterApp: Failed to switch category:', error);
        }
    }
    
    updateUnits(category) {
        try {
            const units = window.unitData?.[category];
            if (!units || !this.elements.fromUnit || !this.elements.toUnit) return;
            
            // Clear existing options
            this.elements.fromUnit.innerHTML = '';
            this.elements.toUnit.innerHTML = '';
            
            // Add new options
            Object.keys(units).forEach(key => {
                const option1 = new Option(units[key].name, key);
                const option2 = new Option(units[key].name, key);
                this.elements.fromUnit.appendChild(option1);
                this.elements.toUnit.appendChild(option2);
            });
            
            // Set default selections
            const unitKeys = Object.keys(units);
            if (unitKeys.length > 1) {
                this.elements.fromUnit.value = unitKeys[0];
                this.elements.toUnit.value = unitKeys[1];
            }
        } catch (error) {
            console.error('ConverterApp: Failed to update units:', error);
        }
    }
    
    updateCategoryButtons(activeButton) {
        try {
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            activeButton.classList.add('active');
        } catch (error) {
            console.error('ConverterApp: Failed to update category buttons:', error);
        }
    }
    
    initializeAnimations() {
        try {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, observerOptions);
            
            // Observe all feature cards
            document.querySelectorAll('.feature-card').forEach(card => {
                observer.observe(card);
            });
        } catch (error) {
            console.error('ConverterApp: Failed to initialize animations:', error);
        }
    }
    
    initializeAnalytics() {
        try {
            // Analytics tracking for CTA clicks
            document.querySelectorAll('button[onclick*=\"initiateUpgrade\"]').forEach(button => {
                this.eventManager.addListener(button, 'click', () => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'click', {
                            event_category: 'CTA',
                            event_label: 'Upgrade to Pro',
                            value: 4.99
                        });
                    }
                });
            });
            
            document.querySelectorAll('a[href=\"#converter\"]').forEach(link => {
                this.eventManager.addListener(link, 'click', () => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'click', {
                            event_category: 'CTA',
                            event_label: 'Try Free Now',
                            value: 1
                        });
                    }
                });
            });
        } catch (error) {
            console.error('ConverterApp: Failed to initialize analytics:', error);
        }
    }
    
    cleanup() {
        try {
            this.eventManager.cleanup();
            this.modalManager.cleanup();
            console.log('ConverterApp: Cleanup completed');
        } catch (error) {
            console.error('ConverterApp: Cleanup failed:', error);
        }
    }
}

// ============================================================================
// GLOBAL FUNCTIONS FOR BACKWARD COMPATIBILITY
// ============================================================================

// Global app instance
let converterApp = null;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        converterApp = new ConverterApp();
        
        // Make functions globally available for onclick handlers
        window.toggleHistoryPanel = function() {
            if (window.conversionHistory) {
                window.conversionHistory.togglePanel();
            }
        };
        
        window.showBatchModal = function() {
            if (window.batchConverter) {
                window.batchConverter.showModal();
            }
        };
        
        window.exportHistory = function() {
            if (window.conversionHistory) {
                window.conversionHistory.exportHistory();
            }
        };
        
        window.clearHistory = function() {
            if (window.conversionHistory) {
                window.conversionHistory.clearHistory();
            }
        };
        
        window.initiateUpgrade = function() {
            try {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'Upgrade',
                        event_label: 'Stripe Checkout',
                        value: 4.99
                    });
                }
                window.open('https://buy.stripe.com/4gMdRbb4c9Ag9HM6lt7Vm09', '_blank');
            } catch (error) {
                console.error('Failed to initiate upgrade:', error);
            }
        };
        
        window.showProFeatures = function() {
            try {
                const modal = document.getElementById('proFeaturesModal');
                if (modal && converterApp?.modalManager) {
                    converterApp.modalManager.showModal(modal);
                }
            } catch (error) {
                console.error('Failed to show pro features:', error);
            }
        };
        
        window.closeProFeatures = function() {
            try {
                const modal = document.getElementById('proFeaturesModal');
                if (modal && converterApp?.modalManager) {
                    converterApp.modalManager.hideModal(modal);
                }
            } catch (error) {
                console.error('Failed to close pro features:', error);
            }
        };
        
        window.installPWA = function() {
            if (converterApp?.pwaManager) {
                converterApp.pwaManager.installPWA();
            }
        };
        
        window.dismissPWAPrompt = function() {
            if (converterApp?.pwaManager) {
                converterApp.pwaManager.hideInstallPrompt();
            }
        };
        
        window.showSupportModal = function() {
            alert('📧 Contact Support\\n\\nFor technical support, feature requests, or billing questions:\\n\\nsupport@precisionconvert.io\\n\\nWe typically respond within 24 hours.');
        };
        
        window.showPrivacyModal = function() {
            alert('🔒 Privacy Policy\\n\\nPrecisionConvert.io is privacy-first:\\n\\n• All conversions processed locally in your browser\\n• No conversion data sent to servers\\n• No tracking of personal calculations\\n• Optional analytics for usage patterns only\\n• No data sharing with third parties\\n\\nYour calculations stay private and secure.');
        };
        
        window.showTermsModal = function() {
            alert('📋 Terms of Service\\n\\nBy using PrecisionConvert.io you agree to:\\n\\n• Use the service for lawful purposes\\n• Respect intellectual property rights\\n• Professional subscriptions are monthly recurring ($4.99/month)\\n• 30-day money-back guarantee\\n• Service provided \"as-is\" with reasonable effort for accuracy\\n\\nFull terms available at: precisionconvert.io/terms');
        };
        
    } catch (error) {
        console.error('Failed to initialize converter app:', error);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (converterApp) {
        converterApp.cleanup();
    }
});

console.log('Critical fixes implementation loaded successfully');