// Background service worker for Terms Analyzer Extension

const API_BASE_URL = 'http://localhost:3000'; // Change to production URL when deployed
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CONCURRENT_ANALYSES = 3; // Limit concurrent API calls
const ANALYSIS_TIMEOUT = 30000; // 30 seconds timeout

// Store for analyzed websites
let analyzedSites = new Map();
let activeAnalyses = new Set();

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      const domain = new URL(tab.url).hostname;
      
      // Skip if already analyzing this domain
      if (activeAnalyses.has(domain)) {
        console.log(`Already analyzing ${domain}, skipping...`);
        return;
      }

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

      // Inject enhanced content extractor
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content-extractor.js']
      });
      
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: initializeComprehensiveExtraction
      });
    } catch (error) {
      console.error('Error processing tab update:', error);
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'COMPREHENSIVE_EXTRACTION_COMPLETE') {
    const { domain, extractionData } = message.data;
    
    // Mark domain as being analyzed
    activeAnalyses.add(domain);
    
    try {
      console.log(`🔍 Starting comprehensive analysis for ${domain}`);
      console.log(`📄 Found ${extractionData.prioritizedDocuments.length} documents and ${extractionData.inlineContent.cookieBanners.length} cookie banners`);
      
      // Analyze all found content
      const analysis = await analyzeComprehensiveContent(extractionData);
      
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
    } finally {
      // Remove from active analyses
      activeAnalyses.delete(domain);
    }
  }
  
  if (message.type === 'GET_ANALYSIS') {
    const { domain } = message.data;
    const cached = await getCachedAnalysis(domain);
    sendResponse(cached);
  }
});

// Enhanced function to initialize comprehensive extraction
function initializeComprehensiveExtraction() {
  if (typeof TermsContentExtractor === 'undefined') {
    console.error('TermsContentExtractor not loaded');
    return;
  }
  
  const domain = window.location.hostname;
  console.log(`🔍 Starting comprehensive extraction for ${domain}`);
  
  try {
    const extractor = new TermsContentExtractor();
    const extractionData = extractor.getComprehensiveAnalysisData();
    
    console.log(`📊 Extraction complete:`, {
      documents: extractionData.prioritizedDocuments.length,
      cookieBanners: extractionData.inlineContent.cookieBanners.length,
      privacyNotices: extractionData.inlineContent.privacyNotices.length,
      termsSnippets: extractionData.inlineContent.termsSnippets.length
    });
    
    // Send comprehensive data to background script
    chrome.runtime.sendMessage({
      type: 'COMPREHENSIVE_EXTRACTION_COMPLETE',
      data: { domain, extractionData }
    });
  } catch (error) {
    console.error('Comprehensive extraction failed:', error);
    chrome.runtime.sendMessage({
      type: 'EXTRACTION_ERROR',
      data: { domain, error: error.message }
    });
  }
}

// Enhanced analysis function for comprehensive content
async function analyzeComprehensiveContent(extractionData) {
  const { prioritizedDocuments, inlineContent, metadata } = extractionData;
  
  if (prioritizedDocuments.length === 0 && inlineContent.cookieBanners.length === 0) {
    return {
      domain: metadata.domain,
      riskLevel: 'unknown',
      score: 0,
      message: 'No terms, privacy policies, or cookie policies found on this website.',
      documents: [],
      inlineAnalysis: null,
      metadata: metadata,
      summary: {
        concerns: [],
        highlights: [],
        totalDocuments: 0,
        hasInlineContent: false
      },
      timestamp: Date.now()
    };
  }

  const analyses = [];
  const inlineAnalyses = [];
  
  // Analyze document links (limit to top 3 to avoid rate limits)
  const topDocuments = prioritizedDocuments.slice(0, 3);
  
  for (const doc of topDocuments) {
    try {
      console.log(`📄 Analyzing document: ${doc.url} (${doc.category})`);
      
      // Fetch document content
      const content = await fetchDocumentContent(doc.url);
      
      if (content && content.length > 100) {
        // Analyze with API
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content,
            source: doc.url,
            type: 'url'
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          analyses.push({
            document: doc,
            analysis: result.analysis,
            contentLength: content.length
          });
          console.log(`✅ Analysis complete for ${doc.url}: ${result.analysis.riskLevel} risk`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to analyze ${doc.url}:`, error);
      // Continue with other documents
    }
  }
  
  // Analyze inline content (cookie banners, privacy notices)
  if (inlineContent.cookieBanners.length > 0 || inlineContent.privacyNotices.length > 0) {
    try {
      const inlineText = [
        ...inlineContent.cookieBanners.map(b => b.text),
        ...inlineContent.privacyNotices.map(n => n.text),
        ...inlineContent.termsSnippets.map(s => s.text)
      ].join('\n\n');
      
      if (inlineText.length > 100) {
        console.log(`📝 Analyzing inline content (${inlineText.length} characters)`);
        
        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: inlineText,
            source: `${metadata.domain} - Inline Content`,
            type: 'text'
          }),
        });
        
        if (response.ok) {
          const result = await response.json();
          inlineAnalyses.push({
            type: 'inline',
            analysis: result.analysis,
            sources: {
              cookieBanners: inlineContent.cookieBanners.length,
              privacyNotices: inlineContent.privacyNotices.length,
              termsSnippets: inlineContent.termsSnippets.length
            }
          });
          console.log(`✅ Inline content analysis complete: ${result.analysis.riskLevel} risk`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to analyze inline content:', error);
    }
  }

  // Combine all analyses
  return combineComprehensiveAnalyses(analyses, inlineAnalyses, extractionData);
}

// Enhanced document content fetching
async function fetchDocumentContent(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Terms Analyzer Extension/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Extract clean text content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove non-content elements
    const elementsToRemove = doc.querySelectorAll('script, style, noscript, nav, header, footer, .nav, .header, .footer, .menu, .sidebar, .advertisement, .ads');
    elementsToRemove.forEach(el => el.remove());
    
    // Try to find main content
    const contentSelectors = ['main', '[role="main"]', '.main-content', '.content', '.terms-content', '.policy-content', '.legal-content', 'article'];
    let content = '';
    
    for (const selector of contentSelectors) {
      const contentEl = doc.querySelector(selector);
      if (contentEl && contentEl.textContent.length > content.length) {
        content = contentEl.textContent;
      }
    }
    
    // Fallback to body if no main content found
    if (!content || content.length < 200) {
      content = doc.body?.textContent || '';
    }
    
    // Clean and validate content
    const cleanContent = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
    
    if (cleanContent.length < 100) {
      throw new Error('Document content too short or empty');
    }
    
    if (cleanContent.length > 100000) {
      // Truncate very long documents
      return cleanContent.substring(0, 100000) + '\n\n[Document truncated for analysis]';
    }
    
    return cleanContent;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - document took too long to load');
    }
    throw error;
  }
}

// Combine multiple analyses into comprehensive result
function combineComprehensiveAnalyses(documentAnalyses, inlineAnalyses, extractionData) {
  const allAnalyses = [...documentAnalyses.map(d => d.analysis), ...inlineAnalyses.map(i => i.analysis)];
  
  if (allAnalyses.length === 0) {
    return {
      domain: extractionData.metadata.domain,
      riskLevel: 'unknown',
      score: 0,
      message: 'No analyzable content found on this website.',
      documents: extractionData.prioritizedDocuments,
      analyses: [],
      inlineAnalysis: null,
      metadata: extractionData.metadata,
      summary: {
        concerns: [],
        highlights: [],
        totalDocuments: 0,
        hasInlineContent: false
      },
      timestamp: Date.now()
    };
  }
  
  // Calculate combined metrics
  const avgScore = Math.round(
    allAnalyses.reduce((sum, analysis) => sum + analysis.score, 0) / allAnalyses.length
  );
  
  // Determine highest risk level
  const riskLevels = { low: 1, medium: 2, high: 3 };
  const highestRisk = allAnalyses.reduce((highest, analysis) => {
    return riskLevels[analysis.riskLevel] > riskLevels[highest] 
      ? analysis.riskLevel 
      : highest;
  }, 'low');
  
  // Combine all concerns and highlights
  const allConcerns = allAnalyses.flatMap(analysis => analysis.concerns);
  const allHighlights = allAnalyses.flatMap(analysis => analysis.highlights);
  const uniqueConcerns = [...new Set(allConcerns)];
  const uniqueHighlights = [...new Set(allHighlights)];
  
  // Create comprehensive message
  const documentCount = documentAnalyses.length;
  const inlineCount = inlineAnalyses.length;
  let message = `Analyzed ${documentCount} document(s)`;
  if (inlineCount > 0) {
    message += ` and ${inlineCount} inline content section(s)`;
  }
  message += ` from this website.`;
  
  // Enhanced summary with category breakdown
  const categoryRisks = {};
  allAnalyses.forEach(analysis => {
    Object.entries(analysis.categories).forEach(([category, data]) => {
      if (!categoryRisks[category]) {
        categoryRisks[category] = [];
      }
      categoryRisks[category].push(data.riskLevel);
    });
  });
  
  return {
    domain: extractionData.metadata.domain,
    riskLevel: highestRisk,
    score: avgScore,
    message: message,
    documents: extractionData.prioritizedDocuments,
    analyses: documentAnalyses,
    inlineAnalysis: inlineAnalyses.length > 0 ? inlineAnalyses[0] : null,
    metadata: extractionData.metadata,
    summary: {
      concerns: uniqueConcerns.slice(0, 8),
      highlights: uniqueHighlights.slice(0, 5),
      totalDocuments: documentCount,
      hasInlineContent: inlineCount > 0,
      categoryRisks: categoryRisks,
      analysisDepth: documentCount + inlineCount
    },
    timestamp: Date.now()
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

// Enhanced cleanup with better performance
// Clear old cache entries periodically
setInterval(async () => {
  const storage = await chrome.storage.local.get();
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [key, value] of Object.entries(storage)) {
    if (key.startsWith('analysis_') && value.timestamp) {
      if (now - value.timestamp > CACHE_DURATION * 7) { // Keep for 7 days max
        await chrome.storage.local.remove([key]);
        cleanedCount++;
      }
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned ${cleanedCount} old cache entries`);
  }
}, 60 * 60 * 1000); // Run every hour