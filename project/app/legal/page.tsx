'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Shield, Clock, MapPin, Phone, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <MessageSquare className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Contact Us
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Have questions, feedback, or need support? We're here to help you understand your digital rights.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center dark:text-white">
                                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                                    Get in Touch
                                </CardTitle>
                                <CardDescription>
                                    Multiple ways to reach our team
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Email Support</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">support@termsanalyzer.com</p>
                                        <p className="text-xs text-gray-500">Response within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <MessageSquare className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">General Inquiries</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">hello@termsanalyzer.com</p>
                                        <p className="text-xs text-gray-500">Business partnerships & media</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Shield className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">Privacy & Legal</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">legal@termsanalyzer.com</p>
                                        <p className="text-xs text-gray-500">Privacy concerns & legal matters</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center dark:text-white">
                                    <Clock className="h-5 w-5 mr-2 text-orange-500" />
                                    Response Times
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Support Requests</span>
                                    <Badge variant="secondary">24 hours</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">General Inquiries</span>
                                    <Badge variant="secondary">48 hours</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Legal Matters</span>
                                    <Badge variant="secondary">72 hours</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center dark:text-white">
                                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                                    Company Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Terms Analyzer</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        AI-Powered Legal Document Analysis
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Headquarters: San Francisco, CA<br />
                                        Founded: 2024<br />
                                        Mission: Democratizing legal document understanding
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center dark:text-white">
                                    <Send className="h-5 w-5 mr-2 text-blue-600" />
                                    Send us a Message
                                </CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you as soon as possible
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {submitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            Message Sent Successfully!
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            Thank you for contacting us. We'll respond to your inquiry within 24 hours.
                                        </p>
                                        <Button onClick={() => setSubmitted(false)} variant="outline">
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your full name"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address *</Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="your.email@example.com"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject *</Label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="What's this about?"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us more about your inquiry, feedback, or how we can help..."
                                                className="min-h-[120px] resize-none"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                            <div className="flex items-start space-x-2">
                                                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-blue-800 dark:text-blue-300">
                                                    <p className="font-medium mb-1">Before contacting support:</p>
                                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                                        <li>Check our FAQ section for common questions</li>
                                                        <li>Try refreshing the page if you're experiencing technical issues</li>
                                                        <li>Include specific details about any errors you're encountering</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                                            className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card className="mt-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="dark:text-white">Frequently Asked Questions</CardTitle>
                                <CardDescription>
                                    Quick answers to common questions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Is the service really free?</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Yes! Our analysis service is completely free with no hidden costs or registration required.
                                    </p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">How accurate is the AI analysis?</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Our AI provides helpful insights, but it's not a substitute for legal advice. Always consult professionals for important legal matters.
                                    </p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Do you store my documents?</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        No, we process documents in memory and don't store them on our servers. Your privacy is our priority.
                                    </p>
                                </div>
                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Can I use this for commercial purposes?</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Our service is designed for individual use. Contact us for commercial licensing options.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}