import React, { useState, useEffect } from 'react';

// Main App Component
export default function App() {
    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <nav className="bg-gray-800 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h1 className="text-2xl font-bold tracking-wider">PortfolioPilot</h1>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto p-4 md:p-8">
                <PortfolioManager />
            </main>
        </div>
    );
}

// --- Child Components ---

// Component to manage the list of tickers
function TickerInput({ tickers, setTickers }) {
    const [currentTicker, setCurrentTicker] = useState('');

    const handleAddTicker = () => {
        const newTicker = currentTicker.trim().toUpperCase();
        if (newTicker && !tickers.includes(newTicker)) {
            setTickers([...tickers, newTicker]);
        }
        setCurrentTicker('');
    };

    const handleRemoveTicker = (tickerToRemove) => {
        setTickers(tickers.filter(t => t !== tickerToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTicker();
        }
    };

    return (
        <div>
            <label htmlFor="tickers" className="block text-sm font-medium text-gray-300 mb-2">Stock Tickers</label>
            <div className="flex">
                <input
                    type="text"
                    id="tickers"
                    value={currentTicker}
                    onChange={(e) => setCurrentTicker(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., AAPL"
                />
                <button onClick={handleAddTicker} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
                {tickers.map(ticker => (
                    <span key={ticker} className="bg-gray-600 text-sm rounded-full px-3 py-1 flex items-center">
                        {ticker}
                        <button onClick={() => handleRemoveTicker(ticker)} className="ml-2 text-red-400 hover:text-red-300 text-lg leading-none">&times;</button>
                    </span>
                ))}
            </div>
        </div>
    );
}

// Component to display a single portfolio result
function PortfolioResultCard({ portfolio, investment }) {
    return (
        <div className="bg-gray-700 p-6 rounded-lg flex-grow flex flex-col">
            <h4 className="text-xl font-semibold mb-4 text-center text-green-300">{portfolio.name}</h4>
            <div className="mb-6 flex-grow">
                 <PieChart data={portfolio.weights} />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-400">Expected Return:</span>
                    <span className="font-mono text-green-400">{portfolio.expected_return}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Volatility (Risk):</span>
                    <span className="font-mono text-yellow-400">{portfolio.risk}</span>
                </div>
            </div>
            <h5 className="text-lg font-semibold mt-6 mb-3">Allocations ($)</h5>
            <div className="space-y-2 text-sm">
                {Object.entries(portfolio.weights).map(([ticker, weight]) => (
                    <div key={ticker} className="flex justify-between items-center">
                        <span className="font-bold">{ticker}</span>
                        <span className="font-mono text-blue-400">${(parseFloat(investment) * weight).toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Pie Chart Component for Visualization
function PieChart({ data }) {
    const [colors, setColors] = useState([]);

    useEffect(() => {
        const generateColors = (numColors) => {
            const colorArray = [];
            for (let i = 0; i < numColors; i++) {
                const hue = (i * (360 / (numColors * 1.618))) % 360; // Use golden angle for better distribution
                colorArray.push(`hsl(${hue}, 70%, 50%)`);
            }
            return colorArray;
        };
        setColors(generateColors(Object.keys(data).length));
    }, [data]);

    if (!data || Object.keys(data).length === 0) return null;

    const total = Object.values(data).reduce((acc, val) => acc + val, 0);
    let cumulativePercent = 0;

    const segments = Object.entries(data).map(([ticker, weight], index) => {
        const percent = (weight / total) * 100;
        const startAngle = (cumulativePercent / 100) * 360;
        cumulativePercent += percent;
        const endAngle = (cumulativePercent / 100) * 360;
        const largeArcFlag = percent > 50 ? 1 : 0;
        const startX = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
        const startY = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
        const endX = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
        const endY = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
        const pathData = `M 50,50 L ${startX},${startY} A 40,40 0 ${largeArcFlag},1 ${endX},${endY} Z`;

        return <path key={ticker} d={pathData} fill={colors[index]} />;
    });

    return (
        <div className="w-full flex flex-col items-center">
            <svg viewBox="0 0 100 100" className="w-40 h-40 md:w-48 md:h-48 transform transition-transform duration-500 hover:scale-105">
                {segments}
            </svg>
            <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
                {Object.keys(data).map((ticker, index) => (
                    <div key={ticker} className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: colors[index] }}></span>
                        <span>{ticker}: {(data[ticker] * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


// --- Main Portfolio Manager Component ---
function PortfolioManager() {
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
            // --- REAL BACKEND CALL ---
            const response = await fetch('http://127.0.0.1:5000/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickers: tickers }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            setOptimizedPortfolios(data.portfolios);
            // --- END REAL CALL ---
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-gray-500 flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Optimizing...
                    </>
                ) : (
                    'Optimize Portfolios'
                )}
            </button>

            {error && <div className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}

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
