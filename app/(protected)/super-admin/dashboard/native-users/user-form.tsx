"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
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
import axios from "axios"

// Define the Organisation interface
interface Organisation {
  id: string
  name: string
  slug: string
  email: string
  commission: number
  phoneNumber: string
  logoUrl?: string
  settings?: Record<string, string>
  createdAt: string
  updatedAt: string
}

// Define the currency options
const CURRENCIES = ["EUR", "AED", "AUD", "USD", "CAD", "CHF", "GBP", "NZD", "SEK","HKD","SGD","ZAR"] as const

// Schema for rates object with all currencies
const ratesSchema = z
  .record(
    z.enum(CURRENCIES),
    z.number().min(0, { message: "Rate must be at least 0" }).max(100, { message: "Rate cannot exceed 100" }),
  )
  .refine((rates) => Object.values(rates).every((rate) => rate !== undefined), {
    message: "All currency rates are required",
  })

const formSchema = z
  .object({
    userType: z.enum(["Admin", "Staff", "Agent"]),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    agentRates: ratesSchema.optional(),
    buyexRates: ratesSchema.optional(),
    forexPartner: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === "Agent") {
      // Validate agent rates
      if (!data.agentRates || Object.keys(data.agentRates).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Agent rates are required for Agent users",
          path: ["agentRates"],
        })
      }

      // Validate buyex rates
      if (!data.buyexRates || Object.keys(data.buyexRates).length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Buyex rates are required for Agent users",
          path: ["buyexRates"],
        })
      }

      if (!data.forexPartner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Forex Partner is required for Agent users",
          path: ["forexPartner"],
        })
      }
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
  const [organisations, setOrganisations] = useState<Organisation[]>([])

  const [selectedCurrency, setSelectedCurrency] = useState<(typeof CURRENCIES)[number]>("USD")

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
      agentRates: CURRENCIES.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {}),
      buyexRates: CURRENCIES.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {}),
      forexPartner: "",
    },
  })

  const userType = watch("userType")

  // Fetch organisations on component mount
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const response = await axios.get("/api/organisations")
        setOrganisations(response.data)
      } catch (error) {
        console.error("Error fetching organisations:", error)
      }
    }

    fetchOrganisations()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setLoading(true)
      setError(null)

      // Prepare the user data
      const userData: UserFormData = {
        userType: data.userType,
        name: data.name,
        email: data.email,
        userId: "", // This will be set by the API response
      }

      // Add agent-specific fields if user type is Agent
      if (data.userType === "Agent") {
        // Find Buy Exchange organization
        const buyExchange = organisations.find((org) => org.name === "Buy Exchange")
        if (buyExchange) {
          userData.organisationId = buyExchange.id
        }

        userData.forexPartner = data.forexPartner

        // Use the rates from the form
        userData.agentRates = data.agentRates || {}
        userData.buyexRates = data.buyexRates || {}
      }

      await onAddUser(userData)
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

    if (value === "Agent") {
      // Initialize all rates to 0 for all currencies
      const defaultRates = CURRENCIES.reduce((acc, curr) => ({ ...acc, [curr]: 0 }), {})
      setValue("agentRates", defaultRates)
      setValue("buyexRates", { ...defaultRates })
    } else {
      setValue("agentRates", undefined)
      setValue("buyexRates", undefined)
      setValue("forexPartner", undefined)
    }
  }

  const handleRateChange = (type: "agent" | "buyex", value: string | number) => {
    const fieldName = type === "agent" ? "agentRates" : "buyexRates"
    const currentRates = watch(fieldName) || {}
    
    // Allow empty string during editing
    if (value === "") {
      setValue(
        fieldName,
        {
          ...currentRates,
          [selectedCurrency]: "",
        },
        { shouldValidate: false },
      )
      return
    }

    // Parse the number if it's a string
    const numValue = typeof value === "string" ? parseFloat(value) : value
    
    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      setValue(
        fieldName,
        {
          ...currentRates,
          [selectedCurrency]: numValue,
        },
        { shouldValidate: true },
      )
    }
  }

  const handleBlur = (type: "agent" | "buyex") => {
    const fieldName = type === "agent" ? "agentRates" : "buyexRates"
    const currentValue = watch(`${fieldName}.${selectedCurrency}` as const)
    
    // If the field is empty on blur, set it to 0
    const isEmpty = (value: unknown): boolean => {
      return value === undefined || value === null || 
             (typeof value === 'string' && value.trim() === '') ||
             (typeof value === 'number' && isNaN(value));
    };
    
    if (isEmpty(currentValue)) {
      const currentRates = watch(fieldName) || {}
      setValue(
        fieldName as 'agentRates' | 'buyexRates',
        {
          ...(currentRates as Record<string, number>),
          [selectedCurrency]: 0,
        } as const,
        { shouldValidate: true },
      )
    }
    
    // No need to update editing state anymore
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
            {/* Organisation field removed - using Buy Exchange as default */}
            {userType === "Agent" && (
              <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Agent Settlement Rates */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Agent Settlement Rates</Label>
                    <div className="relative">
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
                        <Select value={selectedCurrency} onValueChange={(value: string) => setSelectedCurrency(value as typeof CURRENCIES[number])}>
                          <SelectTrigger className="w-20 border-0 border-r border-gray-300 rounded-none bg-gray-50 text-xs font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={`agent-${currency}`} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0.00"
                          className="border-0 rounded-none flex-1 text-sm"
                          value={watch(`agentRates.${selectedCurrency}`) ?? ""}
                          onChange={(e) => handleRateChange("agent", e.target.value)}
                          onBlur={() => handleBlur("agent")}
                        />
                        <div className="px-3 py-2 bg-gray-50 border-l border-gray-300 text-xs text-gray-500 flex items-center">
                          INR
                        </div>
                      </div>
                    </div>
                    {errors.agentRates && <p className="text-red-500 text-xs">{errors.agentRates.message}</p>}
                  </div>

                  {/* Forex Partner */}
                  <div className="space-y-2">
                    <Label htmlFor="forexPartner" className="text-sm font-medium text-gray-700">
                      Forex Partner
                    </Label>
                    <Select onValueChange={(value) => setValue("forexPartner", value)}>
                      <SelectTrigger id="forexPartner" className="w-full border-gray-300 shadow-sm">
                        <SelectValue placeholder="Select partner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ebix Cash World Money Ltd">Ebix Cash World Money Ltd</SelectItem>
                        <SelectItem value="WSFX Global Pay Ltd">WSFX Global Pay Ltd</SelectItem>
                        <SelectItem value="NIUM Forex India Pvt Ltd">NIUM Forex India Pvt Ltd</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.forexPartner && <p className="text-red-500 text-xs">{errors.forexPartner.message}</p>}
                  </div>

                  {/* Buyex Rates */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Buyex Rates</Label>
                    <div className="relative">
                      <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm">
                        <Select value={selectedCurrency} onValueChange={(value: string) => setSelectedCurrency(value as typeof CURRENCIES[number])}>
                          <SelectTrigger className="w-20 border-0 border-r border-gray-300 rounded-none bg-gray-50 text-xs font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={`buyex-${currency}`} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0.00"
                          className="border-0 rounded-none flex-1 text-sm"
                          value={watch(`buyexRates.${selectedCurrency}`) ?? ""}
                          onChange={(e) => handleRateChange("buyex", e.target.value)}
                          onBlur={() => handleBlur("buyex")}
                        />
                        <div className="px-3 py-2 bg-gray-50 border-l border-gray-300 text-xs text-gray-500 flex items-center">
                          INR
                        </div>
                      </div>
                    </div>
                    {errors.buyexRates && <p className="text-red-500 text-xs">{errors.buyexRates.message}</p>}
                  </div>
                </div>
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
