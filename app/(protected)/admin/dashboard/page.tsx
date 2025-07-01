"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Upload, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Order = {
  id: string
  purpose: string
  studentName: string
  currency: string
  amount: number
  totalAmount: number
  ibrRate?: number
  customerRate?: number
  fxRate: number
  fxRateUpdated?: boolean
  status: string
  createdAt: string
  receiverBankCountry?: string
  forexPartner?: string
  receiverAccount?: string
  payer?: string
  consultancy?: string
  margin?: number
  foreignBankCharges?: number
  createdBy?: string
  quote?: Record<string, unknown> // Replaced any with Record<string, unknown>
  calculations?: Record<string, unknown> // Replaced any with Record<string, unknown>
  generatedPDF?: Record<string, unknown> // Replaced any with Record<string, unknown>
}

const statusOptions = [
  "Received",
  "QuoteDownloaded",
  "Authorized",
  "Documents placed",
  "Verified",
  "Pending",
  "Rejected",
  "Completed",
]
const nonChangeableStatuses = ["QuoteDownloaded", "Documents placed", "Verified", "Rejected", "Completed"]

export default function Dashboard() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRateModal, setShowRateModal] = useState(false)
  const [expandedAuthorize, setExpandedAuthorize] = useState<Record<string, boolean>>({})
  const [statusSelections, setStatusSelections] = useState<Record<string, string>>({})
  const [ibrRate, setIbrRate] = useState<string>("")
  const [customerRate, setCustomerRate] = useState<string>("")
  const [settlementRate, setSettlementRate] = useState<string>("")
  const [visibleRows, setVisibleRows] = useState(5)
  const [selectedPurpose, setSelectedPurpose] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showIbrModal, setShowIbrModal] = useState(false)
  const [selectedOrderForIbr, setSelectedOrderForIbr] = useState<Order | null>(null)
  const [ibrModalRate, setIbrModalRate] = useState<string>("")

  const [formValidation, setFormValidation] = useState<
    Record<
      string,
      {
        currency?: string
        fcyAmt?: string
        purpose?: string
        receiverAccount?: string
        isValid?: boolean
      }
    >
  >({})
  const [authorizedOrders, setAuthorizedOrders] = useState<Set<string>>(new Set())

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/orders")
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        setOrders(data)
      } catch (err: unknown) {
        let errorMessage = "Error fetching orders"
        if (err instanceof Error) {
          errorMessage = err.message
        }
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const toggleRowExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedRows(newExpanded)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // If clicking on Pending status, navigate to sender details
    if (newStatus === "Pending") {
      window.location.href = `/staff/dashboard/sender-details?orderId=${orderId}`
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      const updatedOrder = await res.json()
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? updatedOrder : order)))
    } catch (err: unknown) {
      let errorMessage = "Error updating status"
      if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRateClick = (order: Order) => {
    setSelectedOrder(order)
    setIbrRate(order.ibrRate?.toString() || "")
    setCustomerRate(order.customerRate?.toString() || order.fxRate?.toString() || "")
    setSettlementRate("")
    setShowRateModal(true)
  }

  const handleRateUpdate = async (orderId: string, ibrRateValue: number, customerRateValue: number) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ibrRate: ibrRateValue,
          customerRate: customerRateValue,
          fxRate: customerRateValue,
          fxRateUpdated: true, // Add this line
        }),
      })
      if (!res.ok) throw new Error("Failed to update rates")
      const updatedOrder = await res.json()
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? updatedOrder : order)))
      setShowRateModal(false)
    } catch (err: unknown) {
      let errorMessage = "Error updating rates"
      if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSeeMoreClick = () => setVisibleRows((prev) => prev + 5)
  const handleSeeLessClick = () => setVisibleRows(5)

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "QuoteDownloaded":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "authorized":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "documents placed":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "verified":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
      case "pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const renderStatusElement = (order: Order) => {
    const currentStatus = order.status

    if (nonChangeableStatuses.includes(currentStatus)) {
      if (currentStatus === "QuoteDownloaded" || currentStatus === "Documents placed") {
        return (
          <Link
            href={`/staff/dashboard/sender-details?orderId=${order.id}`}
            className="text-dark-blue hover:text-blue-800 underline text-sm"
          >
            {currentStatus}
          </Link>
        )
      } else {
        return <Badge className={getStatusBadgeColor(currentStatus)}>{currentStatus}</Badge>
      }
    } else {
      return (
        <Select value={currentStatus} onValueChange={(value) => handleStatusChange(order.id, value)}>
          <SelectTrigger className="w-32 h-8 border-0 bg-transparent p-0">
            <Badge className={`${getStatusBadgeColor(currentStatus)} flex items-center gap-1`}>
              <SelectValue />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
  }

  // Define the available purposes
  const availablePurposes = [
    "University fee transfer",
    "Student Living expenses transfer",
    "Student Visa fee payment",
    "Convera registered payment",
    "Flywire registered payment",
    "Blocked account transfer",
    "Application fee",
    "Accomodation fee",
    "GIC Canada fee deposite",
  ]

  // Filter orders based on purpose and search term
  const filteredOrders = orders.filter((order) => {
    const matchesPurpose = selectedPurpose === "all" || order.purpose === selectedPurpose
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.currency.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesPurpose && matchesSearch
  })

  // Fixed IBR submit function to prevent page refresh
 const handleIbrSubmit = async (e?: React.FormEvent) => {
    // Prevent default form submission behavior
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!selectedOrderForIbr || !ibrModalRate.trim()) return

    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${selectedOrderForIbr.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ibrRate: Number.parseFloat(ibrModalRate) }),
      })

      if (!res.ok) {
        throw new Error("Failed to update IBR rate")
      }

      const updatedOrder = await res.json()

      // Update the orders state without causing a page refresh
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === selectedOrderForIbr.id ? updatedOrder : order)))

      // Close modal and reset state
      setShowIbrModal(false)
      setIbrModalRate("")
      setSelectedOrderForIbr(null)
    } catch (err: unknown) {
      let errorMessage = "Failed to update IBR rate";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  const validateOrderForm = (order: Order, formData: {
  currency?: string;
  fcyAmt?: string;
  purpose?: string;
  receiverAccount?: string;
}) => {
  if (!formData) return false;

  const currencyValid = !formData.currency || formData.currency === order.currency;
  const amountValid = !formData.fcyAmt || Number.parseFloat(formData.fcyAmt) === order.amount;
  const purposeValid = !formData.purpose || formData.purpose === order.purpose;
  const accountValid = !formData.receiverAccount || formData.receiverAccount === order.receiverAccount;

  return currencyValid && amountValid && purposeValid && accountValid;
}

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen  bg-gray-50">
      <div className="max-w-7xl mx-auto  py-8">
        {/* Header */}
        <div className="mb-8 pt-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-jakarta text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 font-jakarta">Get summary of your portal here.</p>
        </div>

        {/* Order History Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col space-y-4 pb-4 px-4 sm:px-6 pt-6">
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg sm:text-xl font-semibold font-jakarta text-gray-900">
                Order history
              </CardTitle>
              <div className="flex gap-2">
                {visibleRows < filteredOrders.length && (
                  <Button
                    variant="ghost"
                    className="text-dark-blue hover:text-blue-800 text-sm sm:text-base"
                    onClick={handleSeeMoreClick}
                  >
                    See More
                  </Button>
                )}
                {visibleRows > 5 && (
                  <Button
                    variant="ghost"
                    className="text-dark-blue hover:text-blue-800 text-sm sm:text-base"
                    onClick={handleSeeLessClick}
                  >
                    See Less
                  </Button>
                )}
              </div>
            </div>

            {/* Filter and Search Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-dark-blue text-white hover:dark-blue border-dark-blue flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filter by purpose
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setSelectedPurpose("all")}
                    className={selectedPurpose === "all" ? "bg-blue-50 text-blue-700" : ""}
                  >
                    All Purposes
                  </DropdownMenuItem>
                  {availablePurposes.map((purpose) => (
                    <DropdownMenuItem
                      key={purpose}
                      onClick={() => setSelectedPurpose(purpose)}
                      className={selectedPurpose === purpose ? "bg-blue-50 text-blue-700" : ""}
                    >
                      {purpose}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Responsive Order List */}
            <div className="space-y-0">
              {/* Header - visible only on large screens */}
              <div className="hidden lg:grid lg:grid-cols-9 bg-gray-50 border-b py-3 px-4 gap-4 text-sm font-medium font-jakarta text-gray-600">
                <div>Order ID</div>
                <div>Date</div>
                <div>Purpose</div>
                <div>Name</div>
                <div>Currency</div>
                <div>FCY Amt</div>
                <div>FX Rate</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Order Rows - Only show visibleRows */}
              {filteredOrders.slice(0, visibleRows).map((order) => (
                <React.Fragment key={order.id}>
                  {/* Main Row */}
                  <div
                    className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleRowExpansion(order.id)}
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid lg:grid-cols-9 py-2 px-4 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        {expandedRows.has(order.id) ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="font-semibold text-sm font-jakarta text-gray-900">{order.id}</span>
                      </div>
                      <div className="text-gray-600 text-sm font-jakarta">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.purpose}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.studentName}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.currency}</div>
                      <div className="font-semibold text-sm font-jakarta text-gray-900">{order.amount}</div>
                      <div>
                        <button
                          className={`w-24 h-7 rounded-sm text-xs font-medium border ${
                            order.fxRateUpdated
                              ? "bg-white border-gray-800 text-gray-800 font-bold cursor-default"
                              : "bg-white text-red-600 border-red-600 font-bold hover:bg-red-50 cursor-pointer"
                          }`}
                          onClick={(e) => {
                            if (!order.fxRateUpdated) {
                              e.stopPropagation()
                              handleUpdateRateClick(order)
                            }
                          }}
                          disabled={order.fxRateUpdated}
                        >
                          {order.fxRateUpdated ? "UPDATED" : "UPDATE RATE"}
                        </button>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>{renderStatusElement(order)}</div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" className="bg-dark-blue text-white px-2 py-2 text-xs h-7">
                          <Upload className="h-3 w-3" />
                          Uploads
                        </Button>
                      </div>
                    </div>

                    {/* Mobile/Tablet Layout */}
                    <div className="lg:hidden p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {expandedRows.has(order.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium font-jakarta text-gray-900">#{order.id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium font-jakarta text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs sm:text-sm font-jakarta text-gray-600">{order.purpose}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 text-sm mb-3">
                        <div>
                          <span className="text-xs sm:text-sm text-gray-600 font-jakarta">Name:</span>
                          <div className="font-medium font-jakarta text-gray-900 text-sm sm:text-base">
                            {order.studentName}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs sm:text-sm text-gray-600 font-jakarta">Status:</span>
                          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                            {renderStatusElement(order)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          className={`w-24 sm:w-28 h-7 rounded-sm text-xs font-medium border ${
                            order.fxRateUpdated
                              ? "bg-white border-gray-800 text-gray-800 font-bold cursor-default"
                              : "bg-white text-red-600 border-red-600 font-bold hover:bg-red-50 cursor-pointer"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateRateClick(order)
                          }}
                        >
                          {order.fxRateUpdated ? "UPDATED" : "UPDATE RATE"}
                        </button>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className="bg-dark-blue text-white h-7 px-3">
                            <Upload className="h-3 w-3 mr-1" />
                            Uploads
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRows.has(order.id) && (
                    <div className="border-b">
                      <div className="py-4 sm:py-6 px-4 sm:px-6">
                        {/* Initial Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                              Purpose
                            </h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.purpose}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                              Receiver&apos;s full name
                            </h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.studentName}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                              Receiver&apos;s account
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm font-jakarta break-all bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.receiverAccount || "-"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                              Receiver Country
                            </h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.receiverBankCountry || "-"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                              Forex Partner
                            </h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.forexPartner || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Authorization Section */}
                        {order.status !== "Authorized" && (
                          <div className="mt-4 sm:mt-6">
                            {!expandedAuthorize[order.id] ? (
                              // Initial Authorize Button (Blue)
                              <div className="flex justify-center sm:justify-end mt-[-62px] mr-[-33px]">
                                <Button
                                  type="button"
                                  onClick={() => setExpandedAuthorize((prev) => ({ ...prev, [order.id]: true }))}
                                  className="text-white hover:opacity-90 flex items-center gap-2 h-10 sm:h-12 rounded-md px-4 sm:px-6 mt-2 sm:mt-0 sm:mr-[275px]"
                                  style={{
                                    background: "linear-gradient(to right, #614385, #516395)",
                                  }}
                                >
                                  <Image
                                    src="/Frames.png"
                                    alt=""
                                    width={47}
                                    height={35}
                                    className="w-8 h-8 sm:w-6 sm:h-6"
                                  />
                                  <span className="text-sm sm:text-base">Authorize</span>
                                  <div className="flex ml-1">
                                    <span className="text-white font-bold">&gt;&gt;&gt;</span>
                                  </div>
                                </Button>
                              </div>
                            ) : (
                              // Expanded Authorization Form
                              <div className="relative text-black">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
                                  {/* Foreign Currency */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                                      Foreign currency
                                    </h4>
                                    <Select
                                      value={formValidation[order.id]?.currency || ""}
                                      onValueChange={(value) => {
                                        setFormValidation((prev) => ({
                                          ...prev,
                                          [order.id]: {
                                            ...prev[order.id],
                                            currency: value,
                                            isValid: validateOrderForm(order, { ...prev[order.id], currency: value }),
                                          },
                                        }))
                                      }}
                                    >
                                      <SelectTrigger
                                        className={`bg-white border h-10 sm:h-12 ${
                                          formValidation[order.id]?.currency &&
                                          formValidation[order.id]?.currency !== order.currency
                                            ? "border-red-500"
                                            : "border-gray-200"
                                        }`}
                                      >
                                        <SelectValue placeholder="Select currency" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="CAD">CAD</SelectItem>
                                        <SelectItem value="AUD">AUD</SelectItem>
                                        <SelectItem value="CHF">CHF</SelectItem>
                                        <SelectItem value="AED">AED</SelectItem>
                                        <SelectItem value="NZD">NZD</SelectItem>
                                        <SelectItem value="SEK">SEK</SelectItem>
                                        <SelectItem value="GEL">GEL</SelectItem>
                                        <SelectItem value="BGN">BGN</SelectItem>
                                        <SelectItem value="UZS">UZS</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {formValidation[order.id]?.currency &&
                                      formValidation[order.id]?.currency !== order.currency && (
                                        <p className="text-red-500 text-xs mt-1">
                                          Currency must match order currency: {order.currency}
                                        </p>
                                      )}
                                  </div>

                                  {/* FC Volume */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                                      FC Volume
                                    </h4>
                                    <div
                                      className={`bg-white p-2 sm:p-3 rounded-sm border ${
                                        formValidation[order.id]?.fcyAmt &&
                                        Number.parseFloat(formValidation[order.id]?.fcyAmt || "0") !== order.amount
                                          ? "border-red-500"
                                          : "border-gray-200"
                                      }`}
                                    >
                                      <input
                                        type="text"
                                        name="fcyAmt"
                                        value={formValidation[order.id]?.fcyAmt || ""}
                                        onChange={(e) => {
                                          setFormValidation((prev) => ({
                                            ...prev,
                                            [order.id]: {
                                              ...prev[order.id],
                                              fcyAmt: e.target.value,
                                              isValid: validateOrderForm(order, {
                                                ...prev[order.id],
                                                fcyAmt: e.target.value,
                                              }),
                                            },
                                          }))
                                        }}
                                        className="w-full font-medium text-sm sm:text-base text-black focus:outline-none bg-transparent"
                                        placeholder="Enter amount"
                                      />
                                    </div>
                                    {formValidation[order.id]?.fcyAmt &&
                                      Number.parseFloat(formValidation[order.id]?.fcyAmt || "0") !== order.amount && (
                                        <p className="text-red-500 text-xs mt-1">
                                          Amount must match order amount: {order.amount}
                                        </p>
                                      )}
                                  </div>

                                  {/* Purpose */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                                      Purpose
                                    </h4>
                                    <Select
                                      value={formValidation[order.id]?.purpose || ""}
                                      onValueChange={(value) => {
                                        setFormValidation((prev) => ({
                                          ...prev,
                                          [order.id]: {
                                            ...prev[order.id],
                                            purpose: value,
                                            isValid: validateOrderForm(order, { ...prev[order.id], purpose: value }),
                                          },
                                        }))
                                      }}
                                    >
                                      <SelectTrigger
                                        className={`bg-white border h-10 sm:h-12 ${
                                          formValidation[order.id]?.purpose &&
                                          formValidation[order.id]?.purpose !== order.purpose
                                            ? "border-red-500"
                                            : "border-gray-200"
                                        }`}
                                      >
                                        <SelectValue placeholder="Select purpose" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="University fee transfer">University fee transfer</SelectItem>
                                        <SelectItem value="Student Living expenses transfer">
                                          Student Living expenses transfer
                                        </SelectItem>
                                        <SelectItem value="Student Visa fee payment">
                                          Student Visa fee payment
                                        </SelectItem>
                                        <SelectItem value="Convera registered payment">
                                          Convera registered payment
                                        </SelectItem>
                                        <SelectItem value="Flywire registered payment">
                                          Flywire registered payment
                                        </SelectItem>
                                        <SelectItem value="Blocked account transfer">
                                          Blocked account transfer
                                        </SelectItem>
                                        <SelectItem value="Application fee">Application fee</SelectItem>
                                        <SelectItem value="Accomodation fee">Accomodation fee</SelectItem>
                                        <SelectItem value="GIC Canada fee deposite">GIC Canada fee deposite</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    {formValidation[order.id]?.purpose &&
                                      formValidation[order.id]?.purpose !== order.purpose && (
                                        <p className="text-red-500 text-xs mt-1">
                                          Purpose must match order purpose: {order.purpose}
                                        </p>
                                      )}
                                  </div>

                                  {/* Account Number */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                                      Account no.
                                    </h4>
                                    <div
                                      className={`bg-white p-2 sm:p-3 rounded-sm border ${
                                        formValidation[order.id]?.receiverAccount &&
                                        formValidation[order.id]?.receiverAccount !== order.receiverAccount
                                          ? "border-red-500"
                                          : "border-gray-200"
                                      }`}
                                    >
                                      <input
                                        type="text"
                                        name="receiverAccount"
                                        value={formValidation[order.id]?.receiverAccount || ""}
                                        onChange={(e) => {
                                          setFormValidation((prev) => ({
                                            ...prev,
                                            [order.id]: {
                                              ...prev[order.id],
                                              receiverAccount: e.target.value,
                                              isValid: validateOrderForm(order, {
                                                ...prev[order.id],
                                                receiverAccount: e.target.value,
                                              }),
                                            },
                                          }))
                                        }}
                                        className="w-full font-medium text-sm sm:text-base text-black focus:outline-none bg-transparent"
                                        placeholder="Enter account number"
                                      />
                                    </div>
                                    {formValidation[order.id]?.receiverAccount &&
                                      formValidation[order.id]?.receiverAccount !== order.receiverAccount && (
                                        <p className="text-red-500 text-xs mt-1">
                                          Account number must match order account: {order.receiverAccount}
                                        </p>
                                      )}
                                  </div>

                                  {/* Rate Block Status */}
                                  <div className="sm:col-span-2 lg:col-span-1">
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                                      Rate block status
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                      <Select
                                        value={statusSelections[order.id] || ""}
                                        onValueChange={(value) => {
                                          setStatusSelections((prev) => ({ ...prev, [order.id]: value }))
                                          if (value === "blocked") {
                                            setSelectedOrderForIbr(order)
                                            setIbrModalRate("")
                                            setShowIbrModal(true)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="bg-gray-50 h-10 sm:h-12">
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="blocked">Blocked</SelectItem>
                                        </SelectContent>
                                      </Select>

                                      <Button
                                        className={`h-10 sm:h-12 px-4 sm:px-6 ${
                                          !formValidation[order.id]?.isValid && statusSelections[order.id] === "blocked"
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-dark-blue hover:bg-dark-blue"
                                        } text-white`}
                                        disabled={
                                          !formValidation[order.id]?.isValid && statusSelections[order.id] === "blocked"
                                        }
                                        onClick={() => {
                                          if (
                                            statusSelections[order.id] === "blocked" &&
                                            formValidation[order.id]?.isValid
                                          ) {
                                            setAuthorizedOrders((prev) => new Set([...(Array.from(prev)), order.id]))
                                            handleStatusChange(order.id, "Authorized")
                                            setExpandedAuthorize((prev) => ({
                                              ...prev,
                                              [order.id]: false,
                                            }))
                                          } else if (statusSelections[order.id] !== "blocked") {
                                            handleStatusChange(order.id, "Authorized")
                                            setExpandedAuthorize((prev) => ({
                                              ...prev,
                                              [order.id]: false,
                                            }))
                                          }
                                        }}
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Authorize Button - Changes color based on status */}
                                <div className="flex justify-center sm:justify-end sm:absolute sm:top-[-87px] sm:right-[275px] mt-4 sm:mt-0">
                                  <Button
                                    className={`text-white flex items-center gap-2 h-10 sm:h-12 rounded-md px-4 sm:px-6 ${
                                      authorizedOrders.has(order.id) ? "cursor-default" : "cursor-pointer"
                                    }`}
                                    onClick={() => {
                                      if (!authorizedOrders.has(order.id)) {
                                        handleStatusChange(order.id, "Authorized")
                                        setExpandedAuthorize((prev) => ({ ...prev, [order.id]: false }))
                                      }
                                    }}
                                    style={{
                                      background:
                                        authorizedOrders.has(order.id) || order.status === "Authorized"
                                          ? "linear-gradient(to right, #61C454, #414143)"
                                          : "linear-gradient(to right, #614385, #516395)",
                                    }}
                                  >
                                    <Image
                                      src="/Frames.png"
                                      alt=""
                                      width={20}
                                      height={20}
                                      className="w-5 h-5 sm:w-6 sm:h-6"
                                    />
                                    <span className="text-sm sm:text-base">
                                      {authorizedOrders.has(order.id) || order.status === "Authorized"
                                        ? "Authorized"
                                        : "Authorize"}
                                    </span>
                                    <div className="flex ml-1">
                                      <span className="text-white font-bold animate-bounce-slower">&gt;&gt;&gt;</span>
                                    </div>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Update FX Rate Modal */}
      <Dialog open={showRateModal} onOpenChange={setShowRateModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Update FX Rates</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center">
              <span className="text-sm font-medium">Order ID:</span>
              <span className="col-span-2 text-sm -ml-7">#{selectedOrder?.id}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm font-medium">
              <span>IBR rate</span>
              <span>Customer rate</span>
              <span>Settlement rate</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* IBR Rate - Editable */}
              <input
                type="text"
                className="bg-gray-50 rounded p-2 text-sm"
                value={ibrRate || ""}
                onChange={(e) => setIbrRate(e.target.value)}
              />

              {/* Customer Rate - Now Editable */}
              <input
                type="text"
                className="bg-gray-50 rounded p-2 text-sm"
                value={customerRate || selectedOrder?.fxRate?.toFixed(2) || ""}
                onChange={(e) => setCustomerRate(e.target.value)}
              />

              {/* Settlement Rate - Editable */}
              <input
                type="text"
                className="bg-gray-50 rounded p-2 text-sm"
                value={settlementRate || ""}
                onChange={(e) => setSettlementRate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mr-24">
            <button
              className="bg-dark-blue hover:bg-dark-blue text-white px-14 py-2 rounded-sm text-sm flex items-center"
              onClick={() => {
                const ibrValue = Number.parseFloat(ibrRate) || 0
                const customerValue = Number.parseFloat(customerRate) || selectedOrder?.fxRate || 0
                handleRateUpdate(selectedOrder?.id || "", ibrValue, customerValue)
              }}
            >
              <Image src="/bolt.png" alt="" width={20} height={20} className="mr-2" />
              Update rates
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* IBR Rate Modal - Fixed to prevent page refresh */}
      <Dialog open={showIbrModal} onOpenChange={setShowIbrModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Set IBR Rate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIbrSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center">
                <span className="text-sm font-medium">Order ID:</span>
                <span className="col-span-2 text-sm -ml-7">#{selectedOrderForIbr?.id}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">IBR Rate</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 rounded p-3 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={ibrModalRate}
                  onChange={(e) => setIbrModalRate(e.target.value)}
                  placeholder="Enter IBR rate"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleIbrSubmit()
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowIbrModal(false)
                  setIbrModalRate("")
                  setSelectedOrderForIbr(null)
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-dark-blue hover:bg-dark-blue text-white px-6"
                onClick={(e) => {
                  e.preventDefault()
                  handleIbrSubmit()
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
