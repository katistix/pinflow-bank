"use client";

import { IconArrowLeft, IconQrcode } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TransactionCategory } from "@/services/types";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { QRScanner } from "./transfer/QRScanner";

type SendPageProps = {
    bankAccounts: {
        name: string;
        balance: number;
        currency: string;
        id: string;
        iban: string;
    }[]
}

export function SendPage(props: SendPageProps) {
    const [amount, setAmount] = useState<number | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [currency, setCurrency] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [sending, setSending] = useState<boolean>(false);

    const [iban, setIBAN] = useState<string | null>(null);
    const [transactionCategory, setTransactionCategory] = useState<TransactionCategory | null>(null);

    useEffect(() => {
        if (props.bankAccounts.length > 0) {
            setSelectedAccount(props.bankAccounts[0].id);
            setCurrency(props.bankAccounts[0].currency);
            setBalance(props.bankAccounts[0].balance);
        }
    }, [props.bankAccounts]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {


        // if the input amount is more than the balance, don't allow more input
        if (parseFloat(e.target.value) > balance! || parseFloat(e.target.value) < 0) {
            toast.error("Amount too large", {
                duration: 800
            });
            return;
        }

        setAmount(parseFloat(e.target.value));
    }

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const accountId = e.target.value;
        setSelectedAccount(accountId);
        const account = props.bankAccounts.find(acc => acc.id === accountId);
        if (account) {
            setCurrency(account.currency);
            setBalance(account.balance);
            setAmount(null);
        }
    }

    const handleSendMoney = async () => {
        console.log("Sending money to IBAN", selectedAccount);
        if (!iban || !amount || !selectedAccount || !transactionCategory) {
            return;
        }

        setSending(true);

        const res = await fetch('/api/transfer/send', {
            method: "POST",
            body: JSON.stringify({
                from: selectedAccount,
                toIBAN: iban,
                amount: amount,
                category: transactionCategory
            }),
        });

        if (res.ok) {
            toast.success("Money sent!");
            setIBAN(null);
            setAmount(null);
            setTransactionCategory(null);

            // after sending the money, go back to the previous page
            // but wait for 1 second to show the success toast
            setTimeout(() => {
                window.history.back();
            }, 1000);
        }
        else {
            const errorData = await res.json();
            toast.error(errorData.error);
        }
    }

    return (
        <div className="w-screen">
            <header className="w-full p-4 flex flex-row items-center">
                <button className="p-2 mr-2" onClick={() => {
                    window.history.back();
                }}>
                    <IconArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-medium">Send money</h1>
            </header>


            <div className="p-4">
                {/* Max amount */}
                {balance && (
                    <p className="text-xs text-center opacity-75">Max: {balance.toFixed(2)} {currency}</p>
                )}
                <input
                    className="bg-none border-none bg-transparent outline-none w-full pb-8 text-5xl font-bold text-center"
                    type="number"
                    placeholder="0.00"
                    value={amount || ""}
                    onChange={handleAmountChange}
                />
                {currency && (
                    <p className="text-center text-xl">{currency}</p>
                )}
            </div>


            <div className="flex flex-col items-center justify-center w-full">
                <label className="text-xs mb-2">From Account</label>
                {/* Account select */}
                <select className="max-w-64 bg-stone-900 p-2 rounded-sm" onChange={handleAccountChange} value={selectedAccount || ""}>
                    {props.bankAccounts.map(account => (
                        <option key={account.id} className="text-xs" value={account.id}>
                            {account.currency} &bull; {account.name} ({account.iban})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col p-4 mt-4">
                <label className="text-xs">IBAN</label>
                <div className="w-full flex justify-center relative">
                    <input className="relative w-full bg-stone-900 p-4 rounded-md my-4" type="text" placeholder="Enter IBAN" value={iban || ""} onChange={(e) => setIBAN(e.target.value)} />
                    <QRScanner onScan={(val) => setIBAN(val)} />
                </div>
                <label className="text-xs">Transaction Category</label>
                {/* Category select, select from the enum */}
                <select className="bg-stone-900 p-4 rounded-md my-4" value={transactionCategory || ""} onChange={(e) => setTransactionCategory(e.target.value as TransactionCategory)}>
                    <option value="" disabled selected>Select a category...</option>
                    {Object.keys(TransactionCategory).map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            </div>

            <div className="fixed w-full bottom-0 p-4">
                <Button
                    onClick={handleSendMoney}
                    disabled={
                        !iban || !amount || !selectedAccount || !transactionCategory || sending
                    } className="bg-primary w-full rounded-full p-4 text-black">
                    Send
                </Button>
            </div>
        </div>
    )
}
