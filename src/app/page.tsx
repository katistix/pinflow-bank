"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
    return (
        <div className="w-full flex flex-col bg-black">
            {/* Hero sections */}
            <section className="w-full flex flex-col items-center justify-center h-screen">
                <motion.h1 initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="text-stone-200 text-7xl font-bold mb-20">
                    Your money. Our mission.
                </motion.h1>

                <div className="flex space-x-4">
                    <Button size={"lg"} asChild>
                        <Link href="/signin">
                            Get started!
                        </Link>
                    </Button>
                    <Button size={"lg"} variant={"secondary"}>Learn more →</Button>
                </div>
            </section>
        </div>
    )
}