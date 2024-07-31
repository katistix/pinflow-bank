import { auth } from "@/lib/auth";

// Get an array of the balance history of a specific bank account of an account
export async function GET(request: Request) {
    // Right now, we will calculate daily balance history for the past week
    const session = await auth();

    if (!session?.user?.id) {
        return new Response('Unauthorized', { status: 401 })
    }

}
