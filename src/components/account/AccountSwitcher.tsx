"use client"

import { useEffect, useState } from "react";
import { SendMoneyToIBAN } from "../transfer/SendMoneyToIBAN";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AccountPreview } from "./AccountPreview";
import { IconPlus, IconReceipt } from '@tabler/icons-react';
import { useAtom } from "jotai";
import { selectedAccountAtom } from "@/lib/atoms";
import { BalanceChart } from "./BalanceChart";


type AccountSwitcherProps = {
    accounts: {
        name: string;
        balance: number;
        currency: string;
        id: string;
        iban: string;
    }[]
}


const PaginationDots = ({ totalCount, activeIndex }: {
    totalCount: number;
    activeIndex: number;
}) => {
    return (
        <div className="flex justify-center space-x-2">
            {Array.from({ length: totalCount }).map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-stone-400"}`}></div>
            ))}
        </div>
    )
}

export const AccountSwitcher = (props: AccountSwitcherProps) => {
    const [api, setApi] = useState<CarouselApi>()
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedAccount, setSelectedAccount] = useAtom(selectedAccountAtom)

    useEffect(() => {
        if (!api) {
            return
        }

        setActiveIndex(api.selectedScrollSnap())

        api.on("select", () => {
            setActiveIndex(api.selectedScrollSnap())

            const account = props.accounts[api.selectedScrollSnap()]
            setSelectedAccount(account.id)
        })
    }, [api])

    return (
        <div>
            <div className="flex justify-center my-2">
                <PaginationDots totalCount={props.accounts.length} activeIndex={activeIndex} />
            </div>
            <Carousel setApi={setApi}>
                <CarouselContent>
                    {props.accounts.map(account => (
                        <CarouselItem key={account.id}>
                            <AccountPreview account={account} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="rounded-md bg-stone-900">
                <BalanceChart />
            </div>

        </div>
    )
}