"use client"
import { auth } from "@/lib/auth"
import { signIn } from "next-auth/webauthn"
import { signOut, useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";

export default function Login() {
    const session = useSession()

    return (
        <div className=" p-8 w-screen h-screen flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto p-6">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
                    <CardDescription className="text-gray-600">Please sign in to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        {session.status === "unauthenticated" && (
                            <>
                                <button
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    onClick={() => signIn("google")}
                                >
                                    Sign in with Google
                                </button>
                                <button
                                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
                                    onClick={() => signIn("passkey", { callbackUrl: "/feed" })}
                                >
                                    Sign in with Passkey
                                </button>
                            </>
                        )}
                        {session.status === "authenticated" && (
                            <>
                                <p className="text-center text-green-600">You are signed in!</p>
                                <button
                                    className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
                                    onClick={() => signIn("passkey", { action: "register" })}
                                >
                                    Register new Passkey
                                </button>
                                <button
                                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors mt-2"
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                        {session.status === "loading" && (
                            <p className="text-center text-gray-500">Loading...</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-gray-400 text-sm">Need help? <a href="#" className="text-blue-500">Contact support</a></p>
                </CardFooter>
            </Card>
        </div>
    )
}
