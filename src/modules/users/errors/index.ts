import { AppError } from "@/core/errors/app-error";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('Já existe um usuário com este e-mail', 400, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidUserDataError extends AppError {
  constructor(message: string) {
    super(message, 400, 'INVALID_USER_DATA');
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super('Usuário não encontrado', 404, 'USER_NOT_FOUND');
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super('Você não tem permissão para editar este usuário', 403, 'FORBIDDEN');
  }
}

