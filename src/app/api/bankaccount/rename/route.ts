import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const renameBankAccountSchema = z.object({
        accountId: z.string(),
        newName: z.string().min(1).max(255),
    });
    const validatedBody = await renameBankAccountSchema.parseAsync(body);

    if (!validatedBody) {
        return new Response('Invalid input', { status: 400 });
    }

    const bankAccount = await prisma.bankAccount.findFirst({
        where: {
            id: body.accountId,
            userId: session.user.id,
        },
    });

    if (!bankAccount) {
        return new Response('Bank account not found', { status: 404 });
    }

    await prisma.bankAccount.update({
        where: {
            id: body.accountId,
        },
        data: {
            name: body.newName,
        },
    });


    return new Response('Bank account renamed', { status: 200 });

}