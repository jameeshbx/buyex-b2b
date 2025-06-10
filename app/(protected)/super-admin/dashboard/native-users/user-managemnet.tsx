"use client"

import { useState } from "react"
import { UserForm } from "./user-form"
import { UserTable } from "./user-table"
import type { User, UserType, UserFormData } from "@/lib/types"
import { users as initialUsers } from "@/data/native-users"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [filteredUserType, setFilteredUserType] = useState<UserType | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddUser = (user: UserFormData) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.userId, // Use the provided userId instead of generating
      date: new Date().toISOString(),
      userType: user.userType,
      name: user.name,
      email: user.email,
      status: true, // Default to active
    }

    setUsers([newUser, ...users])
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, status: !user.status } : user)))
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const filteredUsers = users.filter((user) => {
    const matchesType = filteredUserType === "all" || user.userType === filteredUserType
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesType && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <UserForm onAddUser={handleAddUser} />
      <UserTable
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        filteredUserType={filteredUserType}
        setFilteredUserType={setFilteredUserType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="text-xs text-gray-500 text-center pt-4">© 2025, Made by BuyExchange.</div>
    </div>
  )
}
