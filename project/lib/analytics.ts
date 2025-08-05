// Google Analytics utility functions
declare global {
    interface Window {
        gtag: (command: string, targetId: string, config?: any) => void;
    }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track page views
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GA_TRACKING_ID, {
            page_location: url,
        });
    }
};

// Track custom events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track analysis events
export const trackAnalysis = (type: 'url' | 'text' | 'file', riskLevel: string, score: number) => {
    event({
        action: 'analysis_completed',
        category: 'Analysis',
        label: `${type}_${riskLevel}`,
        value: score,
    });
};

// Track PDF exports
export const trackPDFExport = (riskLevel: string) => {
    event({
        action: 'pdf_export',
        category: 'Export',
        label: riskLevel,
    });
};

// Track test page usage
export const trackTestUsage = (testType: string) => {
    event({
        action: 'test_run',
        category: 'Testing',
        label: testType,
    });
};