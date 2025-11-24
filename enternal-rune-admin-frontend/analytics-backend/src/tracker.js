(function(window) {
  'use strict';
  
  // Configuration
  const config = {
    website: '__WEBSITE_ID__',
    apiEndpoint: '__API_ENDPOINT__' || 'http://localhost:3001/api/track',
    autoTrack: true,
    trackOutboundLinks: true,
    trackEvents: true,
  };
  
  // Initialize tracking data
  let trackingData = {
    website: config.website,
    hostname: window.location.hostname,
    language: navigator.language,
    screen: `${screen.width}x${screen.height}`,
    title: document.title,
    url: window.location.pathname + window.location.search,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
  };
  
  // Utility functions
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  function getTrackingPayload(eventName = null, eventData = null) {
    return {
      ...trackingData,
      name: eventName,
      data: eventData,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
  
  // Send tracking data to API
  async function sendTrackingData(eventName = null, eventData = null) {
    if (!config.website) {
      console.warn('Analytics: Website ID not configured');
      return;
    }
    
    try {
      const payload = getTrackingPayload(eventName, eventData);
      
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event',
          payload: payload,
        }),
        keepalive: true,
      });
      
      if (!response.ok) {
        console.warn('Analytics: Failed to send tracking data', response.statusText);
      }
    } catch (error) {
      console.warn('Analytics: Error sending tracking data', error);
    }
  }
  
  // Track page view
  function trackPageView() {
    sendTrackingData();
  }
  
  // Track custom event
  function trackEvent(eventName, eventData = {}) {
    sendTrackingData(eventName, eventData);
  }
  
  // Track outbound link clicks
  function setupOutboundLinkTracking() {
    if (!config.trackOutboundLinks) return;
    
    document.addEventListener('click', function(event) {
      const target = event.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (!href) return;
      
      // Check if it's an outbound link
      const isOutbound = href.startsWith('http') && 
                        !href.includes(window.location.hostname);
      
      if (isOutbound) {
        trackEvent('outbound_link_click', {
          url: href,
          text: target.textContent?.trim() || '',
        });
      }
    });
  }
  
  // Track events with data attributes
  function setupEventTracking() {
    if (!config.trackEvents) return;
    
    document.addEventListener('click', function(event) {
      const target = event.target;
      const eventName = target.getAttribute('data-analytics-event');
      
      if (eventName) {
        const eventData = {};
        
        // Collect all data-analytics-* attributes
        Array.from(target.attributes).forEach(attr => {
          if (attr.name.startsWith('data-analytics-') && attr.name !== 'data-analytics-event') {
            const key = attr.name.replace('data-analytics-', '');
            eventData[key] = attr.value;
          }
        });
        
        trackEvent(eventName, eventData);
      }
    });
  }
  
  // Track page visibility changes
  function setupVisibilityTracking() {
    let startTime = Date.now();
    
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (timeSpent > 5) { // Only track if user spent more than 5 seconds
          trackEvent('page_time', { 
            duration: timeSpent,
            url: window.location.pathname 
          });
        }
      } else {
        startTime = Date.now();
      }
    });
  }
  
  // Handle route changes (for SPAs)
  function setupRouteChangeTracking() {
    let currentPath = window.location.pathname;
    
    // Override pushState and replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    function handleRouteChange() {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        currentPath = newPath;
        trackingData.url = window.location.pathname + window.location.search;
        trackingData.title = document.title;
        
        setTimeout(() => {
          trackPageView();
        }, 100); // Small delay to ensure title is updated
      }
    }
    
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleRouteChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleRouteChange();
    };
    
    window.addEventListener('popstate', handleRouteChange);
  }
  
  // Initialize analytics
  function init() {
    // Update tracking data
    trackingData.title = document.title;
    trackingData.url = window.location.pathname + window.location.search;
    
    // Setup tracking
    if (config.autoTrack) {
      trackPageView();
    }
    
    setupOutboundLinkTracking();
    setupEventTracking();
    setupVisibilityTracking();
    setupRouteChangeTracking();
  }
  
  // Public API
  window.analytics = {
    track: trackEvent,
    page: trackPageView,
    config: function(options) {
      Object.assign(config, options);
      trackingData.website = config.website;
    },
    init: init,
  };
  
  // Auto-initialize if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})(window);