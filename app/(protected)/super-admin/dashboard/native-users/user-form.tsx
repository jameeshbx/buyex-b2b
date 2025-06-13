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
import type { UserFormData, UserType } from "@/lib/types"
import axios from "axios"


const formSchema = z.object({
  userType: z.enum(["Admin", "Staff"]),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type FormValues = z.infer<typeof formSchema>

interface UserFormProps {
  onAddUser: (user: UserFormData) => Promise<void>;  // Callback to refresh the table
}

export function UserForm({ onAddUser }: UserFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "Admin",
      name: "",
      email: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)
      setError(null)

      // Send data to API endpoint
      const response = await axios.post('/api/users', {
        userType: data.userType,
        name: data.name,
        email: data.email,
        // Password will be generated on the server
      })

      if (response.status === 201) {
        // Reset form on success
        reset()
        // Refresh the table
        onAddUser({
          userType: data.userType,
          name: data.name,
          email: data.email,
          userId: ""
        })
        // Optionally show success message
        alert('User created successfully! An invitation email has been sent.')
      }
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
    setValue("userType", value)
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="userType">Usertype</Label>
            <Select
              defaultValue="Admin"
              onValueChange={handleUserTypeChange}
            >
              <SelectTrigger id="userType" className="w-full">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            {errors.userType && <p className="text-red-500 text-xs">{errors.userType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter user name"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email ID"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full bg-[#004976] hover:bg-[#003a5e]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}