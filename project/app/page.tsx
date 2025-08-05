'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UrlInput } from '@/components/UrlInput';
import { TextInput } from '@/components/TextInput';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AdSenseUnit } from '@/components/AdSenseUnit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Shield, FileText, Link, Upload } from 'lucide-react';
import { AlertTriangle, TrendingUp, CheckCircle, Users, BookOpen, TestTube } from 'lucide-react';

export interface AnalysisResult {
    id: string;
    source: string;
    type: 'url' | 'text' | 'file';
    content: string;
    analysis: {
        riskLevel: 'low' | 'medium' | 'high';
        score: number;
        concerns: string[];
        highlights: string[];
        summary: string;
        categories: {
            dataPrivacy: CategoryAnalysis;
            userRights: CategoryAnalysis;
            liability: CategoryAnalysis;
            termination: CategoryAnalysis;
            contentOwnership: CategoryAnalysis;
            disputeResolution: CategoryAnalysis;
        };
        recommendations: string[];
        keyMetrics: {
            readabilityScore: number;
            lengthAnalysis: string;
            lastUpdated: string | null;
            jurisdiction: string | null;
        };
    };
    timestamp: Date;
}

export interface CategoryAnalysis {
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
    findings: string[];
    explanation: string;
}

export default function Home() {
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalysis = (result: AnalysisResult) => {
        setResults(prev => [result, ...prev]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Theme Toggle */}
                <div className="flex justify-end mb-4">
                    <ThemeToggle />
                </div>

                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" itemProp="name">
                            Terms Analyzer
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed" itemProp="description">
                        Free AI-powered terms of service analyzer. Get instant risk assessments, detailed insights, and recommendations for privacy policies and legal documents. No signup required.
                    </p>
                    <div className="mt-4">
                        <a
                            href="/test"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            aria-label="Test the analysis pipeline with sample documents"
                        >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test Analysis Pipeline
                        </a>
                    </div>

                    {/* Breadcrumb Schema */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    {
                                        "@type": "ListItem",
                                        "position": 1,
                                        "name": "Home",
                                        "item": process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'
                                    }
                                ]
                            })
                        }}
                    />
                </div>

                {/* Top Banner Ad */}
                <div className="mb-8">
                    <AdSenseUnit slot="top-banner" format="horizontal" />
                </div>

                {/* Main Layout with Side Ads */}
                <div className="flex gap-8">
                    {/* Left Sidebar - Ads */}
                    <div className="hidden lg:block lg:w-64 space-y-6">
                        <AdSenseUnit slot="sidebar-left-top" format="vertical" />
                        <AdSenseUnit slot="sidebar-left-middle" format="rectangle" />
                        <AdSenseUnit slot="sidebar-left-bottom" format="vertical" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 max-w-4xl mx-auto space-y-12">
                        {/* Input Section */}
                        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm" itemScope itemType="https://schema.org/SoftwareApplication">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-2xl dark:text-white" itemProp="name">
                                    <FileText className="h-6 w-6 mr-2 text-blue-600" />
                                    Analyze Terms of Service
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300" itemProp="description">
                                    Choose your preferred method to analyze terms of service documents
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="url" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100/80 dark:bg-slate-700/80">
                                        <TabsTrigger value="url" className="flex items-center gap-2" aria-label="Analyze website URL">
                                            <Link className="h-4 w-4" />
                                            URL
                                        </TabsTrigger>
                                        <TabsTrigger value="text" className="flex items-center gap-2" aria-label="Analyze pasted text">
                                            <FileText className="h-4 w-4" />
                                            Text
                                        </TabsTrigger>
                                        <TabsTrigger value="file" className="flex items-center gap-2" aria-label="Upload and analyze file">
                                            <Upload className="h-4 w-4" />
                                            File
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="url">
                                        <UrlInput
                                            onAnalysis={handleAnalysis}
                                            isAnalyzing={isAnalyzing}
                                            setIsAnalyzing={setIsAnalyzing}
                                        />
                                    </TabsContent>

                                    <TabsContent value="text">
                                        <TextInput
                                            onAnalysis={handleAnalysis}
                                            isAnalyzing={isAnalyzing}
                                            setIsAnalyzing={setIsAnalyzing}
                                        />
                                    </TabsContent>

                                    <TabsContent value="file">
                                        <FileUpload
                                            onAnalysis={handleAnalysis}
                                            isAnalyzing={isAnalyzing}
                                            setIsAnalyzing={setIsAnalyzing}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* How It Works Section */}
                        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center dark:text-white" id="how-it-works">
                                    <Shield className="h-6 w-6 mr-2 text-blue-600" />
                                    How It Works
                                </CardTitle>
                                <CardDescription className="dark:text-gray-300">
                                    Our AI-powered analysis breaks down complex legal documents into understandable insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white font-bold">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Input Your Content</h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">Choose from three convenient methods:</p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                                            <li className="flex items-center"><span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>Paste any website URL</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>Copy and paste text directly</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>Upload PDF, Word, or text files</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white font-bold">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">AI-Powered Analysis</h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">Our GPT-4 powered AI examines 6 critical categories:</p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                                            <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>Data Privacy & Protection</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>User Rights & Refunds</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>Liability & Warranties</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>Account Termination</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>Content Ownership</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>Dispute Resolution</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-white font-bold">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Get Detailed Insights</h4>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">Receive comprehensive analysis including:</p>
                                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                                            <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Overall risk score (0-100)</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Key concerns and highlights</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Category-specific breakdowns</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Actionable recommendations</li>
                                            <li className="flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>Readability & document metrics</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                                        Powered by AI
                                    </h5>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Our AI uses advanced natural language processing to understand complex legal language and provide
                                        human-readable insights. Get professional-level analysis in seconds, not hours.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Middle Content Ad */}
                        <div className="my-8">
                            <AdSenseUnit slot="content-middle" format="rectangle" />
                        </div>

                        {/* Key Features Section */}
                        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center dark:text-white">
                                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                                    Key Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3" itemScope itemType="https://schema.org/ItemList">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300" itemProp="itemListElement">Multi-format support (URL, text, files)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300" itemProp="itemListElement">Real-time AI-powered risk assessment</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300" itemProp="itemListElement">Export detailed PDF and JSON reports</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300" itemProp="itemListElement">Privacy-focused secure analysis</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300" itemProp="itemListElement">No registration or signup required</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Analyses Section */}
                        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center dark:text-white">
                                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                                    Popular Analyses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-700 dark:text-gray-300">Social Media Platforms</span>
                                        <Badge variant="secondary" className="text-xs">High Risk</Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-700 dark:text-gray-300">E-commerce Sites</span>
                                        <Badge variant="secondary" className="text-xs">Medium Risk</Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-700 dark:text-gray-300">Cloud Services</span>
                                        <Badge variant="secondary" className="text-xs">Medium Risk</Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '52%' }}></div>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-700 dark:text-gray-300">Privacy-First Tools</span>
                                        <Badge variant="secondary" className="text-xs">Low Risk</Badge>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '23%' }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Tips Section */}
                        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center dark:text-white">
                                    <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                                    Quick Tips
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-1">💡 Pro Tip</p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        Look for "data retention" policies - some companies keep your data forever!
                                    </p>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-700">
                                    <p className="text-xs text-orange-800 dark:text-orange-300 font-medium mb-1">⚠️ Red Flag</p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">
                                        Avoid services that require you to "indemnify" them - this means you pay their legal costs.
                                    </p>
                                </div>

                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                                    <p className="text-xs text-green-800 dark:text-green-300 font-medium mb-1">✅ Good Sign</p>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        Services offering "data portability" respect your right to move your information.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar - Ads */}
                    <div className="hidden lg:block lg:w-64 space-y-6">
                        <AdSenseUnit slot="sidebar-right-top" format="vertical" />
                        <AdSenseUnit slot="sidebar-right-middle" format="rectangle" />
                        <AdSenseUnit slot="sidebar-right-bottom" format="vertical" />
                    </div>
                </div>

                {/* Bottom Content Ad */}
                <div className="mt-12 mb-8">
                    <AdSenseUnit slot="bottom-content" format="horizontal" />
                </div>

                {/* Results Section */}
                {results.length > 0 && (
                    <div className="mt-12">
                        <AnalysisResults results={results} />
                    </div>
                )}
            </div>
        </div>
    );
}