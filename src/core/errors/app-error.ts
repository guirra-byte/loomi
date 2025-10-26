import { z } from "zod/v4";

export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: string;

  constructor(message: string, statusCode = 400, code?: string, details?: string) {
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const errorSchema = z.object({
  status: z.boolean().describe('Status da resposta (false para erro).'),
  message: z.string().describe('Mensagem descritiva do erro.'),
  code: z.string().optional().describe('Código específico do erro para identificação no frontend.'),
  details: z.string().optional().describe('Detalhes adicionais do erro.'),
});