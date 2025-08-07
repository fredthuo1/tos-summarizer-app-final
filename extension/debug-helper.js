// Debug helper for Terms Analyzer Extension
// Add this to any extension file for debugging

const DEBUG = true; // Set to false for production

function debugLog(context, message, data = null) {
    if (!DEBUG) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] [${context}]`;
    
    if (data) {
        console.log(`${prefix} ${message}`, data);
    } else {
        console.log(`${prefix} ${message}`);
    }
}

function debugError(context, message, error = null) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] [${context}] ERROR:`;
    
    if (error) {
        console.error(`${prefix} ${message}`, error);
    } else {
        console.error(`${prefix} ${message}`);
    }
}

function debugNetwork(url, method, status, responseTime) {
    if (!DEBUG) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] [NETWORK] ${method} ${url} → ${status} (${responseTime}ms)`);
}

// Test extension connectivity
function testExtensionConnectivity() {
    debugLog('TEST', 'Testing extension connectivity...');
    
    // Test API connectivity
    fetch('http://localhost:3000/api/analyze', {
        method: 'GET'
    })
    .then(response => {
        debugLog('TEST', `API connectivity: ${response.status}`);
        return response.json();
    })
    .then(data => {
        debugLog('TEST', 'API response:', data);
    })
    .catch(error => {
        debugError('TEST', 'API connectivity failed', error);
    });
    
    // Test extension permissions
    if (typeof chrome !== 'undefined') {
        debugLog('TEST', 'Chrome extension API available');
        
        // Test storage
        chrome.storage.local.set({test: 'value'}, () => {
            debugLog('TEST', 'Storage write test passed');
            chrome.storage.local.get(['test'], (result) => {
                debugLog('TEST', 'Storage read test:', result);
                chrome.storage.local.remove(['test']);
            });
        });
        
        // Test tabs permission
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            debugLog('TEST', 'Tabs permission test:', tabs.length > 0 ? 'PASSED' : 'FAILED');
        });
    } else {
        debugError('TEST', 'Chrome extension API not available');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { debugLog, debugError, debugNetwork, testExtensionConnectivity };
}