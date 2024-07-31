import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";
import { z } from "zod";

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Get the bank account id from the request body
    const body = await request.json();
    // Validate with zod
    const deleteBankAccountSchema = z.object({
        bankAccountId: z.string(),
    })

    const validatedBody = await deleteBankAccountSchema.parseAsync(body)

    // Make sure the bank account belongs to the user
    const bankAccount = await bankAccountsService.getBankAccountById(validatedBody.bankAccountId);

    if (!bankAccount || bankAccount.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Delete the bank account
    await bankAccountsService.deleteBankAccount(validatedBody.bankAccountId);

}