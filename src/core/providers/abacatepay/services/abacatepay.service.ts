import Axios from "axios";
import { CreatePixPaymentRequest, CreatePixPaymentResponse, SimulatePixPaymentResponse } from "../../type";
import { config } from "dotenv";

config();
export class AbacatepayService {
  private readonly api: Axios.AxiosInstance;

  constructor() {
    if (!process.env.ABACATEPAY_API_BASE_URL || !process.env.ABACATEPAY_API_KEY) {
      throw new Error('ABACATEPAY_API_BASE_URL or ABACATEPAY_API_KEY is not set');
    }

    this.api = Axios.create({
      baseURL: process.env.ABACATEPAY_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACATEPAY_API_KEY}`,
      },
    });
  }

  async createPixPayment(data: CreatePixPaymentRequest): Promise<CreatePixPaymentResponse> {
    const response = await this.api.post('/pixQrCode/create', {
      ...data,
      amount: Math.round(Number(data.amount)),
    });

    return response.data as CreatePixPaymentResponse;
  }

  async simulatePixPayment(abacatepayTaxId: string): Promise<SimulatePixPaymentResponse> {
    const response = await this.api.post(`/pixQrCode/simulate-payment/${abacatepayTaxId}`);
    return response.data as SimulatePixPaymentResponse;
  }
}