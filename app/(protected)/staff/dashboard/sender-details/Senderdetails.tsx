"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formSchema, type FormValues as OriginalFormValues } from "@/schema/senderdetails"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import type { Sender } from "@prisma/client"

type FormValues = OriginalFormValues & {
  status?: string
}

function Senderdetails() {
  const router = useRouter()
  const [payer, setPayer] = useState<string>("self")
  const [showStatusPopup, setShowStatusPopup] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("pending")
  const [sameAddress, setSameAddress] = useState(false)
  const searchParams = useSearchParams()
  const [senderDetails, setSenderDetails] = useState<Sender | null>(null)
  const [orderId] = useState<string | null>(searchParams.get("orderId") || null)

  useEffect(() => {
    const storedPayer = localStorage.getItem("selectedPayer")
    if (storedPayer) {
      setPayer(storedPayer.toLowerCase())
    }
  }, [])

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const order = await axios.get(`/api/orders/${orderId}`)
          if (order.data.senderId) {
            const sender = await axios.get(`/api/senders/${order.data.senderId}`)
            if (sender.data) {
              setSenderDetails(sender.data)
              form.reset({
                ...sender.data,
                bankCharges: "resident",
                occupationStatus: "employed",
                sourceOfFunds: "salary",
              })
            }
          } else {
            router.push(`/staff/dashboard/sender-details`)
          }
        } catch (error) {
          console.error("Error fetching order:", error)
        }
      }
    }

    fetchOrder()
  }, [orderId])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: senderDetails?.studentName || "",
      studentEmailOriginal: senderDetails?.studentEmailOriginal || "",
      studentEmailFake: senderDetails?.studentEmailFake || "",
      phoneNumber: senderDetails?.phoneNumber || "",
      addressLine1: senderDetails?.addressLine1 || "",
      addressLine2: senderDetails?.addressLine2 || "",
      state: senderDetails?.state || "",
      postalCode: senderDetails?.postalCode || "",
      nationality:
        (senderDetails?.nationality as "indian" | "american" | "british" | "canadian" | "australian") || "indian",
      relationship: payer as "self" | "parent" | "brother" | "sister" | "spouse" | "other" | undefined,
      senderName: senderDetails?.senderName || "",
      bankCharges: (senderDetails?.bankCharges as "resident" | "nri" | "pio") || "resident",
      mothersName: senderDetails?.mothersName || "",
      dob: senderDetails?.dob || "",
      senderNationality:
        (senderDetails?.nationality as "indian" | "american" | "british" | "canadian" | "australian") || "indian",
      senderEmail: senderDetails?.senderEmail || "",
      sourceOfFunds: (senderDetails?.sourceOfFunds as "salary" | "savings" | "business" | "investment") || undefined,
      occupationStatus:
        (senderDetails?.occupationStatus as "employed" | "self-employed" | "business-owner" | "retired" | "student") ||
        undefined,
      payerAccountNumber: senderDetails?.payerAccountNumber || "",
      payerBankName: senderDetails?.payerBankName || "",
      senderAddressLine1: senderDetails?.senderAddressLine1 || "",
      senderAddressLine2: senderDetails?.senderAddressLine2 || "",
      senderState: senderDetails?.senderState || "",
      senderPostalCode: senderDetails?.senderPostalCode || "",
      status: senderDetails?.status || "pending",
    },
  })

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (orderId) {
        try {
          const order = await axios.get(`/api/orders/${orderId}`)
          if (order.data) {
            form.setValue("status", order.data.status || "pending")
          }
        } catch (error) {
          console.error("Error fetching order status:", error)
        }
      }
    }
    fetchOrderStatus()
  }, [orderId, form])

  useEffect(() => {
    form.setValue("relationship", payer as "self" | "parent" | "brother" | "sister" | "spouse" | "other" | undefined)
  }, [payer, form])

 const onSubmit = async (data: FormValues) => {
  const errors = form.formState.errors;
  if (Object.keys(errors).length > 0) {
    alert("Please fix the form errors before submitting");
    return;
  }

  try {
    
    const statusToUse = "pending";

    let response;
    if (senderDetails?.id) {
      response = await axios.put(`/api/senders/${senderDetails.id}`, {
        ...data,
        orderId: orderId,
      });
    } else {
      response = await axios.post("/api/senders", {
        ...data,
        orderId: orderId,
      });
    }

if (orderId && response.data) {
  try {
    console.log("Updating order status to:", statusToUse);
    await axios.patch(`/api/orders/${orderId}`, {
      status: statusToUse, // This will always be "pending"
      studentName: data.studentName,
      senderId: response.data.id, // Link the sender to the order
    });
    console.log("Order status updated successfully");
  } catch (patchError) {
    console.error("Error updating order status:", patchError);
    // Don't block the flow if order update fails
    alert("Sender details saved, but there was an issue updating the order status.");
  }
}

    if (response.data) {
      router.push(`/staff/dashboard/beneficiary-details?orderId=${orderId}`);
    }
  } catch (error) {
    console.error("Failed to create sender:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    alert("Failed to submit form. Please try again.");
  }
};

  const handleReset = () => {
    form.reset()
    setSameAddress(false)
    form.setValue("status", "pending")
  }

  const handleSameAddressChange = (checked: boolean) => {
    setSameAddress(checked)
    if (checked) {
      const { addressLine1, addressLine2, state, postalCode } = form.getValues()
      form.setValue("senderAddressLine1", addressLine1)
      form.setValue("senderAddressLine2", addressLine2)
      form.setValue("senderState", state)
      form.setValue("senderPostalCode", postalCode)
    }
  }

  const handleStatusConfirm = async () => {
    form.setValue("status", selectedStatus)
    if (orderId) {
      try {
        await axios.patch(`/api/orders/${orderId}`, {
          status: selectedStatus,
        })
      } catch (error) {
        console.error("Error updating status:", error)
        alert("Failed to update status. Please try again.")
      }
    }
    setShowStatusPopup(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) return // Prevent closing when clicking outside
    setShowStatusPopup(open)
  }

  return (
    <div>
      {/* Simplified Status Popup Dialog - Only Submit Button */}
      <Dialog open={showStatusPopup} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[90vw] max-w-[425px] md:w-full">
          <DialogHeader className="px-4 sm:px-6">
            <DialogTitle className="text-lg sm:text-xl">Rate Status</DialogTitle>
            <DialogDescription className="mt-2 sm:mt-3 text-sm sm:text-base">Update rate status</DialogDescription>
          </DialogHeader>
          <div className="px-4 sm:px-6 py-2 sm:py-4">
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
              <SelectTrigger className="w-full h-10 sm:h-12 text-sm sm:text-base">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base z-50">
                <SelectItem value="pending">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Button
              onClick={handleStatusConfirm}
              className="w-full h-10 sm:h-12 text-sm sm:text-base bg-dark-blue hover:bg-dark-blue"
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto -mt-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Tabs defaultValue="sender" className="w-full">
          <TabsContent value="sender">
            <Card className="shadow-none bg-transparent sm:bg-white sm:shadow-sm sm:border rounded-none">
              <CardContent className="p-0 sm:p-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    {/* Student Details Section - Always shown */}
                    <div className="p-6 sm:p-6 mb-5">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-jakarta">Student Details</h2>
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                        {/* Student Name */}
                        <FormField
                          control={form.control}
                          name="studentName"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Full Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Student name"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Student Email (Original) */}
                        <FormField
                          control={form.control}
                          name="studentEmailOriginal"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Student Email ID (Original)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ex: abc@gmail.com"
                                  type="email"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Student Email (Fake) */}
                        <FormField
                          control={form.control}
                          name="studentEmailFake"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Student Email ID (Fake)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ex: abc@gmail.com"
                                  type="email"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Phone Number */}
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Phone number
                              </FormLabel>
                              <FormControl>
                                <div className="flex">
                                  <div className="flex items-center justify-center px-3 bg-blue-50 border border-r-0 border-input rounded-none text-sm sm:text-base text-gray-500">
                                    +91
                                  </div>
                                  <Input
                                    placeholder="Please enter your phone number"
                                    className="rounded-none bg-blue-50 h-12 sm:h-14"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Address Line 1 */}
                        <FormField
                          control={form.control}
                          name="addressLine1"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500 text-gray-500">
                                Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Building name / House name / Flat number"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Address Line 2 */}
                        <FormField
                          control={form.control}
                          name="addressLine2"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2 mt-10">
                              <FormControl>
                                <Input
                                  placeholder="Street / Locality"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* State */}
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">State</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="State"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Postal Code */}
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Postal code
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Postal code"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Nationality */}
                        <FormField
                          control={form.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Nationality
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-blue-50 h-12 sm:h-14 rounded-none">
                                    <SelectValue placeholder="Select nationality" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-none text-gray-500">
                                  <SelectItem value="indian" className="rounded-none">
                                    Indian
                                  </SelectItem>
                                  <SelectItem value="american" className="rounded-none">
                                    American
                                  </SelectItem>
                                  <SelectItem value="british" className="rounded-none">
                                    British
                                  </SelectItem>
                                  <SelectItem value="canadian" className="rounded-none">
                                    Canadian
                                  </SelectItem>
                                  <SelectItem value="australian" className="rounded-none">
                                    Australian
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Conditionally render Sender Details Section based on payer */}
                    {payer !== "self" && (
                      <div className="p-4 sm:p-6 border-t border-gray-200">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-jakarta">Sender Details</h2>
                        {/* Relationship and Name */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                          {/* Relationship */}
                          <FormField
                            control={form.control}
                            name="relationship"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Relationship to Student
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-blue-50 font-jakarta h-12 sm:h-14 rounded-none">
                                      <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-none">
                                    <SelectItem value="parent" className="rounded-none">
                                      Parent
                                    </SelectItem>
                                    <SelectItem value="brother" className="rounded-none">
                                      Brother
                                    </SelectItem>
                                    <SelectItem value="sister" className="rounded-none">
                                      Sister
                                    </SelectItem>
                                    <SelectItem value="spouse" className="rounded-none">
                                      Spouse
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* Sender Name */}
                          <FormField
                            control={form.control}
                            name="senderName"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Full Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Sender name"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Sender Email - Add this after senderName field */}
                        <FormField
                          control={form.control}
                          name="senderEmail"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Email Address
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ex: sender@gmail.com"
                                  type="email"
                                  className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                          )}
                        />

                        {/* Foreign bank charges */}
                        <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                          <Label className="text-sm sm:text-base text-gray-500">Foreign bank charges</Label>
                          <div className="flex flex-wrap gap-3 sm:gap-4 mt-1 sm:mt-2">
                            <FormField
                              control={form.control}
                              name="bankCharges"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="radio"
                                      id="resident"
                                      className="h-4 w-4 rounded-none"
                                      checked={field.value === "resident"}
                                      onChange={() => field.onChange("resident")}
                                    />
                                  </FormControl>
                                  <Label htmlFor="resident" className="text-sm sm:text-base ">
                                    Resident
                                  </Label>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bankCharges"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="radio"
                                      id="nri"
                                      className="h-4 w-4 rounded-none"
                                      checked={field.value === "nri"}
                                      onChange={() => field.onChange("nri")}
                                    />
                                  </FormControl>
                                  <Label htmlFor="nri" className="text-sm sm:text-base">
                                    NRI
                                  </Label>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="bankCharges"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="radio"
                                      id="pio"
                                      className="h-4 w-4 rounded-none"
                                      checked={field.value === "pio"}
                                      onChange={() => field.onChange("pio")}
                                    />
                                  </FormControl>
                                  <Label htmlFor="pio" className="text-sm sm:text-base">
                                    PIO/OCI
                                  </Label>
                                </FormItem>
                              )}
                            />
                          </div>
                          {form.formState.errors.bankCharges && (
                            <p className="text-xs sm:text-sm font-medium text-destructive">
                              {form.formState.errors.bankCharges.message}
                            </p>
                          )}
                        </div>

                        {/* Mother's Name and DOB */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mt-4 sm:mt-6">
                          {/* Mother's Name */}
                          <FormField
                            control={form.control}
                            name="mothersName"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Mother&apos;s Name
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Mother's name"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* DOB */}
                          <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">DOB</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="DD/MM/YYYY"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Same address checkbox */}
                        <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="sameAddress"
                              className="h-4 w-4 rounded-none"
                              checked={sameAddress}
                              onChange={(e) => handleSameAddressChange(e.target.checked)}
                            />
                            <Label htmlFor="sameAddress" className="text-sm sm:text-base ">
                              Same address as student
                            </Label>
                          </div>
                        </div>

                        {/* Sender Address fields */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mt-4 sm:mt-6">
                          {/* Sender Address Line 1 */}
                          <FormField
                            control={form.control}
                            name="senderAddressLine1"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter Building name / House name / Flat number"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* Sender Address Line 2 */}
                          <FormField
                            control={form.control}
                            name="senderAddressLine2"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2 mt-10">
                                <FormControl>
                                  <Input
                                    placeholder="Street / Locality"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* Sender State */}
                          <FormField
                            control={form.control}
                            name="senderState"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">State</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="State"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* Sender Postal Code */}
                          <FormField
                            control={form.control}
                            name="senderPostalCode"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Postal code
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Postal code"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Source of funds and Occupation */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mt-4 sm:mt-6">
                          {/* Source of Funds */}
                          <FormField
                            control={form.control}
                            name="sourceOfFunds"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base">Source of funds</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-blue-50 font-jakarta h-12 sm:h-14 rounded-none">
                                      <SelectValue placeholder="Source of funds" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-none">
                                    <SelectItem value="salary" className="rounded-none">
                                      Salary
                                    </SelectItem>
                                    <SelectItem value="savings" className="rounded-none">
                                      Savings
                                    </SelectItem>
                                    <SelectItem value="business" className="rounded-none">
                                      Business Income
                                    </SelectItem>
                                    <SelectItem value="investment" className="rounded-none">
                                      Investment Returns
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* Occupation Status */}
                          <FormField
                            control={form.control}
                            name="occupationStatus"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base">Occupation status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-blue-50 font-jakarta h-12 sm:h-14 rounded-none">
                                      <SelectValue placeholder="Employment status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-none">
                                    <SelectItem value="employed" className="rounded-none">
                                      Employed
                                    </SelectItem>
                                    <SelectItem value="self-employed" className="rounded-none">
                                      Self-employed
                                    </SelectItem>
                                    <SelectItem value="business-owner" className="rounded-none">
                                      Business Owner
                                    </SelectItem>
                                    <SelectItem value="retired" className="rounded-none">
                                      Retired
                                    </SelectItem>
                                    <SelectItem value="student" className="rounded-none">
                                      Student
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Bank details */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mt-4 sm:mt-6">
                          {/* Payer Account Number */}
                          <FormField
                            control={form.control}
                            name="payerAccountNumber"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base">
                                  Payer Account Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="ex: 8467-434-5346"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />

                          {/* Payer Bank Name */}
                          <FormField
                            control={form.control}
                            name="payerBankName"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base">Payer Bank Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter bank name"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center p-4 sm:p-6 gap-3 sm:gap-4 border-t border-gray-200">
                      <Button
                        type="submit"
                        className="bg-dark-blue hover:bg-dark-blue text-white px-4 sm:px-8 h-12 sm:h-15 w-full sm:w-55 rounded-none"
                      >
                        <Image src="/continue.svg" alt="" width={15} height={15} className="mr-2" /> CONTINUE
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white hover:bg-white text-dark-gray border-gray-300 h-12 sm:h-15 w-full sm:w-55 rounded-none"
                        onClick={handleReset}
                      >
                        <Image src="/reset.svg" alt="" width={15} height={15} className="mr-2" /> RESET
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-xs text-white-500 mt-8">
        © 2025, Made by <span className="text-bold text-dark-blue">Buy Exchange</span>.
      </div>
    </div>
  )
}

export default Senderdetails
