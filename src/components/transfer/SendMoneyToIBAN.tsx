"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { IconArrowsExchange } from "@tabler/icons-react";

type SendMoneyToIBANProps = {
    className?: string;
    selectedAccount: string;
}

export const SendMoneyToIBAN = (props: SendMoneyToIBANProps) => {
    const [iban, setIBAN] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);

    const handleSendMoney = async () => {
        console.log("Sending money to IBAN", props.selectedAccount);
        if (!iban || !amount || !props.selectedAccount) {
            return;
        }

        const res = await fetch('/api/transfer/send', {
            method: "POST",
            body: JSON.stringify({
                from: props.selectedAccount,
                toIBAN: iban,
                amount: amount
            }),
        });

        if (res.ok) {
            toast.success("Money sent!");
            setIBAN(null);
            setAmount(0);
        }
        else {
            const errorData = await res.json();
            toast.error(errorData.error);
        }
    }


    return (
        <div>
            <Dialog>
                <DialogTrigger className="w-full" asChild>
                    <Button className={props.className} size={"lg"}>Send money <IconArrowsExchange className="w-6 h-6 ml-2" /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Send money</DialogTitle>
                    </DialogHeader>
                    <Input value={iban || ""} onChange={(e) => setIBAN(e.target.value)} type="text" placeholder="Enter IBAN" />
                    <Input type={"number"}
                        value={amount}
                        onChange={(e) => {
                            setAmount(parseFloat(e.target.value))
                        }}
                        placeholder="0.00"
                    />
                    <Button disabled={
                        !iban || !amount
                    } onClick={handleSendMoney}>Send money</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}