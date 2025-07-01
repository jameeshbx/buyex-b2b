"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, UserType } from "@/lib/types"
import { ChevronDown, ChevronUp, Search, Pencil, Trash2, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

type SortField = "date" | "userType" | "name" | "email"
type SortDirection = "asc" | "desc"

const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  userType: z.enum(["Admin", "Staff"]),
})

type EditUserFormData = z.infer<typeof editUserSchema>

interface UserTableProps {
  users: User[]
  onToggleStatus: (id: string) => void
  onDeleteUser: (id: string) => void
  onEditUser: (id: string, userData: { name: string; email: string; userType: UserType }) => Promise<boolean>
  filteredUserType: UserType | "all"
  setFilteredUserType: (type: UserType | "all") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function UserTable({
  users,
  onToggleStatus,
  onDeleteUser,
  onEditUser,
  filteredUserType,
  setFilteredUserType,
  searchQuery,
  setSearchQuery,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [tempFilters, setTempFilters] = useState({
    admin: filteredUserType === "all" || filteredUserType === "Admin",
    staff: filteredUserType === "all" || filteredUserType === "Staff",
  })
  const [statusToggleDialog, setStatusToggleDialog] = useState<{
    open: boolean
    userId: string
    userName: string
  }>({
    open: false,
    userId: "",
    userName: "",
  })
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    user: User | null
  }>({
    open: false,
    user: null,
  })
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean
    message: string
  }>({
    open: false,
    message: "",
  })
  const [selectedUserType, setSelectedUserType] = useState<UserType>("Admin")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  })

  const itemsPerPage = 10

  // Filter users based on search and user type
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesType = false
    if (filteredUserType === "all") {
      matchesType = true
    } else if (filteredUserType === "Admin") {
      matchesType = user.userType === "Admin"
    } else if (filteredUserType === "Staff") {
      matchesType = user.userType === "Staff"
    }

    return matchesSearch && matchesType
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortField) {
      case "date":
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
        break
      case "userType":
        aValue = a.userType.toLowerCase()
        bValue = b.userType.toLowerCase()
        break
      case "name":
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case "email":
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = sortedUsers.slice(startIndex, endIndex)
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-gray-700" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-700" />
    )
  }

  const handleApplyFilters = () => {
    if (tempFilters.admin && tempFilters.staff) {
      setFilteredUserType("all")
    } else if (tempFilters.admin) {
      setFilteredUserType("Admin")
    } else if (tempFilters.staff) {
      setFilteredUserType("Staff")
    } else {
      setFilteredUserType("all")
    }
    setFilterOpen(false)
    setCurrentPage(1)
  }

  const handleStatusToggle = (userId: string, userName: string) => {
    setStatusToggleDialog({
      open: true,
      userId,
      userName,
    })
  }

  const confirmStatusToggle = () => {
    onToggleStatus(statusToggleDialog.userId)
    setStatusToggleDialog({ open: false, userId: "", userName: "" })
  }

  const handleEditClick = (user: User) => {
    setEditDialog({ open: true, user })
    setSelectedUserType(user.userType)
    setTimeout(() => {
      reset({
        name: user.name,
        email: user.email,
        userType: user.userType,
      })
    }, 0)
  }

  const onEditSubmit = async (data: EditUserFormData) => {
    if (!editDialog.user) return

    const success = await onEditUser(editDialog.user.id, data)

    if (success) {
      setEditDialog({ open: false, user: null })
      setSuccessDialog({
        open: true,
        message: `User "${data.name}" has been updated successfully!`,
      })
      reset()
    }
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push("...")
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages && !pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-[#004976] text-white hover:bg-[#003a5e] w-full sm:w-auto"
            >
              Filter by usertype <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="admin-filter"
                    checked={tempFilters.admin}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, admin: (e.target as HTMLInputElement).checked }))}
                  />
                  <label htmlFor="admin-filter" className="text-sm font-medium">
                    Admin
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="staff-filter"
                    checked={tempFilters.staff}
                    onChange={(e) => setTempFilters((prev) => ({ ...prev, staff: (e.target as HTMLInputElement).checked }))}
                  />
                  <label htmlFor="staff-filter" className="text-sm font-medium">
                    Staff
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={handleApplyFilters} className="bg-[#004976] hover:bg-[#003a5e]">
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email"
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    Date {getSortIcon("date")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("userType")}
                  >
                    User Type {getSortIcon("userType")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(user.date)}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          user.userType === "Admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800",
                        )}
                      >
                        {user.userType}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                          user.status ? "bg-[#004976]" : "bg-gray-300",
                        )}
                        onClick={() => handleStatusToggle(user.id, user.name)}
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full bg-white transform transition-transform",
                            user.status ? "translate-x-6" : "translate-x-0",
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                          onClick={() => handleEditClick(user)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={() => onDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center py-6 border-t bg-white">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-sm px-3 py-1"
              >
                Prev
              </Button>

              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-1 text-sm text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={cn(
                        "text-sm px-3 py-1 min-w-[36px]",
                        currentPage === page ? "bg-[#004976] hover:bg-[#003a5e] text-white" : "hover:bg-gray-50",
                      )}
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-sm px-3 py-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Status Toggle Confirmation Dialog */}
      <Dialog
        open={statusToggleDialog.open}
        onOpenChange={(open) => setStatusToggleDialog({ open, userId: "", userName: "" })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status for user &quot;{statusToggleDialog.userName}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setStatusToggleDialog({ open: false, userId: "", userName: "" })}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={confirmStatusToggle} className="bg-[#004976] hover:bg-[#003a5e] w-full sm:w-auto">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => {
          setEditDialog({ open, user: null })
          if (!open) {
            reset()
            setSelectedUserType("Admin")
          }
        }}
      >
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user information below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="edit-userType">User Type</Label>
              <Select
                value={selectedUserType}
                onValueChange={(value: UserType) => {
                  setSelectedUserType(value)
                  setValue("userType", value)
                }}
              >
                <SelectTrigger id="edit-userType" className="z-10">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && <p className="text-red-500 text-xs">{errors.userType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" placeholder="Enter user name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" placeholder="Enter email address" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditDialog({ open: false, user: null })
                  reset()
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#004976] hover:bg-[#003a5e] w-full sm:w-auto"
              >
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
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
    </div>
  )
}
