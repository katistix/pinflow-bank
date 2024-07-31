import { SendMoneyToIBAN } from "../transfer/SendMoneyToIBAN";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AccountPreview } from "./AccountPreview";

type AccountSwitcherProps = {
    accounts: {
        balance: number;
        currency: string;
        id: string;
        iban: string;
    }[]
}

export const AccountSwitcher = (props: AccountSwitcherProps) => {
    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                {props.accounts.map(account => (
                    <TabsTrigger key={account.id} value={account.id}>
                        ...{account.id.slice(-5)}
                    </TabsTrigger>
                ))}
            </TabsList>
            {props.accounts.map(account => (
                <TabsContent key={account.id} value={account.id}>
                    <AccountPreview account={account} />
                    <SendMoneyToIBAN selectedAccount={account.id} />
                </TabsContent>
            ))}
        </Tabs>
    )
}