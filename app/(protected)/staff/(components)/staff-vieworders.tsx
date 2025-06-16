"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Upload, Search, MoreVertical, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import React from "react"
import axios from "axios"
import { statusOptions, nonChangeableStatuses, purposeOptions } from "@/data/staff-dashboard"

interface Order {
  id: string;
  createdAt: string;
  purpose: string;
  studentName: string;
  currency: string;
  amount: number;
  totalAmount: number;
  customerRate: number;
  status: string;
  receiverAccount?: string;
  receiverBankCountry?: string;
  forexPartner?: string;
  addedBy?: string;
  addedDate?: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [purposeFilter, setPurposeFilter] = useState<string | null>(null)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const itemsPerPage = 5

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders')
        setOrders(response.data)
        // Initialize statuses
        const initialStatuses = response.data.reduce((acc: Record<string, string>, order: Order) => ({
          ...acc,
          [order.id]: order.status
        }), {})
        setOrderStatuses(initialStatuses)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setError("Failed to load orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter and search orders
  useEffect(() => {
    let result = [...orders]

    // Apply purpose filter
    if (purposeFilter) {
      result = result.filter((order) => order.purpose === purposeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.studentName.toLowerCase().includes(query) ||
          order.purpose.toLowerCase().includes(query) ||
          order.currency.toLowerCase().includes(query) ||
          order.status.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [purposeFilter, searchQuery, orders])

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
    try {
      // Optimistic UI update
      setOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }))
      
      // Update in database
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus })
    } catch (err) {
      console.error("Failed to update status:", err)
      // Revert if failed
      setOrderStatuses(prev => ({ ...prev, [orderId]: prev[orderId] }))
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "quote downloaded":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "authorize":
        return "bg-red-100 text-red-800 hover:bg-red-200"
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
      case "rate expired":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getCustomerRateColor = (rate: number) => {
    if (rate >= 0.4) return "bg-red-100 text-red-800"
    if (rate >= 0.3) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStatusElement = (order: Order) => {
    const currentStatus = orderStatuses[order.id] || order.status

    if (nonChangeableStatuses.includes(currentStatus)) {
      if (currentStatus === "Quote downloaded" || currentStatus === "Documents placed") {
        return (
          <Link href="/staff/dashboard/sender-details" className="text-dark-blue hover:text-blue-800 underline text-sm">
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

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto ">
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-dark-blue text-white hover:bg-blue-800">
                <Filter className="h-4 w-4" />
                Filter by purpose
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 z-50 relative">
              <div className="p-2">
                <div
                  className={`px-2 py-1.5 text-sm rounded-md bg-gray-100 cursor-pointer ${!purposeFilter ? "bg-gray-100" : "hover:bg-blue-100"}`}
                  onClick={() => setPurposeFilter(null)}
                >
                  All Purposes
                </div>
                {purposeOptions.map((purpose) => (
                  <div
                    key={purpose}
                    className={`px-2 py-1.5 text-sm rounded-md bg-gray-100 cursor-pointer ${purposeFilter === purpose ? "bg-gray-100" : "hover:bg-blue-100"}`}
                    onClick={() => setPurposeFilter(purpose)}
                  >
                    {purpose}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Order History Card */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {/* Responsive Order List */}
            <div className="space-y-0">
              {/* Header - visible only on large screens */}
              <div className="hidden lg:grid lg:grid-cols-10 bg-gray-50 border-b py-3 px-4 gap-4 text-sm font-medium font-jakarta text-gray-600">
                <div>Order ID</div>
                <div>Date</div>
                <div>Purpose</div>
                <div>Name</div>
                <div>Currency</div>
                <div>FCY Amt</div>
                <div>INR Amt</div>
                <div>Customer rate</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              {/* Order Rows */}
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    {/* Main Row */}
                    <div
                      className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => toggleRowExpansion(order.id)}
                    >
                      {/* Desktop Layout */}
                      <div className="hidden lg:grid lg:grid-cols-10 py-2 px-4 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          {expandedRows.has(order.id) ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="font-semibold text-sm font-jakarta text-gray-900">#{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-gray-600 text-sm font-jakarta">{formatDate(order.createdAt)}</div>
                        <div className="text-gray-600 text-sm font-jakarta">{order.purpose}</div>
                        <div className="text-gray-600 text-sm font-jakarta">{order.studentName}</div>
                        <div className="text-gray-600 text-sm font-jakarta">{order.currency}</div>
                        <div className="font-semibold text-sm font-jakarta text-gray900">{order.amount}</div>
                        <div className="font-semibold text-sm font-jakarta text-gray-900">{order.totalAmount}</div>
                        <div>
                          <Badge className={`${getCustomerRateColor(order.customerRate)} border-0`}>
                            {order.customerRate}
                          </Badge>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>{renderStatusElement(order)}</div>
                        <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                          <Link href={`/staff/dashboard/upload-files/${order.id}`}>
                            <Button
                              size="sm"
                              className="bg-dark-blue hover:bg-blue-700 text-white px-2 py-2 text-xs h-7"
                            >
                              <Upload className="h-2 w-2" />
                              Uploads
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex flex-col items-start">
                                <span className="font-medium">Added by: {order.addedBy || "Staff"}</span>
                                <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="lg:hidden p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {expandedRows.has(order.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium font-jakarta text-gray-900">#{order.id.slice(0, 8)}</div>
                              <div className="text-sm font-jakarta text-gray-600">{formatDate(order.createdAt)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium font-jakarta text-gray-900">
                              {order.amount} {order.currency}
                            </div>
                            <div className="text-sm font-jakarta text-gray-600">{order.totalAmount}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-600 font-jakarta">Purpose:</span>
                            <div className="font-medium font-jakarta text-gray-900">{order.purpose}</div>
                          </div>
                          <div>
                            <span className="text-gray-600 font-jakarta">Name:</span>
                            <div className="font-medium font-jakarta text-gray-900">{order.studentName}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getCustomerRateColor(order.customerRate)} border-0`}>
                              {order.customerRate}
                            </Badge>
                            <div onClick={(e) => e.stopPropagation()}>{renderStatusElement(order)}</div>
                          </div>
                          <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
                            <Link href={`/staff/dashboard/upload-files/${order.id}`}>
                              <Button size="sm" className="bg-dark-blue hover:bg-blue-700 text-white">
                                <Upload className="h-4 w-4 mr-1" />
                                Uploads
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex flex-col items-start">
                                  <span className="font-medium">Added by: {order.addedBy || "Staff"}</span>
                                  <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedRows.has(order.id) && (
                      <div className="border-b">
                        <div className="py-6 px-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                            <div>
                              <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Purpose</h4>
                              <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">{order.purpose}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold font-jakarta text-gray-900 mb-2">
                                Student name
                              </h4>
                              <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">{order.studentName}</p>
                            </div>
                            {order.receiverAccount && (
                              <div>
                                <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver&#39;s account</h4>
                                <p className="text-gray-600 font-jakarta text-sm break-all bg-gray-50 p-2 rounded-sm">
                                  {order.receiverAccount}
                                </p>
                              </div>
                            )}
                            {order.receiverBankCountry && (
                              <div>
                                <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver Country</h4>
                                <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">
                                  {order.receiverBankCountry}
                                </p>
                              </div>
                            )}
                            {order.forexPartner && (
                              <div>
                                <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Forex Partner</h4>
                                <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">
                                  {order.forexPartner}
                                </p>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Added On</h4>
                              <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">No orders found matching your search criteria</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={currentPage === pageNum ? "bg-dark-blue hover:bg-blue-700" : ""}
                >
                  {pageNum}
                </Button>
              )
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}