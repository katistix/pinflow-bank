import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { bankAccountsService } from "@/services";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const topUpSchema = z.object({
        accountID: z.string(),
        amount: z.number(),
        currency: z.string(),
    });

    const validatedBody = await topUpSchema.parseAsync(body);

    // Check if the account belongs to the user
    const bankAccount = await bankAccountsService.getBankAccountById(validatedBody.accountID);

    if (bankAccount?.userId != session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: validatedBody.currency,
                    product_data: {
                        name: "Add funds to Pinflow Bank Account",
                    },
                    unit_amount: validatedBody.amount * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            bankAccountId: validatedBody.accountID,
        },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/api/bankaccount/balance/topup/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/feed`,
    });

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url }, { status: 200 });

}
