// ================================
// Google Analytics Helper Functions
// ================================
//
// SETUP:
// 1. Get your Measurement ID from Google Analytics
// 2. Replace 'G-XXXXXXXXXX' below with your actual ID
// 3. Add the Google Analytics script to your HTML <head>:
//
// <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());
//   gtag('config', 'G-XXXXXXXXXX');
// </script>
// ================================

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';  // Replace with your Measurement ID

// Initialize dataLayer if not present
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}

// Track custom events
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'undefined') {
    console.warn('Google Analytics not loaded');
    return;
  }

  gtag('event', eventName, eventParams);
  console.log(`📊 Event tracked: ${eventName}`, eventParams);
}

// Track page views
function trackPageView(pagePath, pageTitle) {
  if (typeof gtag === 'undefined') {
    console.warn('Google Analytics not loaded');
    return;
  }

  gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: pageTitle
  });

  console.log(`📄 Page view tracked: ${pagePath}`);
}

// Track blog post views
function trackBlogView(blogTitle, blogCategory) {
  trackEvent('blog_view', {
    blog_title: blogTitle,
    blog_category: blogCategory,
    content_type: 'blog'
  });
}

// Track video plays
function trackVideoPlay(videoTitle, videoCategory) {
  trackEvent('video_play', {
    video_title: videoTitle,
    video_category: videoCategory,
    content_type: 'video'
  });
}

// Track resource downloads
function trackResourceDownload(resourceTitle, resourceType) {
  trackEvent('resource_download', {
    resource_title: resourceTitle,
    resource_type: resourceType,
    content_type: 'resource'
  });
}

// Track form submissions
function trackFormSubmit(formName, formType) {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType
  });
}

// Track search queries
function trackSearch(searchTerm, searchCategory) {
  trackEvent('search', {
    search_term: searchTerm,
    search_category: searchCategory
  });
}

// Track language switches
function trackLanguageSwitch(fromLang, toLang) {
  trackEvent('language_switch', {
    from_language: fromLang,
    to_language: toLang
  });
}

// Track newsletter signups
function trackNewsletterSignup(email) {
  trackEvent('newsletter_signup', {
    method: 'email',
    // Don't send actual email for privacy
    newsletter_source: window.location.pathname
  });
}

// Track outbound links
function trackOutboundLink(url, linkText) {
  trackEvent('outbound_link', {
    link_url: url,
    link_text: linkText,
    outbound: true
  });
}

// Track social shares
function trackSocialShare(platform, contentUrl, contentTitle) {
  trackEvent('share', {
    method: platform,
    content_type: 'blog',
    item_id: contentUrl,
    content_title: contentTitle
  });
}

// Track scroll depth
let scrollDepthTracked = {
  '25': false,
  '50': false,
  '75': false,
  '100': false
};

function trackScrollDepth() {
  const scrollPercentage = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );

  ['25', '50', '75', '100'].forEach(depth => {
    if (scrollPercentage >= parseInt(depth) && !scrollDepthTracked[depth]) {
      trackEvent('scroll_depth', {
        depth: depth,
        page_path: window.location.pathname
      });
      scrollDepthTracked[depth] = true;
    }
  });
}

// Add scroll tracking listener
if (typeof window !== 'undefined') {
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 100);
  });
}

// Track time on page
let pageLoadTime = Date.now();

function trackTimeOnPage() {
  const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000); // seconds

  trackEvent('page_engagement', {
    engagement_time_msec: timeOnPage * 1000,
    page_path: window.location.pathname
  });
}

// Track time on page when user leaves
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', trackTimeOnPage);

  // Also track every 30 seconds
  setInterval(() => {
    const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
    if (timeOnPage % 30 === 0 && timeOnPage > 0) {
      trackTimeOnPage();
    }
  }, 30000);
}

// Export functions for use in other scripts
window.analytics = {
  trackEvent,
  trackPageView,
  trackBlogView,
  trackVideoPlay,
  trackResourceDownload,
  trackFormSubmit,
  trackSearch,
  trackLanguageSwitch,
  trackNewsletterSignup,
  trackOutboundLink,
  trackSocialShare,
  trackScrollDepth,
  trackTimeOnPage
};

console.log('✅ Analytics helper loaded');

// Usage Examples:
/*

// Track blog view
analytics.trackBlogView('10 Tips for Economics Exam', 'study-tips');

// Track video play
analytics.trackVideoPlay('Supply and Demand Basics', 'microeconomics');

// Track download
analytics.trackResourceDownload('Economics Study Guide', 'pdf');

// Track form submit
analytics.trackFormSubmit('Contact Form', 'contact');

// Track search
analytics.trackSearch('inflation', 'blog');

// Track language switch
analytics.trackLanguageSwitch('ar', 'en');

// Track newsletter signup
analytics.trackNewsletterSignup('user@example.com');

// Track outbound link
analytics.trackOutboundLink('https://youtube.com', 'YouTube Channel');

// Track social share
analytics.trackSocialShare('twitter', '/blog-post-1.html', '10 Tips for Economics');

*/