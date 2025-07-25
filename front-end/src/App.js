import React from 'react';
import Navbar from './components/Navbar/Navbar';
import PortfolioManager from './components/PortfolioManager/PortfolioManager';

export default function App() {
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Navbar />
            <main className="container mx-auto p-4 md:p-8">
                <PortfolioManager />
            </main>
        </div>
    );
}
