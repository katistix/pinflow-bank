import { stripe } from "@/lib/stripe";
import { bankAccountsService } from "@/services";

// The webhook that will be called by the payment provider after a successful top-up
export async function GET(request: Request) {
    // Validate that the payment was successful, we have a session_id in the query
    const params = new URLSearchParams(request.url.split("?")[1]);
    const sessionId = params.get("session_id");

    if (!sessionId) {
        return new Response("No session_id provided", { status: 400 });
    }

    // Get the session from the payment provider
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // If the payment was successful, we will update the balance of the bank account
    if (session.payment_status === "paid") {
        // Get the bank account id from the metadata
        const bankAccountId = session.metadata?.bankAccountId;
        if (!bankAccountId) {
            return new Response("No bankAccountId provided", { status: 400 });
        }



        // Get the amount from the metadata
        if (!session.amount_total) {
            return new Response("No amount provided", { status: 400 });
        }
        const amount = session.amount_total / 100;

        // Get previous balance
        const bankAccount = await bankAccountsService.getBankAccountById(bankAccountId);
        if (!bankAccount) {
            return new Response("Bank account not found", { status: 404 });
        }


        // Create a top up transaction
        const currency = session.currency?.toUpperCase();
        if (!currency) {
            return new Response("No currency provided", { status: 400 });
        }
        await bankAccountsService.createTopUpTransaction(bankAccountId, amount, currency as "USD" | "EUR" | "GBP");

        // Update the balance of the bank account
        await bankAccountsService.updateBalance(bankAccountId, bankAccount.balance + amount);


        // return new Response("Success", { status: 200 });
        return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/feed`, 303);
    }


}