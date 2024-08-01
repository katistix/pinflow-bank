import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";
import { NextResponse } from "next/server";

export async function GET(request: Request, route: { params: { accountId: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the bank account id from the route
    const { accountId } = route.params;

    // Get the bank account from the database
    const bankAccount = await bankAccountsService.getBankAccountById(accountId);

    if (!bankAccount) {
        return NextResponse.json({ error: "Bank account not found" }, { status: 404 });
    }

    // Allow only the owner of the bank account to see the transactions
    if (bankAccount.userId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the transactions of the past week
    const transactionHistory = await bankAccountsService.getTransactions(accountId);

    // Filter the transactions to get only the ones from the past week
    const pastWeekBalanceHistory = transactionHistory.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        const now = new Date();
        const pastWeek = new Date(now.setDate(now.getDate() - 7));

        return transactionDate >= pastWeek;
    });

    return NextResponse.json(pastWeekBalanceHistory, { status: 200 });

}