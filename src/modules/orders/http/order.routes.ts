import { FastifyInstance } from "fastify";
import OrderController from "./order.controller";
import { orderSchemas } from "./order.schema";
import { verifyAuthToken } from "@/core/middlewares/verify-auth-token";
import { permissionGuard } from "@/core/middlewares/permission-guard";

export default function OrderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuthToken);
  fastify.post('/orders', { schema: orderSchemas.createOrder }, OrderController.createOrder);

  // Isolated instance to isolate resources that only can be accessed by ADMIN users
  fastify.register(async (isolatedInstance: FastifyInstance) => {
    isolatedInstance.addHook('preHandler', verifyAuthToken);
    isolatedInstance.addHook('preHandler', permissionGuard('ADMIN'));
    
    isolatedInstance.put('/orders/:id', { schema: orderSchemas.updateOrderStatus }, OrderController.updateOrderStatus);
  })
}