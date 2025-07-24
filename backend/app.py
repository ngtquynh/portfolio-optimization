from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd

# Initialize the Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow the frontend to make requests
CORS(app)

def get_stock_data(tickers, start_date="2020-01-01", end_date=None):
    """
    Fetches historical stock data from Yahoo Finance.
    
    Args:
        tickers (list): A list of stock ticker symbols.
        start_date (str): The start date for historical data (YYYY-MM-DD).
        end_date (str): The end date for historical data (YYYY-MM-DD). Defaults to today.

    Returns:
        pandas.DataFrame: A DataFrame with the adjusted closing prices of the stocks. Returns None on failure.
    """
    try:
        # Download data, silencing yfinance output
        data = yf.download(tickers, start=start_date, end=end_date, progress=False)['Adj Close']
        # If only one ticker, it returns a Series, convert to DataFrame
        if isinstance(data, pd.Series):
            data = data.to_frame(name=tickers[0])
        # Drop tickers that returned no data (all NaN columns)
        data.dropna(axis=1, how='all', inplace=True)
        # Forward-fill any missing values, then back-fill
        data = data.ffill().bfill()
        if data.empty or data.isnull().values.any():
            raise ValueError("Could not fetch valid data for all tickers.")
        return data
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return None

def calculate_portfolios(data):
    """
    Performs mean-variance optimization to find two portfolios:
    1. Maximum Sharpe Ratio Portfolio
    2. Minimum Volatility Portfolio

    Args:
        data (pandas.DataFrame): DataFrame of historical adjusted closing prices.

    Returns:
        list: A list of dictionaries, where each dictionary represents an optimized portfolio.
    """
    # Calculate daily returns
    returns = data.pct_change().dropna()
    
    # Calculate mean returns and covariance matrix
    mean_returns = returns.mean()
    cov_matrix = returns.cov()
    
    num_portfolios = 25000  # Number of random portfolios to simulate
    num_assets = len(data.columns)
    
    # Set up arrays to store simulation results
    results = np.zeros((3, num_portfolios)) # 0: Return, 1: Volatility, 2: Sharpe Ratio
    weights_record = []
    
    for i in range(num_portfolios):
        # Generate random weights
        weights = np.random.random(num_assets)
        weights /= np.sum(weights) # Normalize to sum to 1
        weights_record.append(weights)
        
        # Calculate portfolio return and volatility (annualized)
        portfolio_return = np.sum(mean_returns * weights) * 252 
        portfolio_stddev = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights))) * np.sqrt(252)
        
        # Store results
        results[0,i] = portfolio_return
        results[1,i] = portfolio_stddev
        # Sharpe Ratio (assuming risk-free rate of 0)
        results[2,i] = results[0,i] / results[1,i] if results[1,i] != 0 else 0
        
    # --- Find Optimal Portfolios ---

    # 1. Portfolio with the highest Sharpe ratio
    max_sharpe_idx = np.argmax(results[2])
    max_sharpe_return = results[0, max_sharpe_idx]
    max_sharpe_risk = results[1, max_sharpe_idx]
    max_sharpe_weights = {ticker: weight for ticker, weight in zip(data.columns, weights_record[max_sharpe_idx])}
    
    max_sharpe_portfolio = {
        "name": "Max Sharpe Ratio",
        "weights": max_sharpe_weights,
        "expected_return": f"{max_sharpe_return:.2%}",
        "risk": f"{max_sharpe_risk:.2%}"
    }

    # 2. Portfolio with the minimum volatility (risk)
    min_vol_idx = np.argmin(results[1])
    min_vol_return = results[0, min_vol_idx]
    min_vol_risk = results[1, min_vol_idx]
    min_vol_weights = {ticker: weight for ticker, weight in zip(data.columns, weights_record[min_vol_idx])}

    min_vol_portfolio = {
        "name": "Minimum Volatility",
        "weights": min_vol_weights,
        "expected_return": f"{min_vol_return:.2%}",
        "risk": f"{min_vol_risk:.2%}"
    }
    
    return [max_sharpe_portfolio, min_vol_portfolio]


@app.route('/optimize', methods=['POST'])
def optimize_portfolio_endpoint():
    """
    API endpoint to optimize a portfolio.
    Expects a JSON payload with 'tickers' (list of strings).
    """
    data = request.get_json()
    
    if not data or 'tickers' not in data:
        return jsonify({"error": "Missing 'tickers' in request body"}), 400
        
    tickers = data['tickers']
    
    if not isinstance(tickers, list) or len(tickers) < 2:
        return jsonify({"error": "'tickers' must be a list of at least two symbols"}), 400

    # Fetch historical data
    stock_data = get_stock_data(tickers)
    if stock_data is None or stock_data.shape[1] < len(tickers):
         return jsonify({"error": f"Could not retrieve valid data for one or more tickers. Please check symbols."}), 404

    # Perform optimization
    try:
        portfolios = calculate_portfolios(stock_data)
    except Exception as e:
        return jsonify({"error": f"An error occurred during optimization: {str(e)}"}), 500
        
    # Prepare the response
    response = {
        "portfolios": portfolios
    }
    
    return jsonify(response)

# To run the app:
# 1. Make sure you have Flask, flask_cors, yfinance, numpy, and pandas installed.
# 2. Save this code as a Python file (e.g., `app.py`).
# 3. Run from your terminal: `flask run`
# The server will start, typically on http://127.0.0.1:5000
if __name__ == '__main__':
    # This allows running the script directly with `python app.py`
    app.run(debug=True, port=5000)
