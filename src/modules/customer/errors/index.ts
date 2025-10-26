import { AppError } from "@/core/errors/app-error";

export class CustomerNotFoundError extends AppError {
  constructor() {
    super('Cliente não encontrado', 404, 'CUSTOMER_NOT_FOUND');
  }
}

export class CustomerAlreadyExistsError extends AppError {
  constructor() {
    super('Já existe um cliente com este e-mail', 400, 'CUSTOMER_ALREADY_EXISTS');
  }
}

export class InvalidCustomerDataError extends AppError {
  constructor(message: string) {
    super(message, 400, 'INVALID_CUSTOMER_DATA');
  }
}

