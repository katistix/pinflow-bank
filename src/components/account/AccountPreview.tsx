"use client"
import React from 'react';
import { Button } from '../ui/button';
import { IconDots, IconPlus, IconReceipt } from '@tabler/icons-react';
import { SendMoneyToIBAN } from '../transfer/SendMoneyToIBAN';
import { BalanceChart } from './BalanceChart';

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
        <div className='flex flex-col items-center justify-center text-white'>
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
            <h1 className="text-4xl font-bold text-center my-4">{account.balance} {account.currency}</h1>

            <div className="flex flex-row justify-between w-full px-4 my-8">
                <ActionButton onClick={() => console.log("")} label='Add money'>
                    <IconPlus className="h-4 w-4" />
                </ActionButton>
                <ActionButton onClick={() => console.log("")} label='Transactions'>
                    <IconReceipt className="h-4 w-4" />
                </ActionButton>
                <ActionButton onClick={() => console.log("")} label='More'>
                    <IconDots className="h-4 w-4" />
                </ActionButton>
            </div>
            <SendMoneyToIBAN className="" selectedAccount={account.id} />
        </div>
    )
}