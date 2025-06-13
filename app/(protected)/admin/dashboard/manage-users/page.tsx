"use client"

import { useState, useMemo, useEffect } from "react"
import axios from "axios"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PencilIcon, ChevronUpIcon, ChevronDownIcon, FilterIcon, SearchIcon } from "lucide-react"
import { Topbar } from "../../(components)/Topbar"
import { pagesData } from "@/data/navigation"

interface StaffMember {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MANAGER"
  status: boolean
  createdAt: string
}

type SortField = keyof StaffMember
type SortDirection = "asc" | "desc"

export default function ManageUsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [staffData, setStaffData] = useState<StaffMember[]>([])
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
  const [pendingToggle, setPendingToggle] = useState<{ id: string; currentStatus: boolean; name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Dropdown state and logic for user types
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedUserTypes, setSelectedUserTypes] = useState<string[]>([])
  const userTypes = [
    { value: "agents", label: "Agents" },
    { value: "forex-partners", label: "Forex partners" },
    { value: "staffs", label: "Staffs" },
    { value: "sub-agents", label: "Sub agents" },
  ]

  const handleUserTypeChange = (value: string) => {
    setSelectedUserTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const itemsPerPage = 4

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/users')
        setStaffData(response.data)
      } catch (err) {
        setError("Failed to fetch users")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const sortedData = useMemo(() => {
    let filteredData = staffData

    // Apply search filter
    if (searchTerm) {
      filteredData = staffData.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortDirection === "asc" ? comparison : -comparison
      }

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortDirection === "asc" ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1)
      }

      if (sortField === "createdAt") {
        const dateA = new Date(aValue as string)
        const dateB = new Date(bValue as string)
        return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      }

      return 0
    })
  }, [staffData, sortField, sortDirection, searchTerm])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(currentItems.map((item) => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleStatusToggle = (id: string, currentStatus: boolean, name: string) => {
    setPendingToggle({ id, currentStatus, name })
    setToggleDialogOpen(true)
  }

  const confirmStatusToggle = async () => {
    if (!pendingToggle) return
    
    try {
      const newStatus = !pendingToggle.currentStatus
      
      // Update in the database
      await axios.put(`/api/users?id=${pendingToggle.id}`, {
        status: newStatus
      })

      // Update local state
      setStaffData(prevData =>
        prevData.map(staff =>
          staff.id === pendingToggle.id
            ? { ...staff, status: newStatus }
            : staff
        )
      )
      
      setToggleDialogOpen(false)
      setPendingToggle(null)
    } catch (err) {
      console.error("Error updating user status:", err)
      setError("Failed to update user status")
    }
  }

  const cancelStatusToggle = () => {
    setToggleDialogOpen(false)
    setPendingToggle(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEditUser = async (userId: string) => {
    try {
      // Fetch user data for editing
      const response = await axios.get(`/api/users?id=${userId}`)
      console.log("User data for editing:", response.data)
      // Here you would typically open a modal or form with the user data
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Failed to fetch user data")
    }
  }


  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col ml-1">
          <ChevronUpIcon className="h-3 w-3 text-gray-400" />
          <ChevronDownIcon className="h-3 w-3 text-gray-400 -mt-1" />
        </div>
      )
    }

    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 ml-1 text-gray-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-600" />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e5a73]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1e5a73] text-white px-4 py-2 rounded-md hover:bg-[#164a5e] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-gray-50">
        <Topbar pageData={pagesData.manageUsers} />
      </div>

      <main className="p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Controls - Responsive Layout */}
          <div className="mb-4 sm:mb-6 space-y-4">
            <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 lg:gap-4">
              {/* Filter Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* User Type Filter Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto appearance-none bg-[#1e5a73] hover:bg-[#164a5e] text-white border-0 rounded-md pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e5a73] focus:ring-offset-2 min-w-[160px] flex items-center justify-between transition-colors duration-200"
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <FilterIcon className="h-4 w-4 mr-2 sm:hidden" />
                    <span className="truncate text-left">
                      {selectedUserTypes.length === 0 ? "Select user type" : selectedUserTypes.join(", ")}
                    </span>
                    <span className="ml-2 pointer-events-none">
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-3 min-w-[220px] left-0 right-0">
                      <div className="space-y-1">
                        {userTypes.map((type) => (
                          <label
                            key={type.value}
                            className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedUserTypes.includes(type.value)}
                                onChange={() => handleUserTypeChange(type.value)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                  selectedUserTypes.includes(type.value)
                                    ? "bg-[#1e5a73] border-[#1e5a73]"
                                    : "border-gray-300 bg-white hover:border-[#1e5a73]"
                                }`}
                              >
                                {selectedUserTypes.includes(type.value) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className="ml-3 text-gray-700 font-medium">{type.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="px-4 pt-3 border-t border-gray-100 mt-3 flex justify-end">
                        <button
                          onClick={() => setDropdownOpen(false)}
                          className="bg-[#1e5a73] hover:bg-[#164a5e] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Section */}
              <div className="relative w-full sm:w-80 lg:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 sm:hidden" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-3 pr-10 py-2.5 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e5a73] focus:border-[#1e5a73] border border-gray-300"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 hidden sm:block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" data-testid="staff-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left font-jakarta">
                      <Checkbox
                        checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                        onChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 font-jakarta"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center font-jakarta">
                        Staff ID
                        <SortIcon field="id" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 font-jakarta"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center font-jakarta">
                        Staff name
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 font-jakarta"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center font-jakarta">
                        Email
                        <SortIcon field="email" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 font-jakarta"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center font-jakarta">
                        Status
                        <SortIcon field="status" />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider font-jakarta"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((staff, index) => (
                    <tr key={staff.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap font-jakarta">
                        <Checkbox
                          checked={selectedItems.includes(staff.id)}
                          onChange={() => handleSelectItem(staff.id)}
                          aria-label={`Select ${staff.name}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 font-jakarta">
                        {staff.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-jakarta">
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-jakarta">{staff.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-jakarta">
                        <div className="relative">
                          <div className="cursor-pointer">
                            <div
                              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e5a73] focus:ring-offset-2"
                              style={{
                                backgroundColor: staff.status ? "#1e5a73" : "#e5e7eb",
                              }}
                              onClick={() => handleStatusToggle(staff.id, staff.status, staff.name)}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  staff.status ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Status Toggle Dialog */}
                          {toggleDialogOpen && pendingToggle?.id === staff.id && (
                            <div className="absolute top-8 left-0 z-50 bg-white border border-gray-200 shadow-xl rounded-lg p-4 min-w-[300px]">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-jakarta">
                                  {pendingToggle?.currentStatus ? "Deactivate" : "Activate"} Staff Member
                                </h3>
                                <p className="text-sm text-gray-600 font-jakarta">
                                  Are you sure you want to{" "}
                                  {pendingToggle?.currentStatus ? "deactivate" : "activate"}{" "}
                                  <strong className="font-jakarta">{pendingToggle?.name}</strong>? This will change
                                  their access status.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={cancelStatusToggle}
                                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-jakarta"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={confirmStatusToggle}
                                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors font-jakarta ${
                                    pendingToggle?.currentStatus
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {pendingToggle?.currentStatus ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-jakarta">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full p-2 font-jakarta"
                          onClick={() => handleEditUser(staff.id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only font-jakarta">Edit</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="lg:hidden">
              <div className="p-4 space-y-4">
                {currentItems.map((staff) => (
                  <div key={staff.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedItems.includes(staff.id)}
                          onChange={() => handleSelectItem(staff.id)}
                          aria-label={`Select ${staff.name}`}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 font-jakarta">{staff.name}</h3>
                          <p className="text-sm text-gray-500 font-jakarta">ID: {staff.id}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full p-2 font-jakarta"
                        onClick={() => handleEditUser(staff.id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-600 font-jakarta">
                        <span className="font-medium">Email:</span> {staff.email}
                      </p>
                      <p className="text-sm text-gray-600 font-jakarta">
                        <span className="font-medium">Role:</span> {staff.role}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 font-jakarta">Status</span>
                      <div className="relative">
                        <div className="cursor-pointer">
                          <div
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e5a73] focus:ring-offset-2"
                            style={{
                              backgroundColor: staff.status ? "#1e5a73" : "#e5e7eb",
                            }}
                            onClick={() => handleStatusToggle(staff.id, staff.status, staff.name)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                staff.status ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Mobile Status Toggle Dialog */}
                        {toggleDialogOpen && pendingToggle?.id === staff.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                            <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-full max-w-sm">
                              <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-jakarta">
                                  {pendingToggle?.currentStatus ? "Deactivate" : "Activate"} Staff Member
                                </h3>
                                <p className="text-sm text-gray-600 font-jakarta">
                                  Are you sure you want to{" "}
                                  {pendingToggle?.currentStatus ? "deactivate" : "activate"}{" "}
                                  <strong className="font-jakarta">{pendingToggle?.name}</strong>? This will change
                                  their access status.
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={cancelStatusToggle}
                                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-jakarta"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={confirmStatusToggle}
                                  className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors font-jakarta ${
                                    pendingToggle?.currentStatus
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-green-600 hover:bg-green-700"
                                  }`}
                                >
                                  {pendingToggle?.currentStatus ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsive Pagination */}
            <div className="bg-white px-3 sm:px-4 py-3 flex flex-col items-center justify-center border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm text-gray-700 text-center">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, sortedData.length)}</span> of{" "}
                  <span className="font-medium">{sortedData.length}</span> results
                </p>
              </div>

              <div className="flex items-center justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  <div className="hidden sm:flex">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNumber = i + 1
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === pageNumber
                              ? "bg-[#1e5a73] text-white border-[#1e5a73]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}

                    {totalPages > 5 && (
                      <>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === totalPages
                              ? "bg-[#1e5a73] text-white border-[#1e5a73]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Mobile: Show current page and total */}
                  <div className="sm:hidden flex items-center px-3 py-2 border-t border-b border-gray-300 bg-white">
                    <span className="text-xs font-medium text-gray-700">
                      {currentPage} of {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 sm:px-3 py-2 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}