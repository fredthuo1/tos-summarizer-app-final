'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield } from 'lucide-react';

export function MobileNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-3">
            <Link 
              href="/" 
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              ℹ️ About
            </Link>
            <Link 
              href="/extension" 
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              🧩 Extension
            </Link>
            <Link 
              href="/legal" 
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              ⚖️ Legal
            </Link>
            
            {/* Mobile CTA Button */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/" 
                className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                🚀 Start Analysis
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}