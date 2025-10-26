import { PrismaClient } from "@prisma/client";
import { InvalidQuantityError, InsufficientQuantityError, OrderItemNotFoundError, OrderNotFoundError } from "../../errors";
import { IOrderRepository } from "../../repositories/IOrderRepository";

export class RemoveOrderItemUseCase {
  constructor(private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaClient) { }
  async execute(orderId: string, itemId: string, quantity: number = 1): Promise<void> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }

    if (quantity <= 0) {
      throw new InvalidQuantityError();
    }

    try {
      const item = await this.prisma.orderItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new OrderItemNotFoundError();
      }

      if (quantity > item.quantity) {
        throw new InsufficientQuantityError();
      }

      if (quantity === item.quantity) {
        await this.prisma.orderItem.delete({
          where: { id: itemId },
        });
      } else {
        await this.prisma.orderItem.update({
          where: { id: itemId },
          data: { quantity: item.quantity - quantity },
        });
      }

      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          total: order.total - item.subtotal,
          items: {
            delete: {
              id: itemId,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}