# portfolio-optimization
PortfolioPilot - Portfolio Optimization Web App
PortfolioPilot is a web application designed to help users make informed investment decisions by providing optimized stock portfolio allocations based on modern portfolio theory. Users can input a list of stock tickers and a total investment amount to receive recommendations for multiple portfolio strategies.

✨ Features
Dynamic Stock Selection: Easily add or remove stock tickers to build your desired list.

Investment Sizing: Specify your total investment amount to see allocations in dollar values.

Dual Portfolio Models: Receive two distinct optimized portfolios:

Max Sharpe Ratio: Aims for the best possible return for the amount of risk taken.

Minimum Volatility: Aims for the lowest possible risk, regardless of return.

Clear Visualizations: Interactive pie charts display the percentage allocation for each stock.

Detailed Metrics: View key performance indicators like Expected Annual Return and Annual Volatility (Risk) for each portfolio.

🛠️ Tech Stack
Frontend: React, Tailwind CSS

Backend: Python, Flask

Data & Analysis: yfinance, pandas, numpy

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Make sure you have the following software installed on your system:

Node.js (which includes npm)

Python 3 and pip

Installation & Setup
1. Clone the Repository

git clone <your-repository-url>
cd <your-project-directory>

2. Backend Setup (Flask)

First, create a requirements.txt file in your backend directory with the following content:

# requirements.txt
Flask
Flask-Cors
yfinance
numpy
pandas

Now, follow these steps in your terminal:

# Navigate to the backend directory
cd path/to/your/backend/folder

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Run the Flask server
# The server will start on [http://127.0.0.1:5000](http://127.0.0.1:5000)
flask run

3. Frontend Setup (React)

Open a new terminal window and follow these steps:

# Navigate to the frontend directory
cd path/to/your/frontend/folder

# Install Node.js dependencies
npm install

# Install Tailwind CSS and its peer dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# (If you haven't already) Configure your tailwind.config.js to process your files
# content: ["./src/**/*.{js,jsx,ts,tsx}"],

# (If you haven't already) Add the Tailwind directives to your main CSS file (e.g., src/index.css)
# @tailwind base;
# @tailwind components;
# @tailwind utilities;

# Start the React development server
# The app will open on http://localhost:3000
npm start

Usage
Once both the backend and frontend servers are running, open your web browser and navigate to http://localhost:3000.

Use the input field to add stock tickers to the list (e.g., TSLA, NVDA, JPM).

Enter your desired total investment amount.

Click the "Optimize Portfolios" button.

The application will fetch data, perform the optimization, and display the results for the "Max Sharpe Ratio" and "Minimum Volatility" portfolios.

API Endpoint
The backend provides a single API endpoint to perform the optimization.

Endpoint: /optimize

Method: POST

JSON Payload:

{
  "tickers": ["AAPL", "GOOG", "MSFT"]
}

Success Response (200 OK):

{
  "portfolios": [
    {
      "name": "Max Sharpe Ratio",
      "weights": { "AAPL": 0.4, "GOOG": 0.3, "MSFT": 0.3 },
      "expected_return": "28.50%",
      "risk": "22.10%"
    }
  ]
}