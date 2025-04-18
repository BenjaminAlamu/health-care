export interface BillingRecord {
  patient_id: string;
  patient_name: string;
  billing_code: string;
  amount: number;
  insurance_provider: string;
  payment_status: "Pending" | "Approved" | "Denied";
  claim_date: string;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface PaymentProbability {
  status: string;
  probability: number;
}

export interface SimulationResult {
  expectedRevenue: number;
  minRevenue: number;
  maxRevenue: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  };
  distribution: { value: number; count: number }[];
}
