/*
  Warnings:

  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_customer_id_key" ON "Order"("customer_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
