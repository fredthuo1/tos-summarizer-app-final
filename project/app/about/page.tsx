'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Users, Target, Award, CheckCircle, ArrowRight, Heart, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            About Terms Analyzer
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Empowering users with AI-powered legal document analysis to make informed decisions about their digital rights.
                    </p>
                </div>

                {/* Mission Statement */}
                <Card className="mb-12 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center dark:text-white">
                            <Target className="h-6 w-6 mr-2 text-blue-600" />
                            Our Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            We believe that everyone deserves to understand the legal agreements they're signing. Terms of service documents
                            are often complex, lengthy, and filled with legal jargon that can hide important implications for users' privacy,
                            rights, and financial obligations.
                        </p>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            Our mission is to democratize legal document analysis by making it accessible, instant, and understandable for
                            everyone. We use cutting-edge AI technology to break down complex legal language into clear, actionable insights
                            that help users make informed decisions about the services they use.
                        </p>
                    </CardContent>
                </Card>

                {/* What We Do */}
                <Card className="mb-12 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center dark:text-white">
                            <Zap className="h-6 w-6 mr-2 text-purple-600" />
                            What We Do
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">AI-Powered Analysis</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Advanced natural language processing to understand complex legal documents
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Risk Assessment</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Comprehensive scoring system to evaluate potential risks and concerns
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Category Breakdown</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Detailed analysis across 6 key areas including privacy, liability, and user rights
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Plain English Summaries</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Complex legal jargon translated into understandable language
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Actionable Recommendations</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Practical advice on how to protect yourself and what to watch out for
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Free & Accessible</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            No registration required, completely free to use for everyone
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Our Values */}
                <Card className="mb-12 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center dark:text-white">
                            <Heart className="h-6 w-6 mr-2 text-red-500" />
                            Our Values
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Transparency</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    We believe in complete transparency about how our analysis works and what it means for users.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">User-First</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Every feature we build is designed with the user's best interests and understanding in mind.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="h-8 w-8 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Accessibility</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Legal analysis should be available to everyone, regardless of their technical or legal background.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Why It Matters */}
                <Card className="mb-12 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center dark:text-white">
                            <Award className="h-6 w-6 mr-2 text-orange-500" />
                            Why This Matters
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            In today's digital world, we're constantly agreeing to terms of service without fully understanding what we're
                            signing up for. Studies show that the average person would need over 8 hours to read all the privacy policies
                            they encounter in a single day.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            These documents often contain clauses that can significantly impact your privacy, financial liability, and legal
                            rights. By making legal analysis accessible and understandable, we're helping to level the playing field between
                            users and large corporations.
                        </p>
                        <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                                💡 Did you know? The average terms of service document is longer than Shakespeare's Macbeth,
                                but most people spend less than 30 seconds reviewing it.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Understand Your Digital Rights?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Start analyzing terms of service documents today and make informed decisions about your digital life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Link href="/">
                                <Shield className="h-4 w-4 mr-2" />
                                Start Analyzing
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/legal">
                                Disclaimer
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}