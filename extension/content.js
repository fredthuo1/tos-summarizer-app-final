// Content script for Terms Analyzer Extension

let notificationShown = false;
let currentAnalysis = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYSIS_RESULT') {
    currentAnalysis = message.data;
    showNotification(message.data, message.fromCache);
  }
  
  if (message.type === 'ANALYSIS_ERROR') {
    console.error('Terms analysis error:', message.error);
  }
});

// Show notification about terms analysis
function showNotification(analysis, fromCache = false) {
  if (notificationShown) return;
  
  // Don't show notification for unknown risk or very low scores
  if (analysis.riskLevel === 'unknown' || analysis.score < 20) return;
  
  notificationShown = true;
  
  const notification = createNotificationElement(analysis, fromCache);
  document.body.appendChild(notification);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 10000);
}

// Create notification element
function createNotificationElement(analysis, fromCache) {
  const notification = document.createElement('div');
  notification.id = 'terms-analyzer-notification';
  notification.innerHTML = `
    <div class="ta-notification-container">
      <div class="ta-notification-header">
        <div class="ta-notification-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="ta-notification-title">
          Terms Analyzer
          ${fromCache ? '<span class="ta-cached">(Cached)</span>' : ''}
        </div>
        <button class="ta-notification-close" onclick="this.closest('#terms-analyzer-notification').remove()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="ta-notification-content">
        <div class="ta-risk-indicator ta-risk-${analysis.riskLevel}">
          ${analysis.riskLevel.toUpperCase()} RISK (${analysis.score}/100)
        </div>
        <p class="ta-notification-message">${analysis.message}</p>
        ${analysis.summary && analysis.summary.concerns.length > 0 ? `
          <div class="ta-concerns">
            <strong>Key Concerns:</strong>
            <ul>
              ${analysis.summary.concerns.slice(0, 2).map(concern => `<li>${concern}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      <div class="ta-notification-actions">
        <button class="ta-btn ta-btn-secondary" onclick="this.closest('#terms-analyzer-notification').remove()">
          Dismiss
        </button>
        <button class="ta-btn ta-btn-primary" onclick="window.open('http://localhost:3000', '_blank')">
          View Full Analysis
        </button>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #terms-analyzer-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border: 1px solid #e5e7eb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .ta-notification-container {
      padding: 16px;
    }
    
    .ta-notification-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .ta-notification-icon {
      color: #2563eb;
      margin-right: 8px;
    }
    
    .ta-notification-title {
      font-weight: 600;
      font-size: 14px;
      color: #111827;
      flex: 1;
    }
    
    .ta-cached {
      font-size: 11px;
      color: #6b7280;
      font-weight: normal;
    }
    
    .ta-notification-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
    
    .ta-notification-close:hover {
      background: #f3f4f6;
      color: #374151;
    }
    
    .ta-risk-indicator {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .ta-risk-low {
      background: #d1fae5;
      color: #065f46;
    }
    
    .ta-risk-medium {
      background: #fef3c7;
      color: #92400e;
    }
    
    .ta-risk-high {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .ta-notification-message {
      font-size: 13px;
      color: #374151;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .ta-concerns {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    
    .ta-concerns ul {
      margin: 4px 0 0 16px;
      padding: 0;
    }
    
    .ta-concerns li {
      margin-bottom: 2px;
    }
    
    .ta-notification-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .ta-btn {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    
    .ta-btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }
    
    .ta-btn-secondary:hover {
      background: #e5e7eb;
    }
    
    .ta-btn-primary {
      background: #2563eb;
      color: white;
    }
    
    .ta-btn-primary:hover {
      background: #1d4ed8;
    }
  `;
  
  notification.appendChild(style);
  return notification;
}

// Add floating action button for quick access
function addFloatingButton() {
  const button = document.createElement('div');
  button.id = 'terms-analyzer-fab';
  button.innerHTML = `
    <div class="ta-fab-container">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    </div>
  `;
  
  const fabStyle = document.createElement('style');
  fabStyle.textContent = `
    #terms-analyzer-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      cursor: pointer;
    }
    
    .ta-fab-container {
      width: 56px;
      height: 56px;
      background: #2563eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      transition: all 0.3s ease;
    }
    
    .ta-fab-container:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
  `;
  
  button.appendChild(fabStyle);
  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'OPEN_POPUP'
    });
  });
  
  document.body.appendChild(button);
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addFloatingButton, 2000);
  });
} else {
  setTimeout(addFloatingButton, 2000);
}