import { AppError } from "@/core/errors/app-error";
import { OrderNotFoundError, OrderOwnerNotFoundError } from "../../errors";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import rabbitmqClient from "@/core/libs/rabbitmq/client";
import { PrismaClient } from "@prisma/client";
import { CustomerNotFoundError } from "@/modules/customer/errors";

export class FinishOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaClient
  ) { }

  async execute(orderId: string, userId: string): Promise<void> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }

    if (order.customerId !== customer.id) {
      throw new OrderOwnerNotFoundError();
    }

    try {
      const { channel } = await rabbitmqClient;
      await channel.assertQueue('order.created', { durable: true });
      channel.sendToQueue('order.created', Buffer.from(JSON.stringify({ orderId })));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new Error('Failed to close order');
    }
  }
}