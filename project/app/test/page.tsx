'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTestDocument, getTestUrl, getTestTextSnippet } from '@/lib/test-documents';
import { AnalysisResult } from '@/app/page';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Loader2, TestTube, CheckCircle, AlertTriangle, Shield, Link, FileText, Upload } from 'lucide-react';

export default function TestPage() {
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentTest, setCurrentTest] = useState<string>('');

    // SEO metadata for test page
    const pageTitle = "Test Analysis Pipeline - Terms Analyzer";
    const pageDescription = "Test our AI-powered terms of service analyzer with sample documents. Try high, medium, and low risk examples to see detailed analysis results.";

    const runDocumentAnalysis = async (riskLevel: 'high' | 'medium' | 'low', testName: string) => {
        setIsAnalyzing(true);
        setCurrentTest(testName);

        try {
            const content = getTestDocument(riskLevel);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    source: testName,
                    type: 'text'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data = await response.json();

            const result: AnalysisResult = {
                id: Date.now().toString(),
                source: testName,
                type: 'text',
                content,
                analysis: data.analysis,
                timestamp: new Date()
            };

            setResults(prev => [result, ...prev]);
        } catch (error) {
            console.error('Test analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
            setCurrentTest('');
        }
    };

    const runUrlAnalysis = async (riskLevel: 'high' | 'medium' | 'low', testName: string) => {
        setIsAnalyzing(true);
        setCurrentTest(testName);

        try {
            const url = getTestUrl(riskLevel);

            // Simulate URL fetching by using the document content
            const content = getTestDocument(riskLevel);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    source: url,
                    type: 'url'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data = await response.json();

            const result: AnalysisResult = {
                id: Date.now().toString(),
                source: url,
                type: 'url',
                content,
                analysis: data.analysis,
                timestamp: new Date()
            };

            setResults(prev => [result, ...prev]);
        } catch (error) {
            console.error('URL test analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
            setCurrentTest('');
        }
    };

    const runTextAnalysis = async (riskLevel: 'high' | 'medium' | 'low', testName: string) => {
        setIsAnalyzing(true);
        setCurrentTest(testName);

        try {
            const content = getTestTextSnippet(riskLevel);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    source: testName,
                    type: 'text'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const data = await response.json();

            const result: AnalysisResult = {
                id: Date.now().toString(),
                source: testName,
                type: 'text',
                content,
                analysis: data.analysis,
                timestamp: new Date()
            };

            setResults(prev => [result, ...prev]);
        } catch (error) {
            console.error('Text test analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
            setCurrentTest('');
        }
    };

    const runAllTests = async () => {
        // Test Documents
        await runDocumentAnalysis('high', 'High Risk Document Test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runDocumentAnalysis('medium', 'Medium Risk Document Test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runDocumentAnalysis('low', 'Low Risk Document Test');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test URLs
        await runUrlAnalysis('high', 'High Risk URL Test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runUrlAnalysis('medium', 'Medium Risk URL Test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runUrlAnalysis('low', 'Low Risk URL Test');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test Text Snippets
        await runTextAnalysis('high', 'High Risk Text Test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runTextAnalysis('medium', 'Medium Risk Text Test');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await runTextAnalysis('low', 'Low Risk Text Test');
    };

    const clearResults = () => {
        setResults([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": pageTitle,
                        "description": pageDescription,
                        "url": `${process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'}/test`,
                        "breadcrumb": {
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Home",
                                    "item": process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Test",
                                    "item": `${process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'}/test`
                                }
                            ]
                        }
                    })
                }}
            />
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center" itemProp="name">
                        <TestTube className="h-10 w-10 mr-3 text-blue-600" />
                        End-to-End Analysis Testing
                    </h1>
                    <p className="text-xl text-gray-600" itemProp="description">
                        Test the complete analysis pipeline with documents, URLs, and text snippets
                    </p>
                </div>

                <Card className="mb-8 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="h-5 w-5 mr-2" />
                            Test Controls
                        </CardTitle>
                        <CardDescription>
                            Test all input methods: documents, URLs, and text snippets
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="documents" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="documents" className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Documents
                                </TabsTrigger>
                                <TabsTrigger value="urls" className="flex items-center gap-2">
                                    <Link className="h-4 w-4" />
                                    URLs
                                </TabsTrigger>
                                <TabsTrigger value="text" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Text
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="documents">
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Button
                                        onClick={() => runDocumentAnalysis('high', 'High Risk Document Test')}
                                        disabled={isAnalyzing}
                                        variant="destructive"
                                        className="h-12"
                                    >
                                        {isAnalyzing && currentTest.includes('High Risk Document') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                        )}
                                        High Risk Doc
                                    </Button>

                                    <Button
                                        onClick={() => runDocumentAnalysis('medium', 'Medium Risk Document Test')}
                                        disabled={isAnalyzing}
                                        variant="secondary"
                                        className="h-12"
                                    >
                                        {isAnalyzing && currentTest.includes('Medium Risk Document') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Shield className="h-4 w-4 mr-2" />
                                        )}
                                        Medium Risk Doc
                                    </Button>

                                    <Button
                                        onClick={() => runDocumentAnalysis('low', 'Low Risk Document Test')}
                                        disabled={isAnalyzing}
                                        className="h-12 bg-green-600 hover:bg-green-700"
                                    >
                                        {isAnalyzing && currentTest.includes('Low Risk Document') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Low Risk Doc
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="urls">
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Button
                                        onClick={() => runUrlAnalysis('high', 'High Risk URL Test')}
                                        disabled={isAnalyzing}
                                        variant="destructive"
                                        className="h-12"
                                    >
                                        {isAnalyzing && currentTest.includes('High Risk URL') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                        )}
                                        High Risk URL
                                    </Button>

                                    <Button
                                        onClick={() => runUrlAnalysis('medium', 'Medium Risk URL Test')}
                                        disabled={isAnalyzing}
                                        variant="secondary"
                                        className="h-12"
                                    >
                                        {isAnalyzing && currentTest.includes('Medium Risk URL') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Shield className="h-4 w-4 mr-2" />
                                        )}
                                        Medium Risk URL
                                    </Button>

                                    <Button
                                        onClick={() => runUrlAnalysis('low', 'Low Risk URL Test')}
                                        disabled={isAnalyzing}
                                        className="h-12 bg-green-600 hover:bg-green-700"
                                    >
                                        {isAnalyzing && currentTest.includes('Low Risk URL') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Low Risk URL
                                    </Button>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">Test URLs:</h4>
                                    <div className="grid gap-2 text-sm">
                                        <div>
                                            <span className="font-medium text-red-600">High Risk:</span>
                                            <span className="ml-2 text-gray-600">https://facebook.com/terms</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-yellow-600">Medium Risk:</span>
                                            <span className="ml-2 text-gray-600">https://amazon.com/gp/help/customer/display.html</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-green-600">Low Risk:</span>
                                            <span className="ml-2 text-gray-600">https://apple.com/legal/internet-services/terms/site.html</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="text">
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Button
                                        onClick={() => runTextAnalysis('high', 'High Risk Text Test')}
                                        disabled={isAnalyzing}
                                        variant="destructive"
                                        className="h-12"
                                    >
                                        {isAnalyzing && currentTest.includes('High Risk Text') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                        )}
                                        High Risk Text
                                    </Button>

                                    <Button
                                        onClick={() => runTextAnalysis('medium', 'Medium Risk Text Test')}
                                        disabled={isAnalyzing}
                                        variant="secondary"
                                        className="h-12"
                                    >
                                        {isAnalyzing && currentTest.includes('Medium Risk Text') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Shield className="h-4 w-4 mr-2" />
                                        )}
                                        Medium Risk Text
                                    </Button>

                                    <Button
                                        onClick={() => runTextAnalysis('low', 'Low Risk Text Test')}
                                        disabled={isAnalyzing}
                                        className="h-12 bg-green-600 hover:bg-green-700"
                                    >
                                        {isAnalyzing && currentTest.includes('Low Risk Text') ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                        )}
                                        Low Risk Text
                                    </Button>
                                </div>
                                <div className="mt-4 space-y-3">
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                                        <h5 className="font-semibold text-red-900 mb-1">High Risk Text Sample:</h5>
                                        <p className="text-xs text-red-800">We collect all your personal data including browsing history, location, contacts, and messages...</p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <h5 className="font-semibold text-yellow-900 mb-1">Medium Risk Text Sample:</h5>
                                        <p className="text-xs text-yellow-800">We collect personal information necessary for service operation including your name, email...</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                        <h5 className="font-semibold text-green-900 mb-1">Low Risk Text Sample:</h5>
                                        <p className="text-xs text-green-800">We collect minimal data necessary for service operation and comply with GDPR...</p>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="mt-6 flex justify-between items-center">
                            <Button
                                onClick={runAllTests}
                                disabled={isAnalyzing}
                                variant="outline"
                                className="h-12 px-8"
                            >
                                {isAnalyzing ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <TestTube className="h-4 w-4 mr-2" />
                                )}
                                Run All Tests (9 total)
                            </Button>

                            {results.length > 0 && (
                                <div className="flex items-center gap-4">
                                    <Badge variant="secondary" className="text-sm">
                                        {results.length} test{results.length !== 1 ? 's' : ''} completed
                                    </Badge>
                                    <Button onClick={clearResults} variant="ghost" size="sm">
                                        Clear Results
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="results" className="mb-8">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="results">Test Results</TabsTrigger>
                        <TabsTrigger value="samples">Test Samples</TabsTrigger>
                    </TabsList>

                    <TabsContent value="results">
                        {results.length > 0 ? (
                            <AnalysisResults results={results} />
                        ) : (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <TestTube className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tests Run Yet</h3>
                                    <p className="text-gray-600">
                                        Choose a test type above and click a test button to run end-to-end analysis
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="samples">
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-red-600 flex items-center">
                                        <AlertTriangle className="h-5 w-5 mr-2" />
                                        High Risk Samples
                                    </CardTitle>
                                    <CardDescription>
                                        Aggressive data collection, unlimited liability, and user-unfriendly terms
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h5 className="font-semibold mb-2">Sample URLs:</h5>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://facebook.com/terms
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://twitter.com/tos
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://instagram.com/terms
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                                        <h5 className="font-semibold mb-2">Document Sample:</h5>
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                            Terms of Service - Social Media Platform
                                            Last Updated: January 15, 2024

                                            1. ACCEPTANCE OF TERMS
                                            By accessing or using our service, you accept and agree to be bound by the terms...
                                        </pre>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-yellow-600 flex items-center">
                                        <Shield className="h-5 w-5 mr-2" />
                                        Medium Risk Samples
                                    </CardTitle>
                                    <CardDescription>
                                        Balanced commercial terms with reasonable user protections
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h5 className="font-semibold mb-2">Sample URLs:</h5>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://amazon.com/gp/help/customer/display.html
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://google.com/policies/terms/
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://microsoft.com/en-us/servicesagreement/
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                                        <h5 className="font-semibold mb-2">Document Sample:</h5>
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                            Terms of Service - E-commerce Platform
                                            Last Updated: December 1, 2023

                                            1. SERVICE AGREEMENT
                                            By using our platform, you agree to these terms and conditions...
                                        </pre>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-green-600 flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Low Risk Samples
                                    </CardTitle>
                                    <CardDescription>
                                        Privacy-focused services with user-friendly terms and strong protections
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <h5 className="font-semibold mb-2">Sample URLs:</h5>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://apple.com/legal/internet-services/terms/site.html
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://signal.org/legal/
                                            </div>
                                            <div className="flex items-center">
                                                <Link className="h-3 w-3 mr-2" />
                                                https://protonmail.com/terms-and-conditions
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                                        <h5 className="font-semibold mb-2">Document Sample:</h5>
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                            Terms of Service - Privacy-Focused Cloud Storage
                                            Last Updated: November 15, 2023

                                            1. SERVICE COMMITMENT
                                            We are committed to providing secure, private cloud storage...
                                        </pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}