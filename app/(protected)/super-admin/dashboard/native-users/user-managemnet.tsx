"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { UserForm } from "./user-form"
import { UserTable } from "./user-table"
import type { User, UserType, UserFormData } from "@/lib/types"

// Define the ApiUser type based on the expected API response
type ApiUser = {
  id: string
  name: string
  email: string
  status: boolean
  createdAt: string
  role: string
}

export default function UserManagement() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUserType, setFilteredUserType] = useState<UserType | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/users?role=${session?.user?.role}`)
        const transformedUsers = response.data.map((apiUser: ApiUser) => ({
          id: apiUser.id,
          userId: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          status: apiUser.status,
          date: apiUser.createdAt,
          userType: apiUser.role === "ADMIN" ? "Admin" : "Staff",
        }))
        setUsers(transformedUsers)
      } catch (error) {
        setError("Failed to fetch users")
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role) {
      fetchUsers()
    }
  }, [session])

  const handleAddUser = async (user: UserFormData) => {
    try {
      const response = await axios.post("/api/users", {
        userType: user.userType,
        name: user.name,
        email: user.email,
        status: true,
      })

      if (response.status === 201) {
        const newUser = {
          id: response.data.user.id,
          userId: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          status: response.data.user.status,
          date: response.data.user.createdAt,
          userType: response.data.user.role === "ADMIN" ? ("Admin" as UserType) : ("Staff" as UserType),
        }

        setUsers([newUser, ...users])
      }
    } catch (err) {
      console.error("Error adding user:", err)
      setError("Failed to add user")
      throw err // Re-throw to let the form handle the error
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const user = users.find((u) => u.id === id)
      if (!user) return

      const response = await axios.put(`/api/users?id=${id}`, {
        status: !user.status,
      })

      if (response.status === 200) {
        setUsers(users.map((u) => (u.id === id ? { ...u, status: !u.status } : u)))
      }
    } catch (error) {
      console.error("Error toggling user status:", error)
      setError("Failed to update user status")
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`/api/users?id=${id}`)

      if (response.status === 200) {
        setUsers(users.filter((u) => u.id !== id))
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Failed to delete user")
    }
  }

  const handleEditUser = async (id: string, userData: { name: string; email: string; userType: UserType }) => {
    try {
      const response = await axios.put(`/api/users?id=${id}`, {
        name: userData.name,
        email: userData.email,
        role: userData.userType === "Admin" ? "ADMIN" : "MANAGER",
      })

      if (response.status === 200) {
        setUsers(
          users.map((u) =>
            u.id === id
              ? {
                ...u,
                name: userData.name,
                email: userData.email,
                userType: userData.userType,
              }
              : u,
          ),
        )
        return true // Success
      }
      return false
    } catch (error) {
      console.error("Error editing user:", error)
      setError("Failed to update user")
      return false
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">
            ×
          </button>
        </div>
      )}

      <UserForm onAddUser={handleAddUser} />
      <UserTable
        users={users}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
        filteredUserType={filteredUserType}
        setFilteredUserType={setFilteredUserType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="text-xs text-gray-500 text-center pt-4">© 2025, Made by BuyExchange.</div>
    </div>
  )
}
