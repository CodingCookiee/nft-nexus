'use client'
import React from 'react';
import { Header, Footer } from '../../components/layout';
import WalletConnector from '../../components/ui/client/WalletConnector';
import { Web3Provider } from '../../context/Web3Provider';

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-between p-0 min-h-screen bg-background">
            <Header />
            <main className="flex-1 container py-8">
                <Web3Provider>
                    <WalletConnector />
                </Web3Provider>
            </main>
            <Footer />
        
        </div>
    );
}

export default Dashboard;
