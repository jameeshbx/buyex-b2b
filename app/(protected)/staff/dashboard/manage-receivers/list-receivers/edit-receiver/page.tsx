"use client"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import {
  countries,
  countryBankFields,
  defaultReceiverFormValues,
  receiverFormSchema,
  type ReceiverFormValues,
} from "@/data/receiver-schema"
import { Topbar } from "@/app/(protected)/staff/(components)/Topbar"
import { pagesData } from "@/data/navigation"
import { Suspense } from "react"

function AddReceiversPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")
  const isEditMode = Boolean(editId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReceiverFormValues>({
    resolver: zodResolver(receiverFormSchema),
    defaultValues: defaultReceiverFormValues,
    mode: "onChange",
  })

  const receiverCountry = watch("receiverCountry")
  const receiverBankCountry = watch("receiverBankCountry")
  const anyIntermediaryBank = watch("anyIntermediaryBank")

  // Fetch receiver data for editing
  useEffect(() => {
    if (isEditMode && editId) {
      const fetchReceiverData = async () => {
        try {
          setIsLoading(true)
          const response = await axios.get(`/api/beneficiaries/${editId}`)
          const receiverData = response.data

          // Reset form with fetched data
          reset({
            receiverFullName: receiverData.receiverFullName || "",
            receiverCountry: receiverData.receiverCountry || "United States",
            address: receiverData.address || "",
            receiverBank: receiverData.receiverBank || "",
            receiverBankAddress: receiverData.receiverBankAddress || "",
            receiverBankCountry: receiverData.receiverBankCountry || "United States",
            receiverAccount: receiverData.receiverAccount || "",
            receiverBankSwiftCode: receiverData.receiverBankSwiftCode || "",
            iban: receiverData.iban || "",
            sortCode: receiverData.sortCode || "",
            transitNumber: receiverData.transitNumber || "",
            bsbCode: receiverData.bsbCode || "",
            routingNumber: receiverData.routingNumber || "",
            anyIntermediaryBank: (receiverData.anyIntermediaryBank as "YES" | "NO") || "NO",
            intermediaryBankName: receiverData.intermediaryBankName || "",
            intermediaryBankAccountNo: receiverData.intermediaryBankAccountNo || "",
            intermediaryBankIBAN: receiverData.intermediaryBankIBAN || "",
            intermediaryBankSwiftCode: receiverData.intermediaryBankSwiftCode || "",
            status: receiverData.status !== undefined ? receiverData.status : true,
          })

          toast.success("Receiver data loaded successfully")
        } catch (error) {
          console.error("Failed to fetch receiver data:", error)

          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message || error.response?.data?.error || "Failed to load receiver data"
            toast.error(errorMessage)
          } else {
            toast.error("Failed to load receiver data")
          }

          // Redirect back to list if receiver not found
          router.push("/staff/dashboard/manage-receivers/list-receivers")
        } finally {
          setIsLoading(false)
        }
      }

      fetchReceiverData()
    }
  }, [isEditMode, editId, reset, router])

  const onSubmit: SubmitHandler<ReceiverFormValues> = async (data) => {
    try {
      setIsSubmitting(true)

      if (isEditMode && editId) {
        // Update existing receiver
        await axios.put(`/api/beneficiaries/${editId}`, {
          ...data,
          iban: data.iban || "",
          sortCode: data.sortCode || "",
          transitNumber: data.transitNumber || "",
          bsbCode: data.bsbCode || "",
          routingNumber: data.routingNumber || "",
          intermediaryBankName: data.intermediaryBankName || "",
          intermediaryBankAccountNo: data.intermediaryBankAccountNo || "",
          intermediaryBankIBAN: data.intermediaryBankIBAN || "",
          intermediaryBankSwiftCode: data.intermediaryBankSwiftCode || "",
          totalRemittance: "0", // Required field
          field70: "", // Required field
        })
        toast.success("Receiver updated successfully!")
      } else {
        // Create new receiver
        await axios.post("/api/beneficiaries", {
          ...data,
          iban: data.iban || undefined,
          totalRemittance: "0", // Add required field for new receivers
          field70: "", // Add required field for new receivers
        })
        toast.success("Receiver added successfully!")
      }

      router.push("/staff/dashboard/manage-receivers/list-receivers")
    } catch (error: unknown) {
      console.error("Error submitting form:", error)

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          `Failed to ${isEditMode ? "update" : "add"} receiver. Please try again.`
        toast.error(errorMessage)
      } else {
        toast.error(`Failed to ${isEditMode ? "update" : "add"} receiver. Please try again.`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const shouldShowField = (fieldName: string, country: string): boolean => {
    const fieldsToShow = Object.entries(countryBankFields).find(([countries]) =>
      countries.split(", ").includes(country),
    )
    return fieldsToShow ? fieldsToShow[1].includes(fieldName) : false
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.addReceivers} />
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading receiver data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Topbar */}
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.editReceivers} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 pt-8">
        <div className="bg-white shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Receiver" : "Add New Receiver"}</h1>
            {isEditMode && <p className="text-gray-600 mt-2">Update the receiver information below</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Receiver's full Name */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver's full Name"}
                </label>
                <input
                  type="text"
                  placeholder="Receiver's name"
                  {...register("receiverFullName")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.receiverFullName ? "border border-red-500" : ""}`}
                />
                {errors.receiverFullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverFullName.message}</p>
                )}
              </div>

              {/* Receiver's country */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver's country"}
                </label>
                <div className="relative">
                  <select
                    {...register("receiverCountry")}
                    className={`w-full p-3 bg-blue-50 rounded-md appearance-none pr-10 text-sm sm:text-base ${errors.receiverCountry ? "border border-red-500" : ""}`}
                    onChange={(e) => {
                      setValue("receiverCountry", e.target.value)
                      if (!receiverBankCountry || receiverBankCountry === receiverCountry) {
                        setValue("receiverBankCountry", e.target.value)
                      }
                    }}
                    value={receiverCountry}
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.receiverCountry && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverCountry.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  {...register("address")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.address ? "border border-red-500" : ""}`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
              </div>

              {/* Receiver's bank */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver's bank"}
                </label>
                <input
                  type="text"
                  placeholder="Receiver's bank"
                  {...register("receiverBank")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.receiverBank ? "border border-red-500" : ""}`}
                />
                {errors.receiverBank && <p className="text-red-500 text-sm mt-1">{errors.receiverBank.message}</p>}
              </div>

              {/* Receiver's bank address */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver's bank address"}
                </label>
                <input
                  type="text"
                  placeholder="Receiver's bank address"
                  {...register("receiverBankAddress")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.receiverBankAddress ? "border border-red-500" : ""}`}
                />
                {errors.receiverBankAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverBankAddress.message}</p>
                )}
              </div>

              {/* Receiver bank's country */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver bank's country"}
                </label>
                <div className="relative">
                  <select
                    {...register("receiverBankCountry")}
                    className={`w-full p-3 bg-blue-50 rounded-md appearance-none pr-10 text-sm sm:text-base ${errors.receiverBankCountry ? "border border-red-500" : ""}`}
                  >
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.receiverBankCountry && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverBankCountry.message}</p>
                )}
              </div>

              {/* Receiver's account */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver's account"}
                </label>
                <input
                  type="text"
                  placeholder="Receiver's account"
                  {...register("receiverAccount")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.receiverAccount ? "border border-red-500" : ""}`}
                />
                {errors.receiverAccount && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverAccount.message}</p>
                )}
              </div>

              {/* Receiver's bank swift code */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                  {"Receiver's bank Swift/BIC code"}
                </label>
                <input
                  type="text"
                  placeholder="Receiver's bank Swift/BIC code"
                  {...register("receiverBankSwiftCode")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.receiverBankSwiftCode ? "border border-red-500" : ""}`}
                />
                {errors.receiverBankSwiftCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverBankSwiftCode.message}</p>
                )}
              </div>

              {/* IBAN - Always shown */}
              <div>
                <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">IBAN</label>
                <input
                  type="text"
                  placeholder="IBAN"
                  {...register("iban")}
                  className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.iban ? "border border-red-500" : ""}`}
                />
                {errors.iban && <p className="text-red-500 text-sm mt-1">{errors.iban.message}</p>}
              </div>

              {/* Sort code - conditionally shown */}
              {shouldShowField("sortCode", receiverBankCountry) && (
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">Sort code</label>
                  <input
                    type="text"
                    placeholder="Sort code"
                    {...register("sortCode")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.sortCode ? "border border-red-500" : ""}`}
                  />
                  {errors.sortCode && <p className="text-red-500 text-sm mt-1">{errors.sortCode.message}</p>}
                </div>
              )}

              {/* Transit number - conditionally shown */}
              {shouldShowField("transitNumber", receiverBankCountry) && (
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">Transit number</label>
                  <input
                    type="text"
                    placeholder="Transit number"
                    {...register("transitNumber")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.transitNumber ? "border border-red-500" : ""}`}
                  />
                  {errors.transitNumber && <p className="text-red-500 text-sm mt-1">{errors.transitNumber.message}</p>}
                </div>
              )}

              {/* BSB code - conditionally shown */}
              {shouldShowField("bsbCode", receiverBankCountry) && (
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">BSB code</label>
                  <input
                    type="text"
                    placeholder="BSB code"
                    {...register("bsbCode")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.bsbCode ? "border border-red-500" : ""}`}
                  />
                  {errors.bsbCode && <p className="text-red-500 text-sm mt-1">{errors.bsbCode.message}</p>}
                </div>
              )}

              {/* Routing number - conditionally shown */}
              {shouldShowField("routingNumber", receiverBankCountry) && (
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">Routing number</label>
                  <input
                    type="text"
                    placeholder="Routing number"
                    {...register("routingNumber")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.routingNumber ? "border border-red-500" : ""}`}
                  />
                  {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber.message}</p>}
                </div>
              )}

              {/* Any Intermediary bank exists? */}
              <div className="lg:col-span-2 mt-4">
                <p className="text-gray-600 mb-2 font-jakarta text-sm sm:text-base">Any Intermediary bank exists?</p>
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <label className="flex items-center relative">
                    <span className="relative w-6 h-6 flex items-center justify-center">
                      <input
                        type="radio"
                        value="YES"
                        {...register("anyIntermediaryBank")}
                        className="appearance-none w-6 h-6 border-2 rounded-lg checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                      />
                      {watch("anyIntermediaryBank") === "YES" && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-dark-blue checked:border-dark-blue rounded-md w-full h-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 10.5 17 4 10.5" />
                            </svg>
                          </span>
                        </span>
                      )}
                    </span>
                    <span
                      className={`ml-3 font-Inter text-base font-medium ${
                        watch("anyIntermediaryBank") === "YES" ? "text-black" : "text-light-gray"
                      }`}
                    >
                      YES
                    </span>
                  </label>
                  <label className="flex items-center relative">
                    <span className="relative w-6 h-6 flex items-center justify-center">
                      <input
                        type="radio"
                        value="NO"
                        {...register("anyIntermediaryBank")}
                        className="appearance-none w-6 h-6 border-2 rounded-lg checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                      />
                      {watch("anyIntermediaryBank") === "NO" && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-dark-blue checked:border-dark-blue rounded-md w-full h-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 10.5 17 4 10.5" />
                            </svg>
                          </span>
                        </span>
                      )}
                    </span>
                    <span
                      className={`ml-3 font-Inter text-base font-medium ${
                        watch("anyIntermediaryBank") === "NO" ? "text-black" : "text-light-gray"
                      }`}
                    >
                      NO
                    </span>
                  </label>
                </div>
              </div>

              {/* Intermediary bank details - conditionally shown */}
              {anyIntermediaryBank === "YES" && (
                <>
                  {/* Intermediary bank name */}
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Intermediary bank name (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="Intermediary bank name"
                      {...register("intermediaryBankName")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.intermediaryBankName ? "border border-red-500" : ""}`}
                    />
                    {errors.intermediaryBankName && (
                      <p className="text-red-500 text-sm mt-1">{errors.intermediaryBankName.message}</p>
                    )}
                  </div>

                  {/* Intermediary bank account no. */}
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Intermediary bank account no. (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="Intermediary bank account no."
                      {...register("intermediaryBankAccountNo")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.intermediaryBankAccountNo ? "border border-red-500" : ""}`}
                    />
                    {errors.intermediaryBankAccountNo && (
                      <p className="text-red-500 text-sm mt-1">{errors.intermediaryBankAccountNo.message}</p>
                    )}
                  </div>

                  {/* Intermediary bank IBAN / Sort code / BSB / Routing No. */}
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Intermediary bank IBAN / Sort code / BSB / Routing No.
                    </label>
                    <input
                      type="text"
                      placeholder="Intermediary bank IBAN / Sort code / BSB / Routing No."
                      {...register("intermediaryBankIBAN")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.intermediaryBankIBAN ? "border border-red-500" : ""}`}
                    />
                    {errors.intermediaryBankIBAN && (
                      <p className="text-red-500 text-sm mt-1">{errors.intermediaryBankIBAN.message}</p>
                    )}
                  </div>

                  {/* Intermediary bank Swift code */}
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Intermediary bank Swift code
                    </label>
                    <input
                      type="text"
                      placeholder="Intermediary bank swift code"
                      {...register("intermediaryBankSwiftCode")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${errors.intermediaryBankSwiftCode ? "border border-red-500" : ""}`}
                    />
                    {errors.intermediaryBankSwiftCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.intermediaryBankSwiftCode.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-8 gap-4">
              <button
                type="button"
                onClick={() => router.push("/staff/dashboard/manage-receivers/list-receivers")}
                className="bg-gray-500 text-white font-jakarta px-6 sm:px-8 py-3 rounded-md text-sm sm:text-base hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-dark-blue text-white font-jakarta px-6 sm:px-8 py-3 rounded-md flex items-center justify-center text-sm sm:text-base hover:bg-blue-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  `${isEditMode ? "Updating..." : "Adding..."}`
                ) : (
                  <>
                    <Image src="/addreceivers.png" alt="Continue" className="mr-2 h-6 w-6" width={30} height={30} />
                    {isEditMode ? "Update receiver" : "Add receiver"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="text-xs text-gray-500 mt-8 pb-4">
          © 2025, Made by <span className="text-dark-blue font-bold">BuyExchange</span>.
        </div>
      </div>
    </div>
  )
}

export default function AddReceiversPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddReceiversPageInner />
    </Suspense>
  )
}
