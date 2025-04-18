import { BillingRecord, PaymentProbability, SimulationResult } from "./types";

export const runMonteCarloSimulation = (
  data: BillingRecord[],
  probabilities: PaymentProbability[],
  iterations: number = 2000
): SimulationResult => {
  const probabilityMap = new Map<string, number>();
  probabilities.forEach((p) => probabilityMap.set(p.status, p.probability));

  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let totalRevenue = 0;

    data.forEach((record) => {
      const probability = probabilityMap.get(record.payment_status) || 0;

      const random = Math.random();
      if (random < probability) {
        totalRevenue += record.amount;
      }
    });

    results.push(totalRevenue);
  }
  results.sort((a, b) => a - b);

  const expectedRevenue =
    results.reduce((sum, val) => sum + val, 0) / iterations;
  const minRevenue = results[0];
  const maxRevenue = results[results.length - 1];

  const p25 = results[Math.floor(iterations * 0.25)];
  const p50 = results[Math.floor(iterations * 0.5)];
  const p75 = results[Math.floor(iterations * 0.75)];
  const p95 = results[Math.floor(iterations * 0.95)];

  const distributionMap = new Map<number, number>();
  const step = (maxRevenue - minRevenue) / 10;

  results.forEach((value) => {
    const bucket = Math.floor(value / step) * step;
    distributionMap.set(bucket, (distributionMap.get(bucket) || 0) + 1);
  });

  const distribution = Array.from(distributionMap.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value - b.value);

  return {
    expectedRevenue,
    minRevenue,
    maxRevenue,
    percentiles: {
      p25,
      p50,
      p75,
      p95,
    },
    distribution,
  };
};

export const createSimulationWorker = () => {
  return `
    self.onmessage = function(e) {
      const { data, probabilities, iterations } = e.data;
      
      const probabilityMap = new Map();
      probabilities.forEach(p => probabilityMap.set(p.status, p.probability));
      
      const results = [];
      
      for (let i = 0; i < iterations; i++) {
        let totalRevenue = 0;
        
        data.forEach(record => {
          const probability = probabilityMap.get(record.payment_status) || 0;
          
          const random = Math.random();
          
          if (random < probability) {
            totalRevenue += record.amount;
          }
        });
        
        results.push(totalRevenue);
      }
      results.sort((a, b) => a - b);
      
      const expectedRevenue = results.reduce((sum, val) => sum + val, 0) / iterations;
      const minRevenue = results[0];
      const maxRevenue = results[results.length - 1];
      

      const p25 = results[Math.floor(iterations * 0.25)];
      const p50 = results[Math.floor(iterations * 0.5)];
      const p75 = results[Math.floor(iterations * 0.75)];
      const p95 = results[Math.floor(iterations * 0.95)];
      
      const distributionMap = new Map();
      const step = (maxRevenue - minRevenue) / 10;
      
      results.forEach(value => {
        const bucket = Math.floor(value / step) * step;
        distributionMap.set(bucket, (distributionMap.get(bucket) || 0) + 1);
      });
      
      const distribution = Array.from(distributionMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value - b.value);
      
      self.postMessage({
        expectedRevenue,
        minRevenue,
        maxRevenue,
        percentiles: {
          p25,
          p50,
          p75,
          p95
        },
        distribution
      });
    }
  `;
};
