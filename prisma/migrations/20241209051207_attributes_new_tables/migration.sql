/*
  Warnings:

  - You are about to drop the column `value_type` on the `Attribute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "value_type";

-- DropEnum
DROP TYPE "AttributeValueType";

-- CreateTable
CREATE TABLE "AttributeEnum" (
    "attribute_enum_id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "AttributeEnum_pkey" PRIMARY KEY ("attribute_enum_id")
);

-- CreateIndex
CREATE INDEX "AttributeEnum_attribute_id_idx" ON "AttributeEnum"("attribute_id");

-- AddForeignKey
ALTER TABLE "AttributeEnum" ADD CONSTRAINT "AttributeEnum_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("attribute_id") ON DELETE RESTRICT ON UPDATE CASCADE;
