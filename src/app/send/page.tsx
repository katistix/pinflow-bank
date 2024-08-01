import { SendPage } from "@/components/SendPage";
import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";


export default async function Page() {
    const session = await auth();

    if (!session?.user?.id) {
        return (
            <div>
                Unauthorized
            </div>
        )
    }


    const bankAccounts = await bankAccountsService.getAllBankAccountsOfUser(session.user.id);

    return (
        <SendPage bankAccounts={bankAccounts} />
    )
}