import { AccountPreview } from "@/components/account/AccountPreview";
import { AccountSwitcher } from "@/components/account/AccountSwitcher";
import { NewBankAccount } from "@/components/account/NewBankAccount";
import { SendMoneyToIBAN } from "@/components/transfer/SendMoneyToIBAN";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div>not authenticated</div>
    )
  }

  const bankAccounts = await bankAccountsService.getAllBankAccountsOfUser(session.user.id);

  return (
    <div className="h-screen w-screen">
      <header className="flex items-center justify-between p-4">
        <h1 className="font-bold text-xl">Pinflow Bank</h1>
        <Avatar className="ring">
          <AvatarImage src={session.user.image || ""} />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>
      </header>
      <div className="p-4">
        <AccountSwitcher accounts={bankAccounts.map((account) => ({
          name: account.name,
          iban: account.iban,
          balance: account.balance,
          currency: account.currency,
          id: account.id
        }))} />
      </div>
    </div>
  );
}
