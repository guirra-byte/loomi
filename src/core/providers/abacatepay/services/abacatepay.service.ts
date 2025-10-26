import Axios from "axios";
import { CreatePixPaymentRequest, CreatePixPaymentResponse, SimulatePixPaymentResponse } from "../../type";

export class AbacatepayService {
  private readonly api: Axios.AxiosInstance;

  constructor() {
    const { ABACATEPAY_BASE_URL, ABACATEPAY_API_KEY } = process.env;
    if (!ABACATEPAY_BASE_URL || !ABACATEPAY_API_KEY) {
      throw new Error('ABACATEPAY_BASE_URL or ABACATEPAY_API_KEY is not set');
    }

    this.api = Axios.create({
      baseURL: ABACATEPAY_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ABACATEPAY_API_KEY}`,
      },
    });
  }

  async createPixPayment(data: CreatePixPaymentRequest): Promise<CreatePixPaymentResponse> {
    const response = await this.api.post('/pixQrCode/create', {
      ...data,
    });

    return response.data as CreatePixPaymentResponse;
  }

  async simulatePixPayment(abacatepayTaxId: string): Promise<SimulatePixPaymentResponse> {
    const response = await this.api.post(`/pixQrCode/simulate-payment/${abacatepayTaxId}`);
    return response.data as SimulatePixPaymentResponse;
  }
}