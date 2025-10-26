import { PixPaymentStatus } from "@prisma/client";

export type CreatePixPaymentResponse = {
  data: {
    id: string;
    amount: number;
    status: PixPaymentStatus;
    devMode: boolean;
    brCode: string;
    brCodeBase64: string;
    platformFee: number;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  }
};

export type SimulatePixPaymentResponse = CreatePixPaymentResponse;

export type CreatePixPaymentRequest = {
  amount: number;
  expiresInSeconds?: number;
  description?: string;
};