"use client"

import { auth } from "@/lib/auth"
import { signIn } from "next-auth/webauthn"
import { signOut, useSession } from "next-auth/react";


export default function Login() {
    const session = useSession()

    return (
        <div>
            <button onClick={() => signIn("google")}>Sign in with Github</button>
            {session.status === "authenticated" ? (
                <button onClick={() => signIn("passkey", { action: "register" })}>
                    Register new Passkey
                </button>
            ) : session.status === "unauthenticated" ? (
                <button onClick={() => signIn("passkey")}>Sign in with Passkey</button>
            ) : null}
        </div>
    )
}