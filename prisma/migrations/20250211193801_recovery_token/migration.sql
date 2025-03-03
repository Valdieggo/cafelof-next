-- CreateTable
CREATE TABLE "RecoveryToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "RecoveryToken_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryToken_token_key" ON "RecoveryToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RecoveryToken_identifier_token_uq" ON "RecoveryToken"("email", "token");
