"use client"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function ResetpasswordPage() {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match")
            setIsSubmitting(false)
            return
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password: newPassword,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong")
            }

            setIsSuccess(true)
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                router.push("/signin")
            }, 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white overflow-hidden flex flex-col lg:flex-row shadow-xl relative">
                {/* Left side - Blue section */}
                <div className="w-full lg:w-1/2 bg-gradient-to-b from-dark-blue to-light-blue p-6 sm:p-8 lg:p-10 text-white relative">
                    <div className="mb-8">
                        <Image src="/buyex-main-logo.png" alt="Buyex Forex Logo" width={185} height={60} className="mb-6" />
                        <h1 className="text-xl sm:text-2xl font-bold mb-2 font-jakarta">
                            Be the Change in
                            <br />
                            Global Education.
                        </h1>
                        <p className="mt-4 sm:mt-6 text-sm">
                            Partner with us to deliver seamless,
                            <br className="hidden sm:block" />
                            and powerful study abroad solutions
                            <br className="hidden sm:block" />
                            and take your consultancy to the next level.
                        </p>
                    </div>
                </div>

                {/* Right side - White section */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 relative lg:w-[1260px] lg:h-[579px] lg:mt-[-40px]">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left lg:ml-[233px] lg:mb-[30px] lg:mt-[112px] font-jakarta">

                        Reset Password
                    </h2>



                    <form onSubmit={handleSubmit} className="space-y-4 px-0 sm:px-4 lg:p-[102px] lg:mt-[-119px]">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-bold text-gray-800 mb-1">
                                New password*
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 border-b border-gray-200 border-t-0 border-l-0 border-r-0 focus:border-t focus:border-gray-500 focus:ring-0"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-800 mb-1">
                                Confirm password*
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 border-b border-gray-200 border-t-0 border-l-0 border-r-0 focus:border-t focus:border-gray-500 focus:ring-0"
                                    placeholder="Re-enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-custom-green hover:bg-custom-green text-white font-medium py-2.5 px-4 rounded-full flex items-center justify-center"
                        >
                            {isSubmitting ? "Processing..." : "Change Password"}
                            {isSubmitting && (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                            )}
                        </button>

                        <button
                            type="submit"
                            className="w-full bg-dark-blue text-white py-2 lg:mt-[-40px] rounded-md hover:dark-blue transition font-jakarta"
                        >Reset password</button>
                    </form>


                    {error && (
  <p className="text-red-600 text-sm text-center mt-2">{error}</p>
)}
{isSuccess && (
  <p className="text-green-600 text-sm text-center mt-2">
    Password reset successfully! Redirecting...
  </p>
)}



                    <div className="mt-4 text-center text-gray-500 lg:mt-[-80px] font-jakarta">
                        Want to go back?{" "}
                        <Link href="/signin" className="font-medium text-dark-blue hover:text-dark-blue  hover:underline font-jakarta">
                            Login
                        </Link>
                    </div>
                </div>


                <div className="hidden lg:block absolute bottom-0 left-1/4 transform -translate-x-1/4 pointer-events-none">
                    <Image
                        src="/unusers.png"
                        alt="Illustration"
                        width={500}
                        height={400}
                        className="object-contain ml-[-117px] w-[682px] mb-[0px]"
                    />
                </div>

            </div>

        </div>

    )
}
