import React, { useState } from 'react';
import TickerInput from './TickerInput';
import PortfolioResultCard from './PortfolioResultCard';

export default function PortfolioManager() {
    const [tickers, setTickers] = useState(['AAPL', 'GOOG', 'MSFT', 'AMZN']);
    const [investment, setInvestment] = useState('10000');
    const [optimizedPortfolios, setOptimizedPortfolios] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOptimize = async () => {
        setIsLoading(true);
        setError(null);
        setOptimizedPortfolios(null);

        if (tickers.length < 2) {
            setError("Please add at least two stock tickers.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickers }),
            });
            
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || `HTTP error! status: ${response.status}`);
            setOptimizedPortfolios(data.portfolios);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-green-400">Portfolio Optimizer</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <TickerInput tickers={tickers} setTickers={setTickers} />
                <div>
                    <label htmlFor="investment" className="block text-sm font-medium text-gray-300 mb-2">Total Investment ($)</label>
                    <input
                        type="number"
                        id="investment"
                        value={investment}
                        onChange={(e) => setInvestment(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 10000"
                    />
                </div>
            </div>

            <button
                onClick={handleOptimize}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-500"
            >
                {isLoading ? 'Optimizing...' : 'Optimize Portfolios'}
            </button>

            {error && <div className="mt-4 text-red-400 text-center">{error}</div>}

            {optimizedPortfolios && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4 text-center text-green-400">Optimization Results</h3>
                    <div className="flex flex-col lg:flex-row gap-8 justify-center">
                        {optimizedPortfolios.map(portfolio => (
                            <PortfolioResultCard key={portfolio.name} portfolio={portfolio} investment={investment} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
