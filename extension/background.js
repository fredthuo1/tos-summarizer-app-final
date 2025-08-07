// Background service worker for Terms Analyzer Extension

const API_BASE_URL = 'http://localhost:3000'; // Change to production URL when deployed
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Store for analyzed websites
let analyzedSites = new Map();

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      const domain = new URL(tab.url).hostname;
      
      // Check if we've analyzed this domain recently
      const cached = await getCachedAnalysis(domain);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        // Send cached result to content script
        chrome.tabs.sendMessage(tabId, {
          type: 'ANALYSIS_RESULT',
          data: cached.analysis,
          fromCache: true
        });
        return;
      }

      // Inject content script to look for terms and privacy links
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: findTermsAndPrivacyLinks
      });
    } catch (error) {
      console.error('Error processing tab update:', error);
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'FOUND_TERMS_LINKS') {
    const { domain, links } = message.data;
    
    try {
      // Analyze the found links
      const analysis = await analyzeTermsLinks(links);
      
      // Cache the result
      await cacheAnalysis(domain, analysis);
      
      // Send result back to content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'ANALYSIS_RESULT',
        data: analysis,
        fromCache: false
      });
      
      // Update extension badge
      updateBadge(sender.tab.id, analysis.riskLevel);
      
    } catch (error) {
      console.error('Error analyzing terms:', error);
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'ANALYSIS_ERROR',
        error: error.message
      });
    }
  }
  
  if (message.type === 'GET_ANALYSIS') {
    const { domain } = message.data;
    const cached = await getCachedAnalysis(domain);
    sendResponse(cached);
  }
});

// Function to find terms and privacy links (injected into page)
function findTermsAndPrivacyLinks() {
  const domain = window.location.hostname;
  const links = [];
  
  // Common selectors for terms and privacy links
  const selectors = [
    'a[href*="terms"]',
    'a[href*="privacy"]',
    'a[href*="cookie"]',
    'a[href*="legal"]',
    'a[href*="policy"]',
    'a[href*="tos"]',
    'a[href*="eula"]'
  ];
  
  // Common text patterns
  const textPatterns = [
    /terms\s+of\s+(service|use)/i,
    /privacy\s+policy/i,
    /cookie\s+policy/i,
    /legal\s+notice/i,
    /user\s+agreement/i,
    /end\s+user\s+license/i
  ];
  
  // Find links by selectors
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.href && !links.some(link => link.url === el.href)) {
        links.push({
          url: el.href,
          text: el.textContent.trim(),
          type: determineType(el.href, el.textContent)
        });
      }
    });
  });
  
  // Find links by text content
  const allLinks = document.querySelectorAll('a[href]');
  allLinks.forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    const href = link.href.toLowerCase();
    
    textPatterns.forEach(pattern => {
      if (pattern.test(text) || pattern.test(href)) {
        if (!links.some(l => l.url === link.href)) {
          links.push({
            url: link.href,
            text: link.textContent.trim(),
            type: determineType(link.href, link.textContent)
          });
        }
      }
    });
  });
  
  // Send found links to background script
  chrome.runtime.sendMessage({
    type: 'FOUND_TERMS_LINKS',
    data: { domain, links }
  });
  
  function determineType(url, text) {
    const combined = (url + ' ' + text).toLowerCase();
    if (combined.includes('privacy')) return 'privacy';
    if (combined.includes('cookie')) return 'cookie';
    if (combined.includes('terms')) return 'terms';
    if (combined.includes('legal')) return 'legal';
    return 'unknown';
  }
}

// Analyze terms links using the main application API
async function analyzeTermsLinks(links) {
  if (links.length === 0) {
    return {
      riskLevel: 'unknown',
      score: 0,
      message: 'No terms or privacy policy links found on this website.',
      links: []
    };
  }
  
  const analyses = [];
  
  // Analyze each link (limit to 3 most relevant)
  const relevantLinks = links
    .filter(link => link.type !== 'unknown')
    .slice(0, 3);
  
  for (const link of relevantLinks) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: link.url,
          source: link.url,
          type: 'url'
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        analyses.push({
          link: link,
          analysis: result.analysis
        });
      }
    } catch (error) {
      console.error(`Error analyzing ${link.url}:`, error);
    }
  }
  
  if (analyses.length === 0) {
    return {
      riskLevel: 'unknown',
      score: 0,
      message: 'Could not analyze the found links.',
      links: links
    };
  }
  
  // Combine analyses
  const avgScore = Math.round(
    analyses.reduce((sum, a) => sum + a.analysis.score, 0) / analyses.length
  );
  
  const highestRisk = analyses.reduce((highest, current) => {
    const riskLevels = { low: 1, medium: 2, high: 3, unknown: 0 };
    return riskLevels[current.analysis.riskLevel] > riskLevels[highest] 
      ? current.analysis.riskLevel 
      : highest;
  }, 'low');
  
  const allConcerns = analyses.flatMap(a => a.analysis.concerns);
  const allHighlights = analyses.flatMap(a => a.analysis.highlights);
  
  return {
    riskLevel: highestRisk,
    score: avgScore,
    message: `Analyzed ${analyses.length} document(s) from this website.`,
    links: links,
    analyses: analyses,
    summary: {
      concerns: [...new Set(allConcerns)].slice(0, 5),
      highlights: [...new Set(allHighlights)].slice(0, 3),
      totalDocuments: analyses.length
    }
  };
}

// Cache management
async function cacheAnalysis(domain, analysis) {
  const data = {
    domain,
    analysis,
    timestamp: Date.now()
  };
  
  await chrome.storage.local.set({ [`analysis_${domain}`]: data });
}

async function getCachedAnalysis(domain) {
  const result = await chrome.storage.local.get([`analysis_${domain}`]);
  return result[`analysis_${domain}`] || null;
}

// Update extension badge
function updateBadge(tabId, riskLevel) {
  const colors = {
    low: '#10B981',
    medium: '#F59E0B', 
    high: '#EF4444',
    unknown: '#6B7280'
  };
  
  const texts = {
    low: 'LOW',
    medium: 'MED',
    high: 'HIGH',
    unknown: '?'
  };
  
  chrome.action.setBadgeText({
    tabId: tabId,
    text: texts[riskLevel] || '?'
  });
  
  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: colors[riskLevel] || colors.unknown
  });
}

// Clear old cache entries periodically
setInterval(async () => {
  const storage = await chrome.storage.local.get();
  const now = Date.now();
  
  for (const [key, value] of Object.entries(storage)) {
    if (key.startsWith('analysis_') && value.timestamp) {
      if (now - value.timestamp > CACHE_DURATION * 7) { // Keep for 7 days max
        await chrome.storage.local.remove([key]);
      }
    }
  }
}, 60 * 60 * 1000); // Run every hour