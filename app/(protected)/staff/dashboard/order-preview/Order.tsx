"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { calculateGst, calculateTcs, calculateTotalPayable, getLiveRate } from "@/lib/financial"
import axios from "axios"
import { Loader2 } from "lucide-react"

interface Order {
  id: string
  purpose: string
  foreignBankCharges: number
  payer: string
  forexPartner: string
  margin: number
  receiverBankCountry: string
  studentName: string
  consultancy: string
  ibrRate: number
  amount: number
  currency: string
  totalAmount: number
  customerRate: number
  educationLoan?: string
  status: string
  createdAt: string
  updatedAt: string
}

interface TransactionDetailsProps {
  orderId: string
  onCreateOrder: () => void
  onBack: () => void
}

interface CalculatedValues {
  inrAmount: number
  bankFee: number
  gst: number
  tcsApplicable: number
  totalPayable: number
  customerRate: number
}

export default function TransactionDetails({ orderId, onCreateOrder, onBack }: TransactionDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [amount, setAmount] = useState<string>("")
  const [currency, setCurrency] = useState<string>("")
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    inrAmount: 0,
    bankFee: 1500,
    gst: 0,
    tcsApplicable: 0,
    totalPayable: 0,
    customerRate: 0,
  })

  const COUNTRY_CURRENCY_MAP = {
    Germany: "EUR",
    UAE: "AED",
    Australia: "AUD",
    Canada: "CAD",
    Switzerland: "CHF",
    France: "EUR",
    "United States of America": "USD",
    "United Kingdom": "GBP",
    "New Zealand": "NZD",
    Sweden: "SEK",
    Georgia: "EUR",
    Bulgaria: "EUR",
    Ireland: "EUR",
    Latvia: "EUR",
    Lithuania: "EUR",
    Uzbekistan: "USD",
  }

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/orders/${orderId}`)
        const orderData = response.data
        setOrder(orderData)
        setAmount(orderData.amount.toString())
        setCurrency(orderData.currency)

        // Set initial bank fee based on foreign bank charges
        setCalculatedValues((prev) => ({
          ...prev,
          bankFee: orderData.foreignBankCharges === 0 ? 1500 : 300,
        }))
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  // Update live rate when currency changes
  useEffect(() => {
    const updateLiveRate = async () => {
      if (currency && order) {
        try {
          const rate = await getLiveRate(currency, "INR")
          const newCustomerRate = rate + order.margin
          setCalculatedValues((prev) => ({
            ...prev,
            customerRate: newCustomerRate,
          }))
        } catch (error) {
          console.error("Error fetching live rate:", error)
        }
      }
    }

    updateLiveRate()
  }, [currency, order])

  // Calculate values when amount, currency, or other factors change
  useEffect(() => {
    if (amount && calculatedValues.customerRate && order) {
      const numAmount = Number.parseFloat(amount)
      const inrAmount = numAmount * calculatedValues.customerRate
      const gstAmount = Number.parseFloat(calculateGst(inrAmount))
      const tcsAmount = Number.parseFloat(calculateTcs(inrAmount, order.educationLoan === "yes" ? "education" : ""))
      const totalPayable = Number.parseFloat(calculateTotalPayable(inrAmount, calculatedValues.bankFee))

      setCalculatedValues((prev) => ({
        ...prev,
        inrAmount,
        gst: gstAmount,
        tcsApplicable: tcsAmount,
        totalPayable,
      }))
    }
  }, [amount, calculatedValues.customerRate, calculatedValues.bankFee, order])

  const handleUpdateOrder = async () => {
    if (!order) return

    try {
      setUpdating(true)

      const updateData = {
        ...order,
        amount: Number.parseFloat(amount),
        currency,
        customerRate: calculatedValues.customerRate,
        totalAmount: calculatedValues.totalPayable,
        ibrRate: calculatedValues.customerRate - order.margin,
      }

      await axios.patch(`/api/orders/${orderId}`, updateData)

      // Update local state
      setOrder((prev) => (prev ? { ...prev, ...updateData } : null))

      onCreateOrder()
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const getCurrencyOptions = () => {
    if (!order) return []

    const countryCurrency = COUNTRY_CURRENCY_MAP[order.receiverBankCountry as keyof typeof COUNTRY_CURRENCY_MAP]
    const options = [countryCurrency]

    // Add USD option for non-USD countries
    if (countryCurrency !== "USD") {
      options.push("USD")
    }

    return options.filter(Boolean)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The requested order could not be found.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Details Section */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 font-jakarta">Transaction Details</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Order ID</div>
                <div className="text-black font-semibold text-sm sm:text-base font-jakarta">{order.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Purpose</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.purpose}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Receiver&apos;s Bank Country</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.receiverBankCountry}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Foreign Bank Charges</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.foreignBankCharges === 0
                    ? "OUR (Sender bears bank charges)"
                    : "BEN (Receiver bears bank charges)"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Payer</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.payer}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Student Name</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.studentName}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Consultancy</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.consultancy}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Forex Partner</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.forexPartner}</div>
              </div>
            </div>
          </div>

          {/* Currency & Rate Details Section */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 font-jakarta">Currency & Rate Details</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Status</div>
                <div className="text-sm sm:text-base">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base">Amount</div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border rounded p-1 w-full mr-2 text-sm sm:text-base"
                    step="0.01"
                    min="0"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-dark-blue text-white px-2 sm:px-3 py-1 rounded text-sm sm:text-base font-jakarta appearance-none"
                  >
                    {getCurrencyOptions().map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Customer Rate</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  ₹{calculatedValues.customerRate.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Margin</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">{order.margin}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Total INR Amount</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  ₹
                  {calculatedValues.inrAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Section */}
        <div className="relative border-t pt-6 pb-4">
          {/* Timeline line - Hidden on mobile, visible from sm upwards */}
          <div className="hidden sm:block absolute right-8 top-6 bottom-0 w-0.5 bg-dark-rose">
            {/* Timeline dots */}
            <div className="absolute top-0 -right-2 w-5 h-5 flex items-center justify-center">
              <Image src="/round.png" alt="Timeline point" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="absolute top-[22%] -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image src="/round.png" alt="Timeline point" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="absolute top-[44%] -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image src="/round.png" alt="Timeline point" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="absolute top-[66%] -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image src="/round.png" alt="Timeline point" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="absolute bottom-0 -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image src="/round.png" alt="Timeline point" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 sm:space-y-6 sm:pr-16 mb-[-12px]">
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">INR Amount</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹
                {calculatedValues.inrAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">Bank Fee</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹{calculatedValues.bankFee.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">GST</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹{calculatedValues.gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">TCS Applicable</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹
                {calculatedValues.tcsApplicable.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            {/* Total Payable section */}
            <div className="relative pt-6 sm:pt-8">
              <div className="absolute top-0 left-0 right-0 border-t border-dark-rose mr-[-33px]"></div>
              <div className="flex justify-between items-center">
                <div className="font-bold text-font-gray text-sm sm:text-base font-jakarta">Total Payable</div>
                <div className="font-bold text-font-gray text-sm sm:text-base font-jakarta">
                  ₹
                  {calculatedValues.totalPayable.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8">
          <Button
            onClick={handleUpdateOrder}
            disabled={updating}
            className="bg-dark-blue hover:bg-dark-blue text-white font-jakarta px-8 sm:px-12 py-3 sm:py-4 rounded flex items-center w-full sm:w-auto"
          >
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Image src="/continue.svg" alt="" width={15} height={15} className="mr-2" />
            )}
            <span>{updating ? "Updating..." : "Update & Continue"}</span>
          </Button>
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 px-8 sm:px-12 py-3 sm:py-4 font-jakarta w-full sm:w-auto"
          >
            <Image src="/reset.svg" alt="" width={15} height={15} className="mr-2 sm:mr-0 sm:ml-2" />
            <span>Back</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
