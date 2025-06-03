"use client"

import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronUp, Search, Eye, Trash2, MoreVertical, PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { countries, existingReceivers } from "@/data/country-data"
import { Topbar } from "../../../(components)/Topbar"
import { pagesData } from "@/data/navigation"

interface Receiver {
  id: string
  name: string
  country: string
  address: string
  bankName: string
  bankCountry: string
  accountNo: string
  status: boolean
  createdBy?: string
  createdAt?: string
}

type SortField = keyof Receiver
type SortDirection = "asc" | "desc"

// Enhanced data with staff information
const enhancedReceivers: Receiver[] = existingReceivers.map((receiver, index) => ({
  ...receiver,
  createdBy: `Staff${String.fromCharCode(65 + (index % 10))}`, // StaffA, StaffB, etc.
  createdAt: `${9 + (index % 12)}:${20 + ((index * 5) % 40)}AM ${4 - (index % 5)} May`,
}))

export default function ReceiversTable() {
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [sortField, setSortField] = useState<SortField>("id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [activeStaffInfo, setActiveStaffInfo] = useState<string | null>(null)
  const [receivers, setReceivers] = useState<Receiver[]>(enhancedReceivers)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusToggleDialog, setStatusToggleDialog] = useState<{
    isOpen: boolean
    receiverId: string
    receiverName: string
    currentStatus: boolean
  }>({
    isOpen: false,
    receiverId: "",
    receiverName: "",
    currentStatus: false,
  })
  const itemsPerPage = 5

  // Close staff info dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveStaffInfo(null)
    if (activeStaffInfo) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [activeStaffInfo])
  const handleSort = (field: SortField) => {
    setSortField(field)
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortDirection("asc")
    }
    // Log the sort state to help debugging
    console.log(`Sorting by ${field} in ${sortDirection === "asc" ? "ascending" : "descending"} order`)
  }

  const handleToggleStatusRequest = (id: string, name: string, currentStatus: boolean) => {
    setStatusToggleDialog({
      isOpen: true,
      receiverId: id,
      receiverName: name,
      currentStatus,
    })
  }

  const handleConfirmStatusToggle = () => {
    const { receiverId } = statusToggleDialog
    setReceivers((prev) =>
      prev.map((receiver) => (receiver.id === receiverId ? { ...receiver, status: !receiver.status } : receiver)),
    )
    setStatusToggleDialog({
      isOpen: false,
      receiverId: "",
      receiverName: "",
      currentStatus: false,
    })
  }

  const handleCancelStatusToggle = () => {
    setStatusToggleDialog({
      isOpen: false,
      receiverId: "",
      receiverName: "",
      currentStatus: false,
    })
  }

  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((r) => r.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setReceivers((prev) => prev.filter((receiver) => receiver.id !== id))
      setSelectedRows((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  useEffect(() => {
    console.log("Sort state changed:", { sortField, sortDirection })
  }, [sortField, sortDirection])
  const filteredAndSortedData = useMemo(() => {
    console.log("Recalculating filtered and sorted data")
    let filtered = [...receivers]

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter((receiver) => receiver.country === selectedCountry)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((receiver) =>
        Object.values(receiver).some(
          (value) => value !== undefined && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }

    // Sort the data
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      // Handle null/undefined values
      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      // Handle boolean values (for status field)
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        const aNum = aValue ? 1 : 0
        const bNum = bValue ? 1 : 0
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum
      }

      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()

      // Try to parse numbers
      const aNum = !isNaN(Number(aString)) ? Number(aString) : null
      const bNum = !isNaN(Number(bString)) ? Number(bString) : null

      // If both values are numeric, compare as numbers
      if (aNum !== null && bNum !== null) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum
      }

      // Default string comparison
      const compareResult = aString.localeCompare(bString)
      return sortDirection === "asc" ? compareResult : -compareResult
    })

    console.log("Sorted data:", filtered.slice(0, 3)) // Log first 3 items
    return filtered
  }, [receivers, selectedCountry, searchTerm, sortField, sortDirection])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedData, currentPage])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCountry, searchTerm])
  const SortIcon = ({ field }: { field: SortField }) => {
    const isActive = sortField === field
    const isAsc = sortDirection === "asc"

    if (!isActive) {
      return (
        <ChevronDown className="ml-1 h-4 w-4 text-gray-400 opacity-50" data-testid={`sort-icon-${field}-neutral`} />
      )
    }
    return isAsc ? (
      <ChevronUp className="ml-1 h-4 w-4 text-blue-600 font-bold" data-testid={`sort-icon-${field}-asc`} />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 text-blue-600 font-bold" data-testid={`sort-icon-${field}-desc`} />
    )
  }

  const renderPagination = () => {
    if (totalPages <= 1) return []

    // For small number of pages, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // For larger number of pages, use ellipsis
    const pages = []

    // Always show first page
    pages.push(1)

    // If current page is close to the beginning
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5)
      pages.push("...")
      pages.push(totalPages)
    }
    // If current page is close to the end
    else if (currentPage >= totalPages - 3) {
      pages.push("...")
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    }
    // If current page is in the middle
    else {
      pages.push("...")
      pages.push(currentPage - 1, currentPage, currentPage + 1)
      pages.push("...")
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50" data-testid="receivers-table">
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.listReceivers} />
      </div>
      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={statusToggleDialog.isOpen} onOpenChange={handleCancelStatusToggle}>
        <DialogContent data-testid="status-toggle-dialog">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {statusToggleDialog.currentStatus ? "deactivate" : "activate"} the receiver &quot;
              {statusToggleDialog.receiverName}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelStatusToggle} data-testid="cancel-status-change">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusToggle}
              data-testid="confirm-status-change"
              className={
                statusToggleDialog.currentStatus ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }
            >
              {statusToggleDialog.currentStatus ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fixed Header Section */}
      <div className="sticky top-0 z-10">
        {/* Header with Filter and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4">
          <div className="relative w-full lg:w-auto">
            <DropdownMenu open={showCountryDropdown} onOpenChange={setShowCountryDropdown}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="bg-dark-blue hover:bg-[#003b61] text-white font-medium w-full lg:w-auto"
                  data-testid="country-filter-button"
                >
                  {selectedCountry ? `Filter by country: ${selectedCountry}` : "Filter by country"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 max-h-60 overflow-y-auto"
                data-testid="country-dropdown"
              >
                <DropdownMenuItem onClick={() => setSelectedCountry("")} data-testid="country-option-all">
                  All Countries
                </DropdownMenuItem>
                {countries.map((country) => (
                  <DropdownMenuItem
                    key={country.value}
                    onClick={() => setSelectedCountry(country.value)}
                    data-testid={`country-option-${country.value.toLowerCase()}`}
                  >
                    {country.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative w-full lg:w-auto">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full lg:w-64 bg-[#f5f8fa] border-gray-300"
              data-testid="search-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4 p-4" data-testid="mobile-view">
          {paginatedData.map((receiver) => (
            <div
              key={receiver.id}
              className={`bg-white rounded-lg p-4 border shadow-sm ${
                selectedRows.has(receiver.id) ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              data-testid={`mobile-card-${receiver.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#004d7f] border-gray-300 rounded focus:ring-[#004d7f]"
                    checked={selectedRows.has(receiver.id)}
                    onChange={() => handleRowSelect(receiver.id)}
                    data-testid={`mobile-checkbox-${receiver.id}`}
                  />
                </label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={receiver.status}
                    onCheckedChange={() => handleToggleStatusRequest(receiver.id, receiver.name, receiver.status)}
                    data-testid={`mobile-status-${receiver.id}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => handleDelete(receiver.id, receiver.name)}
                    data-testid={`mobile-delete-${receiver.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-700 p-1"
                    data-testid={`mobile-view-${receiver.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-gray-600 hover:text-gray-800"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("Three dot clicked for:", receiver.id)
                        setActiveStaffInfo(activeStaffInfo === receiver.id ? null : receiver.id)
                      }}
                      data-testid={`mobile-more-${receiver.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {activeStaffInfo === receiver.id && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 border"
                        data-testid={`staff-info-${receiver.id}`}
                      >
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {receiver.createdBy?.charAt(receiver.createdBy.length - 1)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">{receiver.createdBy}</div>
                              <div className="text-xs text-gray-500">{receiver.createdAt}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">                
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">ID</span>
                  <p className="font-bold text-gray-900">{receiver.id}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">Name</span>
                  <p className="font-bold text-gray-900">{receiver.name}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">Country</span>
                  <p className="text-gray-600">{receiver.country}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">Account No.</span>
                  <p className="font-bold text-gray-900">{receiver.accountNo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto bg-white mx-4 rounded-lg shadow-sm" data-testid="desktop-view">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-white border-b">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#004d7f] border-gray-300 rounded focus:ring-[#004d7f]"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    data-testid="select-all-checkbox"
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[120px]"
                  onClick={() => handleSort("id")}
                  data-testid="sort-header-id"
                >
                  <div  
                    className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("id")}
                    data-testid="sort-header-id-inner">
                    Receiver ID
                    <SortIcon field="id" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[180px]"
                  onClick={() => handleSort("name")}
                  data-testid="sort-header-name"
                >
                  <div 
                    className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("name")}
                    data-testid="sort-header-name-inner">
                    Name
                    <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[100px]"
                  onClick={() => handleSort("country")}
                  data-testid="sort-header-country"
                >
                  <div 
                    className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("country")}
                    data-testid="sort-header-country-inner"
                    >
                    Country
                    <SortIcon field="country" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[200px]"
                  onClick={() => handleSort("address")}
                  data-testid="sort-header-address"
                >
                  <div 
                    className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("address")}
                    data-testid="sort-header-address-inner">
                    Address
                    <SortIcon field="address" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[150px]"
                  onClick={() => handleSort("bankName")}
                  data-testid="sort-header-bankName"
                >
                  <div 
                    className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("bankName")}
                    data-testid="sort-header-bankName-inner"
                    >
                    Bank name
                    <SortIcon field="bankName" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[120px]"
                  onClick={() => handleSort("bankCountry")}
                  data-testid="sort-header-bankCountry"
                >
                  <div
                    className="flex items-center font-medium text-gray-700 font-jakarta text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("bankCountry")}
                    data-testid="sort-header-bankCountry-inner"
                    >
                    Bank country
                    <SortIcon field="bankCountry" />
                    </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[140px]"
                  onClick={() => handleSort("accountNo")}
                  data-testid="sort-header-accountNo"
                >
                    <div
                    className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer"
                    onClick={() => handleSort("accountNo")}
                    data-testid="sort-header-accountNo-inner"
                    >
                    Account No.
                    <SortIcon field="accountNo" />
                    </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[80px]"
                  onClick={() => handleSort("status")}
                  data-testid="sort-header-status"
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase">
                    Status
                  </div>
                </TableHead>
                <TableHead>
                  <div className="font-medium text-gray-700 text-xs font-jakarta min-w-[120px] uppercase">
                    Action
                  </div>
                  </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((receiver) => (
                <TableRow
                  key={receiver.id}
                  className={`${selectedRows.has(receiver.id) ? "bg-dark-blue" : "bg-[#f5f8fa]"} border-b-4 border-white hover:bg-gray-50`}
                  data-testid={`table-row-${receiver.id}`}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#004d7f] border-gray-300 rounded focus:ring-[#004d7f]"
                      checked={selectedRows.has(receiver.id)}
                      onChange={() => handleRowSelect(receiver.id)}
                      data-testid={`checkbox-${receiver.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium" data-testid={`cell-id-${receiver.id}`}>
                    <div className="text-gray-900 font-semibold">
                      {receiver.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium" data-testid={`cell-name-${receiver.id}`}>
                    <div className="text-gray-900 font-semibold">
                      {receiver.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600" data-testid={`cell-country-${receiver.id}`}>
                    {receiver.country}
                  </TableCell>
                  <TableCell className="text-gray-600" data-testid={`cell-address-${receiver.id}`}>
                    {receiver.address}
                  </TableCell>
                  <TableCell className="text-gray-600" data-testid={`cell-bankName-${receiver.id}`}>
                    {receiver.bankName}
                  </TableCell>
                  <TableCell className="text-gray-600" data-testid={`cell-bankCountry-${receiver.id}`}>
                    {receiver.bankCountry}
                  </TableCell>
                  <TableCell className="font-medium" data-testid={`cell-accountNo-${receiver.id}`}>
                    <div className="text-gray-900 font-semibold">
                      {receiver.accountNo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={receiver.status}
                      onCheckedChange={() => handleToggleStatusRequest(receiver.id, receiver.name, receiver.status)}
                      data-testid={`status-switch-${receiver.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        onClick={() => handleDelete(receiver.id, receiver.name)}
                        data-testid={`delete-button-${receiver.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-2"
                        onClick={() => console.log(`View details for ${receiver.id}`)}
                        data-testid={`view-button-${receiver.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Three dot clicked for:", receiver.id)
                            setActiveStaffInfo(activeStaffInfo === receiver.id ? null : receiver.id)
                          }}
                          data-testid={`more-button-${receiver.id}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {activeStaffInfo === receiver.id && (
                          <div
                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 border"
                            data-testid={`staff-dropdown-${receiver.id}`}
                          >
                            <div className="p-3">                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {receiver.createdBy?.charAt(receiver.createdBy.length - 1)}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{receiver.createdBy}</div>
                                  <div className="text-xs text-gray-500">{receiver.createdAt}</div>
                                </div>
                              </div>
                              <div className="border-t mt-2 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => console.log(`Edit ${receiver.id}`)}
                                >
                                  <PenSquare className="h-4 w-4" />
                                  <span>Edit Receiver</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Fixed Pagination Footer */}
      <div className="sticky bottom-0 bg-white border-t p-4 shadow-sm" data-testid="pagination">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="prev-button"
          >
            Prev
          </Button>

          {renderPagination().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                className={`px-3 py-1 text-sm ${
                  currentPage === page
                    ? "bg-[#004d7f] hover:bg-[#003b61] text-white border-[#004d7f]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                data-testid={`page-button-${page}`}
              >
                {page}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="next-button"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}