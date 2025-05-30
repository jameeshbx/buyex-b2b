// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import React from "react"
import { Order, orders, statusOptions, nonChangeableStatuses } from "@/data/staff-dashboard"

export default function Dashboard() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    orders.reduce((acc, order) => ({ ...acc, [order.id]: order.status }), {})
  )

  const toggleRowExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedRows(newExpanded)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }))
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
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getCustomerRateColor = (rate: string) => {
    const numRate = Number.parseFloat(rate)
    if (numRate >= 0.4) return "bg-red-100 text-red-800"
    if (numRate >= 0.3) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const renderStatusElement = (order: Order) => {
    const currentStatus = orderStatuses[order.id]

    if (nonChangeableStatuses.includes(currentStatus)) {
      if (currentStatus === "Quote downloaded" || currentStatus === "Documents placed") {
        return (
          <Link href="/staff/dashboard/sender-details" className="text-dark-blue hover:text-blue-800 underline text-sm">
            {currentStatus}
          </Link>
        )
      } else {
        return (
          <Badge className={getStatusBadgeColor(currentStatus)}>
            {currentStatus}
          </Badge>
        )
      }
    } else {
      return (
        <Select
          value={currentStatus}
          onValueChange={(value) => handleStatusChange(order.id, value)}
        >
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-jakarta text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-400 font-jakarta">Get summary of your portal here.</p>
        </div>

        {/* Order History Card */}
        <Card className="shadow-sm p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold font-jakarta text-gray-900">Order history</CardTitle>
            <Button variant="ghost" className="text-dark-blue hover:text-blue-800">
              See More
            </Button>
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
              {orders.map((order) => (
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
                        <span className="font-semibold text-sm font-jakarta text-gray-900">{order.id}</span>
                      </div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.date}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.purpose}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.name}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.currency}</div>
                      <div className="font-semibold text-sm font-jakarta text-gray900">{order.fcyAmt}</div>
                      <div className="font-semibold text-sm font-jakarta text-gray-900">{order.inrAmt}</div>
                      <div>
                        <Badge className={`${getCustomerRateColor(order.customerRate)} border-0`}>
                          {order.customerRate}
                        </Badge>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        {renderStatusElement(order)}
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          className="bg-dark-blue hover:bg-blue-700 text-white px-2 py-2 text-xs h-7"
                        >
                          <Upload className="h-3 w-3" />
                          Uploads
                        </Button>
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
                            <div className="font-medium font-jakarta text-gray-900">#{order.id}</div>
                            <div className="text-sm font-jakarta text-gray-600">{order.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium font-jakarta text-gray-900">
                            {order.fcyAmt} {order.currency}
                          </div>
                          <div className="text-sm font-jakarta text-gray-600">{order.inrAmt}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-600 font-jakarta">Purpose:</span>
                          <div className="font-medium font-jakarta text-gray-900">{order.purpose}</div>
                        </div>
                        <div>
                          <span className="text-gray-600 font-jakarta">Name:</span>
                          <div className="font-medium font-jakarta text-gray-900">{order.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getCustomerRateColor(order.customerRate)} border-0`}>
                            {order.customerRate}
                          </Badge>
                          <div onClick={(e) => e.stopPropagation()}>
                            {renderStatusElement(order)}
                          </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" className="bg-dark-blue hover:bg-blue-700 text-white">
                            <Upload className="h-4 w-4 mr-1" />
                            Uploads
                          </Button>
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
                            <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver&#39;s full name</h4>
                            <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">{order.name}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver&#39;s account</h4>
                            <p className="text-gray-600 font-jakarta text-sm break-all bg-gray-50 p-2 rounded-sm">
                              {order.receiverAccount}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver Country</h4>
                            <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">{order.receiverCountry}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Forex Partner</h4>
                            <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">{order.forexPartner}</p>
                          </div>
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