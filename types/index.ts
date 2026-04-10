export interface LightningPlan {
  title: string;
  price: number; // in SAT
  token?: string;
  description?: string;
}

export type PaymentStep = 'select' | 'confirm' | 'pending' | 'paid';
