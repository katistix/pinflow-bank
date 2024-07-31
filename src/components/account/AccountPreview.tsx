import React from 'react';

type AccountPreviewProps = {
    account: {
        balance: number;
        currency: string;
        id: string;
        iban: string;
    }
}

export const AccountPreview = ({ account }: AccountPreviewProps) => {
    return (
        <div className="bg-gray-200 p-4 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">
                {account.currency} {account.balance}
            </h1>
            <p className="text-gray-600">
                {account.id}
            </p>
            <p className="text-gray-600">
                {account.iban}
            </p>
        </div>
    )
}