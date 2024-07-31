import { AccountPreview } from "@/components/account/AccountPreview";
import { AccountSwitcher } from "@/components/account/AccountSwitcher";
import { NewBankAccount } from "@/components/account/NewBankAccount";
import { SendMoneyToIBAN } from "@/components/transfer/SendMoneyToIBAN";
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
    <div>
      <AccountSwitcher accounts={bankAccounts.map((account) => ({
        iban: account.iban,
        balance: account.balance,
        currency: account.currency,
        id: account.id
      }))} />
      <NewBankAccount />
    </div>
  );
}
