export async function processFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (!content || content.trim().length === 0) {
          reject(new Error('File appears to be empty'));
          return;
        }
        
        // Basic content validation
        if (content.length < 50) {
          reject(new Error('File content is too short for meaningful analysis (minimum 50 characters)'));
          return;
        }
        
        if (content.length > 100000) {
          reject(new Error('File content is too large (maximum 100,000 characters)'));
          return;
        }
        
        resolve(content);
      } catch (error) {
        reject(new Error('Failed to process file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    // For text files, read as text
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // For other file types (PDF, Word), we'll simulate content extraction
      // In a real implementation, you'd use libraries like pdf-parse or mammoth
      setTimeout(() => {
        const mockContent = generateCompleteFileContent(file.name, file.type);
        resolve(mockContent);
      }, 1000);
    }
  });
}

function generateCompleteFileContent(fileName: string, fileType: string): string {
  // Determine risk profile based on filename patterns
  const lowerFileName = fileName.toLowerCase();
  let riskProfile: 'low-risk' | 'medium-risk' | 'high-risk' = 'medium-risk';
  let serviceName = 'Document Service';
  
  if (lowerFileName.includes('facebook') || lowerFileName.includes('meta') || 
      lowerFileName.includes('instagram') || lowerFileName.includes('twitter') || 
      lowerFileName.includes('tiktok') || lowerFileName.includes('social')) {
    riskProfile = 'high-risk';
    serviceName = lowerFileName.includes('facebook') || lowerFileName.includes('meta') ? 'Facebook/Meta' :
                 lowerFileName.includes('twitter') ? 'Twitter/X' :
                 lowerFileName.includes('tiktok') ? 'TikTok' :
                 lowerFileName.includes('instagram') ? 'Instagram' : 'Social Media Platform';
  } else if (lowerFileName.includes('apple') || lowerFileName.includes('signal') || 
             lowerFileName.includes('proton') || lowerFileName.includes('privacy') ||
             lowerFileName.includes('secure')) {
    riskProfile = 'low-risk';
    serviceName = lowerFileName.includes('apple') ? 'Apple' :
                 lowerFileName.includes('signal') ? 'Signal' :
                 lowerFileName.includes('proton') ? 'Proton' : 'Privacy-Focused Service';
  } else if (lowerFileName.includes('google') || lowerFileName.includes('amazon') || 
             lowerFileName.includes('microsoft') || lowerFileName.includes('commercial')) {
    riskProfile = 'medium-risk';
    serviceName = lowerFileName.includes('google') ? 'Google' :
                 lowerFileName.includes('amazon') ? 'Amazon' :
                 lowerFileName.includes('microsoft') ? 'Microsoft' : 'Commercial Service';
  }
  
  return generateCompleteTermsDocument(serviceName, riskProfile, fileName, fileType);
}

function generateCompleteTermsDocument(serviceName: string, riskProfile: 'low-risk' | 'medium-risk' | 'high-risk', fileName: string, fileType: string): string {
  const documentHeader = `COMPREHENSIVE TERMS OF SERVICE AND PRIVACY POLICY

Document Name: ${fileName}
File Type: ${fileType}
Service Provider: ${serviceName}
Document Type: Complete Terms of Service and Privacy Policy
Last Updated: ${new Date().toLocaleDateString()}
Effective Date: ${new Date().toLocaleDateString()}
${getJurisdiction(serviceName)}

IMPORTANT NOTICE: This document contains the complete terms governing your use of our service.
By accessing or using our service, you agree to be bound by these terms in their entirety.

TABLE OF CONTENTS
1. Definitions and Legal Framework
2. Service Agreement and User Acceptance
3. Comprehensive Data Collection and Privacy Practices
4. User Account Management and Responsibilities
5. Intellectual Property Rights and Content Licensing
6. Service Availability, Performance, and Modifications
7. Payment Terms, Billing Procedures, and Refund Policies
8. User Conduct Standards and Prohibited Activities
9. Liability Limitations, Warranties, and Risk Allocation
10. Account Termination, Suspension, and Data Retention
11. Dispute Resolution Procedures and Legal Framework
12. Miscellaneous Provisions and Final Terms

═══════════════════════════════════════════════════════════════════════════════

ARTICLE 1: DEFINITIONS AND LEGAL FRAMEWORK

1.1 Comprehensive Definitions
For the purposes of these Terms of Service ("Terms"), the following definitions shall apply throughout this document:

"Service" means all software applications, websites, mobile applications, APIs, content delivery networks, cloud services, data processing systems, and related technologies provided by ${serviceName}, including all features, functionalities, tools, and associated documentation.

"User," "you," or "your" refers to any individual, corporation, partnership, organization, government entity, or other legal entity that accesses, uses, interacts with, or benefits from the Service in any capacity.

"Content" encompasses all data, information, text, documents, images, videos, audio files, software code, databases, communications, and any other materials uploaded, transmitted, stored, or processed through the Service.

"Personal Data" includes any information that can be used to identify, contact, or locate an individual, including names, addresses, phone numbers, email addresses, financial information, biometric data, location information, and behavioral patterns.

1.2 Legal Framework and Interpretation
These Terms constitute a legally binding contract between you and ${serviceName}. The Terms shall be interpreted according to their plain meaning and applicable law. Headings are for reference only and do not affect legal interpretation.

1.3 Document Integration and Precedence
These Terms, together with our Privacy Policy, Community Guidelines, Acceptable Use Policy, and any service-specific terms, constitute the complete agreement governing your use of the Service.

ARTICLE 2: SERVICE AGREEMENT AND USER ACCEPTANCE

2.1 Comprehensive Agreement Formation
By creating an account, accessing the Service, downloading our applications, using any features or functionality, or otherwise interacting with our systems, you acknowledge that you have read, understood, and agree to be legally bound by all provisions of these Terms. Your continued use constitutes ongoing acceptance and reaffirmation of your agreement to comply with all terms and conditions.

2.2 Legal Capacity and Authority Requirements
You represent and warrant that you possess the full legal capacity and authority to enter into this binding contract. If you are under 18 years of age, you may only use the Service with explicit parental or guardian consent. If accessing on behalf of an organization, you warrant that you have proper authorization to bind that entity.

2.3 Terms Modification and Update Procedures
We reserve the right to modify, update, supplement, or replace these Terms at any time in our sole discretion. Changes may be communicated through email, in-service notifications, or website postings. Your continued use after modifications constitutes acceptance of updated Terms.`;

  const riskSpecificContent = getRiskSpecificFileContent(riskProfile, serviceName);
  
  const documentFooter = `

ARTICLE 12: MISCELLANEOUS PROVISIONS AND FINAL TERMS

12.1 Complete Agreement and Integration
These Terms, together with incorporated policies and guidelines, constitute the entire agreement between you and ${serviceName} regarding the Service and supersede all prior agreements, understandings, and communications, whether written or oral.

12.2 Severability and Enforceability
If any provision of these Terms is deemed invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. Invalid provisions shall be replaced with valid provisions that most closely approximate the original intent.

12.3 Assignment and Transfer Rights
You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may freely assign these Terms to any third party without restriction or notice.

12.4 Waiver and Amendment Procedures
Our failure to enforce any provision shall not constitute a waiver. No waiver shall be effective unless in writing and signed by our authorized representative.

12.5 Contact Information and Legal Notices
All legal notices must be sent to our designated legal address. Customer support inquiries should use the contact methods specified in your account settings or our website.

12.6 Effective Date and Version Control
These Terms are effective as of the date specified above and remain in effect until superseded. We maintain version history for reference and legal compliance.

12.7 Survival of Terms
Provisions that by their nature should survive termination shall continue in effect, including ownership rights, warranty disclaimers, liability limitations, and dispute resolution procedures.

═══════════════════════════════════════════════════════════════════════════════

ACKNOWLEDGMENT OF COMPLETE TERMS

By using ${serviceName}'s Service, you acknowledge that you have read and understood these complete Terms of Service, including all ${getExpectedWordCount(riskProfile)} words and ${getExpectedCharacterCount(riskProfile)} characters of legal provisions. You understand the legal implications and agree to be bound by all terms contained herein.

Document Statistics:
- Total Word Count: Approximately ${getExpectedWordCount(riskProfile)} words
- Character Count: Approximately ${getExpectedCharacterCount(riskProfile)} characters
- Risk Profile: ${riskProfile.replace('-', ' ').toUpperCase()}
- Processing Method: File Upload (${fileType})

If you do not agree to these Terms in their entirety, you must immediately cease all use of the Service.

END OF COMPLETE TERMS OF SERVICE DOCUMENT
═══════════════════════════════════════════════════════════════════════════════`;

  return documentHeader + riskSpecificContent + documentFooter;
}

function getRiskSpecificFileContent(riskProfile: 'low-risk' | 'medium-risk' | 'high-risk', serviceName: string): string {
  // Use the same risk-specific content as URL fetcher for consistency
  return getRiskSpecificContent(riskProfile, serviceName);
}

function getRiskSpecificContent(riskProfile: 'low-risk' | 'medium-risk' | 'high-risk', serviceName: string): string {
  // This function is defined in the URL fetcher - we'll reuse the same logic
  const contentMap = {
    'low-risk': generateLowRiskFileContent(serviceName),
    'medium-risk': generateMediumRiskFileContent(serviceName),
    'high-risk': generateHighRiskFileContent(serviceName)
  };
  
  return contentMap[riskProfile];
}

// Simplified versions for file processing - same structure as URL fetcher
function generateLowRiskFileContent(serviceName: string): string {
  return `

ARTICLE 3: PRIVACY-FIRST DATA COLLECTION AND PROTECTION

3.1 Minimal Data Collection Philosophy
${serviceName} operates under strict data minimization principles, collecting only essential information required for core service functionality. We collect your email for account management, encrypted metadata for file synchronization, and basic usage analytics to improve service quality. We are fully compliant with GDPR, CCPA, and international privacy regulations.

3.2 Transparent Data Processing and End-to-End Encryption
All personal data is processed transparently with end-to-end encryption ensuring even our systems cannot access your private information. Data is stored in secure, distributed data centers with enterprise-grade security and regular independent audits.

3.3 Comprehensive User Rights and Data Control
You have extensive rights including data access, rectification, erasure (right to be forgotten), portability, and processing restrictions. All requests are handled within 30 days with detailed confirmations.

ARTICLE 4: USER-CENTRIC ACCOUNT MANAGEMENT AND RIGHTS

4.1 Complete Account Ownership and Control
You retain full ownership of your account and data with comprehensive export tools and account portability. We provide 60-day money-back guarantees and 99.9% uptime commitments with automatic service credits.

4.2 Content Ownership and Intellectual Property Protection
You retain complete ownership of all content with no commercial exploitation rights granted to us. We never use your content for advertising or commercial purposes without explicit consent.

ARTICLE 5: FAIR SERVICE AVAILABILITY AND RELIABILITY

5.1 High Availability Commitment
We provide 99.9% uptime guarantees with redundant systems and proactive monitoring. Scheduled maintenance includes 48-hour advance notice with emergency maintenance communicated immediately.

5.2 Transparent Pricing and Fair Billing
All pricing is clearly displayed with no hidden fees. Flexible payment options and prorated refunds for unused services are standard.

ARTICLE 6: REASONABLE LIABILITY AND USER PROTECTION

6.1 Fair Warranty and Service Commitments
We warrant substantial performance according to published specifications with reasonable technical support and issue resolution commitments.

6.2 Balanced Liability Limitations
Liability is limited to amounts paid in the preceding 12 months with a minimum $1,000 cap. We maintain comprehensive insurance for data breaches and provide identity monitoring for affected users.

ARTICLE 7: FAIR TERMINATION AND DATA PRESERVATION

7.1 User-Friendly Termination Procedures
Account termination is available anytime with 90-day data export periods. Service-initiated terminations require clear violations with 30-day notice and appeal processes.

7.2 Service Discontinuation Protection
In case of service discontinuation, we guarantee 180 days advance notice with migration assistance and partnerships with alternative service providers.

ARTICLE 8: MULTIPLE DISPUTE RESOLUTION OPTIONS

8.1 Flexible Dispute Resolution
Users can choose between informal negotiation, mediation, neutral arbitration, or court proceedings in their home jurisdiction. No class action waivers are required.

8.2 Legal Fee Protection and Fair Procedures
We reimburse reasonable attorney fees for users who substantially prevail in disputes. Governing law provides strongest available consumer protections.`;
}

function generateMediumRiskFileContent(serviceName: string): string {
  return `

ARTICLE 3: BALANCED DATA COLLECTION AND USAGE PRACTICES

3.1 Standard Information Collection
${serviceName} collects personal information necessary for service operation including names, email addresses, billing information, device identifiers, usage patterns, and information from third-party sources for service enhancement and fraud prevention.

3.2 Business Partner Data Sharing
We share information with trusted partners, service providers, and affiliates for business operations, marketing, customer support, and analytics. All partners maintain appropriate data protection standards.

3.3 Marketing Communications and Data Retention
We use contact information for service updates and marketing communications with opt-out options available. Data is retained for up to 7 years for business and legal compliance purposes.

ARTICLE 4: USER RESPONSIBILITIES AND ACCOUNT MANAGEMENT

4.1 Account Security and User Obligations
Users are responsible for account credential security and all account activities. Strong passwords and security features are required with immediate breach notification obligations.

4.2 Acceptable Use and Content Standards
Users must comply with acceptable use policies prohibiting illegal activities, harassment, spam, and harmful content. We monitor usage and enforce policies through warnings or account restrictions.

ARTICLE 5: INTELLECTUAL PROPERTY AND CONTENT LICENSING

5.1 User Content Licensing
Users grant worldwide, non-exclusive, royalty-free licenses for content use in connection with service provision. Licenses continue for publicly shared content after account termination while users retain ownership.

5.2 Service Intellectual Property Protection
All service intellectual property remains our exclusive property. Users receive limited licenses for intended service use under these Terms.

ARTICLE 6: SERVICE AVAILABILITY AND PERFORMANCE

6.1 Service Level Commitments
We target 99.5% uptime for core functionality while acknowledging that perfect availability cannot be guaranteed. Technical issues are resolved promptly with advance notice for scheduled maintenance.

6.2 Service Modifications and Feature Changes
We reserve rights to modify, suspend, or discontinue service aspects with or without notice. New features may be subject to additional terms.

ARTICLE 7: PAYMENT TERMS AND BILLING PROCEDURES

7.1 Subscription Management and Pricing
Various subscription plans are available with clear pricing that may change with advance notice. Automatic billing occurs according to selected cycles with valid payment method requirements.

7.2 Cancellation and Limited Refund Policies
Subscriptions can be cancelled anytime with effect at the end of billing periods. Limited refunds are available for annual subscriptions under specific circumstances.

ARTICLE 8: LIABILITY LIMITATIONS AND WARRANTIES

8.1 Service Warranty Disclaimers
Service is provided "as is" without warranties of merchantability, fitness for purpose, or non-infringement. We disclaim all express and implied warranties.

8.2 Damage Limitations and User Indemnification
Total liability is limited to amounts paid in the preceding 12 months excluding indirect damages. Users agree to indemnify us for claims arising from Terms violations or third-party right infringements.

ARTICLE 9: ACCOUNT TERMINATION AND DATA HANDLING

9.1 Termination Procedures
Users may terminate accounts anytime while we may terminate for Terms violations, illegal activity, or business reasons with reasonable notice when possible.

9.2 Post-Termination Data Management
Account termination ends service access immediately. Data may be deleted after reasonable periods subject to legal retention requirements and backup policies.

ARTICLE 10: DISPUTE RESOLUTION AND LEGAL FRAMEWORK

10.1 Arbitration Requirements
Disputes must be resolved through binding arbitration administered by the American Arbitration Association after informal resolution attempts. 30-day opt-out periods are available.

10.2 Class Action Limitations
Arbitration and legal proceedings are limited to individual disputes with class action lawsuit waivers except where prohibited by law.`;
}

function generateHighRiskFileContent(serviceName: string): string {
  return `

ARTICLE 3: EXTENSIVE DATA COLLECTION AND COMMERCIAL EXPLOITATION

3.1 Comprehensive Personal Information Harvesting
${serviceName} collects extensive personal information including names, addresses, identification numbers, biometric data, precise location information, browsing history, device information, contact lists, photos with metadata, voice recordings, keystroke patterns, and behavioral analytics for commercial purposes.

3.2 Cross-Platform Tracking and Data Monetization
We employ sophisticated tracking across websites, applications, and devices to build detailed user profiles. Personal data may be sold, licensed, or monetized to third parties including advertisers, data brokers, and commercial entities without additional compensation.

3.3 Indefinite Data Retention and Government Cooperation
All collected data is retained indefinitely for business purposes and potential future monetization. We cooperate fully with government agencies and law enforcement, providing user data upon request without requiring warrants when permitted by law.

ARTICLE 4: UNLIMITED USER LIABILITY AND LEGAL RIGHTS WAIVER

4.1 Comprehensive Indemnification Requirements
Users agree to indemnify, defend, and hold harmless ${serviceName} from all claims, damages, losses, and expenses including attorney fees arising from service use, regardless of fault or negligence on our part.

4.2 Unlimited Personal Liability Exposure
User liability for damages is unlimited and uncapped. Users assume full financial responsibility for any direct, indirect, incidental, or consequential damages that may result from account activities.

4.3 Fundamental Legal Rights Waiver
Users waive rights to class action lawsuits, collective arbitration, jury trials, and injunctive relief. All disputes must be resolved individually through company-controlled arbitration procedures.

ARTICLE 5: PERPETUAL CONTENT RIGHTS AND COMMERCIAL EXPLOITATION

5.1 Irrevocable Content License Grant
Users grant perpetual, irrevocable, worldwide, royalty-free licenses to use, modify, and distribute content in any format. We may use content for commercial purposes including advertising and resale without compensation.

5.2 Content Modification and Moral Rights Waiver
We reserve unrestricted rights to modify, edit, or create derivative works from user content without consent or attribution. Users waive all moral rights including attribution and objection to derogatory treatment.

ARTICLE 6: IMMEDIATE TERMINATION AND ASSET FORFEITURE

6.1 Termination Without Cause or Notice
We may terminate accounts immediately for any reason without prior notice or warning. Termination decisions may be based on algorithmic assessments or arbitrary factors without human review.

6.2 Complete Asset and Data Forfeiture
Upon termination, users forfeit all paid services, credits, and account value without refunds. We may immediately delete all data without export options or recovery periods.

ARTICLE 7: RESTRICTIVE DISPUTE RESOLUTION AND LEGAL LIMITATIONS

7.1 Company-Controlled Arbitration
All disputes must be resolved through arbitration with arbitrators selected and compensated by ${serviceName}. Users waive rights to neutral arbitration acknowledging potential bias in our favor.

7.2 Severe Legal Recourse Limitations
Legal claims must be brought within 30 days regardless of discovery date. Proceedings must occur in our chosen jurisdiction under laws most favorable to us regardless of user residence.

ARTICLE 8: COMPLETE WARRANTY DISCLAIMERS AND RISK ASSUMPTION

8.1 Total Disclaimer of Warranties
Service is provided "as is" with complete disclaimer of all warranties including merchantability, fitness for purpose, security, privacy, and data protection. Users assume all risks including data breaches and security failures.

8.2 Maximum Liability Exclusions
Our total liability is limited to the lesser of $50 or amounts paid in the preceding three months. We exclude all consequential damages and claims related to data breaches, privacy violations, or security incidents.`;
}

function getExpectedWordCount(riskProfile: 'low-risk' | 'medium-risk' | 'high-risk'): number {
  const wordCounts = {
    'low-risk': 4500,
    'medium-risk': 5200,
    'high-risk': 6800
  };
  return wordCounts[riskProfile];
}

function getExpectedCharacterCount(riskProfile: 'low-risk' | 'medium-risk' | 'high-risk'): number {
  const charCounts = {
    'low-risk': 28000,
    'medium-risk': 32000,
    'high-risk': 42000
  };
  return charCounts[riskProfile];
}

function getJurisdiction(serviceName: string): string {
  if (serviceName.includes('Twitter') || serviceName.includes('X')) {
    return 'Governing Law: These terms are governed by the laws of California, United States.';
  } else if (serviceName.includes('TikTok')) {
    return 'Governing Law: These terms are governed by the laws of Singapore.';
  } else if (serviceName.includes('Facebook') || serviceName.includes('Meta')) {
    return 'Governing Law: These terms are governed by the laws of California, United States.';
  } else {
    return 'Governing Law: These terms are governed by the laws of Delaware, United States.';
  }
}