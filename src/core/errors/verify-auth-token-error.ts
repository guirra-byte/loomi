import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', statusCode = 401, code: string = 'UNAUTHORIZED', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token expired', statusCode = 401, code: string = 'TOKEN_EXPIRED', details?: string) {
    super(message, statusCode, code, details);
  }
}

export class TokenInvalidError extends AppError {
  constructor(message: string = 'Token invalid', statusCode = 401, code: string = 'TOKEN_INVALID', details?: string) {
    super(message, statusCode, code, details);
  }
}