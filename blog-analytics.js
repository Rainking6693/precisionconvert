/**
 * Blog Analytics Tracking System
 * Comprehensive tracking for blog pages, modal interactions, and conversion flow
 * Optimized for PrecisionConvert.io
 */

class BlogAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.pageType = this.detectPageType();
        this.visitStartTime = Date.now();
        this.scrollDepth = 0;
        this.maxScrollDepth = 0;
        this.modalInteractions = [];
        this.conversionEvents = [];
        
        this.init();
    }
    
    init() {
        this.trackPageView();
        this.setupScrollTracking();
        this.setupModalTracking();
        this.setupConversionTracking();
        this.setupHeatmapTracking();
        this.setupTimeOnPage();
        
        console.log('Blog Analytics initialized for:', this.pageType);
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    detectPageType() {
        const path = window.location.pathname;
        const url = window.location.href;
        
        if (path.includes('blog') || url.includes('/blog')) {
            return 'blog-index';
        } else if (path.includes('scientific') || url.includes('scientific')) {
            return 'scientific-guide';
        } else if (path.includes('cooking') || url.includes('cooking')) {
            return 'cooking-guide';
        } else if (path === '/' || path === '/index.html') {
            return 'main-converter';
        }
        return 'unknown';
    }
    
    trackPageView() {
        const eventData = {
            event: 'blog_page_view',
            page_type: this.pageType,
            session_id: this.sessionId,
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language
        };
        
        this.sendEvent(eventData);
        
        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                custom_map: {
                    'custom_page_type': this.pageType,
                    'custom_session_id': this.sessionId
                }
            });
        }
    }
    
    setupScrollTracking() {
        let ticking = false;
        
        const updateScrollDepth = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.scrollDepth = Math.round((scrollTop / docHeight) * 100);
            
            if (this.scrollDepth > this.maxScrollDepth) {
                this.maxScrollDepth = this.scrollDepth;
                
                // Track milestone scrolls
                if (this.maxScrollDepth >= 25 && this.maxScrollDepth % 25 === 0) {
                    this.trackEvent('scroll_milestone', {
                        depth: this.maxScrollDepth,
                        page_type: this.pageType
                    });
                }
            }
            
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDepth);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate);
    }
    
    setupModalTracking() {
        // Track Pro Features modal interactions
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Pro Features button clicks
            if (target.matches('.pro-btn, [data-action="upgrade"], .upgrade-btn')) {
                this.trackModalInteraction('pro_features_button_click', {
                    button_text: target.textContent?.trim(),
                    source_page: this.pageType,
                    location: this.getElementLocation(target)
                });
            }
            
            // Modal close tracking
            if (target.matches('.modal-close, [data-dismiss="modal"]') || 
                target.closest('.modal-overlay')) {
                this.trackModalInteraction('modal_close', {
                    modal_type: 'pro_features',
                    source_page: this.pageType
                });
            }
            
            // Blog navigation clicks
            if (target.matches('.blog-link, [href*="/blog"], [href*="scientific"], [href*="cooking"]')) {
                this.trackEvent('blog_navigation', {
                    link_text: target.textContent?.trim(),
                    link_href: target.href,
                    source_page: this.pageType
                });
            }
        });
        
        // Modal view tracking
        const observeModals = () => {
            const modals = document.querySelectorAll('.modal, [id*="modal"]');
            modals.forEach(modal => {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            mutation.attributeName === 'class') {
                            if (modal.classList.contains('show') || 
                                modal.style.display === 'block') {
                                this.trackModalInteraction('modal_view', {
                                    modal_id: modal.id,
                                    source_page: this.pageType
                                });
                            }
                        }
                    });
                });
                
                observer.observe(modal, {
                    attributes: true,
                    attributeFilter: ['class', 'style']
                });
            });
        };
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', observeModals);
        } else {
            observeModals();
        }
    }
    
    setupConversionTracking() {
        // Track conversion funnel: Blog → Converter → Upgrade
        const trackConversionStep = (step, data = {}) => {
            const conversionEvent = {
                event: 'conversion_step',
                step: step,
                session_id: this.sessionId,
                source_page: this.pageType,
                timestamp: Date.now(),
                ...data
            };
            
            this.conversionEvents.push(conversionEvent);
            this.sendEvent(conversionEvent);
        };
        
        // Blog to converter navigation
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.matches('[href="/"], [href="index.html"], .converter-link')) {
                trackConversionStep('blog_to_converter', {
                    trigger: 'navigation_click',
                    link_text: target.textContent?.trim()
                });
            }
            
            // Converter usage (when on main page)
            if (this.pageType === 'main-converter' && 
                target.matches('button[onclick*="convert"], .convert-btn')) {
                trackConversionStep('converter_usage', {
                    trigger: 'convert_button'
                });
            }
            
            // Upgrade button clicks
            if (target.matches('.upgrade-btn, [data-action="upgrade"]')) {
                trackConversionStep('upgrade_intent', {
                    trigger: 'upgrade_button',
                    button_location: this.getElementLocation(target)
                });
            }
        });
    }
    
    setupHeatmapTracking() {
        // Simple click heatmap tracking
        document.addEventListener('click', (event) => {
            const rect = event.target.getBoundingClientRect();
            const heatmapData = {
                event: 'heatmap_click',
                page_type: this.pageType,
                x: event.clientX,
                y: event.clientY,
                element_tag: event.target.tagName.toLowerCase(),
                element_class: event.target.className,
                element_id: event.target.id,
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight,
                timestamp: Date.now()
            };
            
            this.sendEvent(heatmapData);
        });
    }
    
    setupTimeOnPage() {
        // Track time spent on page
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.visitStartTime;
            this.trackEvent('page_exit', {
                time_on_page: timeOnPage,
                max_scroll_depth: this.maxScrollDepth,
                page_type: this.pageType,
                session_id: this.sessionId
            });
        });
        
        // Track engagement time (visible time)
        let visibleTime = 0;
        let lastVisibleStart = Date.now();
        let isVisible = !document.hidden;
        
        const trackVisibility = () => {
            if (document.hidden && isVisible) {
                visibleTime += Date.now() - lastVisibleStart;
                isVisible = false;
            } else if (!document.hidden && !isVisible) {
                lastVisibleStart = Date.now();
                isVisible = true;
            }
        };
        
        document.addEventListener('visibilitychange', trackVisibility);
        
        // Send engagement data every 30 seconds
        setInterval(() => {
            if (isVisible) {
                visibleTime += Date.now() - lastVisibleStart;
                lastVisibleStart = Date.now();
            }
            
            this.trackEvent('engagement_heartbeat', {
                visible_time: visibleTime,
                scroll_depth: this.scrollDepth,
                page_type: this.pageType,
                session_id: this.sessionId
            });
        }, 30000);
    }
    
    trackModalInteraction(action, data = {}) {
        const modalEvent = {
            event: 'modal_interaction',
            action: action,
            session_id: this.sessionId,
            timestamp: Date.now(),
            ...data
        };
        
        this.modalInteractions.push(modalEvent);
        this.sendEvent(modalEvent);
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'modal',
                event_label: data.modal_type || 'pro_features',
                custom_map: {
                    'source_page': this.pageType
                }
            });
        }
    }
    
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            session_id: this.sessionId,
            page_type: this.pageType,
            timestamp: Date.now(),
            ...data
        };
        
        this.sendEvent(eventData);
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...data,
                custom_page_type: this.pageType,
                custom_session_id: this.sessionId
            });
        }
    }
    
    getElementLocation(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        return {
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + scrollTop + rect.height / 2),
            viewport_x: Math.round(rect.left + rect.width / 2),
            viewport_y: Math.round(rect.top + rect.height / 2)
        };
    }
    
    sendEvent(eventData) {
        // Send to your analytics endpoint
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(eventData)], {
                type: 'application/json'
            });
            navigator.sendBeacon('/.netlify/functions/analytics', blob);
        } else {
            // Fallback for older browsers
            fetch('/.netlify/functions/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
                keepalive: true
            }).catch(console.error);
        }
        
        // Also log to console in development
        if (window.location.hostname === 'localhost' || 
            window.location.hostname.includes('netlify.app')) {
            console.log('Analytics Event:', eventData);
        }
    }
    
    // Public methods for manual tracking
    trackCustomEvent(eventName, data = {}) {
        this.trackEvent(eventName, data);
    }
    
    trackConversion(conversionType, value = 0) {
        this.trackEvent('conversion', {
            conversion_type: conversionType,
            value: value,
            session_id: this.sessionId
        });
    }
    
    getSessionData() {
        return {
            sessionId: this.sessionId,
            pageType: this.pageType,
            maxScrollDepth: this.maxScrollDepth,
            modalInteractions: this.modalInteractions,
            conversionEvents: this.conversionEvents,
            timeOnPage: Date.now() - this.visitStartTime
        };
    }
}

// Initialize analytics when DOM is ready
let blogAnalytics;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        blogAnalytics = new BlogAnalytics();
        window.blogAnalytics = blogAnalytics; // Make available globally
    });
} else {
    blogAnalytics = new BlogAnalytics();
    window.blogAnalytics = blogAnalytics;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogAnalytics;
}