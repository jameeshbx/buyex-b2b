"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { loginSchema } from "@/schema/signin-validation"
import type { LoginInput } from "@/schema/signin-validation"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Partial<LoginInput>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = loginSchema.safeParse({ email, password })

    if (!result.success) {
      // Extract errors from Zod and show them
      const formErrors: Partial<LoginInput> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginInput
        formErrors[field] = err.message
      })
      setErrors(formErrors)
      setIsLoading(false)
      return
    }

    setErrors({}) // Clear previous errors

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.ok) {
        toast.success("Login successful")
        router.push("/dashboard")
      } else {
        // Handle specific error cases
        if (res?.error === "CredentialsSignin") {
          toast.error("Invalid email or password")
        } else if (res?.error === "AccessDenied") {
          toast.error("Your account has been disabled. Please contact support.")
        } else if (res?.error === "EmailNotVerified") {
          toast.error("Please verify your email address before logging in")
        } else {
          toast.error("An error occurred during login. Please try again.")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left lg:ml-[233px] lg:mb-[30px] lg:mt-[112px] font-jakarta">
            Sign in
          </h2>

          <form onSubmit={handleLogin} className="space-y-6 px-0 sm:px-4 lg:p-[102px] lg:mt-[-119px]">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border-b border-gray-200 border-t-0 border-l-0 border-r-0 focus:border-t focus:border-gray-500 focus:ring-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border-b border-gray-200 border-t-0 border-l-0 border-r-0 focus:border-t focus:border-gray-500 focus:ring-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-between items-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline font-jakarta">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-dark-blue text-white py-2 rounded-md hover:bg-medium-blue transition font-jakarta disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-500 lg:mt-[-85px] font-jakarta">
            Not registered?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline font-jakarta">
              Create an account
            </Link>
          </p>
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
