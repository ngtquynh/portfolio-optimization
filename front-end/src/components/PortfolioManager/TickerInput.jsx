import React, { useState } from 'react';


export default function TickerInput({ tickers, setTickers }) {
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

