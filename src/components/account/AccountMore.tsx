"use client"
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogDescription
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAtom } from 'jotai';
import { selectedAccountAtom } from '@/lib/atoms';

type AccountMoreProps = {
    children: React.ReactNode;
};

function AccountMore(props: AccountMoreProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [accountName, setAccountName] = useState('');
    const [accountID, setAccountID] = useAtom(selectedAccountAtom);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleInputChange = (e: any) => {
        setAccountName(e.target.value);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/bankaccount/rename', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accountId: accountID, newName: accountName })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle success (e.g., show a notification or update state)
            handleDialogClose();

            // Reload window
            window.location.reload();


        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {props.children}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDialogOpen}>Edit Account Name</DropdownMenuItem>
                    <DropdownMenuItem>Delete Account</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Account Name</DialogTitle>
                        <DialogClose onClick={handleDialogClose} />
                    </DialogHeader>
                    <DialogDescription>
                        <Input
                            placeholder="New Account Name"
                            value={accountName}
                            onChange={handleInputChange}
                        />
                        <Button className='w-full mt-4' disabled={
                            accountName.length <= 0 || accountName.length >= 255
                        } onClick={handleSave}>Save</Button>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AccountMore;
