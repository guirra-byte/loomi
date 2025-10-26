import { PixPaymentStatus, PrismaClient } from "@prisma/client";
import { AbacatepayService } from "@/core/providers/abacatepay/services/abacatepay.service";
import { OrderNotFoundError } from "../../errors";

export class OrderCreated {
  constructor(
    private readonly abacatepayService: AbacatepayService,
    private readonly prisma: PrismaClient
  ) { }

  async execute(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new OrderNotFoundError();
    }

    const orderPayment = await this.prisma.orderPayment.findUnique({
      where: { orderId: orderId },
    });

    if (orderPayment) {
      const activePix = await this.prisma.qrCodePixPayment.findFirst({
        where: {
          OrderPayment: {
            id: orderPayment.id,
          },
          status: PixPaymentStatus.PENDING,
        },
      });

      const isExpired = activePix?.expiresAt && activePix.expiresAt < new Date();
      if (activePix && isExpired) {
        await this.prisma.qrCodePixPayment.update({
          where: { id: activePix.id },
          data: { status: PixPaymentStatus.EXPIRED },
        });
      }

      if (activePix && !isExpired) {
        return;
      }
    }

    try {
      const qrCodePixPayment = await this.abacatepayService
        .createPixPayment({
          amount: order.total,
          expiresInSeconds: 300,
          description: `Pedido ${orderId}`,
        });

      await this.prisma.orderPayment.create({
        data: {
          orderId: orderId,
          qrCodePixPayment: {
            create: {
              id: qrCodePixPayment.id,
              brCode: qrCodePixPayment.brCode,
              brCodeBase64: qrCodePixPayment.brCodeBase64,
              abacatepayTaxId: qrCodePixPayment.id,
              expiresAt: new Date(Date.now() + 300000),
            },
          },
        },
      });

      const orderItems = order.items.map(async (item) => {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity as number } },
        });
      });

      await Promise.all(orderItems);
    }
    catch (error) {
      throw error;
    }
  }
}