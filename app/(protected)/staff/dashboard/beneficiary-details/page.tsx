"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { ChevronDown, ChevronUp, Eye, Trash2 } from "lucide-react"
import {
  beneficiaryFormSchema,
  countries,
  countryBankFields,
  defaultFormValues,
  existingReceivers,
  type BeneficiaryFormValues,
} from "@/data/country-data"
import { Topbar } from "../../(components)/Topbar"
import { pagesData } from "@/data/navigation"
import BreadcrumbMenubar from "../../(components)/Menubar"

export default function BeneficiaryDetailsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeStaffInfo, setActiveStaffInfo] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [receiverStatuses, setReceiverStatuses] = useState<Record<string, boolean>>(() => {
    // Initialize with the status from existingReceivers
    const initialStatuses: Record<string, boolean> = {}
    existingReceivers.forEach((receiver) => {
      initialStatuses[receiver.id] = receiver.status
    })
    return initialStatuses
  })
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiaryFormSchema),
    defaultValues: defaultFormValues,
  })

  const existingReceiver = watch("existingReceiver")
  const receiverCountry = watch("receiverCountry")
  const receiverBankCountry = watch("receiverBankCountry")
  const anyIntermediaryBank = watch("anyIntermediaryBank")

  const onSubmit = (data: BeneficiaryFormValues) => {
    console.log("Form submitted:", data)
    // Handle form submission
  }

  const handleReset = () => {
    reset(defaultFormValues)
  }

  const selectReceiver = (receiver: (typeof existingReceivers)[0]) => {
    setValue("selectedReceiverId", receiver.id)
  }

  const toggleStatus = (receiverId: string) => {
    setReceiverStatuses((prev) => ({
      ...prev,
      [receiverId]: !prev[receiverId],
    }))
  }

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
  }

  const handleCountryFilter = (country: string | null) => {
    setSelectedCountry(country)
    setShowCountryDropdown(false)
  }

  const getSortedReceivers = () => {
    const filteredData = existingReceivers.filter((receiver) => {
      const matchesSearch =
        searchTerm === "" ||
        receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receiver.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCountry = !selectedCountry || receiver.country === selectedCountry

      return matchesSearch && matchesCountry
    })

    if (sortConfig !== null) {
      return [...filteredData].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filteredData
  }

  // Determine which bank fields to show based on country
  const shouldShowField = (fieldName: string, country: string) => {
    const fieldsToShow = Object.entries(countryBankFields).find(([countries]) =>
      countries.split(", ").includes(country),
    )

    return fieldsToShow ? fieldsToShow[1].includes(fieldName) : false
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeStaffInfo && !(event.target as Element).closest(".staff-info-popup")) {
        setActiveStaffInfo(null)
      }

      if (showCountryDropdown && !(event.target as Element).closest(".country-filter-dropdown")) {
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeStaffInfo, showCountryDropdown])

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar pageData={pagesData.newBeneficiary} />
      <div className="container mx-auto px-4 py-6">
        <BreadcrumbMenubar />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing receiver selection */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2 font-jakarta">Existing receiver?</p>
              <div className="flex items-center space-x-6">
                <label className="flex items-center mr-10 relative">
                  <span className="relative w-6 h-6 flex items-center justify-center">
                    <input
                      type="radio"
                      value="YES"
                      {...register("existingReceiver")}
                      className="appearance-none w-6 h-6 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                    />
                    {/* Tick icon when checked, centered with blue bg */}
                    {watch("existingReceiver") === "YES" && (
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
                      watch("existingReceiver") === "YES" ? "text-black" : "text-light-gray"
                    }`}
                  >
                    YES
                  </span>
                </label>
                <label className="flex items-center mr-10 relative">
                  <span className="relative w-6 h-6 flex items-center justify-center">
                    <input
                      type="radio"
                      value="NO"
                      {...register("existingReceiver")}
                      className="appearance-none w-6 h-6 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                    />
                    {/* Tick icon when checked, centered with blue bg */}
                    {watch("existingReceiver") === "NO" && (
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
                      watch("existingReceiver") === "NO" ? "text-black" : "text-light-gray"
                    }`}
                  >
                    NO
                  </span>
                </label>
              </div>
            </div>

            {existingReceiver === "YES" ? (
              /* Existing receivers table */
              <div className="mb-6">
                <div className="flex flex-wrap justify-between mb-4 gap-2 sticky top-0 bg-white z-30 py-2">
                  <div className="relative country-filter-dropdown">
                    <button
                      type="button"
                      className="flex items-center bg-dark-blue text-white font-jakarta px-4 py-2 rounded-md"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    >
                      {selectedCountry ? `Filtered: ${selectedCountry}` : "Filter by country"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-20 mt-1 bg-white shadow-lg rounded-md z-20 w-48">
                        <ul className="py-1">
                          <li>
                            <button
                              type="button"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-medium"
                              onClick={() => handleCountryFilter(null)}
                            >
                              All Countries
                            </button>
                          </li>
                          {countries.map((country) => (
                            <li key={country.value}>
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleCountryFilter(country.value)}
                              >
                                {country.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg font-jakarta bg-light-blue"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="overflow-auto max-h-[500px] rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white sticky top-0 z-20 relative">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        ></th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("id")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Receiver ID
                            <span className="ml-1">
                              {sortConfig?.key === "id" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("name")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Name
                            <span className="ml-1">
                              {sortConfig?.key === "name" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("country")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Country
                            <span className="ml-1">
                              {sortConfig?.key === "country" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("address")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Address
                            <span className="ml-1">
                              {sortConfig?.key === "address" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("bankName")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Bank name
                            <span className="ml-1">
                              {sortConfig?.key === "bankName" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("bankCountry")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Bank country
                            <span className="ml-1">
                              {sortConfig?.key === "bankCountry" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("accountNo")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Account No.
                            <span className="ml-1">
                              {sortConfig?.key === "accountNo" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("status")}
                        >
                          <div className="flex items-center font-jakarta text-gray-700">
                            Status
                            <span className="ml-1">
                              {sortConfig?.key === "status" ? (
                                sortConfig.direction === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-300" />
                              )}
                            </span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium font-jakarta text-gray-700 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-light-blue divide-y-4 divide-white">
                      {getSortedReceivers().map((receiver) => (
                        <tr
                          key={receiver.id}
                          className={receiver.id === watch("selectedReceiverId") ? "bg-blue-50" : ""}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <label className="flex items-center relative">
                              <span className="relative w-5 h-5 flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="selectedReceiver"
                                  className="appearance-none w-5 h-5 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                                  checked={receiver.id === watch("selectedReceiverId")}
                                  onClick={() => {
                                    if (receiver.id === watch("selectedReceiverId")) {
                                      // Deselect if already selected
                                      selectReceiver({ ...receiver, id: "" })
                                    } else {
                                      selectReceiver(receiver)
                                    }
                                  }}
                                  readOnly
                                />
                                {receiver.id === watch("selectedReceiverId") && (
                                  <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-dark-blue checked:border-dark-blue rounded-md w-full h-full flex items-center justify-center">
                                      <svg
                                        className="w-3 h-3 text-white"
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
                            </label>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-jakarta font-semibold">
                            {receiver.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-jakarta font-semibold">
                            {receiver.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                            {receiver.country}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                            {receiver.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                            {receiver.bankName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                            {receiver.bankCountry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-jakarta font-semibold">
                            {receiver.accountNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => toggleStatus(receiver.id)}
                              className={`h-6 w-12 rounded-full flex items-center transition-colors ${
                                receiverStatuses[receiver.id] ? "bg-blue-100 justify-end" : "bg-gray-200 justify-start"
                              }`}
                            >
                              <div
                                className={`h-5 w-5 rounded-full transition-all ${
                                  receiverStatuses[receiver.id] ? "bg-blue-600 mr-0.5" : "bg-gray-400 ml-0.5"
                                }`}
                              ></div>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-3">
                              <button
                                type="button"
                                className="text-orange-500 hover:text-orange-700"
                                onClick={() => {
                                  // View details action
                                  console.log(`View details for ${receiver.id}`)
                                }}
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <div className="relative">
                                <button
                                  type="button"
                                  className="text-gray-600 hover:text-gray-800"
                                  onClick={() => {
                                    // Toggle staff info popup for this receiver
                                    setActiveStaffInfo(activeStaffInfo === receiver.id ? null : receiver.id)
                                  }}
                                >
                                  ⋮
                                </button>
                                {activeStaffInfo === receiver.id && (
                                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 staff-info-popup">
                                    <div className="p-3 flex flex-col space-y-2">
                                      <div className="flex items-start space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-md">
                                          <Trash2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                          <div className="font-medium text-sm">Added by : StaffA</div>
                                          <div className="text-xs text-gray-500 mt-1">09:20AM 04 May</div>
                                        </div>
                                      </div>
                                      <button
                                        className="flex items-center space-x-2 text-red-500 hover:text-red-700 mt-2 text-sm"
                                        onClick={() => console.log(`Delete ${receiver.id}`)}
                                      ></button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* New receiver form */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Receiver's full Name */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta">{"Receiver's full Name"}</label>
                  <input
                    type="text"
                    placeholder="Beneficiary's name"
                    {...register("receiverFullName")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.receiverFullName ? "border border-red-500" : ""}`}
                  />
                  {errors.receiverFullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.receiverFullName.message}</p>
                  )}
                </div>

                {/* Receiver's country */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta">{"Receiver's country"}</label>
                  <div className="relative">
                    <select
                      {...register("receiverCountry")}
                      className={`w-full p-3 bg-blue-50 rounded-md appearance-none pr-10 ${errors.receiverCountry ? "border border-red-500" : ""}`}
                      onChange={(e) => {
                        setValue("receiverCountry", e.target.value)
                        // Only set receiverBankCountry if it's not already set or matches the previous receiverCountry
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
                  <label className="block text-gray-600 mb-2 font-jakarta">Address</label>
                  <input
                    type="text"
                    placeholder="Address"
                    {...register("address")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.address ? "border border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>

                {/* Receiver's bank */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta">{"Receiver's bank"}</label>
                  <input
                    type="text"
                    placeholder="Beneficiary's bank"
                    {...register("receiverBank")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.receiverBank ? "border border-red-500" : ""}`}
                  />
                  {errors.receiverBank && <p className="text-red-500 text-sm mt-1">{errors.receiverBank.message}</p>}
                </div>

                {/* Receiver's bank address */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta mb-2">{"Receiver's bank address"}</label>
                  <input
                    type="text"
                    placeholder="Beneficiary's bank address"
                    {...register("receiverBankAddress")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.receiverBankAddress ? "border border-red-500" : ""}`}
                  />
                  {errors.receiverBankAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.receiverBankAddress.message}</p>
                  )}
                </div>

                {/* Receiver bank's country */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta">{"Receiver bank's country"}</label>
                  <div className="relative">
                    <select
                      {...register("receiverBankCountry")}
                      className={`w-full p-3 bg-blue-50 rounded-md appearance-none pr-10 ${errors.receiverBankCountry ? "border border-red-500" : ""}`}
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
                  <label className="block text-gray-600 mb-2 font-jakarta">{"Receiver's account"}</label>
                  <input
                    type="text"
                    placeholder="Beneficiary's account"
                    {...register("receiverAccount")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.receiverAccount ? "border border-red-500" : ""}`}
                  />
                  {errors.receiverAccount && (
                    <p className="text-red-500 text-sm mt-1">{errors.receiverAccount.message}</p>
                  )}
                </div>

                {/* Receiver's bank swift code */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta mb-2">{"Receiver's bank swift code"}</label>
                  <input
                    type="text"
                    placeholder="Beneficiary's bank swift code"
                    {...register("receiverBankSwiftCode")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.receiverBankSwiftCode ? "border border-red-500" : ""}`}
                  />
                  {errors.receiverBankSwiftCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.receiverBankSwiftCode.message}</p>
                  )}
                </div>

                {/* IBAN - conditionally shown */}
                {shouldShowField("iban", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta mb-2">IBAN</label>
                    <input
                      type="text"
                      placeholder="IBAN"
                      {...register("iban")}
                      className={`w-full p-3 bg-blue-50 rounded-md ${errors.iban ? "border border-red-500" : ""}`}
                    />
                    {errors.iban && <p className="text-red-500 text-sm mt-1">{errors.iban.message}</p>}
                  </div>
                )}

                {/* Sort code - conditionally shown */}
                {shouldShowField("sortCode", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta mb-2">Sort code</label>
                    <input
                      type="text"
                      placeholder="Sort code"
                      {...register("sortCode")}
                      className={`w-full p-3 bg-blue-50 rounded-md ${errors.sortCode ? "border border-red-500" : ""}`}
                    />
                    {errors.sortCode && <p className="text-red-500 text-sm mt-1">{errors.sortCode.message}</p>}
                  </div>
                )}

                {/* Transit number - conditionally shown */}
                {shouldShowField("transitNumber", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta mb-2">Transit number</label>
                    <input
                      type="text"
                      placeholder="Transit number"
                      {...register("transitNumber")}
                      className={`w-full p-3 bg-blue-50 rounded-md ${errors.transitNumber ? "border border-red-500" : ""}`}
                    />
                    {errors.transitNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.transitNumber.message}</p>
                    )}
                  </div>
                )}

                {/* BSB code - conditionally shown */}
                {shouldShowField("bsbCode", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta mb-2">BSB code</label>
                    <input
                      type="text"
                      placeholder="BSB code"
                      {...register("bsbCode")}
                      className={`w-full p-3 bg-blue-50 rounded-md ${errors.bsbCode ? "border border-red-500" : ""}`}
                    />
                    {errors.bsbCode && <p className="text-red-500 text-sm mt-1">{errors.bsbCode.message}</p>}
                  </div>
                )}

                {/* Routing number - conditionally shown */}
                {shouldShowField("routingNumber", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta mb-2">Routing number</label>
                    <input
                      type="text"
                      placeholder="Routing number"
                      {...register("routingNumber")}
                      className={`w-full p-3 bg-blue-50 rounded-md ${errors.routingNumber ? "border border-red-500" : ""}`}
                    />
                    {errors.routingNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.routingNumber.message}</p>
                    )}
                  </div>
                )}

                {/* Any Intermediary bank exists? */}
                <div className="md:col-span-2 mt-4">
                  <p className="text-gray-600 mb-2 font-jakarta mb-2">Any Intermediary bank exists?</p>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center mr-10 relative">
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
                    <label className="flex items-center mr-10 relative">
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
                      <label className="block text-gray-600 mb-2 font-jakarta mb-2">
                        Intermediary bank name (if applicable)
                      </label>
                      <input
                        type="text"
                        placeholder="Intermediary bank name"
                        {...register("intermediaryBankName")}
                        className="w-full p-3 bg-blue-50 rounded-md"
                      />
                    </div>

                    {/* Intermediary bank account no. */}
                    <div>
                      <label className="block text-gray-600 mb-2 font-jakarta mb-2">
                        Intermediary bank account no. (if applicable)
                      </label>
                      <input
                        type="text"
                        placeholder="Intermediary bank account no."
                        {...register("intermediaryBankAccountNo")}
                        className="w-full p-3 bg-blue-50 rounded-md"
                      />
                    </div>

                    {/* Intermediary bank IBAN / Sort code / BSB / Routing No. */}
                    <div>
                      <label className="block text-gray-600 mb-2 font-jakarta mb-2">
                        Intermediary bank IBAN / Sort code / BSB / Routing No.
                      </label>
                      <input
                        type="text"
                        placeholder="Intermediary bank IBAN / Sort code / BSB / Routing No."
                        {...register("intermediaryBankIBAN")}
                        className="w-full p-3 bg-blue-50 rounded-md"
                      />
                    </div>

                    {/* Intermediary bank Swift code */}
                    <div>
                      <label className="block text-gray-600 mb-2 font-jakarta mb-2">Intermediary bank Swift code</label>
                      <input
                        type="text"
                        placeholder="Intermediary bank swift code"
                        {...register("intermediaryBankSwiftCode")}
                        className="w-full p-3 bg-blue-50 rounded-md"
                      />
                    </div>
                  </>
                )}

                {/* Total remittance made in INR */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta mb-2">Total remittance made in INR</label>
                  <input
                    type="text"
                    placeholder="Current Financial year"
                    {...register("totalRemittance")}
                    className={`w-full p-3 bg-blue-50 rounded-md ${errors.totalRemittance ? "border border-red-500" : ""}`}
                  />
                  {errors.totalRemittance && (
                    <p className="text-red-500 text-sm mt-1">{errors.totalRemittance.message}</p>
                  )}
                </div>

                {/* Field 70 - special information to receiver */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta mb-2">
                    Field 70 - special information to receiver
                  </label>
                  <textarea
                    placeholder="Type here"
                    {...register("field70")}
                    className="w-full p-3 bg-blue-50 rounded-md h-24"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Form buttons */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                type="submit"
                className="bg-dark-blue text-white font-jakarta px-8 py-3 rounded-md flex items-center"
              >
                <Image src="/continue.png" alt="Continue" className="mr-2 h-3 w-3" width={20} height={20} />
                CONTINUE
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="border border-gray-300 text-gray-700 font-jakarta px-8 py-3 rounded-md flex items-center"
              >
                <Image src="/reset.png" alt="Reset" className="mr-2 h-3 w-3" width={20} height={20} />
                RESET
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-8 pb-4">
        © 2025, Made by <span className="text-dark-blue font-bold">BuyExchange</span>.
      </div>
    </div>
  )
}
