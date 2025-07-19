"use client"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import React from "react"
import axios from "axios"

interface Order {
  id: string
  createdAt: string
  purpose: string
  studentName: string
  currency: string
  amount: number
  totalAmount: number
  customerRate: number
  status: string
  receiverAccount?: string
  receiverBankCountry?: string
  forexPartner?:
    | string
    | {
        accountNumber: string
        accountName: string
        bankName: string
        ifscCode: string
        branch: string
        email: string
      }
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch only orders with status "quotedownloaded" as per agent's view requirements.
        // This ensures only agent-relevant orders are displayed, excluding admin/staff updates.
        const response = await axios.get("/api/orders", {
          params: {
            status: "quotedownloaded",
          },
        })
        setOrders(response.data)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setError("Failed to load orders. Please try again later.")
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

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "quotedownloaded":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "authorize":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "documents placed":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "blocked":
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

  const getCustomerRateColor = (rate: number) => {
    if (rate >= 0.4) return "bg-red-100 text-red-800"
    if (rate >= 0.3) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const renderStatusElement = (order: Order) => {
    return <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
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
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-jakarta text-gray-900 mb-2">Agent Dashboard</h1>
          <p className="text-gray-400 font-jakarta">Get summary of your portal here.</p>
        </div>
        {/* Order History Card */}
        <Card className="shadow-sm p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold font-jakarta text-gray-900">Order history</CardTitle>
            <Link className="text-dark-blue text-sm hover:text-blue-800" href={"/agent/dashboard/viewallorders"}>
              See More
            </Link>
          </CardHeader>
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
              {orders.slice(0, 5).map((order: Order) => (
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
                        <span className="font-semibold text-sm font-jakarta text-gray-900">
                          #{order.id.slice(0, 8)}
                        </span>
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
                      <div>{renderStatusElement(order)}</div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Link href={`/staff/dashboard/upload-files/${order.id}`}>
                          <Button size="sm" className="bg-dark-blue hover:bg-blue-700 text-white px-2 py-2 text-xs h-7">
                            <Upload className="h-2 w-2" />
                            Uploads
                          </Button>
                        </Link>
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
                          <div>{renderStatusElement(order)}</div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Link href={`/admin/dashboard/upload-files/${order.id}`}>
                            <Button size="sm" className="bg-dark-blue hover:bg-blue-700 text-white">
                              <Upload className="h-4 w-4 mr-1" />
                              Uploads
                            </Button>
                          </Link>
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
                            <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Student name</h4>
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
                                {typeof order.forexPartner === "string"
                                  ? order.forexPartner
                                  : order.forexPartner?.bankName || "N/A"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
