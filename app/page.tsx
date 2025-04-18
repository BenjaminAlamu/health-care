import { Suspense } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSummary } from '@/components/dashboard/summary';
import { ClaimsTable } from '@/components/dashboard/claims-table';
import { RevenueForecast } from '@/components/dashboard/revenue-forecast';
import { fetchBillingData, fetchBillingStats } from '@/lib/actions';

export default async function Home() {
  // Fetch data using imported functions (not server actions in this version)
  const billingData = await fetchBillingData();
  const { totalAmount, statusCounts, totalClaims } = await fetchBillingStats();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1">
        <div className="container mx-auto p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Healthcare Billing Dashboard</h1>
              <p className="text-muted-foreground">
                Manage healthcare claims and forecast revenue with Monte Carlo simulation
              </p>
            </div>
          </div>

          <Suspense fallback={<div>Loading dashboard summary...</div>}>
            <DashboardSummary
              totalAmount={totalAmount}
              statusCounts={statusCounts}
              totalClaims={totalClaims}
            />
          </Suspense>

          <Suspense fallback={<div>Loading revenue forecast...</div>}>
            <RevenueForecast data={billingData} />
          </Suspense>

          <Suspense fallback={<div>Loading claims table...</div>}>
            <ClaimsTable data={billingData} />
          </Suspense>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 Benjamin Alamu
        </div>
      </footer>
    </div>
  );
}