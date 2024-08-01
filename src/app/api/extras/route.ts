import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb } from 'pdf-lib';
import { z } from 'zod';

interface Transaction {
    sender: { iban: string; currency: string };
    receiver: { iban: string };
    createdAt: Date;
    amount: number;
}

const generatePDF = async (transactions: Transaction[]) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 1000]);

    const title = 'Account Statement';
    page.drawText(title, {
        x: 50,
        y: 950,
        size: 20,
        color: rgb(0, 0.53, 0.71),
    });

    const tableTitle = 'Transactions:';
    page.drawText(tableTitle, {
        x: 50,
        y: 920,
        size: 12,
        color: rgb(0, 0, 0),
    });

    // Table headers
    const headers = ['Date', 'Sender IBAN', 'Receiver IBAN', 'Amount', 'Currency'];
    let yPosition = 900;
    headers.forEach((header, index) => {
        page.drawText(header, {
            x: 50 + index * 100,  // Adjusted column width
            y: yPosition,
            size: 8,
            color: rgb(0, 0, 0),
        });
    });

    // Table rows
    yPosition -= 20;
    transactions.forEach((transaction) => {
        const { createdAt, amount, sender, receiver } = transaction;
        const row = [
            createdAt.toISOString().split('T')[0],
            sender.iban,
            receiver.iban,
            `${amount.toFixed(2)}`,
            sender.currency,
        ];
        row.forEach((text, index) => {
            page.drawText(text, {
                x: 50 + index * 100,  // Adjusted column width
                y: yPosition,
                size: 8,  // Reduced font size
                color: rgb(0, 0, 0),
            });
        });
        yPosition -= 20;  // Add margin between rows
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};


export async function POST(request: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Get the account id from the body
    const body = await request.json();

    // Get the bank account from the database
    const bankAccount = await prisma.bankAccount.findFirst({
        where: {
            id: body.accountId,
            userId: session.user.id,
        },
    });

    if (!bankAccount) {
        return new Response('Bank account not found', { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            OR: [
                { senderId: bankAccount.id },
                { receiverId: bankAccount.id },
            ],
        },
        include: {
            sender: true,
            receiver: true,
        },
    });

    // Generate a new PDF document with transactions and return it
    const pdf = await generatePDF(transactions);
    return new Response(pdf, {
        headers: {
            'Content-Type': 'application/pdf',
        },
    });
}
