import Fastify from "fastify";
import orderRoutes from "./modules/orders/http/order.routes";
import authRoutes from "./modules/auth/http/auth.routes";
import userRoutes from "./modules/users/http/user.routes";
import productRoutes from "./modules/product/http/product.routes";
import customerRoutes from "./modules/customer/http/customer.routes";
import { extractZodError, formatZodError } from "./core/utils/zod-errors";
import { ZodError } from "zod";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = Fastify({ logger: true });

// Configure Zod as the validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Global error handler for serialization errors
app.setErrorHandler((error, request, reply) => {
  // Log the full error for debugging
  console.error('Global error handler caught:', {
    error: error.message,
    name: error.name,
    stack: error.stack,
    url: request.url,
    method: request.method,
    // Log the full error object to help debug the structure
    errorObject: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
  });

  // Handle serialization errors with Zod validation details
  if (error.message.includes('Response doesn\'t match the schema')) {
    const zodError = extractZodError(error);
    
    if (zodError) {
      const validationErrors = formatZodError(zodError);
      
      console.error('Zod validation errors found:', validationErrors);
      
      return reply.status(500).send({
        status: false,
        message: 'Erro de validação na resposta da API',
        code: 'RESPONSE_VALIDATION_ERROR',
        details: `Os seguintes campos não estão no formato esperado: ${validationErrors.map(e => e.field).join(', ')}`,
        validationErrors,
        fieldErrors: validationErrors.reduce((acc, error) => {
          acc[error.field] = error.message;
          return acc;
        }, {} as Record<string, string>),
      });
    }
    
    // Enhanced fallback with more debugging info
    return reply.status(500).send({
      status: false,
      message: 'Erro na formatação dos dados de resposta',
      code: 'SERIALIZATION_ERROR',
      details: 'Os dados retornados não estão no formato esperado pelo sistema. Entre em contato com o suporte.',
      errorMessage: error.message,
      errorName: error.name,
      // Include additional debugging information when not in production
      ...(process.env.NODE_ENV !== 'production' && {
        debugInfo: {
          errorType: typeof error,
          errorKeys: Object.keys(error),
          hasIssues: Array.isArray((error as any).issues),
          issuesLength: (error as any).issues?.length,
          causeName: (error as any).cause?.name,
          causeMessage: (error as any).cause?.message,
        }
      }),
    });
  }

  // Handle Zod errors directly (for request validation)
  if (error instanceof ZodError) {
    const validationErrors = formatZodError(error);
    
    return reply.status(400).send({
      status: false,
      message: 'Dados de entrada inválidos',
      code: 'VALIDATION_ERROR',
      validationErrors,
      fieldErrors: validationErrors.reduce((acc, error) => {
        acc[error.field] = error.message;
        return acc;
      }, {} as Record<string, string>),
    });
  }

  // Handle other Fastify errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      status: false,
      message: error.message || 'Erro interno do servidor',
      code: error.code || 'INTERNAL_SERVER_ERROR',
    });
  }

  // Default error response
  return reply.status(500).send({
    status: false,
    message: 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
    details: 'Ocorreu um erro inesperado ao processar sua solicitação.',
  });
});

app.register(orderRoutes, { prefix: '/api/v1' });
app.register(authRoutes, { prefix: '/api/v1' });
app.register(userRoutes, { prefix: '/api/v1' });
app.register(productRoutes, { prefix: '/api/v1' });
app.register(customerRoutes, { prefix: '/api/v1' });

export default app;