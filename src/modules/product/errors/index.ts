import { AppError } from "@/core/errors/app-error";

export class ProductNotFoundError extends AppError {
  constructor() {
    super('Produto não encontrado', 404, 'PRODUCT_NOT_FOUND');
  }
}

export class ProductAlreadyExistsError extends AppError {
  constructor() {
    super('Já existe um produto com este nome', 400, 'PRODUCT_ALREADY_EXISTS');
  }
}

export class InvalidProductDataError extends AppError {
  constructor(message: string) {
    super(message, 400, 'INVALID_PRODUCT_DATA');
  }
}

