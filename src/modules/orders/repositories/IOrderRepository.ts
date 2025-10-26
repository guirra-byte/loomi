import { Order, OrderStatus } from "@prisma/client";

export interface CreateOrderData {
  customerId: string;
  total: number;
  products: {
    id: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
}

export interface IOrderRepository {
  createOrder(order: CreateOrderData): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  findOrderById(orderId: string): Promise<Order | null>;
}