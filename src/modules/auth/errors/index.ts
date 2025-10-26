import { AppError } from "@/core/errors/app-error";

export class UserNotFoundError extends AppError {
  constructor(message: string = 'User not found', statusCode = 404, code: string = 'USER_NOT_FOUND', details?: string) {
    super(message, statusCode, code, details);
  }
}