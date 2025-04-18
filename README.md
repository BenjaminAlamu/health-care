# Healthcare Billing Dashboard

A comprehensive healthcare billing analytics dashboard with Monte Carlo simulation for revenue forecasting.

## Features

- **Dashboard Summary**: Displays total billing amount and count of claims by status with a visualization showing claim distribution
- **Claims Table**: Interactive table with filtering, sorting, and search functionality
- **Revenue Forecasting**: Monte Carlo simulation tool that allows adjusting payment probabilities and visualizes potential revenue outcomes
- **Server-side Data Handling**: Uses React Server Components and Server Actions for data fetching

## Technology Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Recharts for data visualization

## Component Architecture

The application is organized into modular components:

- **Dashboard Layout**: Main layout with header and footer
- **Dashboard Summary**: Displays key metrics and a pie chart for claim distribution
- **Claims Table**: Interactive table with filtering and sorting capabilities 
- **Revenue Forecasting**: Monte Carlo simulation tool with adjustable parameters

## State Management

- **Server Components**: Used for static UI elements and initial data fetching
- **Client Components**: Used for interactive elements like the claims table and revenue forecasting tool
- **Web Workers**: Used for running Monte Carlo simulations without blocking the UI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Monte Carlo Simulation

The revenue forecasting tool uses Monte Carlo simulation to predict potential revenue outcomes:

1. User adjusts payment probabilities for each claim status (Approved, Pending, Denied)
2. The simulation runs multiple iterations (2000 by default)
3. For each iteration, it determines whether each claim gets paid based on its status and the associated probability
4. Results are displayed as expected revenue, revenue range, and a distribution chart

The simulation runs in a Web Worker to ensure the UI remains responsive during calculations.