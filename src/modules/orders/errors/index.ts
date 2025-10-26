import { AppError } from "@/core/errors/app-error";

export class OrderOutOfStockError extends AppError {
  constructor(message: string = 'Order out of stock', statusCode = 400, code: string = 'ORDER_OUT_OF_STOCK', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class OrderProductNotFoundError extends AppError {
  constructor(message: string = 'Order product not found', statusCode = 404, code: string = 'ORDER_PRODUCT_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class OrderNotFoundError extends AppError {
  constructor(message: string = 'Order not found', statusCode = 404, code: string = 'ORDER_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class OrderStatusUpdateError extends AppError {
  constructor(message: string = 'Order status update failed', statusCode = 400, code: string = 'ORDER_STATUS_UPDATE_FAILED', details?: string) {
    super(message, statusCode, code, details);
  }
}