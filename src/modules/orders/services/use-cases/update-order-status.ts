import { Order, OrderStatus } from "@prisma/client";
import { IOrderRepository } from "../../repositories/IOrderRepository";
import { OrderNotFoundError } from "../../errors";

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: IOrderRepository) { }
  async execute(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOrderById(orderId);
    if (!order) {
      throw new OrderNotFoundError();
    }
    
    try{
      return await this.orderRepository.updateOrderStatus(orderId, status);
    } catch (error) {
      throw error;
    }
  }
}