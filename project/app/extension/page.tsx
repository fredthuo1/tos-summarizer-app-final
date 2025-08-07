'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Download, 
  Chrome, 
  Monitor, 
  Bell, 
  Zap, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Smartphone,
  Globe,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Chrome className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Browser Extension
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Automatically analyze terms of service and privacy policies on every website you visit. 
            Get instant risk assessments without leaving your browsing experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
              <Link href="/extension/icons/generate-icons.html" target="_blank">
                <Download className="h-5 w-5 mr-2" />
                Generate Icons
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="https://github.com/your-repo/terms-analyzer-extension" target="_blank">
                <ExternalLink className="h-5 w-5 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="dark:text-white">Automatic Detection</CardTitle>
              <CardDescription>
                Automatically finds and analyzes terms of service, privacy policies, and cookie policies on every website
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="dark:text-white">Smart Notifications</CardTitle>
              <CardDescription>
                Get non-intrusive notifications when visiting websites with concerning terms or privacy practices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="dark:text-white">Risk Assessment</CardTitle>
              <CardDescription>
                Instant risk scores and detailed analysis powered by the same AI that drives our web application
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-12 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center dark:text-white">
              <Monitor className="h-6 w-6 mr-2 text-blue-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Browse Normally</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Continue browsing the web as usual. The extension works silently in the background.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Automatic Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  When you visit a website, the extension automatically finds and analyzes legal documents.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Insights</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive instant notifications and detailed analysis through the extension popup.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screenshots/Demo */}
        <Tabs defaultValue="notification" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notification">Notifications</TabsTrigger>
            <TabsTrigger value="popup">Extension Popup</TabsTrigger>
            <TabsTrigger value="badge">Risk Indicators</TabsTrigger>
          </TabsList>

          <TabsContent value="notification">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="dark:text-white">Smart Notifications</CardTitle>
                <CardDescription>
                  Non-intrusive notifications appear when you visit websites with concerning terms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 text-center">
                  <div className="max-w-sm mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-semibold text-sm">Terms Analyzer</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">×</button>
                    </div>
                    <div className="mb-3">
                      <Badge className="bg-red-100 text-red-800 border-red-200">HIGH RISK (78/100)</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      This website has concerning privacy practices and user rights limitations.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">Dismiss</Button>
                      <Button size="sm" className="text-xs">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popup">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="dark:text-white">Detailed Analysis Popup</CardTitle>
                <CardDescription>
                  Click the extension icon for comprehensive analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 flex justify-center">
                  <div className="w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5" />
                        <h3 className="font-semibold">Terms Analyzer</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🌐</div>
                        <div>
                          <div className="font-semibold text-sm">Example Website</div>
                          <div className="text-xs text-gray-500">example.com</div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">MEDIUM RISK</span>
                          <span className="text-xs font-bold">45/100</span>
                        </div>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                          Found 2 documents with moderate privacy concerns
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">Refresh</Button>
                        <Button size="sm" className="flex-1 text-xs">Full Analysis</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badge">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="dark:text-white">Risk Level Badges</CardTitle>
                <CardDescription>
                  Extension icon shows risk level for quick reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">LOW</div>
                    </div>
                    <h4 className="font-semibold text-green-600">Low Risk</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">User-friendly terms</p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-1 rounded">MED</div>
                    </div>
                    <h4 className="font-semibold text-yellow-600">Medium Risk</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Review carefully</p>
                  </div>
                  <div className="text-center">
                    <div className="relative inline-block mb-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">HIGH</div>
                    </div>
                    <h4 className="font-semibold text-red-600">High Risk</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Proceed with caution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Privacy & Security */}
        <Card className="mb-12 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center dark:text-white">
              <Lock className="h-6 w-6 mr-2 text-green-600" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What We Don't Collect</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">No personal browsing history</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">No user identification data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">No tracking or analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">No data sharing with third parties</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">How It Works</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Only analyzes public legal documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Sends URLs to our secure API</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Results cached locally on your device</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">All communication encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        <Card className="mb-12 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center dark:text-white">
              <Download className="h-6 w-6 mr-2 text-blue-600" />
              Installation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chrome">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chrome">Chrome/Edge</TabsTrigger>
                <TabsTrigger value="firefox">Firefox (Coming Soon)</TabsTrigger>
              </TabsList>

              <TabsContent value="chrome" className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Chrome Web Store (Recommended)</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Install directly from the Chrome Web Store for automatic updates and security.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Chrome className="h-4 w-4 mr-2" />
                    Add to Chrome
                  </Button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Manual Installation (Developer Mode)</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>Download the extension files from GitHub</li>
                    <li>Open Chrome and go to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">chrome://extensions/</code></li>
                    <li>Enable "Developer mode" in the top right</li>
                    <li>Click "Load unpacked" and select the extension folder</li>
                    <li>Pin the extension to your toolbar for easy access</li>
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="firefox" className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700 text-center">
                  <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Coming Soon</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    Firefox support is in development. Sign up for updates to be notified when it's available.
                  </p>
                  <Button variant="outline" className="mt-3">
                    Notify Me
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Browse with Confidence?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Install the Terms Analyzer extension and never be surprised by hidden clauses or unfair terms again. 
            Your privacy and digital rights matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="h-5 w-5 mr-2" />
              Install Extension
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                Try Web Version
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}