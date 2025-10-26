import { Order, OrderStatus, PrismaClient } from "@prisma/client";
import { CreateOrderData, IOrderRepository } from "../IOrderRepository";

export class OrdersRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createOrder(order: CreateOrderData): Promise<Order> {
    return this.prisma.order.create({
      data: {
        customerId: order.customerId,
        products: {
          connect: order.products.map((product) => ({ id: product.id })),
        },
        total: order.total,
        items: {
          create: order.products.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
            subtotal: product.subtotal,
          })),
        },
        status: OrderStatus.PENDING,
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