import { AppError } from "../errors/app-error";

export class RabbitMQClientError extends AppError {
  constructor(message: string = 'RabbitMQ client error', statusCode = 500, code: string = 'RABBITMQ_CLIENT_ERROR', details?: string) {
    super(message, statusCode, code, details);
  }
}