/*
  Warnings:

  - Changed the type of `currency` on the `BankAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'GBP');

-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL,
ALTER COLUMN "balance" SET DEFAULT 0;
