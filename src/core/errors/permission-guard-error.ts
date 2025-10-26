import { AppError } from "./app-error";

export class AccessDeniedError extends AppError {
  constructor(message: string = 'Access denied', statusCode = 403, code: string = 'ACCESS_DENIED', details?: string) {
    super(message, statusCode, code, details);
  }
}