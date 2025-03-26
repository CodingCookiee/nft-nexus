'use client'
import React from 'react';
import { Header, Footer, Main } from './components/layout';
import { Toaster } from './components/ui/common/sonner';
import { Button } from './components/ui/common';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between p-0 min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to NFT Nexus
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Your unified platform to manage, showcase, and monetize your NFT collections
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="default" size="lg" className="px-8">
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Manage Collection</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Easily organize and track your NFT portfolio in one place
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get insights on your collection value and market trends
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Buy, sell, and trade NFTs with secure wallet integration
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster 
        position="top-center" 
        richColors
        closeButton
      />
    </div>
  );
}
