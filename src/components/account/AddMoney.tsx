import { DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import { Input } from "../ui/input" // Import the Input component
import toast from "react-hot-toast"

type AddMoneyDialogProps = {
    children: React.ReactNode,
    accountName: string,
    currency: string,
    accountID: string
}

export const AddMoneyDialog = (props: AddMoneyDialogProps) => {

    const [amount, setAmount] = useState<number>(0);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // If more than 2 decimal places, don't allow more input
        if (e.target.value.split(".")[1]?.length > 2) {
            return;
        }

        setAmount(parseFloat(e.target.value));
    }

    const handleAddMoney = async () => {
        // Round the amount to 2 decimal places
        const roundedAmount = Math.round(amount * 100) / 100;

        try {
            // Initialize the payment
            const res = await fetch('/api/bankaccount/balance/topup/create-checkout-session', {
                method: "POST",
                body: JSON.stringify({
                    amount: roundedAmount,
                    currency: props.currency,
                    accountID: props.accountID
                }),
            });

            // Check if the request was successful
            if (res.ok) {
                // This returns the checkout session ID and the URL to redirect to
                const data = await res.json();

                // Redirect to the checkout page
                window.location.href = data.url;
            } else {
                // Display an error toast
                toast.error("Failed to add money. Please try again later.");
            }
        } catch (error) {
            // Display an error toast
            toast.error("An error occurred. Please try again later.");
        }
    }
    return (
        <Dialog>
            <DialogTrigger>
                {props.children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Money</DialogTitle>
                    <DialogDescription>Deposit money into your <span className="text-primary">{props.accountName}</span> account.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 w-full">
                    <Input type="number" placeholder={"0.00 " + props.currency} value={amount} onChange={handleAmountChange} />
                    <Button className="w-full" onClick={handleAddMoney} disabled={amount <= 0}>Add money</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
