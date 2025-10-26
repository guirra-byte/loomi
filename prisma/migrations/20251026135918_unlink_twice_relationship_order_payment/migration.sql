/*
  Warnings:

  - You are about to drop the column `order_payment_id` on the `QrCodePixPayment` table. All the data in the column will be lost.
  - The `status` column on the `QrCodePixPayment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PixPaymentStatus" AS ENUM ('PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED');

-- DropIndex
DROP INDEX "public"."QrCodePixPayment_order_payment_id_key";

-- AlterTable
ALTER TABLE "QrCodePixPayment" DROP COLUMN "order_payment_id",
DROP COLUMN "status",
ADD COLUMN     "status" "PixPaymentStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."PixPayment";
