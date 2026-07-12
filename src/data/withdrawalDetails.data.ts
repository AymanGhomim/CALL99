export interface WithdrawalDetails {
  id: number;
  requestNo: string;
  requestedAt: string;
  status: string;
  amount: string;
  provider: {
    id: string;
    name: string;
    phone: string;
    email: string;
    bank: string;
    accountName: string;
    iban: string;
  };
  summary: {
    totalProfit: string;
    totalWithdrawals: string;
    remainingBalance: string;
    requestedAmount: string;
  };
}

const defaultWithdrawalDetails: WithdrawalDetails = {
    id: 1,
    requestNo: "#ORD-9421",
    requestedAt: "23 مايو 2026 - 08:30 م",
    status: "قيد المراجعة",
    amount: "150.00 ر.س",
    provider: {
      id: "PROV-00254",
      name: "أحمد محمد علي",
      phone: "+966 50 123 4567",
      email: "ahmed@example.com",
      bank: "بنك الراجحي",
      accountName: "أحمد محمد علي",
      iban: "SA12 8000 0123 6080 1012 3456",
    },
    summary: {
      totalProfit: "5,000.00 ر.س",
      totalWithdrawals: "3,200.00 ر.س",
      remainingBalance: "1,800.00 ر.س",
      requestedAmount: "150.00 ر.س",
    },
};

export const withdrawalDetails: WithdrawalDetails[] = [defaultWithdrawalDetails];

export function getWithdrawalDetails(id: number): WithdrawalDetails {
  return withdrawalDetails.find((item) => item.id === id) ?? defaultWithdrawalDetails;
}
