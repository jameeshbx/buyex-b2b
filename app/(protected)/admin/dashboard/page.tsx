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
import { Order, initialOrders, statusOptions, nonChangeableStatuses } from "@/data/admin-dashboard"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dailog"

export default function Dashboard() {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [showRateModal, setShowRateModal] = useState(false)
    const [expandedAuthorize, setExpandedAuthorize] = useState<Record<string, boolean>>({})

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
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId 
                    ? { ...order, status: newStatus }
                    : order
            )
        )
    }

    const handleUpdateRateClick = (order: Order) => {
        setSelectedOrder(order)
        setShowRateModal(true)
    }

    const handleRateUpdate = (orderId: string, newRate: number) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId 
                    ? { ...order, fxRateUpdated: true, fxRate: newRate }
                    : order
            )
        )
        setShowRateModal(false)
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

                            {/* Order Rows */}
                            {orders.map((order) => (
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
                                                    className={`w-24 h-7 rounded-sm text-xs font-medium ${
                                                        order.fxRateUpdated 
                                                            ? 'bg-gray-800 text-white' 
                                                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleUpdateRateClick(order)
                                                    }}
                                                >
                                                    {order.fxRateUpdated ? 'UPDATE' : 'UPDATE RATE'}
                                                </button>
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
                                                    <button
                                                        className={`w-20 h-6 rounded-sm text-xs font-medium ${
                                                            order.fxRateUpdated 
                                                                ? 'bg-gray-800 text-white' 
                                                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleUpdateRateClick(order)
                                                        }}
                                                    >
                                                        {order.fxRateUpdated ? 'UPDATE' : 'UPDATE RATE'}
                                                    </button>
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
                                                        <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver's full name</h4>
                                                        <p className="text-gray-600 font-jakarta bg-gray-50 p-2 rounded-sm">{order.name}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold font-jakarta text-gray-900 mb-2">Receiver's account</h4>
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

                                                {!expandedAuthorize[order.id] && order.status !== "Authorized" ? (
                                                    <div className="mt-6 flex justify-end">
                                                        <Button
                                                            type="button"
                                                            onClick={() => setExpandedAuthorize(prev => ({ ...prev, [order.id]: true }))}
                                                            className="text-white hover:opacity-90 flex items-center gap-2 h-12 rounded-md px-6"
                                                            style={{
                                                                background: 'linear-gradient(to right, #614385, #516395)',
                                                            }}
                                                        >
                                                            <span>Authorize</span>
                                                            <div className="flex ml-1">
                                                                <span className="text-white font-bold">&gt;&gt;&gt;</span>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                ) : expandedAuthorize[order.id] && (
                                                    <div className="mt-6 border-t pt-6">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Purpose</h4>
                                                                    <div className="bg-gray-50 p-3 rounded-sm">
                                                                        <p className="font-medium">Blocked Account</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Receiver Country</h4>
                                                                    <div className="bg-gray-50 p-3 rounded-sm">
                                                                        <p className="font-medium">Germany</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Foreign currency</h4>
                                                                    <div className="bg-gray-50 p-3 rounded-sm">
                                                                        <p className="font-medium">{order.currency}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Account no.</h4>
                                                                    <div className="bg-gray-50 p-3 rounded-sm">
                                                                        <p className="font-medium">{order.receiverAccount}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Receiver's full name</h4>
                                                                    <div className="bg-gray-50 p-3 rounded-sm">
                                                                        <p className="font-medium">{order.name}</p>
                                                                        <p className="mt-2 text-sm text-gray-600">Forex Partner</p>
                                                                        <p className="font-medium">{order.forexPartner}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4 sm:col-span-2">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">FC Volume</h4>
                                                                    <div className="bg-gray-50 p-3 rounded-sm">
                                                                        <p className="font-medium">{order.fcyAmt}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Rate block status</h4>
                                                                    <Select>
                                                                        <SelectTrigger className="bg-gray-50">
                                                                            <SelectValue placeholder="Select status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="active">Active</SelectItem>
                                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border-t pt-6">
                                                            <h4 className="font-semibold text-gray-900 mb-4">Authorize</h4>
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">Purpose</h4>
                                                                    <p className="text-gray-600 mt-1">Blocked Account</p>
                                                                </div>
                                                                <Button
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    onClick={() => {
                                                                        handleStatusChange(order.id, "Authorized")
                                                                        setExpandedAuthorize(prev => ({ ...prev, [order.id]: false }))
                                                                    }}
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </div>
                                                        </div>
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
                        <DialogTitle>Update FX Rates</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-sm font-medium">Order ID</span>
                            <span className="col-span-3 text-sm">#{selectedOrder?.id}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                            <span>IBR rate</span>
                            <span>Customer rate</span>
                            <span>Settlement rate</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <input
                                type="number"
                                className="border rounded p-2"
                                defaultValue="0.25"
                                step="0.01"
                            />
                            <input
                                type="number"
                                className="border rounded p-2"
                                defaultValue="0.25"
                                step="0.01"
                            />
                            <input
                                type="number"
                                className="border rounded p-2"
                                defaultValue="0.25"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-sm text-sm"
                            onClick={() => {
                                handleRateUpdate(selectedOrder?.id || '', 0.25)
                            }}
                        >
                            Update rates
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}