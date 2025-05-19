"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

function VerifyEmailContent() {
    const [isVerifying, setIsVerifying] = useState(true)
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get("token")

                if (!token) {
                    throw new Error("No verification token provided")
                }

                const response = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Failed to verify email")
                }

                toast({
                    title: "Success!",
                    description: "Your email has been verified. You can now sign in.",
                })

                router.push("/signin")
            } catch (error) {
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to verify email",
                    variant: "destructive",
                })
            } finally {
                setIsVerifying(false)
            }
        }

        verifyEmail()
    }, [searchParams, toast, router])

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>
                {isVerifying ? (
                    <p className="text-center text-gray-600">Verifying your email...</p>
                ) : (
                    <p className="text-center text-gray-600">
                        If you&apos;re not redirected automatically, please{" "}
                        <a href="/signin" className="text-dark-blue hover:underline">
                            click here
                        </a>{" "}
                        to sign in.
                    </p>
                )}
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>
                    <p className="text-center text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
} 