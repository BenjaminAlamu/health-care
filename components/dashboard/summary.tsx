"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCount } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface DashboardSummaryProps {
  totalAmount: number;
  statusCounts: StatusCount[];
  totalClaims: number;
}

export function DashboardSummary({ totalAmount, statusCounts, totalClaims }: DashboardSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "hsl(var(--chart-2))";
      case "Pending": return "hsl(var(--chart-4))";
      case "Denied": return "hsl(var(--chart-1))";
      default: return "hsl(var(--chart-3))";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Billing Amount</CardTitle>
          <CardDescription>Sum of all claim amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Claims Breakdown</CardTitle>
          <CardDescription>Total claims: {totalClaims}</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="space-y-2">
            {statusCounts.map((status) => (
              <div key={status.status} className="flex items-center">
                <div className={cn("h-3 w-3 rounded-full mr-2")}
                  style={{ backgroundColor: getStatusColor(status.status) }} />
                <div className="flex-1">
                  <div className="text-sm">{status.status}</div>
                </div>
                <div>{status.count}</div>
                <div className="ml-2 text-muted-foreground">
                  {Math.round((status.count / totalClaims) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Claims Distribution</CardTitle>
          <CardDescription>By payment status</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusCounts}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                nameKey="status"

              >
                {statusCounts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.status)}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value} claims`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}