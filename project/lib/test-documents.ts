// Test documents for end-to-end analysis testing
export const testDocuments = {
    highRisk: `Terms of Service - Social Media Platform
Last Updated: January 15, 2024
Effective Date: January 15, 2024

1. ACCEPTANCE OF TERMS
By accessing or using our service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.

2. DATA COLLECTION AND USAGE
We collect extensive personal information including your name, email address, phone number, location data, browsing habits, device information, contacts, and behavioral patterns. We track across websites and applications to build comprehensive user profiles. This data may be sold to third parties for advertising and marketing purposes. We retain data indefinitely unless you specifically request deletion.

3. USER OBLIGATIONS AND LIABILITY
Users must indemnify the company for any legal costs, damages, or liabilities arising from their use of the service. You agree to unlimited liability for any claims related to your account or content. Users waive class action rights and agree to individual arbitration only.

4. CONTENT RIGHTS AND OWNERSHIP
By uploading content, users transfer perpetual rights to the company. We may modify, distribute, monetize, or create derivative works from user content without compensation. Users grant us an irrevocable, worldwide license to use their content in any manner we see fit.

5. SERVICE TERMINATION
We may terminate accounts immediately without cause or notice. Upon termination, users forfeit all paid fees and cannot transfer account data. We reserve the right to retain and use your data even after account termination.

6. DISPUTE RESOLUTION
All disputes must be resolved through company-chosen arbitration. Users waive jury trial rights and cannot pursue class action lawsuits. The company selects the arbitrator, creating potential bias in dispute resolution.

7. LIABILITY LIMITATIONS
We disclaim all warranties and exclude liability for consequential damages. The company assumes no responsibility for data breaches, service interruptions, or financial losses. Users assume all risks associated with service usage.`,

    mediumRisk: `Terms of Service - E-commerce Platform
Last Updated: December 1, 2023
Effective Date: December 1, 2023
Governing Law: These terms are governed by the laws of California, United States.

1. SERVICE AGREEMENT
By using our platform, you agree to these terms and conditions. We reserve the right to modify these terms with 30 days notice to users.

2. DATA COLLECTION AND PRIVACY
We collect personal information including your name, email, billing address, and purchase history. This information may be shared with trusted partners for order fulfillment and customer service. We comply with applicable privacy laws and provide data portability options upon request.

3. USER ACCOUNTS AND RESPONSIBILITIES
Users are responsible for maintaining account security and accurate information. We may suspend accounts that violate our terms with reasonable notice and opportunity to cure violations.

4. PAYMENT AND REFUNDS
We offer a 30-day return policy for most products. Refunds are processed within 5-10 business days. Users are responsible for return shipping costs unless the item was defective.

5. INTELLECTUAL PROPERTY
Users retain ownership of their reviews and content but grant us a license to display and distribute such content on our platform. We respect intellectual property rights and respond to valid DMCA notices.

6. SERVICE AVAILABILITY
We strive to maintain 99% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be announced in advance when possible.

7. LIMITATION OF LIABILITY
Our liability is limited to the amount paid for products in the preceding 12 months. We exclude liability for indirect damages to the extent permitted by law.

8. DISPUTE RESOLUTION
Disputes may be resolved through mediation or binding arbitration. Users retain the right to pursue claims in small claims court for qualifying disputes.`,

    lowRisk: `Terms of Service - Privacy-Focused Cloud Storage
Last Updated: November 15, 2023
Effective Date: November 15, 2023
Governing Law: These terms are governed by Swiss privacy laws.

1. SERVICE COMMITMENT
We are committed to providing secure, private cloud storage while respecting user rights and privacy. These terms reflect our commitment to user protection.

2. PRIVACY AND DATA PROTECTION
We collect minimal data necessary for service operation - only your email and encrypted file metadata. We are GDPR compliant and provide comprehensive data protection. Users have the right to deletion of all personal data. We use end-to-end encryption and cannot access your files.

3. USER RIGHTS AND CONTROL
Users retain full ownership and control of their data. We provide data portability and export options. Account deletion results in immediate data removal from our systems. We offer a 60-day money back guarantee for all paid plans.

4. SERVICE TRANSPARENCY
We publish regular transparency reports and undergo independent security audits. Our privacy policy is written in plain language and we notify users of any changes 60 days in advance.

5. FAIR USE AND CONDUCT
We have clear, reasonable usage policies focused on preventing abuse while maximizing user freedom. Account suspensions require clear violations and include an appeal process.

6. LIABILITY AND WARRANTIES
We provide service level agreements with uptime guarantees and compensation for outages. Our liability is reasonably capped but includes coverage for data loss due to our negligence.

7. DISPUTE RESOLUTION
Users can choose between neutral arbitration or court proceedings in their home jurisdiction. We do not require class action waivers and support collective user rights.

8. ACCOUNT MANAGEMENT
We provide 90 days advance notice for any account termination. Users have multiple opportunities to resolve issues and export their data before any account closure.`
};

export function getTestDocument(riskLevel: 'high' | 'medium' | 'low'): string {
    switch (riskLevel) {
        case 'high':
            return testDocuments.highRisk;
        case 'medium':
            return testDocuments.mediumRisk;
        case 'low':
            return testDocuments.lowRisk;
        default:
            return testDocuments.mediumRisk;
    }
}

// Test URLs for different risk levels
export const testUrls = {
    highRisk: [
        'https://facebook.com/terms',
        'https://twitter.com/tos',
        'https://x.com/terms',
        'https://instagram.com/terms',
        'https://tiktok.com/legal/terms-of-service'
    ],
    mediumRisk: [
        'https://amazon.com/gp/help/customer/display.html?nodeId=508088',
        'https://google.com/policies/terms/',
        'https://microsoft.com/en-us/servicesagreement/',
        'https://ebay.com/help/policies/member-behaviour-policies/user-agreement',
        'https://paypal.com/us/webapps/mpp/ua/useragreement-full'
    ],
    lowRisk: [
        'https://apple.com/legal/internet-services/terms/site.html',
        'https://signal.org/legal/',
        'https://protonmail.com/terms-and-conditions',
        'https://duckduckgo.com/terms',
        'https://mozilla.org/en-US/about/legal/terms/services/'
    ]
};

// Sample text snippets for quick testing
export const testTextSnippets = {
    highRisk: `We collect all your personal data including browsing history, location, contacts, and messages. This data may be sold to third parties for advertising purposes. You agree to unlimited liability and waive all rights to class action lawsuits. We can terminate your account immediately without notice and you forfeit all paid fees. By using our service, you transfer perpetual rights to all your content to us.`,

    mediumRisk: `We collect personal information necessary for service operation including your name, email, and usage data. This information may be shared with trusted partners. Our liability is limited to the amount paid for services. We may terminate accounts for violations with reasonable notice. Users retain ownership of their content but grant us a license to display it.`,

    lowRisk: `We collect minimal data necessary for service operation and comply with GDPR. You have the right to data deletion and portability. We offer a 60-day money back guarantee. We provide 90 days advance notice before any account termination. Users retain full ownership of their content and data. Disputes can be resolved through neutral arbitration or courts.`
};

export function getTestUrl(riskLevel: 'high' | 'medium' | 'low', index: number = 0): string {
    const riskMap = {
        'high': testUrls.highRisk,
        'medium': testUrls.mediumRisk,
        'low': testUrls.lowRisk
    };
    const urls = riskMap[riskLevel];
    return urls[index % urls.length];
}

export function getTestTextSnippet(riskLevel: 'high' | 'medium' | 'low'): string {
    const riskMap = {
        'high': testTextSnippets.highRisk,
        'medium': testTextSnippets.mediumRisk,
        'low': testTextSnippets.lowRisk
    };
    return riskMap[riskLevel];
}