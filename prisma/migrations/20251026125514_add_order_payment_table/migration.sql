/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PixPayment" AS ENUM ('PENDING', 'EXPIRED', 'CANCELLED', 'PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment_id" TEXT;

-- CreateTable
CREATE TABLE "OrderPayment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "qr_code_pix_payment_id" TEXT NOT NULL,

    CONSTRAINT "OrderPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrCodePixPayment" (
    "id" TEXT NOT NULL,
    "br_code" TEXT NOT NULL,
    "br_code_base64" TEXT NOT NULL,
    "abacatepay_tax_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "order_payment_id" TEXT NOT NULL,
    "status" "PixPayment" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QrCodePixPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderPayment_order_id_key" ON "OrderPayment"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPayment_payment_id_key" ON "OrderPayment"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderPayment_qr_code_pix_payment_id_key" ON "OrderPayment"("qr_code_pix_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "QrCodePixPayment_br_code_key" ON "QrCodePixPayment"("br_code");

-- CreateIndex
CREATE UNIQUE INDEX "QrCodePixPayment_br_code_base64_key" ON "QrCodePixPayment"("br_code_base64");

-- CreateIndex
CREATE UNIQUE INDEX "QrCodePixPayment_abacatepay_tax_id_key" ON "QrCodePixPayment"("abacatepay_tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "QrCodePixPayment_order_payment_id_key" ON "QrCodePixPayment"("order_payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_payment_id_key" ON "Order"("payment_id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "OrderPayment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPayment" ADD CONSTRAINT "OrderPayment_qr_code_pix_payment_id_fkey" FOREIGN KEY ("qr_code_pix_payment_id") REFERENCES "QrCodePixPayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
