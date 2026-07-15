export interface CommissionSetting {
  id: number;
  service: string;
  rate: number;
}

export interface WithdrawalSettings {
  freezeThreshold: number;
  weeklyLimit: number;
  minimumWithdrawal: number;
  autoFreezeEnabled: boolean;
}

export const defaultCommissionRate = 15;

export const initialCommissionSettings: CommissionSetting[] = [
  { id: 1, service: "صيانة", rate: 15 },
  { id: 2, service: "تنظيف", rate: 12 },
  { id: 3, service: "غسيل سيارات", rate: 10 },
  { id: 4, service: "نقل", rate: 18 },
];

export const initialWithdrawalSettings: WithdrawalSettings = {
  freezeThreshold: 50,
  weeklyLimit: 10000,
  minimumWithdrawal: 100,
  autoFreezeEnabled: true,
};
