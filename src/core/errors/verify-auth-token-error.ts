import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', statusCode = 401, code: string = 'UNAUTHORIZED', details?: string) {
    super(message, statusCode, code, details);
  }
}