import { useState, useEffect } from "react";

// Pie Chart Component for Visualization
export default function PieChart({ data }) {
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