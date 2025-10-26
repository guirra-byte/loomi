import { IOrderRepository } from "../../repositories/IOrderRepository";
import { OrderNotFoundError } from "../../errors";
import { Order } from "@prisma/client";
import rabbitmqClient from "@/core/libs/rabbitmq/client";

export class SimulateOrderPaymentUseCase {
  constructor(private readonly orderRepository: IOrderRepository) { }
  async execute(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }

    try{
      const { channel } = await rabbitmqClient;
      channel.assertQueue('order.payment', { durable: true });
      channel.sendToQueue('order.payment', Buffer.from(JSON.stringify({ orderId: order.id })));
      return order;
    } catch (error) {
      throw error;
    }
  }
}