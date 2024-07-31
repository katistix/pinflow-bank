
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import WebAuthn from "next-auth/providers/webauthn"
import Passkey from "@auth/core/providers/passkey"

import { prisma } from "./prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    experimental: {
        enableWebAuthn: true,
    },
    adapter: PrismaAdapter(prisma),
    // providers: [Google],
    providers: [Passkey, Google],
})