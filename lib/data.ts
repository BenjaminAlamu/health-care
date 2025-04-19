import { BillingRecord, StatusCount } from "./types";

export const mockBillingData: BillingRecord[] = [
  {
    patient_id: "P1",
    patient_name: "John Smith",
    billing_code: "B1001",
    amount: 1675.5,
    insurance_provider: "Blue Shield",
    payment_status: "Pending",
    claim_date: "2025-03-25",
  },
  {
    patient_id: "P2",
    patient_name: "Sarah Johnson",
    billing_code: "B2002",
    amount: 2310.09,
    insurance_provider: "Medicare",
    payment_status: "Approved",
    claim_date: "2025-01-05",
  },
  {
    patient_id: "P3",
    patient_name: "Robert Chen",
    billing_code: "B3003",
    amount: 4945.57,
    insurance_provider: "Aetna",
    payment_status: "Pending",
    claim_date: "2025-03-04",
  },
  {
    patient_id: "P4",
    patient_name: "Lisa Williams",
    billing_code: "B4004",
    amount: 8338.89,
    insurance_provider: "UnitedHealth",
    payment_status: "Denied",
    claim_date: "2025-03-20",
  },
  {
    patient_id: "P5",
    patient_name: "Michael Garcia",
    billing_code: "B5005",
    amount: 3220.05,
    insurance_provider: "Cigna",
    payment_status: "Denied",
    claim_date: "2025-02-21",
  },
  {
    patient_id: "P1",
    patient_name: "John Smith",
    billing_code: "B1001",
    amount: 1675.5,
    insurance_provider: "Blue Shield",
    payment_status: "Pending",
    claim_date: "2025-03-25",
  },
  {
    patient_id: "P2",
    patient_name: "Sarah Johnson",
    billing_code: "B2002",
    amount: 2310.09,
    insurance_provider: "Medicare",
    payment_status: "Approved",
    claim_date: "2025-01-05",
  },
  {
    patient_id: "P3",
    patient_name: "Robert Chen",
    billing_code: "B3003",
    amount: 4945.57,
    insurance_provider: "Aetna",
    payment_status: "Pending",
    claim_date: "2025-03-04",
  },
  {
    patient_id: "P4",
    patient_name: "Lisa Williams",
    billing_code: "B4004",
    amount: 8338.89,
    insurance_provider: "UnitedHealth",
    payment_status: "Denied",
    claim_date: "2025-03-20",
  },
  {
    patient_id: "P5",
    patient_name: "Michael Garcia",
    billing_code: "B5005",
    amount: 3220.05,
    insurance_provider: "Cigna",
    payment_status: "Denied",
    claim_date: "2025-02-21",
  },
  {
    patient_id: "P1",
    patient_name: "John Smith",
    billing_code: "B1001",
    amount: 1675.5,
    insurance_provider: "Blue Shield",
    payment_status: "Pending",
    claim_date: "2025-03-25",
  },
  {
    patient_id: "P2",
    patient_name: "Sarah Johnson",
    billing_code: "B2002",
    amount: 2310.09,
    insurance_provider: "Medicare",
    payment_status: "Approved",
    claim_date: "2025-01-05",
  },
  {
    patient_id: "P3",
    patient_name: "Robert Chen",
    billing_code: "B3003",
    amount: 4945.57,
    insurance_provider: "Aetna",
    payment_status: "Pending",
    claim_date: "2025-03-04",
  },
  {
    patient_id: "P4",
    patient_name: "Lisa Williams",
    billing_code: "B4004",
    amount: 8338.89,
    insurance_provider: "UnitedHealth",
    payment_status: "Denied",
    claim_date: "2025-03-20",
  },
  {
    patient_id: "P5",
    patient_name: "Michael Garcia",
    billing_code: "B5005",
    amount: 3220.05,
    insurance_provider: "Cigna",
    payment_status: "Denied",
    claim_date: "2025-02-21",
  },
  {
    patient_id: "P1",
    patient_name: "John Smith",
    billing_code: "B1001",
    amount: 1675.5,
    insurance_provider: "Blue Shield",
    payment_status: "Pending",
    claim_date: "2025-03-25",
  },
  {
    patient_id: "P2",
    patient_name: "Sarah Johnson",
    billing_code: "B2002",
    amount: 2310.09,
    insurance_provider: "Medicare",
    payment_status: "Approved",
    claim_date: "2025-01-05",
  },
  {
    patient_id: "P3",
    patient_name: "Robert Chen",
    billing_code: "B3003",
    amount: 4945.57,
    insurance_provider: "Aetna",
    payment_status: "Pending",
    claim_date: "2025-03-04",
  },
  {
    patient_id: "P4",
    patient_name: "Lisa Williams",
    billing_code: "B4004",
    amount: 8338.89,
    insurance_provider: "UnitedHealth",
    payment_status: "Denied",
    claim_date: "2025-03-20",
  },
  {
    patient_id: "P5",
    patient_name: "Michael Garcia",
    billing_code: "B5005",
    amount: 3220.05,
    insurance_provider: "Cigna",
    payment_status: "Denied",
    claim_date: "2025-02-21",
  },
];

export const getTotalBillingAmount = (data: BillingRecord[]): number => {
  return data.reduce((total, record) => total + record.amount, 0);
};

export const getClaimsByStatus = (data: BillingRecord[]): StatusCount[] => {
  const statusMap = new Map<string, number>();

  data.forEach((record) => {
    const status = record.payment_status;
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });

  return Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count,
  }));
};

export const getAmountByStatus = (
  data: BillingRecord[]
): Record<string, number> => {
  const result: Record<string, number> = {
    Pending: 0,
    Approved: 0,
    Denied: 0,
  };

  data.forEach((record) => {
    result[record.payment_status] += record.amount;
  });

  return result;
};
