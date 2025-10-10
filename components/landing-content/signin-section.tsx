"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { loginSchema } from "@/schema/signin-validation"
import type { LoginInput } from "@/schema/signin-validation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  error?: string;
};

function PasswordInput({ value, onChange, disabled = false, error }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleShowPassword = () => {
    setShowPassword(true);
    // Hide after 2 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowPassword(false), 2000);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className={`w-full p-2 border-b border-gray-200 border-t-0 border-l-0 border-r-0 focus:border-t focus:border-gray-500 focus:ring-0 ${
          error ? "border-red-500" : ""
        }`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={handleShowPassword}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Partial<LoginInput>>({})
  const [authError, setAuthError] = useState("") // Add state for authentication errors
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError("") // Clear previous auth errors

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

    setErrors({}) // Clear previous validation errors

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.ok) {
        // Get the session after successful sign-in
        const session = await getSession()

        if (!session?.user?.role) {
          setAuthError("User role not found")
          toast.error("User role not found")
          setIsLoading(false)
          return
        }

        // Debug: Log the role to see what we're getting
       

        toast.success("Login successful")

        // Normalize the role and redirect based on user role
        const userRole = (session.user.role as string).toUpperCase().replace(/\s+/g, "_")
   

        switch (userRole) {
          case "STAFF":
            router.push("/staff/dashboard")
            break
          case "ADMIN":
            router.push("/admin/dashboard")
            break
          case "SUPER_ADMIN":
          case "SUPERADMIN":
            router.push("/super-admin/dashboard/native-users")
            break
            case "AGENT":
              router.push("/agent/dashboard")
              break
          default:
            
            router.push("/staff/dashboard") // Default fallback
        }
      } else {
        // Handle specific error cases and set form errors
        if (res?.error === "CredentialsSignin") {
          setAuthError("Invalid email or password. Please check your credentials and try again.")
          toast.error("Invalid email or password")
        } else if (res?.error === "AccessDenied") {
          setAuthError("Your account has been disabled. Please contact support.")
          toast.error("Your account has been disabled. Please contact support.")
        } else if (res?.error === "EmailNotVerified") {
          setAuthError("Please verify your email address before logging in.")
          toast.error("Please verify your email address before logging in")
        } else {
          setAuthError("An error occurred during login. Please try again.")
          toast.error("An error occurred during login. Please try again.")
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("An unexpected error occurred. Please try again later.")
      toast.error("An unexpected error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Clear errors when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
    if (authError) {
      setAuthError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
    if (authError) {
      setAuthError("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white overflow-hidden flex flex-col lg:flex-row shadow-xl relative">
        {/* Left side - Blue section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-b from-dark-blue to-light-blue p-6 sm:p-8 lg:p-10 text-white relative">
          <div className="mb-8">
            <Link href="/" passHref>
  <div className="cursor-pointer">
    <Image 
      src="/simplify-study-abroad-payments.webp" 
      alt="Buyex Forex Logo – Trusted Student Payment Platform" 
      width={185} 
      height={60} 
      className="mb-6"
    />
  </div>
</Link>
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
            {/* Display general authentication error */}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {authError}
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-2 border-b border-gray-200 border-t-0 border-l-0 border-r-0 focus:border-t focus:border-gray-500 focus:ring-0 ${
                  errors.email ? "border-red-500" : ""
                }`}
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                error={errors.password}
              />
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
            <Link href="tel:+918943243543" className="text-blue-600 hover:underline font-jakarta">           
             Contact Sales Team
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
