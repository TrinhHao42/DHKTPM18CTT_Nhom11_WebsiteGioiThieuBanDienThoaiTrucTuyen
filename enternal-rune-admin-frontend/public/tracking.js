/**
 * Analytics Tracking Script
 * Client-side tracking for web analytics
 */
(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    apiUrl: 'https://6jh6gpx1-3001.asse.devtunnels.ms/api/analytics/track',
    websiteId: 'cmic2k2820000ml8mu0miqhlm', // Default website ID
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    debug: true,
    maxRetries: 3,
    retryDelay: 1000,
    autoTrack: true // Auto-track page views like Umami
  };
  
  // Override config from script attributes
  const script = document.currentScript;
  if (script) {
    CONFIG.websiteId = script.dataset.websiteId || CONFIG.websiteId;
    CONFIG.apiUrl = script.dataset.apiUrl || CONFIG.apiUrl;
    CONFIG.debug = script.dataset.debug === 'true';
  }
  
  // Expose CONFIG globally for debugging
  window.CONFIG = CONFIG;
  
  // Event name translation helper
  // NOTE: This mapping is synced from src/utils/eventNames.ts
  function getEventDisplayName(eventName) {
    const eventMap = {
      // Page events
      'pageview': 'Xem trang',
      'page_unload': 'Rời khỏi trang',
      'page_engagement': 'Tương tác với trang',
      'page_hidden': 'Ẩn trang',
      'page_visible': 'Hiển thị trang',
      'title_change': 'Đổi tiêu đề',

      // Click events
      'click': 'Nhấp chuột',
      'button': 'Nhấp nút',
      'external_link': 'Link ngoài',
      'internal_link': 'Link nội bộ',
      'email_link': 'Link email',
      'phone_link': 'Link điện thoại',

      // Form events
      'form_submit': 'Gửi form',

      // User events
      'user_identify': 'Nhận dạng người dùng',

      // Interaction events
      'interaction_click': 'Tương tác nhấp',
      'interaction_hover': 'Tương tác hover',
      'interaction_focus': 'Tương tác focus',

      // Custom events (common ones)
      'purchase_intent': 'Ý định mua hàng',
      'search': 'Tìm kiếm',
      'download': 'Tải xuống',
      'video_play': 'Phát video',
      'video_pause': 'Tạm dừng video'
    };

    return eventMap[eventName] || eventName;
  }
  
  // Utility functions
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
  
  function parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();
    
    let browser = 'Unknown';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opera')) browser = 'Opera';
    
    let os = 'Unknown';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macintosh')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    
    let device = 'Desktop';
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      device = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      device = 'Tablet';
    }
    
    return { browser, os, device };
  }
  
  function getDeviceInfo() {
    const deviceInfo = parseUserAgent(navigator.userAgent);
    
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      device: deviceInfo.device
    };
  }
  
  function getLocationInfo() {
    // This would typically use an IP geolocation service
    // For now, return empty - can be enhanced later
    return {
      country: null,
      region: null,
      city: null
    };
  }
  
  function extractUTMParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
      utmTerm: urlParams.get('utm_term'),
      utmContent: urlParams.get('utm_content')
    };
  }
  
  // Session management
  class SessionManager {
    constructor() {
      this.sessionId = this.getOrCreateSessionId();
      this.userId = this.getOrCreateUserId();
      this.lastActivity = Date.now();
      this.deviceInfo = getDeviceInfo();
      this.locationInfo = getLocationInfo();
      
      this.updateLastActivity();
    }
    
    getOrCreateSessionId() {
      let sessionId = getCookie('analytics_session');
      const lastActivity = parseInt(getCookie('analytics_last_activity') || '0');
      
      // Check if session expired
      if (!sessionId || (Date.now() - lastActivity) > CONFIG.sessionTimeout) {
        sessionId = generateId();
        this.setSessionCookie(sessionId);
      }
      
      return sessionId;
    }
    
    getOrCreateUserId() {
      let userId = getCookie('analytics_user');
      if (!userId) {
        userId = generateId();
        setCookie('analytics_user', userId, 365); // 1 year
      }
      return userId;
    }
    
    setSessionCookie(sessionId) {
      // Session cookie expires in 30 minutes
      setCookie('analytics_session', sessionId, 0.0208); // 30 minutes in days
    }
    
    updateLastActivity() {
      this.lastActivity = Date.now();
      setCookie('analytics_last_activity', this.lastActivity.toString(), 0.0208);
    }
    
    isExpired() {
      return Date.now() - this.lastActivity > CONFIG.sessionTimeout;
    }
    
    getSessionData() {
      return {
        sessionId: this.sessionId,
        userId: this.userId,
        deviceInfo: this.deviceInfo,
        locationInfo: this.locationInfo
      };
    }
    
    renewSession() {
      this.sessionId = generateId();
      this.setSessionCookie(this.sessionId);
      this.updateLastActivity();
    }
  }
  
  // Event queue for offline support
  class EventQueue {
    constructor() {
      this.queue = [];
      this.maxSize = 100;
      this.processing = false;
    }
    
    add(event) {
      if (this.queue.length >= this.maxSize) {
        this.queue.shift(); // Remove oldest event
      }
      this.queue.push(event);
      this.process();
    }
    
    async process() {
      if (this.processing || this.queue.length === 0) return;
      
      this.processing = true;
      
      while (this.queue.length > 0) {
        const event = this.queue.shift();
        try {
          await this.sendEvent(event);
        } catch {
          // Re-queue failed event (with retry limit)
          if (!event._retries || event._retries < CONFIG.maxRetries) {
            event._retries = (event._retries || 0) + 1;
            this.queue.unshift(event);
            break; // Stop processing if network is failing
          }
        }
      }
      
      this.processing = false;
    }
    
    async sendEvent(event) {
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
        keepalive: true
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    }
  }
  
  // Main Analytics Tracker
  class AnalyticsTracker {
    constructor() {
      this.session = new SessionManager();
      this.eventQueue = new EventQueue();
      this.initialized = false;
      this.pageStartTime = Date.now();
  this.interactions = 0;
      
      // Bind methods
  this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    log(...args) {
      if (CONFIG.debug) {
        console.log('[Analytics]', ...args);
      }
    }
    
    async send(data) {
      try {
        const payload = {
          ...data,
          ...this.session.getSessionData(),
          websiteId: CONFIG.websiteId,
          timestamp: Date.now(),
          url: window.location.href,
          path: window.location.pathname,
          title: document.title,
          ...extractUTMParams()
        };
        
        this.log('Tracking:', payload);
        
        this.eventQueue.add(payload);
        this.session.updateLastActivity();
        
        return { success: true };
      } catch (error) {
        this.log('Tracking failed:', error);
        throw error;
      }
    }
    
    // Track page view
    async trackPageView(customData = {}) {
      const timeOnPage = Date.now() - this.pageStartTime;
      
      await this.send({
        type: 'pageview',
        timeOnPage: timeOnPage,
        interactions: this.interactions,
        ...customData
      });
      
  // Reset page metrics
  this.pageStartTime = Date.now();
  this.interactions = 0;
    }
    
    // Track custom event
    async trackEvent(eventName, eventData = {}) {
      await this.send({
        type: 'event',
        eventName,
        eventData: {
          ...eventData,
          interactions: this.interactions,
          timeOnPage: Date.now() - this.pageStartTime
        }
      });
      
      this.interactions++;
    }
    
    // Track user interaction with element
    async trackInteraction(element, action, customData = {}) {
      const elementData = {
        tagName: element.tagName.toLowerCase(),
        id: element.id || null,
        className: element.className || null,
        text: element.textContent?.substring(0, 100) || null,
        href: element.href || null,
        ...customData
      };
      
      await this.trackEvent(`interaction_${action}`, elementData);
    }
    
  // Scroll tracking removed: function deleted to stop scroll tracking
    
    // Handle click events
    handleClick(event) {
      const target = event.target.closest('a, button, [role="button"], [onclick]');
      if (target) {
        this.trackInteraction(target, 'click', {
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey
        });
      }
    }
    
    // Handle form submissions
    handleSubmit(event) {
      const form = event.target;
      if (form.tagName === 'FORM') {
        const formData = {
          id: form.id || null,
          name: form.name || null,
          action: form.action || null,
          method: form.method || 'get',
          inputCount: form.querySelectorAll('input, select, textarea').length
        };
        
        this.trackEvent('form_submit', formData);
      }
    }
    
    // Handle page visibility changes
    handleVisibilityChange() {
      if (document.hidden) {
        this.trackEvent('page_hidden', {
          timeOnPage: Date.now() - this.pageStartTime
        });
      } else {
        this.trackEvent('page_visible');
        this.pageStartTime = Date.now(); // Reset timer
      }
    }
    
    // Handle page unload
    handleBeforeUnload() {
      const timeOnPage = Date.now() - this.pageStartTime;
      
      // Use sendBeacon for reliable delivery during page unload
      if (navigator.sendBeacon) {
        const data = {
          type: 'page_unload',
          timeOnPage,
          interactions: this.interactions,
          ...this.session.getSessionData(),
          websiteId: CONFIG.websiteId,
          timestamp: Date.now(),
          url: window.location.href,
          path: window.location.pathname,
          title: document.title
        };
        
        navigator.sendBeacon(CONFIG.apiUrl, JSON.stringify(data));
        this.log('Page unload tracked via sendBeacon');
      }
    }
    
    // Setup automatic event tracking (như Umami)
    setupAutoTracking() {
      // Auto-track all clicks (buttons, links, etc.)
      document.addEventListener('click', (event) => {
        const target = event.target.closest('a, button, [role="button"], [onclick]');
        if (target) {
          const elementData = {
            tag: target.tagName.toLowerCase(),
            id: target.id || null,
            class: target.className || null,
            text: (target.textContent || target.innerText || '').trim().substring(0, 50),
            href: target.href || null,
            type: target.type || null
          };
          
          // Determine click type
          let clickType = 'click';
          if (target.tagName === 'A') {
            if (target.href && target.href.startsWith('http') && !target.href.includes(window.location.hostname)) {
              clickType = 'external_link';
            } else if (target.href && target.href.startsWith('mailto:')) {
              clickType = 'email_link';
            } else if (target.href && target.href.startsWith('tel:')) {
              clickType = 'phone_link';
            } else {
              clickType = 'internal_link';
            }
          } else if (target.tagName === 'BUTTON' || target.type === 'submit') {
            clickType = 'button';
          }
          
          this.trackEvent(clickType, elementData);
          this.interactions++;
        }
      }, true);
      
      // Auto-track form submissions
      document.addEventListener('submit', (event) => {
        const form = event.target;
        if (form.tagName === 'FORM') {
          const formData = {
            id: form.id || null,
            name: form.name || null,
            action: form.action || window.location.href,
            method: (form.method || 'GET').toUpperCase(),
            fieldCount: form.querySelectorAll('input, select, textarea').length
          };
          
          this.trackEvent('form_submit', formData);
          this.interactions++;
        }
      }, true);
      
      // Auto-scroll tracking is disabled per request; removed to reduce noise and overhead
      
      // Page visibility tracking
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      
      // Page exit tracking
      window.addEventListener('beforeunload', this.handleBeforeUnload);
      window.addEventListener('pagehide', this.handleBeforeUnload);
      
      // Session renewal on activity
      let activityTimer = null;
  ['mousedown', 'mousemove', 'keypress', 'touchstart', 'click'].forEach(eventType => {
        document.addEventListener(eventType, () => {
          if (activityTimer) clearTimeout(activityTimer);
          activityTimer = setTimeout(() => {
            if (this.session.isExpired()) {
              this.session.renewSession();
              this.log('🔄 Session renewed due to activity');
            }
          }, 100);
        }, { passive: true });
      });
      
  this.log('✅ Auto-tracking enabled: clicks, forms, page changes');
    }
    
    // Auto-track URL changes (như Umami)
    setupAutoPageTracking() {
      let currentUrl = window.location.href;
      let currentTitle = document.title;
      
      const trackUrlChange = () => {
        const newUrl = window.location.href;
        const newTitle = document.title;
        
        if (newUrl !== currentUrl) {
          this.log('🔄 URL changed:', currentUrl, '->', newUrl);
          currentUrl = newUrl;
          currentTitle = newTitle;
          
          // Track as new page view
          this.trackPageView({
            previousUrl: currentUrl,
            navigationMethod: 'url_change'
          });
        } else if (newTitle !== currentTitle) {
          this.log('📝 Title changed:', currentTitle, '->', newTitle);
          currentTitle = newTitle;
          
          // Track title change as page update
          this.trackEvent('title_change', {
            newTitle: newTitle,
            oldTitle: currentTitle
          });
        }
      };
      
      // 1. History API overrides (SPA navigation)
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        originalPushState.apply(history, args);
        setTimeout(trackUrlChange, 0);
      };
      
      history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        setTimeout(trackUrlChange, 0);
      };
      
      // 2. PopState event (back/forward buttons)
      window.addEventListener('popstate', () => {
        setTimeout(trackUrlChange, 0);
      });
      
      // 3. Hash changes
      window.addEventListener('hashchange', () => {
        setTimeout(trackUrlChange, 0);
      });
      
      // 4. Monitor title changes (for dynamic SPAs)
      const titleObserver = new MutationObserver(() => {
        setTimeout(trackUrlChange, 0);
      });
      
      const titleElement = document.querySelector('title');
      if (titleElement) {
        titleObserver.observe(titleElement, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
      
      // 5. Fallback: Poll for URL changes (for edge cases)
      if (CONFIG.autoTrack) {
        setInterval(() => {
          trackUrlChange();
        }, 1000); // Check every second
      }
    }
    
    // Initialize tracking
    init() {
      if (this.initialized) return;
      
      this.log('Initializing analytics tracker...');
      this.initialized = true;
      
      // Track initial page view
      this.trackPageView();
      
      // Setup automatic tracking
      this.setupAutoTracking();
      
      // Setup auto page tracking (như Umami)
      this.setupAutoPageTracking();
      
      this.log('Analytics tracker initialized successfully');
      this.log('Website ID:', CONFIG.websiteId);
      this.log('Session ID:', this.session.sessionId);
    }
    
    // Public API methods
    identify(userId, userProperties = {}) {
      this.trackEvent('user_identify', {
        userId,
        userProperties
      });
    }
    
    page(name, properties = {}) {
      this.trackPageView({
        pageName: name,
        pageProperties: properties
      });
    }
    
    track(eventName, properties = {}) {
      this.trackEvent(eventName, properties);
    }
  }
  
  // Global instance
  window.AnalyticsTracker = AnalyticsTracker;
  
  // Auto-initialize unless disabled
  if (!script || script.dataset.autoInit !== 'false') {
    const tracker = new AnalyticsTracker();
    window.analyticsTracker = tracker;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => tracker.init());
    } else {
      // DOM is already ready
      setTimeout(() => tracker.init(), 0);
    }
  }
  
  // Expose Umami-style API
  window.umami = {
    track: function(eventName, eventData = {}) {
      if (window.analyticsTracker) {
        return window.analyticsTracker.trackEvent(eventName, eventData);
      } else {
        console.warn('Analytics not loaded yet. Event queued:', eventName, eventData);
      }
    },
    
    page: function(customData = {}) {
      if (window.analyticsTracker) {
        return window.analyticsTracker.trackPageView(customData);
      }
    },
    
    identify: function(userId, properties = {}) {
      if (window.analyticsTracker) {
        return window.analyticsTracker.identify(userId, properties);
      }
    },
    
    // Get tracking info
    get config() {
      return CONFIG;
    },
    
    get session() {
      return window.analyticsTracker ? window.analyticsTracker.session.getSessionData() : null;
    },
    
    // Get user-friendly event name
    getEventDisplayName: getEventDisplayName
  };
  
  // Legacy API (backward compatibility)
  window.trackEvent = window.umami.track;
  window.trackPageView = window.umami.page;
  
})();