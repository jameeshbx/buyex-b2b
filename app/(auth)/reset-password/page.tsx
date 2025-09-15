"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Lock, Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      // Redirect to login page with success message
      router.push("/signin?message=Password reset successful. Please login with your new password.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <div className="text-center">
            <Image src="/buyex-main-logo.png" alt="Buyex Forex Logo" width={185} height={60} className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
            <a
              href="/forgot-password"
              className="inline-block bg-dark-blue hover:bg-custom-green text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
            >
              Request New Reset Link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <Image src="/buyex-main-logo.png" alt="Buyex Forex Logo" width={185} height={60} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800">Reset Your Password</h1>
          <p className="text-gray-600 mt-2">Please enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter new password"
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-dark-blue focus:border-transparent ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Confirm new password"
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-dark-blue hover:bg-custom-green text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-dark-blue to-light-blue flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <div className="text-center">
            <Image src="/buyex-main-logo.png" alt="Buyex Forex Logo" width={185} height={60} className="mx-auto mb-6" />
            <div className="h-5 w-5 border-2 border-dark-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
