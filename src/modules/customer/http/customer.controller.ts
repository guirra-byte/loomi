import { FastifyReply, FastifyRequest } from "fastify";
import { customerSchemas } from "./customer.schema";
import { z } from "zod/v4";
import { AppError } from "@/core/errors/app-error";
import { makeCreateCustomer } from "../services/factories/make-create-customer";
import { makeGetAllCustomers } from "../services/factories/make-get-all-customers";
import { makeGetCustomerById } from "../services/factories/make-get-customer-by-id";
import { makeUpdateCustomer } from "../services/factories/make-update-customer";
import { makeDeleteCustomer } from "../services/factories/make-delete-customer";

type CreateCustomerRequest = FastifyRequest<{
  Body: z.infer<typeof customerSchemas.createCustomer.body>
}>;

type GetCustomerByIdRequest = FastifyRequest<{
  Params: z.infer<typeof customerSchemas.getCustomerById.params>
}>;

type UpdateCustomerRequest = FastifyRequest<{
  Params: z.infer<typeof customerSchemas.updateCustomer.params>,
  Body: z.infer<typeof customerSchemas.updateCustomer.body>
}>;

type DeleteCustomerRequest = FastifyRequest<{
  Params: z.infer<typeof customerSchemas.deleteCustomer.params>
}>;

export default class CustomerController {
  static async createCustomer(req: CreateCustomerRequest, res: FastifyReply) {
    console.log("Hello World 4");
    try {
      const { userId } = req.body;
      const createCustomerUseCase = makeCreateCustomer();
      const customer = await createCustomerUseCase.execute({
        userId,
      });

      return res.status(201).send({
        status: true,
        message: 'Customer created successfully',
        data: customer,
      });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async getAllCustomers(_req: FastifyRequest, res: FastifyReply) {
    try {
      const getAllCustomersUseCase = makeGetAllCustomers();
      const customers = await getAllCustomersUseCase.execute();

      res.status(200).send(customers);
    } catch (error: unknown) {
      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async getCustomerById(req: GetCustomerByIdRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const getCustomerByIdUseCase = makeGetCustomerById();
      const customer = await getCustomerByIdUseCase.execute(id);

      res.status(200).send(customer);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async updateCustomer(req: UpdateCustomerRequest, res: FastifyReply) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const updateCustomerUseCase = makeUpdateCustomer();
      const customer = await updateCustomerUseCase.execute(id, {
        name,
        email,
        password,
      });

      res.status(200).send(customer);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async deleteCustomer(req: DeleteCustomerRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const deleteCustomerUseCase = makeDeleteCustomer();
      await deleteCustomerUseCase.execute(id);

      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).send({
          status: false,
          message: error.message,
          code: error.code,
          details: error.details,
        });
      }

      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }
}

