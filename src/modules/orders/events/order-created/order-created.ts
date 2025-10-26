import { OrderStatus, PixPaymentStatus, PrismaClient } from "@prisma/client";
import { AbacatepayService } from "@/core/providers/abacatepay/services/abacatepay.service";
import { OrderNotFoundError, OrderNotOpenError } from "../../errors";

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

    if (order.status !== OrderStatus.OPEN) {
      throw new OrderNotOpenError(`Order ${orderId} is not open`);
    }

    const orderPayment = await this.prisma.orderPayment.findUnique({
      where: { orderId: orderId },
      include: {
        qrCodePixPayment: true,
      },
    });

    if (orderPayment) {
      const activePix = orderPayment.qrCodePixPayment;
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
              id: qrCodePixPayment.data.id,
              brCode: qrCodePixPayment.data.brCode,
              brCodeBase64: '',
              abacatepayTaxId: qrCodePixPayment.data.id,
              expiresAt: new Date(Date.now() + 300000),
            },
          },
        },
      });

      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PENDING_PAYMENT },
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