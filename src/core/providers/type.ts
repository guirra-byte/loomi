export type CreatePixPaymentResponse = {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUNDED";
  devMode: boolean;
  brCode: string;
  brCodeBase64: string;
  platformFee: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
};

export type SimulatePixPaymentResponse = CreatePixPaymentResponse;

export type CreatePixPaymentRequest = {
  amount: number;
  expiresInSeconds?: number;
  description?: string;
};