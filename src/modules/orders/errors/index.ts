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

export class OrderPaymentNotFoundError extends AppError {
  constructor(message: string = 'Order payment not found', statusCode = 404, code: string = 'ORDER_PAYMENT_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class QrCodePixPaymentNotFoundError extends AppError {
  constructor(message: string = 'Qr code pix payment not found', statusCode = 404, code: string = 'QR_CODE_PIX_PAYMENT_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class OrderItemNotFoundError extends AppError {
  constructor(message: string = 'Order item not found', statusCode = 404, code: string = 'ORDER_ITEM_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class InvalidQuantityError extends AppError {
  constructor(message: string = 'Invalid quantity', statusCode = 400, code: string = 'INVALID_QUANTITY', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class InsufficientQuantityError extends AppError {
  constructor(message: string = 'Insufficient quantity', statusCode = 400, code: string = 'INSUFFICIENT_QUANTITY', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class OrderNotOpenError extends AppError {
  constructor(message: string = 'Order not open', statusCode = 400, code: string = 'ORDER_NOT_OPEN', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class OrderOwnerNotFoundError extends AppError {
  constructor(message: string = 'Order owner not found', statusCode = 404, code: string = 'ORDER_OWNER_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}