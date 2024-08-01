import { PrismaClient } from "@prisma/client";

export class BankAccountsService {
    constructor(
        private prisma: PrismaClient
    ) { }

    private static COUNTRY_CODE = "RO";
    private static BANK_CODE = "PNFL";



    async getBankAccountById(bankAccountId: string) {
        const bankAccount = await this.prisma.bankAccount.findFirst({
            where: {
                id: bankAccountId
            }
        });

        return bankAccount;
    }

    async createTopUpTransaction(bankAccountId: string, amount: number, currency: "USD" | "EUR" | "GBP") {
        const transaction = await this.prisma.topUpTransaction.create({
            data: {
                bankAccountId,
                currency,
                amount
            }
        });

        return transaction;
    }

    async createTransaction(fromId: string, toId: string, subtractAmount: number, addAmount: number) {
        const transaction = await this.prisma.transaction.create({
            data: {
                senderId: fromId,
                receiverId: toId,
                amount: subtractAmount
            }
        });

        return transaction;
    }

    async transferMoney(fromId: string, toId: string, subtractAmount: number, addAmount: number) {
        const fromAccount = await this.prisma.bankAccount.findFirst({
            where: {
                id: fromId
            }
        })
        const toAccount = await this.prisma.bankAccount.findFirst({
            where: {
                id: toId
            }
        });
        if (!fromAccount || !toAccount) {
            return new Error("Something went wrong!")
        }

        try {
            await this.prisma.bankAccount.update({
                where: {
                    id: fromId
                },
                data: {
                    balance: fromAccount?.balance - subtractAmount
                }
            });
            await this.prisma.bankAccount.update({
                where: {
                    id: toId
                },
                data: {
                    balance: toAccount.balance + addAmount
                }
            })
        } catch (e: any) {
            console.error(e);
        }
    }

    async getBankAccountByIBAN(bankAccountIBAN: string) {
        const bankAccount = await this.prisma.bankAccount.findFirst({
            where: {
                iban: bankAccountIBAN
            }
        })

        return bankAccount;
    }

    async getAllBankAccountsOfUser(userId: string) {
        const bankAccounts = await this.prisma.bankAccount.findMany({
            where: {
                userId
            }
        });

        return bankAccounts;
    }
    async createNewBankAccount(userId: string, currency: "USD" | "EUR" | "GBP") {
        // Generate a new bank account iban

        // Make sure there is no other bank account with the same iban
        // If there is, generate a new iban
        const iban = await this.generateUniqueIban();

        // Make sure the iban is unique
        // If it is not, thow an error
        const bankAccountWithSameIban = await this.prisma.bankAccount.findFirst({
            where: {
                iban
            }
        });

        if (bankAccountWithSameIban) {
            throw new Error("IBAN already exists");
        }

        const newBankAccount = await this.prisma.bankAccount.create({
            data: {
                name: "Main",
                iban,
                userId,
                balance: 0,
                currency
            },
        });

        if (!newBankAccount) {
            throw new Error("Could not create new bank account");
        }

        return newBankAccount;
    }

    async deleteBankAccount(bankAccountId: string) {
        const bankAccount = await this.prisma.bankAccount.findFirst({
            where: {
                id: bankAccountId
            }
        });

        if (!bankAccount) {
            throw new Error("Bank account not found");
        }

        await this.prisma.bankAccount.delete({
            where: {
                id: bankAccountId
            }
        });
    }

    async updateBalance(bankAccountId: string, newBalance: number) {
        const bankAccount = await this.prisma.bankAccount.findFirst({
            where: {
                id: bankAccountId
            }
        });

        if (!bankAccount) {
            throw new Error("Bank account not found");
        }

        await this.prisma.bankAccount.update({
            where: {
                id: bankAccountId
            },
            data: {
                balance: newBalance
            }
        });
    }


    // ==============

    // Private method to generate a unique IBAN
    private async generateUniqueIban(): Promise<string> {
        let iban: string;
        let isUnique: boolean = false;

        do {
            const randomAccountNumber = Math.random().toString(36).substring(2, 26).toUpperCase();
            const partialIban = `${BankAccountsService.COUNTRY_CODE}${BankAccountsService.BANK_CODE}${randomAccountNumber}`;
            const checkDigits = this.calculateCheckDigits(partialIban);
            iban = `${BankAccountsService.COUNTRY_CODE}${checkDigits}${BankAccountsService.BANK_CODE}${randomAccountNumber}`;

            const existingBankAccount = await this.prisma.bankAccount.findFirst({
                where: {
                    iban
                }
            });
            if (!existingBankAccount) {
                isUnique = true;
            }
        } while (!isUnique);

        return iban;
    }

    // Private method to calculate check digits
    private calculateCheckDigits(partialIban: string): string {
        // Replace country code and check digits with 00
        const tempIban = partialIban.slice(4) + partialIban.slice(0, 4);
        const numericIban = tempIban.split('').map(char => {
            const code = char.charCodeAt(0);
            return code >= 48 && code <= 57 ? char : (code - 55).toString(); // Convert letters to numbers
        }).join('');

        // Calculate check digits
        const mod97 = (num: string) => {
            let remainder = 0;
            for (let i = 0; i < num.length; i++) {
                remainder = (remainder * 10 + parseInt(num[i], 10)) % 97;
            }
            return remainder;
        };

        const checkDigits = (98 - mod97(numericIban)).toString().padStart(2, '0');
        return checkDigits;
    }
}