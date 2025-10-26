import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import CustomerController from "./customer.controller";
import { customerSchemas } from "./customer.schema";
import { verifyAuthToken } from "@/core/middlewares/verify-auth-token";
import { permissionGuard } from "@/core/middlewares/permission-guard";

export default function CustomerRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuthToken);
  fastify.addHook('preHandler', (req: FastifyRequest, _res: FastifyReply) => permissionGuard(req, 'ADMIN'));

  fastify.post('/customers', { schema: customerSchemas.createCustomer }, CustomerController.createCustomer);
  fastify.get('/customers', { schema: customerSchemas.getAllCustomers }, CustomerController.getAllCustomers);
  fastify.get('/customers/:id', { schema: customerSchemas.getCustomerById }, CustomerController.getCustomerById);
  fastify.put('/customers/:id', { schema: customerSchemas.updateCustomer }, CustomerController.updateCustomer);
  fastify.delete('/customers/:id', { schema: customerSchemas.deleteCustomer }, CustomerController.deleteCustomer);
}

