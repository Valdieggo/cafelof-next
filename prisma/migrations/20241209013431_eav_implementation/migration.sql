-- CreateEnum
CREATE TYPE "AttributeValueType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN');

-- CreateTable
CREATE TABLE "Attribute" (
    "attribute_id" SERIAL NOT NULL,
    "attribute_name" TEXT NOT NULL,
    "value_type" "AttributeValueType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("attribute_id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "product_attribute_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("product_attribute_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_attribute_name_key" ON "Attribute"("attribute_name");

-- CreateIndex
CREATE INDEX "ProductAttribute_product_id_idx" ON "ProductAttribute"("product_id");

-- CreateIndex
CREATE INDEX "ProductAttribute_attribute_id_idx" ON "ProductAttribute"("attribute_id");

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "Attribute"("attribute_id") ON DELETE RESTRICT ON UPDATE CASCADE;
