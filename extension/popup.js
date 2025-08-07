// Popup script for Terms Analyzer Extension

const API_BASE_URL = 'http://localhost:3000'; // Change to production URL when deployed

document.addEventListener('DOMContentLoaded', async () => {
    await initializePopup();
    setupEventListeners();
});

async function initializePopup() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
            showError('Cannot analyze this page');
            return;
        }
        
        const domain = new URL(tab.url).hostname;
        
        // Update website info
        updateWebsiteInfo(domain, tab.url, tab.title);
        
        // Check for cached analysis
        const cached = await getCachedAnalysis(domain);
        
        if (cached && (Date.now() - cached.timestamp) < 24 * 60 * 60 * 1000) {
            console.log(`📋 Using cached analysis for ${domain}`);
            displayAnalysis(cached.analysis, true);
        } else {
            console.log(`🔍 Requesting fresh analysis for ${domain}`);
            // Request fresh analysis
            requestAnalysis(tab.id, domain);
        }
        
    } catch (error) {
        console.error('Error initializing popup:', error);
        showError('Failed to initialize analysis');
    }
}

function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            const domain = new URL(tab.url).hostname;
            // Clear cache and request fresh analysis
            await clearCachedAnalysis(domain);
            showLoading();
            requestAnalysis(tab.id, domain);
        }
    });
    
    document.getElementById('viewFullBtn').addEventListener('click', () => {
        chrome.tabs.create({ url: API_BASE_URL });
    });
    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        // For now, open the main app
        chrome.tabs.create({ url: `${API_BASE_URL}/extension` });
    });
}

function updateWebsiteInfo(domain, url, title) {
    document.getElementById('websiteName').textContent = title || domain;
    document.getElementById('websiteUrl').textContent = domain;
}

async function requestAnalysis(tabId, domain) {
    try {
        // Inject enhanced content extractor
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content-extractor.js']
        });
        
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: initializeComprehensiveExtraction
        });
        
        // Listen for analysis result
        const messageListener = (message) => {
            if (message.type === 'ANALYSIS_RESULT') {
                displayAnalysis(message.data, message.fromCache);
                chrome.runtime.onMessage.removeListener(messageListener);
            } else if (message.type === 'ANALYSIS_ERROR') {
                showError(message.error);
                chrome.runtime.onMessage.removeListener(messageListener);
            }
        };
        
        chrome.runtime.onMessage.addListener(messageListener);
        
        // Timeout after 45 seconds (longer for comprehensive analysis)
        setTimeout(() => {
            chrome.runtime.onMessage.removeListener(messageListener);
            showError('Analysis timed out - website may be slow or blocking requests');
        }, 45000);
        
    } catch (error) {
        console.error('Error requesting analysis:', error);
        showError('Failed to analyze website');
    }
}

// Enhanced display with comprehensive data
function displayAnalysis(analysis, fromCache = false) {
    hideLoading();
    
    console.log('📊 Displaying analysis:', analysis);
    
    // Update risk assessment
    const riskIndicator = document.getElementById('riskIndicator');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    const riskMessage = document.getElementById('riskMessage');
    
    riskIndicator.className = `risk-indicator risk-${analysis.riskLevel}`;
    riskLevel.textContent = analysis.riskLevel.toUpperCase() + 
                           (fromCache ? ' (CACHED)' : '') +
                           (analysis.summary?.hasInlineContent ? ' +INLINE' : '');
    riskScore.textContent = `${analysis.score}/100`;
    
    // Enhanced message with more details
    let message = analysis.message || 'Analysis completed';
    if (analysis.summary?.analysisDepth) {
        message += ` (Depth: ${analysis.summary.analysisDepth})`;
    }
    riskMessage.textContent = message;
    
    // Show found documents with enhanced details
    if (analysis.documents && analysis.documents.length > 0) {
        displayFoundDocuments(analysis.documents);
    }
    
    // Show concerns with enhanced formatting
    if (analysis.summary?.concerns && analysis.summary.concerns.length > 0) {
        displayConcerns(analysis.summary.concerns);
    }
    
    // Show highlights with enhanced formatting
    if (analysis.summary?.highlights && analysis.summary.highlights.length > 0) {
        displayHighlights(analysis.summary.highlights);
    }
    
    // Show inline content analysis if available
    if (analysis.inlineAnalysis) {
        displayInlineAnalysis(analysis.inlineAnalysis);
    }
    
    // Show metadata insights
    if (analysis.metadata) {
        displayMetadataInsights(analysis.metadata);
    }
}

// Enhanced document display
function displayFoundDocuments(documents) {
    const foundLinksSection = document.getElementById('foundLinks');
    const linksList = document.getElementById('linksList');
    
    linksList.innerHTML = '';
    
    documents.slice(0, 6).forEach(doc => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        
        const confidenceColor = doc.confidence > 70 ? '#059669' : 
                               doc.confidence > 40 ? '#d97706' : '#6b7280';
        
        linkItem.innerHTML = `
            <span class="link-type ${doc.category}">${doc.category}</span>
            <span class="link-text">${doc.text || 'Legal Document'}</span>
            <span class="link-confidence" style="color: ${confidenceColor}; font-size: 10px;">
                ${doc.confidence}%
            </span>
        `;
        linkItem.addEventListener('click', () => {
            chrome.tabs.create({ url: doc.url });
        });
        linkItem.title = `${doc.category} - Confidence: ${doc.confidence}% - Click to open`;
        linksList.appendChild(linkItem);
    });
    
    foundLinksSection.style.display = 'block';
}

// Enhanced concerns display
function displayConcerns(concerns) {
    const concernsSection = document.getElementById('concernsSection');
    const concernsList = document.getElementById('concernsList');
    
    concernsList.innerHTML = '';
    
    concerns.slice(0, 5).forEach((concern, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="concern-priority">${index + 1}</span>
            <span class="concern-text">${concern}</span>
        `;
        concernsList.appendChild(li);
    });
    
    if (concerns.length > 5) {
        const moreItem = document.createElement('li');
        moreItem.innerHTML = `<em>+${concerns.length - 5} more concerns in full analysis</em>`;
        moreItem.style.fontStyle = 'italic';
        moreItem.style.color = '#6b7280';
        concernsList.appendChild(moreItem);
    }
    
    concernsSection.style.display = 'block';
}

// Enhanced highlights display
function displayHighlights(highlights) {
    const highlightsSection = document.getElementById('highlightsSection');
    const highlightsList = document.getElementById('highlightsList');
    
    highlightsList.innerHTML = '';
    
    highlights.slice(0, 4).forEach((highlight, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="highlight-icon">✅</span>
            <span class="highlight-text">${highlight}</span>
        `;
        highlightsList.appendChild(li);
    });
    
    highlightsSection.style.display = 'block';
}

// Display inline content analysis
function displayInlineAnalysis(inlineAnalysis) {
    // Create inline analysis section if it doesn't exist
    let inlineSection = document.getElementById('inlineSection');
    if (!inlineSection) {
        inlineSection = document.createElement('div');
        inlineSection.id = 'inlineSection';
        inlineSection.className = 'inline-analysis';
        inlineSection.innerHTML = `
            <h3>🍪 Inline Content Analysis</h3>
            <div id="inlineContent"></div>
        `;
        document.getElementById('content').appendChild(inlineSection);
    }
    
    const inlineContent = document.getElementById('inlineContent');
    inlineContent.innerHTML = `
        <div class="inline-summary">
            <div class="inline-risk risk-${inlineAnalysis.analysis.riskLevel}">
                ${inlineAnalysis.analysis.riskLevel.toUpperCase()} RISK (${inlineAnalysis.analysis.score}/100)
            </div>
            <p class="inline-description">
                Analysis of cookie banners and privacy notices found on this page.
            </p>
            <div class="inline-sources">
                <small>
                    Sources: ${inlineAnalysis.sources.cookieBanners} cookie banner(s), 
                    ${inlineAnalysis.sources.privacyNotices} privacy notice(s), 
                    ${inlineAnalysis.sources.termsSnippets} terms snippet(s)
                </small>
            </div>
        </div>
    `;
    
    inlineSection.style.display = 'block';
}

// Display metadata insights
function displayMetadataInsights(metadata) {
    // Create metadata section if it doesn't exist
    let metadataSection = document.getElementById('metadataSection');
    if (!metadataSection) {
        metadataSection = document.createElement('div');
        metadataSection.id = 'metadataSection';
        metadataSection.className = 'metadata-insights';
        metadataSection.innerHTML = `
            <h3>📊 Website Insights</h3>
            <div id="metadataContent"></div>
        `;
        document.getElementById('content').appendChild(metadataSection);
    }
    
    const metadataContent = document.getElementById('metadataContent');
    metadataContent.innerHTML = `
        <div class="metadata-grid">
            <div class="metadata-item">
                <span class="metadata-label">Security:</span>
                <span class="metadata-value ${metadata.hasSSL ? 'positive' : 'negative'}">
                    ${metadata.hasSSL ? '🔒 HTTPS' : '⚠️ HTTP'}
                </span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">GDPR:</span>
                <span class="metadata-value ${metadata.hasGDPRBanner ? 'positive' : 'neutral'}">
                    ${metadata.hasGDPRBanner ? '✅ Detected' : '❓ Not Found'}
                </span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Cookie Consent:</span>
                <span class="metadata-value ${metadata.hasCookieConsent ? 'positive' : 'neutral'}">
                    ${metadata.hasCookieConsent ? '✅ Present' : '❓ Not Found'}
                </span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Page Size:</span>
                <span class="metadata-value">${metadata.wordCount?.toLocaleString()} words</span>
            </div>
        </div>
    `;
    
    metadataSection.style.display = 'block';
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('content').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

function showError(message) {
    hideLoading();
    
    const riskIndicator = document.getElementById('riskIndicator');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    const riskMessage = document.getElementById('riskMessage');
    
    riskIndicator.className = 'risk-indicator risk-unknown';
    riskLevel.textContent = 'ERROR';
    riskScore.textContent = '';
    riskMessage.textContent = message;
}

// Helper functions
async function getCachedAnalysis(domain) {
    const result = await chrome.storage.local.get([`analysis_${domain}`]);
    return result[`analysis_${domain}`] || null;
}

async function clearCachedAnalysis(domain) {
    await chrome.storage.local.remove([`analysis_${domain}`]);
}

// Enhanced comprehensive extraction function
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