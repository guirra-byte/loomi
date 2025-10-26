import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import OrderController from "./order.controller";
import { orderSchemas } from "./order.schema";
import { verifyAuthToken } from "@/core/middlewares/verify-auth-token";
import { permissionGuard } from "@/core/middlewares/permission-guard";

export default function OrderRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuthToken);
  
  // Customer routes - authenticated users
  fastify.post('/orders', { schema: orderSchemas.createOrder }, OrderController.createOrder);
  fastify.post('/orders/:id/finish', { schema: orderSchemas.finishOrder }, OrderController.finishOrder);
  fastify.delete('/orders/:orderId/items/:itemId', { schema: orderSchemas.removeOrderItem }, OrderController.removeOrderItem);
  
  // Isolated instance to isolate resources that only can be accessed by ADMIN users
  fastify.register(async (isolatedInstance: FastifyInstance) => {
    isolatedInstance.addHook('preHandler', (req: FastifyRequest, _res: FastifyReply) => permissionGuard(req, 'ADMIN'));
    
    isolatedInstance.put('/orders/:id', { schema: orderSchemas.updateOrderStatus }, OrderController.updateOrderStatus);
    isolatedInstance.post('/orders/:id/cancel', { schema: orderSchemas.cancelOrder }, OrderController.cancelOrder);
    isolatedInstance.post('/orders/:id/simulate-payment', { schema: orderSchemas.simulateOrderPayment }, OrderController.simulateOrderPayment);
  })
}