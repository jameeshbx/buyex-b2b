"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import type { UserFormData, UserType } from "@/lib/types"

const formSchema = z
  .object({
    userType: z.enum(["Admin", "Staff", "Agent"]),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    agentRate: z
      .number()
      .optional()
      .refine((val) => val === undefined || (val >= 0 && val <= 100), {
        message: "Agent rate must be between 0 and 100",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.userType === "Agent" && (data.agentRate === undefined || data.agentRate < 0 || data.agentRate > 100)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Agent rate is required and must be between 0 and 100 for Agent users",
        path: ["agentRate"],
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

interface UserFormProps {
  onAddUser: (user: UserFormData) => Promise<void>
}

export function UserForm({ onAddUser }: UserFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean
    message: string
  }>({
    open: false,
    message: "",
  })
  const [, setSelectedUserType] = useState<UserType>("Admin")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "Admin",
      name: "",
      email: "",
      agentRate: undefined,
    },
  })

  const userType = watch("userType")

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      setError(null)
      await onAddUser({
        userType: data.userType,
        name: data.name,
        email: data.email,
        agentRate: data.userType === "Agent" ? data.agentRate : undefined,
        userId: "", // This will be set by the API response
      })
      // Reset form on success
      reset()
      // Show success popup
      setSuccessDialog({
        open: true,
        message: "User created successfully! An invitation email with login details has been sent.",
      })
    } catch (err: unknown) {
      console.error("Error creating user:", err)
      const axiosError = err as {
        response?: {
          data?: {
            error?: string
          }
        }
      }
      setError(axiosError?.response?.data?.error || "Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const handleUserTypeChange = (value: UserType) => {
    setSelectedUserType(value)
    setValue("userType", value)
    if (value !== "Agent") {
      setValue("agentRate", undefined)
    }
  }

  return (
    <>
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="userType">Usertype</Label>
              <Select defaultValue="Admin" onValueChange={handleUserTypeChange}>
                <SelectTrigger id="userType" className="w-full">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && <p className="text-red-500 text-xs">{errors.userType.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter user name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input id="email" type="email" placeholder="Enter email ID" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            {userType === "Agent" && (
              <div className="space-y-2">
                <Label htmlFor="agentRate">Agent Rate</Label>
                <Input
                  id="agentRate"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter agent rate"
                  {...register("agentRate", {
                    valueAsNumber: true,
                  })}
                />
                {errors.agentRate && <p className="text-red-500 text-xs">{errors.agentRate.message}</p>}
              </div>
            )}
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-[#004976] hover:bg-[#003a5e]" disabled={loading}>
                {loading ? "Creating..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Success Dialog remains the same */}
      <Dialog open={successDialog.open} onOpenChange={(open) => setSuccessDialog({ open, message: "" })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <DialogTitle className="text-green-800">Success!</DialogTitle>
                <DialogDescription className="text-green-600">{successDialog.message}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setSuccessDialog({ open: false, message: "" })}
              className="bg-[#004976] hover:bg-[#003a5e] w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
