import PieChart from '../Chart/PieChart';

// Component to display a single portfolio result
export default function PortfolioResultCard({ portfolio, investment }) {
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