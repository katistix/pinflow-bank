/*
  Warnings:

  - A unique constraint covering the columns `[userId,iban]` on the table `BankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "TopUpTransaction" (
    "id" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankAccountId" TEXT NOT NULL,

    CONSTRAINT "TopUpTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_userId_iban_key" ON "BankAccount"("userId", "iban");

-- AddForeignKey
ALTER TABLE "TopUpTransaction" ADD CONSTRAINT "TopUpTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
