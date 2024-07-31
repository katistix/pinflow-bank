import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json();


    const sendMoneySchema = z.object({
        from: z.string(), // The id of the account from which we will send money
        toIBAN: z.string(), // The IBAN to which we will send money
        amount: z.number(),
    })

    const validatedBody = await sendMoneySchema.parseAsync(body);
    console.log(validatedBody);

    // Make sure the authed user is allowed to send money from this account
    const bankAccount = await bankAccountsService.getBankAccountById(validatedBody.from);

    if (bankAccount?.userId != session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the bank account that needs to receive the money
    const recipientAccount = await bankAccountsService.getBankAccountByIBAN(validatedBody.toIBAN);

    if (!recipientAccount) {
        return NextResponse.json({ error: "Recipient account not found" }, { status: 404 });
    }

    // Make the transaction only if the current account has enough funds
    if (bankAccount.balance < validatedBody.amount) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    // TODO: CONVERT CURRENCY!!!!!
    const convertedAmount = validatedBody.amount;
    console.log("Converted amount", convertedAmount);

    // Move the money
    try {
        await bankAccountsService.transferMoney(bankAccount.id, recipientAccount.id, validatedBody.amount, convertedAmount);
    }
    catch (e: any) {
        return NextResponse.json({ error: e.message }, {
            status: 500
        });
    }

    return NextResponse.json({ message: "Money sent!" });
}
