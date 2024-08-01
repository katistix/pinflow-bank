"use client"

import { IconQrcode } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import toast from "react-hot-toast";
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from "react";



export const QRScanner = (props: {
    onScan: (result: string) => void
}) => {
    const [open, setOpen] = useState(false);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="absolute right-0 mr-4 top-[50%] -translate-y-[50%]">
                    <IconQrcode className="w-8 h-8" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">Scan IBAN QR Code</h2>
                    <Scanner onScan={(result) => {
                        props.onScan(result[0].rawValue);
                        setOpen(false);
                    }} />
                </div>
            </DialogContent>

        </Dialog>
    )

}