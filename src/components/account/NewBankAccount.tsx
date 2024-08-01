"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import toast from "react-hot-toast";

export function NewBankAccount() {
    const [alreadyCreated, setAlreadyCreated] = useState<boolean>(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

    const handleCreateNewBankAccount = async () => {
        if (!selectedCurrency) {
            return;
        }
        setAlreadyCreated(true);
        const res = await fetch('/api/bankaccount/create', {
            method: 'POST',
            body: JSON.stringify({
                currency: selectedCurrency
            }),
        })

        if (res.status === 201) {
            toast.success("New bank account created");
            // reload the page to show the new bank account
            // wait for 1 second before reloading
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        if (res.status === 400) {
            toast.error("Could not create new bank account");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="px-4 py-2 mb-4 rounded-full bg-stone-800 text-xs bg-opacity-75">Create new account +</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Select
                    onValueChange={
                        (value) => {
                            setSelectedCurrency(value)
                        }
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a currency..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                </Select>

                <Button disabled={
                    alreadyCreated || !selectedCurrency
                } onClick={handleCreateNewBankAccount}>Create new account</Button>
            </DialogContent>
        </Dialog >
    );
}