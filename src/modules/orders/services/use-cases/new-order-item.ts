import { OrderStatus, PrismaClient } from "@prisma/client";
import { CreateOrderData, IOrderRepository } from "../../repositories/IOrderRepository";
import { OrderOutOfStockError, OrderProductNotFoundError } from "../../errors";

interface NewOrderRequest {
  customerId: string;
  products: OrderItem[];
}

interface OrderItem {
  id: string;
  quantity: number;
}

interface OrderItemWithPriceAndSubtotal extends OrderItem {
  price: number;
  subtotal: number;
}

export class NewOrderItemUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaClient
  ) { }

  async execute(orderRequest: NewOrderRequest): Promise<string> {
    const orderItems = new Map<string, OrderItem>();
    orderRequest.products.map((product) => {
      if (orderItems.has(product.id)) {
        let tmpOrderItem = orderItems.get(product.id)!;
        orderItems.get(product.id)!.quantity += tmpOrderItem.quantity;
      } else {
        orderItems.set(product.id,
          {
            id: product.id,
            quantity: 1,
          });
      }
    });

    const availableProducts = Array.from(orderItems.values()).map((product) => {
      return new Promise(async (resolve, reject) => {
        try {
          const productDb = await this.prisma.product.findUnique({
            where: {
              id: product.id,
            },
          });

          if (productDb && productDb.stock < product.quantity) {
            orderItems.delete(product.id);
            reject(new OrderOutOfStockError());
          } else if (productDb) {
            resolve({ item: { ...product, price: productDb.price, subtotal: productDb.price * product.quantity } });
          } else {
            orderItems.delete(product.id);
            reject(new OrderProductNotFoundError());
          }
        }
        catch (error) { reject(error); }
      });
    });

    const order: OrderItemWithPriceAndSubtotal[] = [];
    await Promise.allSettled(availableProducts).then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') {
          throw result.reason;
        } else if (result.status === 'fulfilled') {
          const { item } = result.value as { item: OrderItemWithPriceAndSubtotal };
          order.push({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          });
        }
      });
    });

    const mountOrderData: CreateOrderData = {
      customerId: orderRequest.customerId,
      products: order,
      total: order.reduce((acc, item) => acc + item.subtotal, 0),
    };

    try {
      const haveOpenOrder = await this.prisma.order.findFirst({
        where: {
          customerId: orderRequest.customerId,
          status: OrderStatus.OPEN,
        },
        include: {
          items: true,
        },
      });

      let orderId = '';
      if (!haveOpenOrder) {
        const createdOrder = await this.orderRepository.createOrder(mountOrderData);
        orderId = createdOrder.id;
      } else {
        await this.prisma.order.update({
          where: { id: haveOpenOrder.id },
          data: {
            items: {
              create: order.map((item) => ({ productId: item.id, quantity: item.quantity, subtotal: item.subtotal, unityPrice: item.price })),
            },
            total: haveOpenOrder.items.reduce((acc, item) => acc + item.subtotal, 0) + order.reduce((acc, item) => acc + item.subtotal, 0),
          },
        });

        orderId = haveOpenOrder.id;
      }

      orderItems.clear();

      return orderId;
    } catch (error) {
      throw error;
    }
  }
}