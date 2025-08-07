// Content script for Terms Analyzer Extension

let notificationShown = false;
let currentAnalysis = null;
let extractionInProgress = false;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ANALYSIS_RESULT') {
    currentAnalysis = message.data;
    showNotification(message.data, message.fromCache);
  }
  
  if (message.type === 'ANALYSIS_ERROR') {
    console.error('Terms analysis error:', message.error);
    showErrorNotification(message.error);
  }
});

// Enhanced notification system
function showNotification(analysis, fromCache = false) {
  if (notificationShown) return;
  
  // Don't show notification for unknown risk or very low scores
  if (analysis.riskLevel === 'unknown' || analysis.score < 20) return;
  
  // Don't show for low risk unless there are specific concerns
  if (analysis.riskLevel === 'low' && analysis.summary.concerns.length === 0) return;
  
  notificationShown = true;
  
  const notification = createNotificationElement(analysis, fromCache);
  document.body.appendChild(notification);
  
  // Auto-hide based on risk level
  const hideDelay = analysis.riskLevel === 'high' ? 15000 : 
                   analysis.riskLevel === 'medium' ? 12000 : 8000;
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, hideDelay);
}

// Enhanced notification with more details
function createNotificationElement(analysis, fromCache) {
  const notification = document.createElement('div');
  notification.id = 'terms-analyzer-notification';
  
  const riskEmoji = {
    high: '🚨',
    medium: '⚠️', 
    low: '✅',
    unknown: '❓'
  };
  
  const analysisDetails = analysis.summary || {};
  const documentCount = analysisDetails.totalDocuments || 0;
  const hasInlineContent = analysisDetails.hasInlineContent || false;
  
  notification.innerHTML = `
    <div class="ta-notification-container">
      <div class="ta-notification-header">
        <div class="ta-notification-icon">
          ${riskEmoji[analysis.riskLevel]} 
        </div>
        <div class="ta-notification-title">
          Terms Analyzer
          ${fromCache ? '<span class="ta-cached">(Cached)</span>' : ''}
          ${hasInlineContent ? '<span class="ta-inline">+Inline</span>' : ''}
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
          ${riskEmoji[analysis.riskLevel]} ${analysis.riskLevel.toUpperCase()} RISK (${analysis.score}/100)
        </div>
        <p class="ta-notification-message">
          ${analysis.message}
          ${documentCount > 0 ? `<br><small>📄 ${documentCount} document(s) analyzed</small>` : ''}
          ${hasInlineContent ? `<br><small>🍪 Cookie/privacy content detected</small>` : ''}
        </p>
        ${analysisDetails.concerns && analysisDetails.concerns.length > 0 ? `
          <div class="ta-concerns">
            <strong>🚨 Key Concerns (${analysisDetails.concerns.length}):</strong>
            <ul>
              ${analysisDetails.concerns.slice(0, 3).map(concern => `<li>${concern}</li>`).join('')}
              ${analysisDetails.concerns.length > 3 ? `<li><em>+${analysisDetails.concerns.length - 3} more concerns...</em></li>` : ''}
            </ul>
          </div>
        ` : ''}
        ${analysisDetails.highlights && analysisDetails.highlights.length > 0 ? `
          <div class="ta-highlights">
            <strong>✅ Positive Aspects (${analysisDetails.highlights.length}):</strong>
            <ul>
              ${analysisDetails.highlights.slice(0, 2).map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      <div class="ta-notification-actions">
        <button class="ta-btn ta-btn-secondary" onclick="this.closest('#terms-analyzer-notification').remove()">
          Dismiss
        </button>
        <button class="ta-btn ta-btn-primary" onclick="window.open('http://localhost:3000', '_blank')">
          Full Report
        </button>
      </div>
    </div>
  `;
  
  // Enhanced styles
  const style = document.createElement('style');
  style.textContent = `
    #terms-analyzer-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 420px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
      border: 2px solid ${analysis.riskLevel === 'high' ? '#ef4444' : analysis.riskLevel === 'medium' ? '#f59e0b' : '#10b981'};
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
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .ta-notification-container {
      padding: 18px;
    }
    
    .ta-notification-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .ta-notification-icon {
      font-size: 18px;
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
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 6px;
    }
    
    .ta-inline {
      font-size: 11px;
      color: #059669;
      font-weight: normal;
      background: #d1fae5;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 6px;
    }
    
    .ta-notification-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .ta-notification-close:hover {
      background: #f3f4f6;
      color: #374151;
      transform: scale(1.1);
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
      border: 1px solid #a7f3d0;
    }
    
    .ta-risk-medium {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    
    .ta-risk-high {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }
    
    .ta-notification-message {
      font-size: 13px;
      color: #374151;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
    
    .ta-concerns, .ta-highlights {
      font-size: 12px;
      margin-bottom: 12px;
      padding: 8px;
      border-radius: 6px;
    }
    
    .ta-concerns {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #7f1d1d;
    }
    
    .ta-highlights {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #14532d;
    }
    
    .ta-concerns ul, .ta-highlights ul {
      margin: 4px 0 0 16px;
      padding: 0;
    }
    
    .ta-concerns li, .ta-highlights li {
      margin-bottom: 2px;
      line-height: 1.3;
    }
    
    .ta-notification-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 12px;
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
      transform: translateY(-1px);
    }
    
    .ta-btn-primary {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: white;
    }
    
    .ta-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  `;
  
  notification.appendChild(style);
  return notification;
}

// Show error notification
function showErrorNotification(error) {
  if (notificationShown) return;
  
  notificationShown = true;
  
  const notification = document.createElement('div');
  notification.id = 'terms-analyzer-error-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 350px;
      background: #fee2e2;
      border: 2px solid #fca5a5;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 16px; margin-right: 8px;">❌</span>
        <span style="font-weight: 600; color: #991b1b;">Analysis Failed</span>
        <button onclick="this.closest('#terms-analyzer-error-notification').remove()" style="
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          margin-left: auto;
        ">×</button>
      </div>
      <p style="font-size: 12px; color: #7f1d1d; margin: 0;">
        ${error || 'Could not analyze this website'}
      </p>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Add floating action button for quick access
function addFloatingButton() {
  // Don't add if already exists
  if (document.getElementById('terms-analyzer-fab')) return;
  
  const button = document.createElement('div');
  button.id = 'terms-analyzer-fab';
  button.innerHTML = `
    <div class="ta-fab-container">
      <span style="font-size: 20px;">🛡️</span>
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
      transition: all 0.3s ease;
    }
    
    .ta-fab-container {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
      transition: all 0.3s ease;
    }
    
    .ta-fab-container:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.5);
    }
    
    #terms-analyzer-fab.analyzing .ta-fab-container {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `;
  
  button.appendChild(fabStyle);
  button.addEventListener('click', () => {
    // Open extension popup or main app
    window.open('http://localhost:3000', '_blank');
  });
  
  document.body.appendChild(button);
  
  // Show analysis status on FAB
  if (currentAnalysis) {
    updateFABStatus(currentAnalysis.riskLevel);
  }
}

// Update FAB visual status
function updateFABStatus(riskLevel) {
  const fab = document.getElementById('terms-analyzer-fab');
  if (!fab) return;
  
  const container = fab.querySelector('.ta-fab-container');
  if (!container) return;
  
  const colors = {
    high: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    medium: 'linear-gradient(135deg, #d97706, #b45309)', 
    low: 'linear-gradient(135deg, #059669, #047857)',
    unknown: 'linear-gradient(135deg, #6b7280, #4b5563)'
  };
  
  container.style.background = colors[riskLevel] || colors.unknown;
}

// Show analysis in progress
function showAnalysisProgress() {
  const fab = document.getElementById('terms-analyzer-fab');
  if (fab) {
    fab.classList.add('analyzing');
  }
}

// Hide analysis progress
function hideAnalysisProgress() {
  const fab = document.getElementById('terms-analyzer-fab');
  if (fab) {
    fab.classList.remove('analyzing');
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      addFloatingButton();
      // Reset notification state for new page
      notificationShown = false;
    }, 2000);
  });
} else {
  setTimeout(() => {
    addFloatingButton();
    notificationShown = false;
  }, 2000);
}

// Listen for analysis progress updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'ANALYSIS_STARTED') {
    showAnalysisProgress();
  } else if (message.type === 'ANALYSIS_COMPLETE' || message.type === 'ANALYSIS_ERROR') {
    hideAnalysisProgress();
  }
});

// Enhanced page change detection
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    notificationShown = false;
    currentAnalysis = null;
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('#terms-analyzer-notification, #terms-analyzer-error-notification');
    existingNotifications.forEach(n => n.remove());
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  observer.disconnect();
}
)