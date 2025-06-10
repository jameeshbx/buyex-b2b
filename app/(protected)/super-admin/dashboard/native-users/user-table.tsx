"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { User, UserType } from "@/lib/types"
import { ChevronDown, ChevronUp, Search, Pencil, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility functions moved from utils.ts
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "short" })
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

type SortField = "date" | "userType" | "userId" | "name" | "email"
type SortDirection = "asc" | "desc"

interface UserTableProps {
  users: User[]
  onToggleStatus: (id: string) => void
  onDeleteUser: (id: string) => void
  filteredUserType: UserType | "all"
  setFilteredUserType: (type: UserType | "all") => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function UserTable({
  users,
  onToggleStatus,
  onDeleteUser,
  filteredUserType,
  setFilteredUserType,
  searchQuery,
  setSearchQuery,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
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

  const itemsPerPage = 10

  // Filter users based on search and user type
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase())

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
      case "userId":
        aValue = a.userId.toLowerCase()
        bValue = b.userId.toLowerCase()
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

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1
    }
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
    setCurrentPage(1) // Reset to first page when sorting
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

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
  }

  const handleSelectAllRows = () => {
    if (selectedRows.length === currentUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentUsers.map((user) => user.id))
    }
  }

  const handleApplyFilters = () => {
    if (tempFilters.admin && tempFilters.staff) {
      setFilteredUserType("all")
    } else if (tempFilters.admin) {
      setFilteredUserType("Admin")
    } else if (tempFilters.staff) {
      setFilteredUserType("Staff")
    } else {
      // If neither is selected, show all
      setFilteredUserType("all")
    }
    setFilterOpen(false)
    setCurrentPage(1) // Reset to first page when filtering
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

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages && !pages.includes(i)) {
          pages.push(i)
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        pages.push("...")
      }

      // Show last page
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
              data-cy="filter-button"
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
                    data-cy="admin-filter-checkbox"
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
                    data-cy="staff-filter-checkbox"
                  />
                  <label htmlFor="staff-filter" className="text-sm font-medium">
                    Staff
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleApplyFilters}
                  className="bg-[#004976] hover:bg-[#003a5e]"
                  data-cy="apply-filter-button"
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Reset to first page when searching
            }}
            data-cy="search-input"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === currentUsers.length && currentUsers.length > 0}
                    onChange={handleSelectAllRows}
                    aria-label="Select all"
                    data-cy="select-all"
                  />
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("date")}
                    data-cy="sort-date"
                  >
                    Date {getSortIcon("date")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("userType")}
                    data-cy="sort-usertype"
                  >
                    Usertype {getSortIcon("userType")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("userId")}
                    data-cy="sort-userid"
                  >
                    User ID {getSortIcon("userId")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("name")}
                    data-cy="sort-name"
                  >
                    Name {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    className="flex items-center gap-1 hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleSort("email")}
                    data-cy="sort-email"
                  >
                    Email ID {getSortIcon("email")}
                  </button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                currentUsers.map((user) => (
                  <TableRow key={user.id} data-cy={`user-row-${user.id}`} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(user.id)}
                        onChange={() => handleSelectRow(user.id)}
                        aria-label={`Select ${user.name}`}
                        data-cy={`select-user-${user.id}`}
                      />
                    </TableCell>
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
                    <TableCell className="font-mono text-sm">{user.userId}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors",
                          user.status ? "bg-[#004976]" : "bg-gray-300",
                        )}
                        onClick={() => handleStatusToggle(user.id, user.name)}
                        data-cy={`status-toggle-${user.id}`}
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
                          data-cy={`edit-user-${user.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={() => onDeleteUser(user.id)}
                          data-cy={`delete-user-${user.id}`}
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
                data-cy="prev-page"
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
                      data-cy={`page-${page}`}
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
                data-cy="next-page"
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
        <DialogContent data-cy="status-toggle-dialog" className="sm:max-w-md">
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
              data-cy="cancel-status-toggle"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusToggle}
              className="bg-[#004976] hover:bg-[#003a5e] w-full sm:w-auto"
              data-cy="confirm-status-toggle"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
