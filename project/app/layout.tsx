import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Shield } from 'lucide-react';
import Script from 'next/script';
import Link from 'next/link';
import { MobileNavigation } from '@/components/MobileNavigation';
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
            {/* Navigation */}
            <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 relative">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-gray-900 dark:text-white">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <span>Terms Analyzer</span>
                  </Link>
                  
                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Home
                    </Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      About
                    </Link>
                    <Link href="/legal" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Legal
                    </Link>
                  </div>
                  
                  <MobileNavigation />
                </div>
              </div>
            </nav>
            {children}
            
            {/* Footer */}
            <footer className="bg-gray-900 dark:bg-slate-950 text-white mt-16">
              <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield className="h-6 w-6 text-blue-400" />
                      <span className="font-bold text-xl">Terms Analyzer</span>
                    </div>
                    <p className="text-gray-300 mb-4 max-w-md">
                      AI-powered terms of service analysis to help you understand your digital rights and make informed decisions.
                    </p>
                    <p className="text-sm text-gray-400">
                      © 2025 Terms Analyzer. All rights reserved.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li><Link href="/" className="hover:text-blue-400 transition-colors">Analyze Terms</Link></li>
                      <li><Link href="/extension" className="hover:text-blue-400 transition-colors">Browser Extension</Link></li>
                      <li><Link href="/about" className="hover:text-blue-400 transition-colors">How It Works</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li><Link href="/legal" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                  <p className="text-sm text-gray-400">
                    Made with ❤️ for digital transparency and user rights
                  </p>
                </div>
              </div>
            </footer>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}