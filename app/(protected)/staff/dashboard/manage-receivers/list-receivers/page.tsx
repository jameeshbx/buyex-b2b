"use client"
import { useState, useMemo, useEffect } from "react"
import { ChevronDown, ChevronUp, Search, Trash2, MoreVertical, PenSquare } from 'lucide-react'
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
import { countries } from "@/data/country-data"
import { Topbar } from "../../../(components)/Topbar"
import { pagesData } from "@/data/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Receiver {
  id: string
  receiverFullName: string
  receiverCountry: string
  address: string
  receiverBank: string
  receiverBankAddress?: string
  receiverBankCountry: string
  receiverAccount: string
  receiverBankSwiftCode?: string
  iban?: string
  sortCode?: string
  transitNumber?: string
  bsbCode?: string
  routingNumber?: string
  anyIntermediaryBank?: "YES" | "NO"
  intermediaryBankName?: string
  intermediaryBankAccountNo?: string
  intermediaryBankIBAN?: string
  intermediaryBankSwiftCode?: string
  totalRemittance?: string
  field70?: string
  status: boolean
  createdAt: string
  updatedAt: string
}

type SortField = keyof Receiver
type SortDirection = "asc" | "desc"

export default function ReceiversTable() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [activeStaffInfo, setActiveStaffInfo] = useState<string | null>(null)
  const [receivers, setReceivers] = useState<Receiver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const itemsPerPage = 10

  // Function to filter out duplicate receivers (same details except totalRemittance and field70)
  const filterUniqueReceivers = (receivers: Receiver[]) => {
    const uniqueReceivers = new Map<string, Receiver>();

    // Sort by createdAt in descending order to keep the latest version
    const sortedReceivers = [...receivers].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sortedReceivers.forEach(receiver => {
      // Create a key from all fields except specific ones we want to exclude
      // Omit the fields we don't need in the key
      const { 
        totalRemittance: _totalRemittance,
        field70: _field70,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        status: _status,
        id: _id,
        ...rest 
      } = receiver;
      
      // Explicitly mark variables as unused to satisfy linter
      void [_totalRemittance, _field70, _createdAt, _updatedAt, _status, _id];
      const key = JSON.stringify(rest);

      // Only add if we haven't seen this combination of fields before
      if (!uniqueReceivers.has(key)) {
        uniqueReceivers.set(key, receiver);
      }
    });

    return Array.from(uniqueReceivers.values());
  };

  // Fetch receivers from API
  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/beneficiaries");
        const filteredReceivers = filterUniqueReceivers(response.data);
        setReceivers(filteredReceivers);
        setError(null);
      } catch (err) {
        setError("Failed to fetch receivers");
        console.error("Error fetching receivers:", err);
        toast.error("Failed to fetch receivers");
      } finally {
        setLoading(false);
      }
    }

    fetchReceivers()
  }, [])

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
  }

  const handleToggleStatusRequest = (id: string, name: string, currentStatus: boolean) => {
    setStatusToggleDialog({
      isOpen: true,
      receiverId: id,
      receiverName: name,
      currentStatus,
    })
  }

  const handleConfirmStatusToggle = async () => {
    const { receiverId, currentStatus } = statusToggleDialog
    try {
      const newStatus = !currentStatus

      // Updated API call with proper data structure
      await axios.patch(`/api/beneficiaries/${receiverId}`, {
        status: newStatus
      })

      // Update local state
      setReceivers(prev =>
        prev.map(receiver =>
          receiver.id === receiverId ? { ...receiver, status: newStatus } : receiver
        )
      )

      toast.success(`Receiver ${newStatus ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      console.error("Failed to update receiver status:", error)

      // More detailed error handling
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to update receiver status"
        toast.error(errorMessage)
      } else {
        toast.error("Failed to update receiver status")
      }
    } finally {
      setStatusToggleDialog({
        isOpen: false,
        receiverId: "",
        receiverName: "",
        currentStatus: false,
      })
    }
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
      setSelectedRows(new Set(paginatedData.map(r => r.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await axios.delete(`/api/beneficiaries/${id}`)
        setReceivers(prev => prev.filter(receiver => receiver.id !== id))
        setSelectedRows(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        toast.success("Receiver deleted successfully")
      } catch (error) {
        console.error("Failed to delete receiver:", error)
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to delete receiver"
          toast.error(errorMessage)
        } else {
          toast.error("Failed to delete receiver")
        }
      }
    }
  }

  const handleEditReceiver = (receiverId: string) => {
    router.push(`/staff/dashboard/manage-receivers/list-receivers/edit-receiver?edit=${receiverId}`)
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...receivers]

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter(receiver => receiver.receiverCountry === selectedCountry)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(receiver =>
        Object.values(receiver).some(
          value => value !== undefined && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
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
      return <ChevronDown className="ml-1 h-4 w-4 text-gray-400 opacity-50" />
    }
    return isAsc ? (
      <ChevronUp className="ml-1 h-4 w-4 text-blue-600 font-bold" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 text-blue-600 font-bold" />
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

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.listReceivers} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading receivers...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.listReceivers} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.listReceivers} />
      </div>

      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={statusToggleDialog.isOpen} onOpenChange={handleCancelStatusToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {statusToggleDialog.currentStatus ? "deactivate" : "activate"} the receiver
              &quot;{statusToggleDialog.receiverName}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelStatusToggle}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusToggle}
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
      <div className="sticky top-0 z-10 bg-white border-b">
        {/* Header with Filter and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4">
          <div className="relative w-full lg:w-auto">
            <DropdownMenu open={showCountryDropdown} onOpenChange={setShowCountryDropdown}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="bg-dark-blue hover:bg-[#003b61] text-white font-medium w-full lg:w-auto"
                >
                  {selectedCountry ? `Filter by country: ${selectedCountry}` : "Filter by country"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 max-h-60 overflow-y-auto">
                <DropdownMenuItem onClick={() => setSelectedCountry("")}>
                  All Countries
                </DropdownMenuItem>
                {countries.map(country => (
                  <DropdownMenuItem
                    key={country.value}
                    onClick={() => setSelectedCountry(country.value)}
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
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full lg:w-64 bg-[#f5f8fa] border-gray-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Scrollable Table Section */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4 p-4">
          {paginatedData.map(receiver => (
            <div
              key={receiver.id}
              className={`bg-white rounded-lg p-4 border shadow-sm ${selectedRows.has(receiver.id) ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#004d7f] border-gray-300 rounded focus:ring-[#004d7f]"
                    checked={selectedRows.has(receiver.id)}
                    onChange={() => handleRowSelect(receiver.id)}
                  />
                </label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={receiver.status}
                    onCheckedChange={() =>
                      handleToggleStatusRequest(receiver.id, receiver.receiverFullName, receiver.status)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => handleDelete(receiver.id, receiver.receiverFullName)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 text-gray-600 hover:text-gray-800"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        setActiveStaffInfo(activeStaffInfo === receiver.id ? null : receiver.id)
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {activeStaffInfo === receiver.id && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 border">
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">S</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">Staff</div>
                              <div className="text-xs text-gray-500">
                                {new Date(receiver.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="border-t mt-2 pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleEditReceiver(receiver.id)}
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
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">ID</span>
                  <p className="font-bold text-gray-900">{receiver.id}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">Name</span>
                  <p className="font-bold text-gray-900">{receiver.receiverFullName}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">Country</span>
                  <p className="text-gray-600">{receiver.receiverCountry}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide font-jakarta">Account No.</span>
                  <p className="font-bold text-gray-900">{receiver.receiverAccount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto bg-white mx-4 rounded-lg shadow-sm">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-white border-b">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#004d7f] border-gray-300 rounded focus:ring-[#004d7f]"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[120px]"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer">
                    Receiver ID
                    <SortIcon field="id" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[180px]"
                  onClick={() => handleSort("receiverFullName")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer">
                    Name
                    <SortIcon field="receiverFullName" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[100px]"
                  onClick={() => handleSort("receiverCountry")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer">
                    Country
                    <SortIcon field="receiverCountry" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[200px]"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer">
                    Address
                    <SortIcon field="address" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[150px]"
                  onClick={() => handleSort("receiverBank")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer">
                    Bank name
                    <SortIcon field="receiverBank" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[120px]"
                  onClick={() => handleSort("receiverBankCountry")}
                >
                  <div className="flex items-center font-medium text-gray-700 font-jakarta text-xs uppercase cursor-pointer">
                    Bank country
                    <SortIcon field="receiverBankCountry" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[140px]"
                  onClick={() => handleSort("receiverAccount")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase cursor-pointer">
                    Account No.
                    <SortIcon field="receiverAccount" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:bg-blue-50 transition-colors duration-150 min-w-[80px]"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center font-medium font-jakarta text-gray-700 text-xs uppercase">
                    Status
                  </div>
                </TableHead>
                <TableHead>
                  <div className="font-medium text-gray-700 text-xs font-jakarta min-w-[120px] uppercase">Action</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(receiver => (
                <TableRow
                  key={receiver.id}
                  className={`${selectedRows.has(receiver.id) ? "bg-dark-blue" : "bg-[#f5f8fa]"} border-b-4 border-white hover:bg-gray-50`}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#004d7f] border-gray-300 rounded focus:ring-[#004d7f]"
                      checked={selectedRows.has(receiver.id)}
                      onChange={() => handleRowSelect(receiver.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="text-gray-900 font-semibold">{receiver.id}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="text-gray-900 font-semibold">{receiver.receiverFullName}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {receiver.receiverCountry}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {receiver.address}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {receiver.receiverBank}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {receiver.receiverBankCountry}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="text-gray-900 font-semibold">{receiver.receiverAccount}</div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={receiver.status}
                      onCheckedChange={() =>
                        handleToggleStatusRequest(receiver.id, receiver.receiverFullName, receiver.status)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        onClick={() => handleDelete(receiver.id, receiver.receiverFullName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            setActiveStaffInfo(activeStaffInfo === receiver.id ? null : receiver.id)
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        {activeStaffInfo === receiver.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 border">
                            <div className="p-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">S</span>
                                </div>
                                <div>
                                  <div className="font-medium text-sm">Staff</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(receiver.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="border-t mt-2 pt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full text-left flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() => handleEditReceiver(receiver.id)}
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
      <div className="sticky bottom-0 bg-white border-t p-4 shadow-sm">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className={`px-3 py-1 text-sm ${currentPage === page
                    ? "bg-[#004d7f] hover:bg-[#003b61] text-white border-[#004d7f]"
                    : "border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-8 pb-4">
        © 2025, Made by <span className="text-dark-blue font-bold">BuyEx Forex</span>.
      </div>
    </div>
  )
}
