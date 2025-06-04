"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import React from "react"
import { type Order, initialOrders, statusOptions, nonChangeableStatuses } from "@/data/admin-dashboard"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dailog"
import Image from "next/image"

export default function Dashboard() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRateModal, setShowRateModal] = useState(false)
  const [expandedAuthorize, setExpandedAuthorize] = useState<Record<string, boolean>>({})
  const [statusSelections, setStatusSelections] = useState<Record<string, string>>({})
  const [ibrRate, setIbrRate] = useState<string>('')
  const [customerRate, setCustomerRate] = useState<string>('')
  const [settlementRate, setSettlementRate] = useState<string>('')
  const [visibleRows, setVisibleRows] = useState(5)

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
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  const handleUpdateRateClick = (order: Order) => {
    setSelectedOrder(order)
    setShowRateModal(true)
  }

  const handleRateUpdate = (orderId: string, newRate: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, fxRateUpdated: true, fxRate: newRate } : order)),
    )
    setShowRateModal(false)
  }

  const handleSeeMoreClick = () => {
    setVisibleRows(prev => prev + 5) // Increase visible rows by 5
  }

  const handleSeeLessClick = () => {
    setVisibleRows(5) // Reset to initial 5 rows
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "quote downloaded":
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-jakarta text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400 font-jakarta">Get summary of your portal here.</p>
        </div>

        {/* Order History Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 sm:px-6 pt-6">
            <CardTitle className="text-lg sm:text-xl font-semibold font-jakarta text-gray-900">Order history</CardTitle>
            <div className="flex gap-2">
              {visibleRows < orders.length && (
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
              {orders.slice(0, visibleRows).map((order) => (
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
                      <div className="text-gray-600 text-sm font-jakarta">{order.date}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.purpose}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.name}</div>
                      <div className="text-gray-600 text-sm font-jakarta">{order.currency}</div>
                      <div className="font-semibold text-sm font-jakarta text-gray-900">{order.fcyAmt}</div>
                      <div>
                        <button
                          className={`w-24 h-7 rounded-sm text-xs font-medium border ${order.fxRateUpdated
                              ? "bg-white border-black text-black font-bold "
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
                            <div className="text-xs sm:text-sm font-jakarta text-gray-600">{order.date}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium font-jakarta text-gray-900">
                            {order.fcyAmt} {order.currency}
                          </div>
                          <div className="text-xs sm:text-sm font-jakarta text-gray-600">
                            {order.purpose}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 text-sm mb-3">
                        <div>
                          <span className="text-xs sm:text-sm text-gray-600 font-jakarta">Name:</span>
                          <div className="font-medium font-jakarta text-gray-900 text-sm sm:text-base">{order.name}</div>
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
                          className={`w-24 sm:w-28 h-7 rounded-sm text-xs font-medium border ${order.fxRateUpdated
                            ? "bg-white border-black text-black font-bold"
                            : "bg-white text-red-600 border-red-600 font-bold"
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
                            <span className="text-xs">Uploads</span>
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
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Purpose</h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">{order.purpose}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Receiver&apos;s full name</h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">{order.name}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Receiver&apos;s account</h4>
                            <p className="text-gray-600 text-xs sm:text-sm font-jakarta break-all bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.receiverAccount}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Receiver Country</h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">
                              {order.receiverCountry}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Forex Partner</h4>
                            <p className="text-gray-600 text-sm sm:text-base font-jakarta bg-gray-50 p-2 sm:p-3 rounded-sm">{order.forexPartner}</p>
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
                                  <Image src="/Frames.png" alt="" width={47} height={35} className="w-8 h-8 sm:w-6 sm:h-6" />
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
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Foreign currency</h4>
                                    <div className="bg-white p-2 sm:p-3 rounded-sm border border-gray-200">
                                      <input
                                        type="text"
                                        name="currency"
                                        className="w-full font-medium text-sm sm:text-base text-black focus:outline-none bg-transparent"
                                        placeholder="Enter currency"
                                      />
                                    </div>
                                  </div>

                                  {/* FC Volume */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">FC Volume</h4>
                                    <div className="bg-white p-2 sm:p-3 rounded-sm border border-gray-200">
                                      <input
                                        type="text"
                                        name="fcyAmt"
                                        className="w-full font-medium text-sm sm:text-base text-black focus:outline-none bg-transparent"
                                        placeholder="Enter amount"
                                      />
                                    </div>
                                  </div>

                                  {/* Purpose */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Purpose</h4>
                                    <div className="bg-white p-2 sm:p-3 rounded-sm border border-gray-200">
                                      <input
                                        type="text"
                                        name="purpose"
                                        className="w-full font-medium text-sm sm:text-base text-black focus:outline-none bg-transparent"
                                        placeholder="Enter purpose"
                                      />
                                    </div>
                                  </div>

                                  {/* Account Number */}
                                  <div>
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">Account no.</h4>
                                    <div className="bg-white p-2 sm:p-3 rounded-sm border border-gray-200">
                                      <input
                                        type="text"
                                        name="receiverAccount"
                                        className="w-full font-medium text-sm sm:text-base text-black focus:outline-none bg-transparent"
                                        placeholder="Enter account number"
                                      />
                                    </div>
                                  </div>

                                  {/* Rate Block Status */}
                                  <div className="sm:col-span-2 lg:col-span-1">
                                    <h4 className="font-semibold text-sm sm:text-base font-jakarta text-gray-900 mb-1 sm:mb-2">
                                      Rate block status
                                    </h4>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                      <Select
                                        value={statusSelections[order.id] || ""}
                                        onValueChange={(value) =>
                                          setStatusSelections((prev) => ({ ...prev, [order.id]: value }))
                                        }
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
                                        className="bg-dark-blue hover:bg-dark-blue text-white h-10 sm:h-12 px-4 sm:px-6"
                                        onClick={() => {
                                          const selected = statusSelections[order.id]
                                          const statusToSet = selected === "blocked" ? "Authorized" : "Pending"
                                          handleStatusChange(order.id, statusToSet)
                                          setExpandedAuthorize((prev) => ({
                                            ...prev,
                                            [order.id]: false,
                                          }))
                                        }}
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                {/* Green Authorize Button */}
                                <div className="flex justify-center sm:justify-end sm:absolute sm:top-[-87px] sm:right-[275px] mt-4 sm:mt-0">
                                  <Button
                                    className="text-white flex items-center gap-2 h-10 sm:h-12 rounded-md px-4 sm:px-6"
                                    onClick={() => {
                                      handleStatusChange(order.id, "Authorized")
                                      setExpandedAuthorize((prev) => ({ ...prev, [order.id]: false }))
                                    }}
                                    style={{
                                      background: "linear-gradient(to right, #61C454, #414143)",
                                    }}
                                  >
                                    <Image src="/Frames.png" alt="" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="text-sm sm:text-base">Authorize</span>
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
                value={ibrRate || ''}
                onChange={(e) => setIbrRate(e.target.value)}
              />

              {/* Customer Rate - Now Editable */}
              <input
                type="text"
                className="bg-gray-50 rounded p-2 text-sm"
                value={customerRate || selectedOrder?.fxRate?.toFixed(2) || ''}
                onChange={(e) => setCustomerRate(e.target.value)}
              />

              {/* Settlement Rate - Editable */}
              <input
                type="text"
                className="bg-gray-50 rounded p-2 text-sm"
                value={settlementRate || ''}
                onChange={(e) => setSettlementRate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mr-24">
            <button
              className="bg-dark-blue hover:bg-dark-blue text-white px-14 py-2 rounded-sm text-sm flex items-center"
              onClick={() => {
                handleRateUpdate(
                  selectedOrder?.id || "",
                  parseFloat(customerRate) || selectedOrder?.fxRate || 0
                )
              }}
            >
              <Image
                src="/bolt.png"
                alt=""
                width={20}
                height={20}
                className="mr-2"
              />
              Update rates
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}