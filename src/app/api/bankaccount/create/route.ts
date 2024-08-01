import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { bankAccountsService } from "@/services"
import { z } from "zod"

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {
    return new Response('GET /api/bankaccount/create')
}


export async function POST(request: Request) {
    const body = await request.json();
    // Use zod to validate the body
    const createBankAccountSchema = z.object({
        currency: z.enum(['USD', 'EUR', 'GBP']),
        accountName: z.string().min(1).max(255),
    })

    const validatedBody = await createBankAccountSchema.parseAsync(body)

    // Get the user id from the session
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Try to create the bank account
    try {
        const newBankAccount = await bankAccountsService.createNewBankAccount(session.user.id, validatedBody.currency, validatedBody.accountName)
        return new Response(JSON.stringify(newBankAccount), { status: 201 })
    } catch (error: any) {
        return new Response(error.message, { status: 400 })
    }
}