import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
  constructor(message: string = 'Você não tem permissão para acessar este recurso', statusCode = 403, code: string = 'FORBIDDEN', details?: string) {
    super(message, statusCode, code, details);
  }
}