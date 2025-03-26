'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { Text, Button } from '../../components/ui/common';
import { Web3Provider } from '../../context/Web3Provider';
import { siweClient } from '../../utils/siweClient';
import WalletConnector from '../../components/ui/client/WalletConnector';

const SignIn = () => {
    const router = useRouter();

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        // Implement Google Sign In logic here
        // After successful sign in, redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-indigo-950">
            <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <img 
                        src="/app/favicon.png" 
                        alt="NFT Nexus Logo" 
                        className="mx-auto h-16 w-16 mb-4"
                    />
                    <Text variant="h2" color="primary" align="center">
                        Welcome to NFT Nexus
                    </Text>
                    <Text variant="body" color="secondary" align="center" className="mt-2">
                        Sign in to access your NFT dashboard
                    </Text>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <Text variant="h5" color="default" align="center" className="mb-4">
                            Connect with Wallet
                        </Text>
                        <Web3Provider>
                            <siweClient.Provider
                                enabled={true}
                                onSignIn={(session) => {
                                    if (session) {
                                        router.push('/dashboard');
                                    }
                                }}
                            >
                                <WalletConnector compact={true} />
                            </siweClient.Provider>
                        </Web3Provider>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
