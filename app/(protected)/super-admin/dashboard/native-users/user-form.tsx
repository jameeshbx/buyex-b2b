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
import type { UserType, User } from "@/lib/types"
import { users } from "@/data/native-users"

// Utility function moved from utils.ts
function generateUserId(userType: UserType, existingUsers: User[]): string {
  const prefix = userType === "Admin" ? "adm" : "stf"

  // Find the highest existing ID number for this user type
  const existingIds = existingUsers
    .filter((user) => user.userType === userType)
    .map((user) => {
      const match = user.userId.match(/\d+/)
      return match ? Number.parseInt(match[0], 10) : 0
    })

  const highestId = existingIds.length > 0 ? Math.max(...existingIds) : 0
  const nextId = highestId + 1

  // Format with leading zeros (e.g., 001, 012, 123)
  return `${prefix}${nextId.toString().padStart(3, "0")}`
}

const formSchema = z.object({
  userType: z.enum(["Admin", "Staff"]),
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type FormValues = z.infer<typeof formSchema>

interface UserFormProps {
  onAddUser: (user: FormValues) => void
}

export function UserForm({ onAddUser }: UserFormProps) {
  const [, setSelectedUserType] = useState<UserType>("Admin")
  const [previewUserId, setPreviewUserId] = useState(generateUserId("Admin", users))

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
      userId: "",
      name: "",
      email: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    const userData = {
      ...data,
      userId: previewUserId, // Use the current value from the input
    }
    onAddUser(userData)
    reset()
    // Reset the preview user ID after submission
    setSelectedUserType("Admin")
    setPreviewUserId(generateUserId("Admin", users))
  }

  const handleUserTypeChange = (value: UserType) => {
    setSelectedUserType(value)
    setValue("userType", value)
    setPreviewUserId(generateUserId(value, users))
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Row */}
          <div className="space-y-2">
            <Label htmlFor="userType">Usertype</Label>
            <Select
              defaultValue="Admin"
              onValueChange={(value: UserType) => handleUserTypeChange(value)}
              data-cy="usertype-select"
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
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={previewUserId}
              onChange={(e) => setPreviewUserId(e.target.value)}
              className="w-full"
              data-cy="userid-input"
            />
            <p className="text-xs text-gray-500">Auto-generated or enter manually</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter user name" {...register("name")} data-cy="name-input" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          {/* Second Row */}
          <div className="space-y-2">
            <Label htmlFor="email">Email ID</Label>
            <Input id="email" type="email" placeholder="Enter email ID" {...register("email")} data-cy="email-input" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#004976] hover:bg-[#003a5e]" data-cy="submit-button">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
