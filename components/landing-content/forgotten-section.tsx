"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/schema/forgotschema"

export default function ForgotPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError: setFormError,
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsSubmitting(true)
        setIsSuccess(false)

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong")
            }

            setIsSuccess(true)
        } catch (err) {
            setFormError("root", {
                type: "manual",
                message: err instanceof Error ? err.message : "Something went wrong",
            })
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
                        <Image src="/whitelogo.png" alt="Buy Exchange Logo" width={165} height={50} className="mb-6" />
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
                    <h2 className="text-md sm:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left lg:ml-[157px] lg:mb-[30px] lg:mt-[112px] font-jakarta">
                        Forgotten Password
                    </h2>
                    <br />
                    <form onSubmit={handleSubmit(onSubmit)} data-cy="reset-form" className="space-y-4 px-0 sm:px-4 lg:p-[102px] lg:mt-[-119px]">
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-1 font-raleway">
                                Email Address
                            </label>
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className={`pl-10 w-full rounded-full border ${errors.email ? "border-red-500" : "border-gray-300"} py-2.5 sm:py-3 px-4 text-gray-900 font-raleway placeholder-gray-500 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base`}
                                    placeholder="your@email.com"
                                    data-cy="email-input"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 font-raleway">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {errors.root && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errors.root.message}
                            </div>
                        )}

                        {isSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                Password reset email sent. Please check your inbox.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-dark-blue hover:bg-custom-green text-white font-raleway font-medium py-2.5 sm:py-3 px-4 rounded-full flex items-center justify-center transition-colors duration-200 text-sm sm:text-base"
                            data-cy="reset-button"
                        >
                            Reset Password
                            {isSubmitting ? (
                                <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                            ) : (
                                <Lock className="h-4 w-4 sm:h-5 sm:w-5 ml-2 font-medium" />
                            )}
                        </button>
                    </form>
                    <div className="mt-4 text-center text-gray-500 lg:mt-[-80px] font-jakarta">
                        Want to go back?{" "}
                        <Link href="/signin" className="font-medium text-dark-blue hover:text-dark-blue hover:underline font-jakarta">
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