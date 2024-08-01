"use client"

import toast from "react-hot-toast";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import QRCode from "react-qr-code";


type IbanQrDrawerProps = {
    children: React.ReactNode;
    iban: string;
}

export const IbanQrDrawer = (props: IbanQrDrawerProps) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(props.iban);

        toast.success("IBAN copied to clipboard");
    }

    return (

        <Drawer>
            <DrawerTrigger>
                {props.children}
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>IBAN QR Code</DrawerTitle>
                </DrawerHeader>
                <div className="flex justify-center" onClick={handleCopy}>
                    <div className="bg-white p-4 rounded-lg">
                        <QRCode value={props.iban} size={150} />
                    </div>
                </div>
                <div className="text-center my-4" onClick={handleCopy}>
                    <p className="text-md font-semibold"
                    >{props.iban}</p>
                </div>
            </DrawerContent>
        </Drawer>
    )

}