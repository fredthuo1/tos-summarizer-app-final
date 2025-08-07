// Advanced content extraction for Terms Analyzer Extension

class TermsContentExtractor {
    constructor() {
        this.selectors = {
            // Terms of Service selectors
            terms: [
                'a[href*="terms"]',
                'a[href*="tos"]',
                'a[href*="conditions"]',
                'a[href*="agreement"]',
                'a[href*="eula"]',
                'a[href*="service-agreement"]',
                'a[href*="user-agreement"]',
                '[data-testid*="terms"]',
                '[class*="terms"]',
                '[id*="terms"]'
            ],
            
            // Privacy Policy selectors
            privacy: [
                'a[href*="privacy"]',
                'a[href*="data-policy"]',
                'a[href*="data-protection"]',
                '[data-testid*="privacy"]',
                '[class*="privacy"]',
                '[id*="privacy"]'
            ],
            
            // Cookie Policy selectors
            cookies: [
                'a[href*="cookie"]',
                'a[href*="cookies"]',
                'a[href*="tracking"]',
                '[data-testid*="cookie"]',
                '[class*="cookie"]',
                '[id*="cookie"]',
                '.cookie-policy',
                '#cookie-policy'
            ],
            
            // Legal/Compliance selectors
            legal: [
                'a[href*="legal"]',
                'a[href*="compliance"]',
                'a[href*="gdpr"]',
                'a[href*="ccpa"]',
                'a[href*="disclaimer"]',
                '[class*="legal"]',
                '[id*="legal"]'
            ],
            
            // Footer and navigation areas where legal links are commonly found
            containers: [
                'footer',
                '.footer',
                '#footer',
                'nav',
                '.nav',
                '.navigation',
                '.legal-links',
                '.policy-links',
                '.site-links',
                '.bottom-links',
                '[role="contentinfo"]'
            ]
        };
        
        this.textPatterns = {
            terms: [
                /terms\s+of\s+(service|use)/i,
                /user\s+agreement/i,
                /service\s+agreement/i,
                /end\s+user\s+license/i,
                /terms\s+and\s+conditions/i,
                /website\s+terms/i,
                /platform\s+terms/i
            ],
            privacy: [
                /privacy\s+policy/i,
                /privacy\s+notice/i,
                /data\s+policy/i,
                /data\s+protection/i,
                /privacy\s+statement/i,
                /information\s+practices/i
            ],
            cookies: [
                /cookie\s+policy/i,
                /cookie\s+notice/i,
                /cookie\s+statement/i,
                /tracking\s+policy/i,
                /cookies?\s+and\s+tracking/i,
                /about\s+cookies/i
            ],
            legal: [
                /legal\s+notice/i,
                /legal\s+information/i,
                /disclaimer/i,
                /compliance/i,
                /gdpr/i,
                /ccpa/i
            ]
        };
    }

    // Main extraction method
    extractAllLegalDocuments() {
        const results = {
            domain: window.location.hostname,
            url: window.location.href,
            timestamp: Date.now(),
            documents: {
                terms: [],
                privacy: [],
                cookies: [],
                legal: []
            },
            inlineContent: {
                cookieBanners: [],
                privacyNotices: [],
                termsSnippets: []
            },
            metadata: {
                totalLinks: 0,
                uniqueUrls: new Set(),
                confidence: 'high'
            }
        };

        // Extract links by category
        Object.keys(this.selectors).forEach(category => {
            if (category !== 'containers') {
                results.documents[category] = this.findDocumentLinks(category);
            }
        });

        // Extract inline content
        results.inlineContent = this.extractInlineContent();

        // Calculate metadata
        const allDocs = Object.values(results.documents).flat();
        results.metadata.totalLinks = allDocs.length;
        allDocs.forEach(doc => results.metadata.uniqueUrls.add(doc.url));
        results.metadata.uniqueUrls = Array.from(results.metadata.uniqueUrls);

        return results;
    }

    // Find document links by category
    findDocumentLinks(category) {
        const documents = [];
        const selectors = this.selectors[category] || [];
        const patterns = this.textPatterns[category] || [];

        // Search by selectors
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const doc = this.processElement(el, category);
                    if (doc && !documents.some(d => d.url === doc.url)) {
                        documents.push(doc);
                    }
                });
            } catch (e) {
                console.warn(`Selector failed: ${selector}`, e);
            }
        });

        // Search by text patterns in all links
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            const text = (link.textContent || '').trim();
            const href = link.href || '';
            const combined = `${text} ${href}`.toLowerCase();

            patterns.forEach(pattern => {
                if (pattern.test(combined)) {
                    const doc = this.processElement(link, category);
                    if (doc && !documents.some(d => d.url === doc.url)) {
                        documents.push(doc);
                    }
                }
            });
        });

        // Search within common container areas
        this.selectors.containers.forEach(containerSelector => {
            try {
                const containers = document.querySelectorAll(containerSelector);
                containers.forEach(container => {
                    const links = container.querySelectorAll('a[href]');
                    links.forEach(link => {
                        const text = (link.textContent || '').trim().toLowerCase();
                        const href = (link.href || '').toLowerCase();

                        patterns.forEach(pattern => {
                            if (pattern.test(text) || pattern.test(href)) {
                                const doc = this.processElement(link, category);
                                if (doc && !documents.some(d => d.url === doc.url)) {
                                    doc.foundIn = containerSelector;
                                    documents.push(doc);
                                }
                            }
                        });
                    });
                });
            } catch (e) {
                console.warn(`Container search failed: ${containerSelector}`, e);
            }
        });

        return documents.sort((a, b) => b.confidence - a.confidence);
    }

    // Process individual elements
    processElement(element, category) {
        if (!element.href) return null;

        try {
            const url = new URL(element.href, window.location.href);
            
            // Skip non-HTTP URLs
            if (!['http:', 'https:'].includes(url.protocol)) return null;
            
            // Skip obvious non-legal links
            if (this.isNonLegalUrl(url.href)) return null;

            const text = (element.textContent || '').trim();
            const title = element.title || element.getAttribute('aria-label') || '';
            
            return {
                url: url.href,
                text: text,
                title: title,
                category: category,
                confidence: this.calculateConfidence(url.href, text, category),
                element: {
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id
                },
                context: this.getElementContext(element)
            };
        } catch (e) {
            return null;
        }
    }

    // Calculate confidence score for link relevance
    calculateConfidence(url, text, category) {
        let confidence = 0;
        const combined = `${url} ${text}`.toLowerCase();
        
        // URL-based scoring
        if (combined.includes(category)) confidence += 30;
        if (combined.includes('policy')) confidence += 20;
        if (combined.includes('legal')) confidence += 15;
        
        // Text quality scoring
        if (text.length > 5 && text.length < 50) confidence += 10;
        if (text.includes('Policy') || text.includes('Terms')) confidence += 15;
        
        // Penalty for generic terms
        if (combined.includes('help') || combined.includes('support')) confidence -= 10;
        if (combined.includes('contact') || combined.includes('about')) confidence -= 5;
        
        return Math.max(0, Math.min(100, confidence));
    }

    // Check if URL is obviously not a legal document
    isNonLegalUrl(url) {
        const nonLegalPatterns = [
            /\.(jpg|jpeg|png|gif|svg|ico|pdf|doc|docx)$/i,
            /\/images?\//i,
            /\/assets?\//i,
            /\/static\//i,
            /\/media\//i,
            /javascript:/i,
            /mailto:/i,
            /tel:/i,
            /#/,
            /\/search/i,
            /\/login/i,
            /\/register/i,
            /\/cart/i,
            /\/checkout/i
        ];
        
        return nonLegalPatterns.some(pattern => pattern.test(url));
    }

    // Get context information about element placement
    getElementContext(element) {
        const parent = element.parentElement;
        const grandParent = parent?.parentElement;
        
        return {
            parentTag: parent?.tagName,
            parentClass: parent?.className,
            grandParentTag: grandParent?.tagName,
            isInFooter: !!element.closest('footer, .footer, #footer'),
            isInNav: !!element.closest('nav, .nav, .navigation'),
            isInSidebar: !!element.closest('.sidebar, .side-nav, aside'),
            depth: this.getElementDepth(element)
        };
    }

    // Calculate element depth in DOM
    getElementDepth(element) {
        let depth = 0;
        let current = element;
        while (current.parentElement) {
            depth++;
            current = current.parentElement;
        }
        return depth;
    }

    // Extract inline content like cookie banners and privacy notices
    extractInlineContent() {
        const inlineContent = {
            cookieBanners: this.findCookieBanners(),
            privacyNotices: this.findPrivacyNotices(),
            termsSnippets: this.findTermsSnippets()
        };

        return inlineContent;
    }

    // Find cookie banners and consent notices
    findCookieBanners() {
        const banners = [];
        const cookieBannerSelectors = [
            '[class*="cookie"]',
            '[id*="cookie"]',
            '[class*="consent"]',
            '[id*="consent"]',
            '[class*="gdpr"]',
            '[id*="gdpr"]',
            '[class*="privacy-banner"]',
            '[data-testid*="cookie"]',
            '[role="dialog"][aria-label*="cookie" i]',
            '[role="banner"][class*="cookie"]'
        ];

        cookieBannerSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent?.trim();
                    if (text && text.length > 20 && text.length < 1000) {
                        // Check if it's actually about cookies
                        if (/cookie|consent|gdpr|privacy|tracking/i.test(text)) {
                            banners.push({
                                text: text,
                                selector: selector,
                                visible: this.isElementVisible(el),
                                position: this.getElementPosition(el)
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn(`Cookie banner selector failed: ${selector}`, e);
            }
        });

        return banners;
    }

    // Find privacy notices in page content
    findPrivacyNotices() {
        const notices = [];
        const privacySelectors = [
            '[class*="privacy"]',
            '[id*="privacy"]',
            '[class*="data-protection"]',
            '[class*="personal-data"]'
        ];

        privacySelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent?.trim();
                    if (text && text.length > 50 && text.length < 2000) {
                        if (/privacy|personal.data|information.collection/i.test(text)) {
                            notices.push({
                                text: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
                                selector: selector,
                                fullLength: text.length
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn(`Privacy notice selector failed: ${selector}`, e);
            }
        });

        return notices;
    }

    // Find terms snippets in page content
    findTermsSnippets() {
        const snippets = [];
        const termsSelectors = [
            '[class*="terms"]',
            '[id*="terms"]',
            '[class*="conditions"]',
            '[class*="agreement"]'
        ];

        termsSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent?.trim();
                    if (text && text.length > 50 && text.length < 2000) {
                        if (/terms|conditions|agreement|liability|warranty/i.test(text)) {
                            snippets.push({
                                text: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
                                selector: selector,
                                fullLength: text.length
                            });
                        }
                    }
                });
            } catch (e) {
                console.warn(`Terms snippet selector failed: ${selector}`, e);
            }
        });

        return snippets;
    }

    // Check if element is visible
    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0' &&
               element.offsetWidth > 0 && 
               element.offsetHeight > 0;
    }

    // Get element position information
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            inViewport: rect.top >= 0 && rect.left >= 0 && 
                       rect.bottom <= window.innerHeight && 
                       rect.right <= window.innerWidth
        };
    }

    // Extract comprehensive page metadata
    extractPageMetadata() {
        return {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content || '',
            keywords: document.querySelector('meta[name="keywords"]')?.content || '',
            language: document.documentElement.lang || 'en',
            lastModified: document.lastModified,
            url: window.location.href,
            domain: window.location.hostname,
            path: window.location.pathname,
            hasSSL: window.location.protocol === 'https:',
            wordCount: this.getPageWordCount(),
            hasGDPRBanner: this.hasGDPRCompliance(),
            hasCookieConsent: this.hasCookieConsent()
        };
    }

    // Count words on page
    getPageWordCount() {
        const text = document.body.textContent || '';
        return text.trim().split(/\s+/).length;
    }

    // Check for GDPR compliance indicators
    hasGDPRCompliance() {
        const pageText = document.body.textContent?.toLowerCase() || '';
        return /gdpr|general.data.protection|data.protection.regulation/i.test(pageText);
    }

    // Check for cookie consent mechanisms
    hasCookieConsent() {
        const consentSelectors = [
            '[class*="cookie-consent"]',
            '[class*="cookie-banner"]',
            '[id*="cookie-consent"]',
            '[id*="cookie-banner"]',
            '[class*="consent-manager"]'
        ];

        return consentSelectors.some(selector => {
            return document.querySelector(selector) !== null;
        });
    }

    // Fetch and analyze document content
    async fetchDocumentContent(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Terms Analyzer Extension/1.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                credentials: 'omit',
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            return this.extractTextFromHTML(html);
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            throw error;
        }
    }

    // Extract clean text from HTML
    extractTextFromHTML(html) {
        // Create a temporary DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove script and style elements
        const scripts = doc.querySelectorAll('script, style, noscript');
        scripts.forEach(el => el.remove());

        // Remove navigation and header elements that aren't content
        const nonContent = doc.querySelectorAll('nav, header, .nav, .header, .menu, .sidebar');
        nonContent.forEach(el => el.remove());

        // Get main content areas
        const contentSelectors = [
            'main',
            '[role="main"]',
            '.main-content',
            '.content',
            '.terms-content',
            '.policy-content',
            '.legal-content',
            'article',
            '.article'
        ];

        let content = '';
        
        // Try to find main content area first
        for (const selector of contentSelectors) {
            const contentEl = doc.querySelector(selector);
            if (contentEl) {
                content = contentEl.textContent || '';
                break;
            }
        }

        // Fallback to body content
        if (!content || content.length < 100) {
            content = doc.body?.textContent || '';
        }

        // Clean up the text
        return content
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }

    // Prioritize documents by relevance and quality
    prioritizeDocuments(documents) {
        return documents
            .filter(doc => doc.confidence > 20)
            .sort((a, b) => {
                // Sort by confidence first
                if (b.confidence !== a.confidence) {
                    return b.confidence - a.confidence;
                }
                
                // Then by category importance
                const categoryPriority = { terms: 4, privacy: 3, cookies: 2, legal: 1 };
                const aPriority = categoryPriority[a.category] || 0;
                const bPriority = categoryPriority[b.category] || 0;
                
                return bPriority - aPriority;
            });
    }

    // Get comprehensive analysis data
    getComprehensiveAnalysisData() {
        const extraction = this.extractAllLegalDocuments();
        const metadata = this.extractPageMetadata();
        
        // Combine all documents
        const allDocuments = Object.values(extraction.documents).flat();
        const prioritizedDocs = this.prioritizeDocuments(allDocuments);
        
        return {
            ...extraction,
            metadata: {
                ...extraction.metadata,
                ...metadata
            },
            prioritizedDocuments: prioritizedDocs.slice(0, 5), // Top 5 most relevant
            analysisReady: prioritizedDocs.length > 0 || extraction.inlineContent.cookieBanners.length > 0
        };
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.TermsContentExtractor = TermsContentExtractor;
}