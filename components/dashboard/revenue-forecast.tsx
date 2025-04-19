"use client"

import { useState, useEffect, useRef } from "react";
import { BillingRecord, PaymentProbability, SimulationResult } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { runMonteCarloSimulation, createSimulationWorker } from "@/lib/simulation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";

interface RevenueForecastProps {
  data: BillingRecord[];
}

export function RevenueForecast({ data }: RevenueForecastProps) {
  const initialProbabilities: PaymentProbability[] = [
    { status: "Approved", probability: 0.95 },
    { status: "Pending", probability: 0.6 },
    { status: "Denied", probability: 0.1 },
  ];

  const [probabilities, setProbabilities] = useState<PaymentProbability[]>(initialProbabilities);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const workerBlob = new Blob([createSimulationWorker()], { type: 'text/javascript' });
      const workerUrl = URL.createObjectURL(workerBlob);
      workerRef.current = new Worker(workerUrl);

      workerRef.current.onmessage = (e) => {
        setSimulationResult(e.data);
        setIsSimulating(false);
      };

      return () => {
        if (workerRef.current) {
          workerRef.current.terminate();
          URL.revokeObjectURL(workerUrl);
        }
      };
    }
  }, []);

  useEffect(() => {
    runSimulation();
  }, [probabilities]);

  const runSimulation = () => {
    if (!data.length) return;

    setIsSimulating(true);

    if (workerRef.current) {
      workerRef.current.postMessage({
        data,
        probabilities,
        iterations: 2000
      });
    } else {
      setTimeout(() => {
        const result = runMonteCarloSimulation(data, probabilities, 2000);
        setSimulationResult(result);
        setIsSimulating(false);
      }, 0);
    }
  };

  const updateProbability = (status: string, value: number) => {
    setProbabilities(
      probabilities.map(p =>
        p.status === status ? { ...p, probability: value / 100 } : p
      )
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getChartData = () => {
    if (!simulationResult) return [];

    return simulationResult.distribution.map(({ value, count }) => ({
      revenue: Math.round(value),
      frequency: count
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Forecasting</CardTitle>
        <CardDescription>Adjust payment probabilities to simulate revenue outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Payment Probabilities</h3>

              {probabilities.map((prob) => (
                <div key={prob.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{prob.status}</label>
                    <span className="text-sm">{Math.round(prob.probability * 100)}%</span>
                  </div>
                  <Slider
                    value={[prob.probability * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([value]) => updateProbability(prob.status, value)}
                    className={`${prob.status === 'Approved' ? 'accent-green-500' :
                      prob.status === 'Pending' ? 'accent-yellow-500' :
                        'accent-red-500'}`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-medium">Simulation Results</h3>

              {simulationResult ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Expected Revenue</div>
                      <div className="mt-1 text-3xl font-bold">
                        {formatCurrency(simulationResult.expectedRevenue)}
                      </div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Revenue Range</div>
                      <div className="mt-1 text-sm">
                        {formatCurrency(simulationResult.minRevenue)} - {formatCurrency(simulationResult.maxRevenue)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">25th Percentile</div>
                      <div className="mt-1 text-sm font-medium">
                        {formatCurrency(simulationResult.percentiles.p25)}
                      </div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">Median</div>
                      <div className="mt-1 text-sm font-medium">
                        {formatCurrency(simulationResult.percentiles.p50)}
                      </div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">75th Percentile</div>
                      <div className="mt-1 text-sm font-medium">
                        {formatCurrency(simulationResult.percentiles.p75)}
                      </div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-xs text-muted-foreground">95th Percentile</div>
                      <div className="mt-1 text-sm font-medium">
                        {formatCurrency(simulationResult.percentiles.p95)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  {isSimulating ? 'Running simulation...' : 'No simulation results yet'}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProbabilities(initialProbabilities);
                  }}
                  disabled={isSimulating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={runSimulation}
                  disabled={isSimulating}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </Button>
              </div>
            </div>
          </div>

          <div className="h-80">
            <h3 className="text-sm font-medium mb-4">Revenue Distribution</h3>
            {simulationResult ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getChartData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="revenue"
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                    label={{ value: 'Revenue', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis
                    label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [value, name === 'frequency' ? 'Frequency' : '']}
                    labelFormatter={(value) => `Revenue: ${formatCurrency(value)}`}
                  />
                  <ReferenceLine
                    x={simulationResult.expectedRevenue}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="3 3"
                    label={{ value: 'Expected', position: 'top' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="frequency"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                {isSimulating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <span>Running simulation...</span>
                  </div>
                ) : (
                  "Adjust the sliders to run a simulation"
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}