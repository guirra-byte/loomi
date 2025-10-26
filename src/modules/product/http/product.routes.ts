import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import ProductController from "./product.controller";
import { productSchemas } from "./product.schema";
import { verifyAuthToken } from "@/core/middlewares/verify-auth-token";
import { permissionGuard } from "@/core/middlewares/permission-guard";
import { Role } from "@prisma/client";

export default function ProductRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuthToken);

  fastify.register(async (isolatedInstance) => {
    isolatedInstance.addHook('preHandler', (req: FastifyRequest, _res: FastifyReply) => permissionGuard(req, Role.ADMIN));

    isolatedInstance.post('/products', { schema: productSchemas.createProduct }, ProductController.createProduct);
    isolatedInstance.put('/products/:id', { schema: productSchemas.updateProduct }, ProductController.updateProduct);
    isolatedInstance.delete('/products/:id', { schema: productSchemas.deleteProduct }, ProductController.deleteProduct);
  });

  fastify.get('/products', { schema: productSchemas.getAllProducts }, ProductController.getAllProducts);
  fastify.get('/products/:id', { schema: productSchemas.getProductById }, ProductController.getProductById);
}

