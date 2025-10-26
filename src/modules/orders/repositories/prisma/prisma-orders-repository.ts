import { Order, OrderStatus, PrismaClient } from "@prisma/client";
import { CreateOrderData, IOrderRepository } from "../IOrderRepository";

export class OrdersRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createOrder(order: CreateOrderData): Promise<Order> {
    return this.prisma.order.create({
      data: {
        customerId: order.customerId,
        total: order.total,
        status: OrderStatus.OPEN,
      },
    });
  }

  async findOrderById(orderId: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}