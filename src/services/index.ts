import { prisma } from "@/lib/prisma";
import { BankAccountsService } from "./BankAccounts";





export const bankAccountsService = new BankAccountsService(prisma);