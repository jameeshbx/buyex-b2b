"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import VerificationButton from "./verification-button"
import Link from "next/link"
import Image from "next/image"
import { formSchema, type FormValues } from "@/schema/signupSchema"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function SignupSection() {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organisationName: "",
      email: "",
      password: "",
      phoneNumber: "",
      verified: false,
      acceptTerms: false,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true)

      // Remove logo from the initial submission
      const { logo, ...signupData } = data;

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      // If logo was provided, upload it after successful signup
      if (logo instanceof File) {
        const formData = new FormData();
        formData.append('logo', logo);
        formData.append('organisationId', result.organisationId);

        const uploadResponse = await fetch('/api/upload/logo', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.warn('Logo upload failed, but account was created successfully');
        }
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email to verify your account.",
      })

      router.push("/signin")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      form.setValue("verified", true)
    }
    setIsVerified(success)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center px-4 md:px-10 sm:px-10 py-8">
      <div className="relative w-full max-w-5xl bg-white flex flex-col lg:flex-row overflow-hidden shadow-xl rounded-lg">
        {/* Left Section */}
        <div className="w-full lg:w-1/3 bg-gradient-to-b from-dark-blue to-light-blue p-6 sm:p-8 text-white">
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
          <h1 className="text-2xl font-bold font-plus-jakarta">
            Be the Change in <br />
            Global Education.
          </h1>
          <p className="mt-4 text-sm font-plus-jakarta">
            Partner with us to deliver seamless,
            <br />
            and powerful study abroad solutions and
            <br />
            take your consultancy to the next level.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 md:p-10 relative z-0">
          <h2 className="text-2xl font-semibold font-plus-jakarta text-center text-gray-800 mb-6">
            Create Account
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 lg:px-16">
              {/* Organisation Name */}
              <FormField
                control={form.control}
                name="organisationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-500 font-plus-jakarta">
                      Organisation Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-8 text-sm focus-visible:ring-0 focus-visible:border-dark-blue"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-500 font-plus-jakarta">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-8 text-sm focus-visible:ring-0 focus-visible:border-dark-blue"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-500 font-plus-jakarta">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-8 text-sm focus-visible:ring-0 focus-visible:border-dark-blue"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-500 font-plus-jakarta">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-0 border-b border-gray-300 rounded-none px-0 h-8 text-sm focus-visible:ring-0 focus-visible:border-dark-blue"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Upload Logo */}
              <div className="space-y-1">
                <FormLabel className="text-sm text-gray-500 font-plus-jakarta">Upload Logo (optional)</FormLabel>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        form.setValue("logo", e.target.files[0])
                        document.getElementById("file-name")!.textContent = e.target.files[0].name
                      }
                    }}
                    accept="image/*"
                  />
                  <div className="flex-1 border-b border-gray-300 py-1 h-8 flex items-center w-full">
                    <span id="file-name" className="text-gray-500 truncate text-sm">
                      {form.watch("logo")?.name || "No file selected"}
                    </span>
                  </div>
                  <Button
                    type="button"
                    className="bg-dark-blue hover:bg-medium-blue h-8 px-3 text-sm"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    Upload
                  </Button>
                </div>
              </div>

              {/* Verification Button */}
              <FormField
                control={form.control}
                name="verified"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <VerificationButton
                        onVerificationComplete={handleVerificationComplete}
                        isVerified={isVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Accept Terms */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                        className="border-gray-300 h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <div className="text-xs sm:text-sm text-gray-600 leading-tight sm:leading-normal">
                      <FormLabel className="font-normal flex flex-wrap gap-x-1">
                        I accept the{" "}
                        <Link
                          href="/terms-and-conditions"
                          className="text-dark-blue hover:underline whitespace-nowrap"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-dark-blue hover:underline whitespace-nowrap"
                        >
                          Privacy Policy
                        </Link>

                      </FormLabel>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-dark-blue hover:bg-medium-blue text-white h-10 text-sm font-plus-jakarta"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <div className="text-center text-gray-500 font-plus-jakarta">
                Already have an account?{" "}
                <Link href="/signin" className="text-dark-blue hover:underline">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </div>

        {/* Illustration - Show only on lg+ */}
        <div className="hidden lg:block absolute bottom-0 left-1/4 transform -translate-x-1/4 z-50 pointer-events-none">
          <Image
            src="/images/signup/background.png"
            alt="Illustration"
            width={500}
            height={400}
            className="object-contain ml-[-126px] w-[660px] mb-[-14px]"
          />
        </div>
      </div>
    </div>
  )
}
