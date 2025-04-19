import { mockBillingData } from "./data";
import { BillingRecord, StatusCount } from "./types";

export async function fetchBillingData(): Promise<BillingRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockBillingData;
}

export async function fetchBillingStats(): Promise<{
  totalAmount: number;
  statusCounts: StatusCount[];
  amountByStatus: { status: string; count: number }[];
  totalClaims: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = mockBillingData;
  const totalAmount = data.reduce((sum, record) => sum + record.amount, 0);

  const statusMap = new Map<string, number>();
  const statusAmountMap = new Map<string, number>();

  data.forEach((record) => {
    const status = record.payment_status;
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
    statusAmountMap.set(
      status,
      (statusAmountMap.get(status) || 0) + record.amount
    );
  });

  const statusCounts = Array.from(statusMap.entries()).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  const amountByStatus = Array.from(statusAmountMap.entries()).map(
    ([status, count]) => ({
      status,
      count,
    })
  );

  return {
    totalAmount,
    statusCounts,
    amountByStatus,
    totalClaims: data.length,
  };
}
