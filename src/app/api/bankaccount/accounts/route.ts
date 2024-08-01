import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 })
    }

    // Get all bank accounts of the user
    const bankAccounts = await bankAccountsService.getAllBankAccountsOfUser(session.user.id);

    // Respond wih a list of bank account ids
    // const ids = bankAccounts.map((account) => account.id);

    return NextResponse.json({ bankAccounts }, { status: 200 });

}