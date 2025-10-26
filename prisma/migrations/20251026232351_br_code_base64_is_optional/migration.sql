-- DropIndex
DROP INDEX "public"."QrCodePixPayment_br_code_base64_key";

-- AlterTable
ALTER TABLE "QrCodePixPayment" ALTER COLUMN "br_code_base64" DROP NOT NULL;
