# FinSight

A full-stack portfolio tracking and risk analytics dashboard. Track your holdings, see live P&L and allocation, measure portfolio risk (volatility, Sharpe ratio, Value at Risk), stress-test against market drops, and follow news for the stocks you own.

![FinSight dashboard screenshot](docs/screenshot.png)

<!-- TODO: add a screenshot at docs/screenshot.png -->

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Recharts, Axios, Heroicons
- **Backend:** Node.js, Express, express-rate-limit
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcrypt
- **Data providers:** Alpha Vantage (prices), Finnhub (news)

## Features

- Email/password authentication with JWT sessions
- Holdings tracking with live quotes, P&L ($ and %), and allocation chart
- Dashboard with portfolio value history and summary metrics
- Risk analytics: annualised volatility, Sharpe ratio, 95% VaR, return distribution, risk contribution per holding
- Interactive market-drop stress test
- News feed aggregated across your holdings, filterable by ticker
- Responsive layout (bottom navigation on mobile), loading skeletons, empty states, and toast error notifications
- Production hardening: rate limiting, input validation, configurable CORS

## Setup

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)
- Free API keys from [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and [Finnhub](https://finnhub.io/)

### 1. Clone and install

```bash
git clone <your-repo-url> finsight
cd finsight
cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

**Server** — copy `.env.example` to `.env` in the project root (the server loads `../.env`):

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `ALPHA_VANTAGE_API_KEY` | Price data key |
| `FINNHUB_API_KEY` | News data key |
| `FRONTEND_URL` | Allowed CORS origin (falls back to `http://localhost:5173` in development; required when `NODE_ENV=production`) |

**Client** — copy `client/.env.example` to `client/.env`:

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |

### 3. Run in development

In two terminals:

```bash
cd server && npm run dev
```

```bash
cd client && npm run dev
```

The app is served at http://localhost:5173 and the API at http://localhost:5000.

### Production build

```bash
cd client && npm run build   # outputs client/dist (set VITE_API_URL before building)
cd server && NODE_ENV=production npm start
```
