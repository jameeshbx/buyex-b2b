"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import type { Beneficiary } from "@prisma/client"
import { pagesData } from "@/data/navigation"
import Image from "next/image"
import { Topbar } from "../../../(components)/Topbar"
import BreadcrumbMenubar from "../../../(components)/Menubar"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function BeneficiaryDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [beneficiaryId, setBeneficiaryId] = useState<string | null>(null)

  // Resolve the async params
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params
        setBeneficiaryId(resolvedParams.id)
      } catch {
        setError("Failed to load page parameters")
        setLoading(false)
      }
    }

    resolveParams()
  }, [params])

  // Fetch beneficiary data when ID is available
  useEffect(() => {
    if (!beneficiaryId) return

    const fetchBeneficiary = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/beneficiaries/${beneficiaryId}`)
        setBeneficiary(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch beneficiary details")
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBeneficiary()
  }, [beneficiaryId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.beneficiaryDetails} />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark-blue"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.beneficiaryDetails} />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push("/staff/dashboard/manage-receivers/list-receivers")}
              className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!beneficiary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.beneficiaryDetails} />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="mb-4">Beneficiary not found</p>
            <button
              onClick={() => router.push("/staff/dashboard/manage-receivers/list-receivers")}
              className="bg-dark-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Topbar */}
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.beneficiaryDetails} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <BreadcrumbMenubar />
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Beneficiary Details</h1>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  beneficiary.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {beneficiary.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Full Name</p>
                    <p className="font-medium text-gray-900">{beneficiary.receiverFullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Country</p>
                    <p className="font-medium text-gray-900">{beneficiary.receiverCountry}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Address</p>
                    <p className="font-medium text-gray-900">{beneficiary.address}</p>
                  </div>
                  {beneficiary.receiverBankAddress && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Bank Address</p>
                      <p className="font-medium text-gray-900">{beneficiary.receiverBankAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Banking Details */}
              <div>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Additional Banking Details</h2>
                <div className="space-y-4">
                  {beneficiary.iban && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">IBAN</p>
                      <p className="font-medium text-gray-900 font-mono">{beneficiary.iban}</p>
                    </div>
                  )}
                  {beneficiary.sortCode && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Sort Code</p>
                      <p className="font-medium text-gray-900 font-mono">{beneficiary.sortCode}</p>
                    </div>
                  )}
                  {beneficiary.transitNumber && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Transit Number</p>
                      <p className="font-medium text-gray-900 font-mono">{beneficiary.transitNumber}</p>
                    </div>
                  )}
                  {beneficiary.bsbCode && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">BSB Code</p>
                      <p className="font-medium text-gray-900 font-mono">{beneficiary.bsbCode}</p>
                    </div>
                  )}
                  {beneficiary.routingNumber && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Routing Number</p>
                      <p className="font-medium text-gray-900 font-mono">{beneficiary.routingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Bank Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Bank Name</p>
                    <p className="font-medium text-gray-900">{beneficiary.receiverBank}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Bank Country</p>
                    <p className="font-medium text-gray-900">{beneficiary.receiverBankCountry}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Account Number</p>
                    <p className="font-medium text-gray-900 font-mono">{beneficiary.receiverAccount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">SWIFT/BIC Code</p>
                    <p className="font-medium text-gray-900 font-mono">{beneficiary.receiverBankSwiftCode}</p>
                  </div>
                </div>
              </div>

              {/* Intermediary Bank Information */}
              {beneficiary.anyIntermediaryBank === "YES" && (
                <div>
                  <h2 className="text-lg font-semibold border-b pb-2 mb-4">Intermediary Bank Information</h2>
                  <div className="space-y-4">
                    {beneficiary.intermediaryBankName && (
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Intermediary Bank Name</p>
                        <p className="font-medium text-gray-900">{beneficiary.intermediaryBankName}</p>
                      </div>
                    )}
                    {beneficiary.intermediaryBankAccountNo && (
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Intermediary Bank Account No.</p>
                        <p className="font-medium text-gray-900 font-mono">{beneficiary.intermediaryBankAccountNo}</p>
                      </div>
                    )}
                    {beneficiary.intermediaryBankIBAN && (
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Intermediary Bank IBAN</p>
                        <p className="font-medium text-gray-900 font-mono">{beneficiary.intermediaryBankIBAN}</p>
                      </div>
                    )}
                    {beneficiary.intermediaryBankSwiftCode && (
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Intermediary Bank SWIFT Code</p>
                        <p className="font-medium text-gray-900 font-mono">{beneficiary.intermediaryBankSwiftCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Information */}
              <div>
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">System Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Created At</p>
                    <p className="font-medium text-gray-900">
                      {new Date(beneficiary.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {new Date(beneficiary.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {beneficiary.totalRemittance && (
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Remittance</p>
                      <p className="font-medium text-gray-900">{beneficiary.totalRemittance}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <button
              onClick={() => router.push("/staff/dashboard/manage-receivers/list-receivers")}
              className="bg-gray-500 text-white px-6 py-3 rounded-md flex items-center hover:bg-gray-600 transition-colors"
            >
              <Image src="/back.png" alt="Back" className="mr-2 h-3 w-3" width={20} height={20} />
              BACK TO RECEIVERS
            </button>

            <button
              onClick={() => router.push(`/staff/dashboard/manage-receivers/add-receivers?edit=${beneficiaryId}`)}
              className="bg-dark-blue text-white px-6 py-3 rounded-md flex items-center hover:bg-blue-700 transition-colors"
            >
              <Image src="/edit.png" alt="Edit" className="mr-2 h-4 w-4" width={20} height={20} />
              EDIT RECEIVER
            </button>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-8 pb-4 text-center">
        © 2025, Made by <span className="text-dark-blue font-bold">BuyEx Forex</span>.
      </div>
    </div>
  )
}
