/*
  Warnings:

  - You are about to drop the column `payment_id` on the `OrderPayment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."OrderPayment_payment_id_key";

-- AlterTable
ALTER TABLE "OrderPayment" DROP COLUMN "payment_id";
