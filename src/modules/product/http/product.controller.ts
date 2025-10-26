import { FastifyReply, FastifyRequest } from "fastify";
import { productSchemas } from "./product.schema";
import { z } from "zod/v4";
import { AppError } from "@/core/errors/app-error";
import { makeCreateProduct } from "../services/factories/make-create-product";
import { makeGetAllProducts } from "../services/factories/make-get-all-products";
import { makeGetProductById } from "../services/factories/make-get-product-by-id";
import { makeUpdateProduct } from "../services/factories/make-update-product";
import { makeDeleteProduct } from "../services/factories/make-delete-product";

type CreateProductRequest = FastifyRequest<{ 
  Body: z.infer<typeof productSchemas.createProduct.body> 
}>;

type GetProductByIdRequest = FastifyRequest<{ 
  Params: z.infer<typeof productSchemas.getProductById.params> 
}>;

type UpdateProductRequest = FastifyRequest<{ 
  Params: z.infer<typeof productSchemas.updateProduct.params>,
  Body: z.infer<typeof productSchemas.updateProduct.body> 
}>;

type DeleteProductRequest = FastifyRequest<{ 
  Params: z.infer<typeof productSchemas.deleteProduct.params> 
}>;

export default class ProductController {
  static async createProduct(req: CreateProductRequest, res: FastifyReply) {
    try {
      const { name, description, price, stock } = req.body;

      const createProductUseCase = makeCreateProduct();
      const product = await createProductUseCase.execute({ 
        name, 
        description, 
        price,
        stock 
      });

      res.status(201).send(product);
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

  static async getAllProducts(req: FastifyRequest, res: FastifyReply) {
    try {
      const getAllProductsUseCase = makeGetAllProducts();
      const products = await getAllProductsUseCase.execute();

      res.status(200).send(products);
    } catch (error: unknown) {
      return res.status(500).send({
        status: false,
        message: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
  }

  static async getProductById(req: GetProductByIdRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const getProductByIdUseCase = makeGetProductById();
      const product = await getProductByIdUseCase.execute(id);

      res.status(200).send(product);
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

  static async updateProduct(req: UpdateProductRequest, res: FastifyReply) {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;

      const updateProductUseCase = makeUpdateProduct();
      const product = await updateProductUseCase.execute(id, { 
        name, 
        description, 
        price,
        stock 
      });

      res.status(200).send(product);
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

  static async deleteProduct(req: DeleteProductRequest, res: FastifyReply) {
    try {
      const { id } = req.params;

      const deleteProductUseCase = makeDeleteProduct();
      await deleteProductUseCase.execute(id);

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

