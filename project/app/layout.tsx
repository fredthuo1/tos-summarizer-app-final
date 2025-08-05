import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Terms Analyzer - AI-Powered Terms of Service Analysis',
    description: 'Free AI-powered terms of service analyzer. Instantly analyze privacy policies, terms of service, and legal documents. Get risk scores, detailed insights, and recommendations. No signup required.',
    keywords: 'terms of service analyzer, privacy policy checker, legal document analysis, AI legal analysis, terms checker, privacy policy analyzer, legal risk assessment, document scanner, terms of service checker, legal AI tool',
    authors: [{ name: 'Terms Analyzer' }],
    creator: 'Terms Analyzer',
    publisher: 'Terms Analyzer',
    category: 'Legal Technology',
    robots: 'index, follow',
    metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://termsreviewer.com/' : 'http://localhost:3000'),
    openGraph: {
        title: 'Terms Analyzer - AI-Powered Terms of Service Analysis',
        description: 'Free AI-powered terms of service analyzer. Instantly analyze privacy policies and legal documents with detailed risk assessments.',
        type: 'website',
        url: '/',
        locale: 'en_US',
        siteName: 'Terms Analyzer',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Terms Analyzer - AI-Powered Legal Document Analysis',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Terms Analyzer - AI-Powered Terms of Service Analysis',
        description: 'Free AI-powered terms of service analyzer. Get instant risk assessments and detailed insights.',
        images: ['/og-image.jpg'],
        creator: '@termsanalyzer',
    },
    alternates: {
        canonical: '/',
    },
    verification: {
        google: 'your-google-verification-code',
        other: {
            'msvalidate.01': 'your-bing-verification-code',
        },
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Terms Analyzer',
    description: 'AI-powered terms of service and privacy policy analyzer',
    url: process.env.NODE_ENV === 'production' ? 'https://termsreviewer.com/' : 'http://localhost:3000',
    applicationCategory: 'LegalApplication',
    operatingSystem: 'Web Browser',
    offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
    },
    creator: {
        '@type': 'Organization',
        name: 'Terms Analyzer',
    },
    featureList: [
        'AI-powered document analysis',
        'Risk assessment scoring',
        'Privacy policy analysis',
        'Terms of service checking',
        'Legal document insights',
        'PDF export functionality'
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="theme-color" content="#2563eb" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={inter.className}>
                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8588865009381819"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />

                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-8NRYVJNL3R"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
                </Script>

                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </ThemeProvider>
            </body>
        </html>
    );
}