import { AccountPreview } from "@/components/account/AccountPreview";
import { AccountSwitcher } from "@/components/account/AccountSwitcher";
import { NewBankAccount } from "@/components/account/NewBankAccount";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth";
import { bankAccountsService } from "@/services";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div>
        Unauthorized
      </div>
    )
  }
  const rawBankAccounts = await bankAccountsService.getAllBankAccountsOfUser(session.user.id);
  // Sorted by date created
  const bankAccounts = rawBankAccounts.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  })

  return (
    <div className="h-screen w-screen">
      <header className="flex items-center justify-between p-4">
        <DropdownMenu>
          <DropdownMenuTrigger>

            <Avatar className="ring h-8 w-8">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex flex-row">
              <Link className="flex flex-row text-destructive" href={"/api/auth/signout"}>Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {bankAccounts.length !== 0 ? (
          <Link href={"/send"}>
            <div className="bg-stone-800 text-xs flex flex-row p-2 px-4 rounded-full">
              <IconArrowRight className="w-4 h-4 mr-2" /> Send money
            </div>
          </Link>
        ) : null}
      </header>
      <div className="p-4">
        {bankAccounts.length !== 0 ? (
          <AccountSwitcher accounts={bankAccounts.map((account) => ({
            name: account.name,
            iban: account.iban,
            balance: account.balance,
            currency: account.currency,
            id: account.id
          }))} />
        ) : (
          <div className="flex flex-col p-8 gap-6 ">
            <h1 className=" text-balance text-center">You don&apos;t have any accounts open right now!</h1>
            <NewBankAccount />
          </div>

        )}
      </div>
    </div>
  );
}
