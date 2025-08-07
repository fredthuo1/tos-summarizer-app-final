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
            displayAnalysis(cached.analysis, true);
        } else {
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
        chrome.runtime.openOptionsPage();
    });
}

function updateWebsiteInfo(domain, url, title) {
    document.getElementById('websiteName').textContent = title || domain;
    document.getElementById('websiteUrl').textContent = domain;
}

async function requestAnalysis(tabId, domain) {
    try {
        // Inject content script to find terms links
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: findTermsAndPrivacyLinks
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
        
        // Timeout after 30 seconds
        setTimeout(() => {
            chrome.runtime.onMessage.removeListener(messageListener);
            showError('Analysis timed out');
        }, 30000);
        
    } catch (error) {
        console.error('Error requesting analysis:', error);
        showError('Failed to analyze website');
    }
}

function displayAnalysis(analysis, fromCache = false) {
    hideLoading();
    
    // Update risk assessment
    const riskIndicator = document.getElementById('riskIndicator');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    const riskMessage = document.getElementById('riskMessage');
    
    riskIndicator.className = `risk-indicator risk-${analysis.riskLevel}`;
    riskLevel.textContent = analysis.riskLevel.toUpperCase() + (fromCache ? ' (CACHED)' : '');
    riskScore.textContent = `${analysis.score}/100`;
    riskMessage.textContent = analysis.message || 'Analysis completed';
    
    // Show found links
    if (analysis.links && analysis.links.length > 0) {
        displayFoundLinks(analysis.links);
    }
    
    // Show concerns
    if (analysis.summary && analysis.summary.concerns && analysis.summary.concerns.length > 0) {
        displayConcerns(analysis.summary.concerns);
    }
    
    // Show highlights
    if (analysis.summary && analysis.summary.highlights && analysis.summary.highlights.length > 0) {
        displayHighlights(analysis.summary.highlights);
    }
}

function displayFoundLinks(links) {
    const foundLinksSection = document.getElementById('foundLinks');
    const linksList = document.getElementById('linksList');
    
    linksList.innerHTML = '';
    
    links.slice(0, 5).forEach(link => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            <span class="link-type ${link.type}">${link.type}</span>
            <span class="link-text">${link.text}</span>
        `;
        linkItem.addEventListener('click', () => {
            chrome.tabs.create({ url: link.url });
        });
        linksList.appendChild(linkItem);
    });
    
    foundLinksSection.style.display = 'block';
}

function displayConcerns(concerns) {
    const concernsSection = document.getElementById('concernsSection');
    const concernsList = document.getElementById('concernsList');
    
    concernsList.innerHTML = '';
    
    concerns.slice(0, 3).forEach(concern => {
        const li = document.createElement('li');
        li.textContent = concern;
        concernsList.appendChild(li);
    });
    
    concernsSection.style.display = 'block';
}

function displayHighlights(highlights) {
    const highlightsSection = document.getElementById('highlightsSection');
    const highlightsList = document.getElementById('highlightsList');
    
    highlightsList.innerHTML = '';
    
    highlights.slice(0, 3).forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        highlightsList.appendChild(li);
    });
    
    highlightsSection.style.display = 'block';
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

// Function to find terms and privacy links (same as in background.js)
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