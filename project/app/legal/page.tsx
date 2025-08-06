'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Scale, Eye, Lock, FileText, AlertTriangle } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Legal Information
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Our commitment to transparency, privacy, and legal compliance.
          </p>
        </div>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 mb-8 h-auto p-1">
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
            <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <Lock className="h-6 w-6 mr-2 text-green-600" />
                  Privacy Policy
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h3>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p><strong>Content Analysis:</strong> We temporarily process the text content you submit for analysis. This content is not stored permanently and is deleted after processing.</p>
                    <p><strong>Analytics Data:</strong> We collect anonymous usage statistics through Google Analytics to improve our service, including page views, analysis completion rates, and general usage patterns.</p>
                    <p><strong>Technical Data:</strong> Standard web server logs including IP addresses, browser types, and access times for security and performance monitoring.</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How We Use Your Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>To provide AI-powered analysis of terms of service documents</li>
                    <li>To improve our analysis algorithms and service quality</li>
                    <li>To monitor and maintain system security and performance</li>
                    <li>To generate anonymous usage statistics and insights</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Protection</h3>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p><strong>No Account Required:</strong> We don't require user registration, so we don't collect personal identification information.</p>
                    <p><strong>Temporary Processing:</strong> Document content is processed in memory and not stored on our servers.</p>
                    <p><strong>Secure Transmission:</strong> All data is transmitted over encrypted HTTPS connections.</p>
                    <p><strong>No Third-Party Sharing:</strong> We do not sell, trade, or share your content with third parties.</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Right to know what data we collect and how it's used</li>
                    <li>Right to request deletion of any personal data we may have</li>
                    <li>Right to opt-out of analytics tracking</li>
                    <li>Right to contact us with privacy concerns</li>
                  </ul>
                </section>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <Shield className="h-4 w-4 inline mr-2" />
                    We are committed to protecting your privacy and will never use your submitted content for any purpose other than providing the analysis you requested.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <FileText className="h-6 w-6 mr-2 text-blue-600" />
                  Terms of Service
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Acceptance of Terms</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    By accessing and using Terms Analyzer, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Terms Analyzer provides AI-powered analysis of legal documents, specifically terms of service and privacy policies. 
                    Our service is provided "as is" for informational purposes only.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Use the service only for legitimate legal document analysis</li>
                    <li>Do not submit copyrighted content without permission</li>
                    <li>Do not attempt to reverse engineer or abuse our AI systems</li>
                    <li>Respect our server resources and do not overload the system</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    You retain all rights to content you submit. We retain rights to our analysis algorithms, interface design, 
                    and generated insights. Our service and technology are protected by intellectual property laws.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our analysis is for informational purposes only and should not be considered legal advice. 
                    We are not liable for decisions made based on our analysis. Always consult qualified legal professionals 
                    for important legal matters.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Service Availability</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We strive to maintain high availability but do not guarantee uninterrupted service. 
                    We reserve the right to modify or discontinue the service with reasonable notice.
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disclaimer">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <AlertTriangle className="h-6 w-6 mr-2 text-orange-500" />
                  Legal Disclaimer
                </CardTitle>
                <CardDescription>
                  Important limitations and disclaimers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Not Legal Advice</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Terms Analyzer provides automated analysis for informational purposes only. Our analysis does not constitute 
                    legal advice and should not be relied upon as such. Always consult with qualified legal professionals for 
                    legal matters.
                  </p>
                </div>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI Analysis Limitations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>AI analysis may not catch all nuances or context-specific implications</li>
                    <li>Legal interpretation can vary based on jurisdiction and specific circumstances</li>
                    <li>Our analysis is based on general patterns and may not apply to your specific situation</li>
                    <li>Technology limitations may result in incomplete or inaccurate analysis</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Accuracy Disclaimer</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of our analysis. 
                    Legal documents are complex and our automated analysis may miss important details or context.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Use at Your Own Risk</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    You use our service at your own risk. We are not responsible for any decisions made based on our analysis 
                    or any consequences resulting from such decisions. Important legal decisions should always involve qualified legal counsel.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Jurisdictional Variations</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Legal requirements and interpretations vary significantly by jurisdiction. Our analysis provides general insights 
                    but may not account for specific local laws, regulations, or legal precedents that could affect the interpretation 
                    of terms of service documents.
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cookies">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <Eye className="h-6 w-6 mr-2 text-purple-600" />
                  Cookie Policy
                </CardTitle>
                <CardDescription>
                  How we use cookies and tracking technologies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">What Are Cookies</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Cookies are small text files stored on your device when you visit our website. They help us provide 
                    a better user experience and understand how our service is used.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Types of Cookies We Use</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Essential Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Required for basic website functionality, including theme preferences and session management.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Google Analytics cookies help us understand how visitors use our site to improve the service.
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Advertising Cookies</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Google AdSense cookies enable us to display relevant advertisements to support our free service.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Managing Cookies</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Block all cookies (may affect website functionality)</li>
                    <li>Delete existing cookies</li>
                    <li>Set preferences for specific websites</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Third-Party Services</h3>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300">
                    <p><strong>Google Analytics:</strong> Provides website usage statistics. You can opt-out using Google's opt-out tools.</p>
                    <p><strong>Google AdSense:</strong> Displays advertisements. You can manage ad preferences through Google's Ad Settings.</p>
                  </div>
                </section>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-purple-800 dark:text-purple-300">
                    <Eye className="h-4 w-4 inline mr-2" />
                    We respect your privacy choices. Essential cookies are necessary for the website to function, 
                    but you can disable analytics and advertising cookies through your browser settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}