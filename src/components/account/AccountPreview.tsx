"use client"
import React from 'react';
import { IconDots, IconPlus, IconQrcode, IconReceipt } from '@tabler/icons-react';
import { AddMoneyDialog } from './AddMoney';
import { IbanQrDrawer } from './IbanQrDrawer';
import { NewBankAccount } from './NewBankAccount';
import AccountMore from './AccountMore';

type AccountPreviewProps = {
    account: {
        name: string;
        balance: number;
        currency: string;
        id: string;
        iban: string;
    }
}

const ActionButton = ({ children, onClick, label }: {
    children: React.ReactNode,
    onClick?: () => void
    label?: string
}) => {
    return (
        <div onClick={onClick} className='flex flex-col items-center justify-center text-white'>
            <div className='flex rounded-full p-1 h-10 w-10 bg-stone-700 justify-center items-center text-white bg-opacity-60'>
                {children}
            </div>
            <p className='text-xs mt-1'>{label}</p>
        </div>
    )
}

export const AccountPreview = ({ account }: AccountPreviewProps) => {
    return (
        <div className="flex flex-col justify-center items-center py-10">
            <h2 className='text-xs'>{account.name} &bull; {account.currency}</h2>
            <h1 className="text-4xl font-bold text-center my-4">{account.balance.toFixed(2)} {account.currency}</h1>
            <NewBankAccount />

            <div className="flex flex-row justify-between w-full px-4 my-8">
                <AddMoneyDialog accountID={account.id} accountName={account.name} currency={account.currency}>
                    <ActionButton onClick={() => console.log("")} label='Add money'>
                        <IconPlus className="h-4 w-4" />
                    </ActionButton>
                </AddMoneyDialog>
                <ActionButton onClick={async () => {
                    console.log("fetching transactions", account.id);
                    const res = await fetch(`/api/extras`, {
                        method: 'POST',
                        body: JSON.stringify({ accountID: account.id }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    // Save the received data bytes into a file
                    const data = await res.blob();
                    // Download the file
                    const url = window.URL.createObjectURL(data);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'transactions.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    console.log(data);
                }} label='Transactions'>
                    <IconReceipt className="h-4 w-4" />
                </ActionButton>
                <IbanQrDrawer iban={account.iban}>
                    <ActionButton label='Show IBAN'>
                        <IconQrcode className="h-4 w-4" />
                    </ActionButton>
                </IbanQrDrawer>


                <AccountMore>
                    <ActionButton label='More'>
                        <IconDots className="h-4 w-4" />
                    </ActionButton>
                </AccountMore>
            </div>
            {/* <SendMoneyToIBAN className="" selectedAccount={account.id} /> */}
        </div>
    )
}