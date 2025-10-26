import { OrderStatus, PixPaymentStatus, PrismaClient } from "@prisma/client";
import { OrderNotFoundError, OrderPaymentNotFoundError, QrCodePixPaymentNotFoundError } from "../../errors";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { AbacatepayService } from "@/core/providers/abacatepay/services/abacatepay.service";

export class OrderPayment {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaClient,
    private readonly abacatepayService: AbacatepayService
  ) { }

  async execute(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }

    try {
      const orderPayment = await this.prisma.orderPayment.findUnique({
        where: { orderId: orderId },
      });

      if (!orderPayment) {
        throw new OrderPaymentNotFoundError();
      }

      const qrCodePixPayment = await this.prisma.qrCodePixPayment.findUnique({
        where: { id: orderPayment.qrCodePixPaymentId },
      });

      if (!qrCodePixPayment) {
        throw new QrCodePixPaymentNotFoundError();
      }

      const isExpired = qrCodePixPayment.expiresAt && qrCodePixPayment.expiresAt < new Date();
      if (qrCodePixPayment && isExpired) {
        await this.prisma.qrCodePixPayment.update({
          where: { id: qrCodePixPayment.id },
          data: { status: PixPaymentStatus.EXPIRED },
        });

        return;
      }

      if (qrCodePixPayment && !isExpired) {
        const paymentSimulation = await this.abacatepayService
          .simulatePixPayment(qrCodePixPayment.abacatepayTaxId);

        if (paymentSimulation.data.status === PixPaymentStatus.PAID) {
          await this.prisma.orderPayment.update({
            where: { id: orderPayment.id },
            data: {
              Order: { update: { status: OrderStatus.PAID } },
              qrCodePixPayment: { update: { status: PixPaymentStatus.PAID } }
            },
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }
}