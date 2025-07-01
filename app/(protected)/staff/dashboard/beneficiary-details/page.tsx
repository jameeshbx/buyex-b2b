"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChevronDown, ChevronUp, Eye, Trash2 } from "lucide-react";
import {
  beneficiaryFormSchema,
  countries,
  countryBankFields,
  defaultFormValues,
  type BeneficiaryFormValues,
} from "@/data/country-data";
import { Topbar } from "../../(components)/Topbar";
import { pagesData } from "@/data/navigation";
import BreadcrumbMenubar from "../../(components)/Menubar";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import type { Beneficiary } from "@prisma/client";
import { z } from "zod";

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.newBeneficiary} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark-blue"></div>
        </div>
      </div>
    </div>
  );
}

// Separate component that uses useSearchParams
function BeneficiaryDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeStaffInfo, setActiveStaffInfo] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);
  const [orderId] = useState<string | null>(
    searchParams.get("orderId") || null
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BeneficiaryFormValues>({
    resolver: zodResolver(beneficiaryFormSchema),
    defaultValues: defaultFormValues,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const existingReceiver = watch("existingReceiver");
  const receiverCountry = watch("receiverCountry");
  const receiverBankCountry = watch("receiverBankCountry");
  const anyIntermediaryBank = watch("anyIntermediaryBank");

  // Fetch beneficiaries from API
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/beneficiaries");
        setBeneficiaries(response.data);
      } catch (error) {
        console.error("Failed to fetch beneficiaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const order = await axios.get(`/api/orders/${orderId}`);

        if (order.data.beneficiaryId) {
          const beneficiary = await axios.get(
            `/api/beneficiaries/${order.data.beneficiaryId}`
          );
          if (beneficiary.data) {
            reset({
              ...beneficiary.data,
              existingReceiver: "YES",
            });
          }

          // router.push(
          //   `/staff/dashboard/beneficiary-details?orderId=${orderId}`
          // );
        } else {
          router.push(`/staff/dashboard/beneficiary-details`);
        }
      }
    };
    fetchOrder();
  }, [orderId]);

  // Handle edit mode - fetch and populate existing beneficiary data
  useEffect(() => {
    const fetchBeneficiaryForEdit = async () => {
      if (editId) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/beneficiaries/${editId}`);
          const beneficiary = response.data;

          // Set form to edit mode
          setValue("existingReceiver", "NO");

          // Populate all form fields with existing data
          setValue("receiverFullName", beneficiary.receiverFullName || "");
          setValue("receiverCountry", beneficiary.receiverCountry || "");
          setValue("address", beneficiary.address || "");
          setValue("receiverBank", beneficiary.receiverBank || "");
          setValue(
            "receiverBankAddress",
            beneficiary.receiverBankAddress || ""
          );
          setValue(
            "receiverBankCountry",
            beneficiary.receiverBankCountry || ""
          );
          setValue("receiverAccount", beneficiary.receiverAccount || "");
          setValue(
            "receiverBankSwiftCode",
            beneficiary.receiverBankSwiftCode || ""
          );
          setValue("iban", beneficiary.iban || "");
          setValue("sortCode", beneficiary.sortCode || "");
          setValue("transitNumber", beneficiary.transitNumber || "");
          setValue("bsbCode", beneficiary.bsbCode || "");
          setValue("routingNumber", beneficiary.routingNumber || "");
          setValue(
            "anyIntermediaryBank",
            beneficiary.anyIntermediaryBank || "NO"
          );
          setValue(
            "intermediaryBankName",
            beneficiary.intermediaryBankName || ""
          );
          setValue(
            "intermediaryBankAccountNo",
            beneficiary.intermediaryBankAccountNo || ""
          );
          setValue(
            "intermediaryBankIBAN",
            beneficiary.intermediaryBankIBAN || ""
          );
          setValue(
            "intermediaryBankSwiftCode",
            beneficiary.intermediaryBankSwiftCode || ""
          );
          // Keep totalRemittance and field70 empty for manual entry as requested
          setValue("totalRemittance", "");
          setValue("field70", "");
        } catch (error) {
          console.error("Failed to fetch beneficiary for edit:", error);
          setSubmitError("Failed to load beneficiary data for editing");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBeneficiaryForEdit();
  }, [editId, setValue]);

  const onSubmit = async (data: BeneficiaryFormValues) => {
    setSubmitError(null);
    try {
      if (existingReceiver === "YES" && selectedBeneficiary) {
        // Redirect to beneficiary details page with the selected ID
        router.push(
          `/staff/dashboard/beneficiary-details/${selectedBeneficiary.id}`
        );
        return;
      }

      console.log("orderId", orderId);

      // For new beneficiaries or editing existing ones
      const submissionData = {
        ...data,
        orderId: orderId,
        status: true,
      };

      let response;
      if (editId) {
        // Update existing beneficiary
        response = await axios.put(
          `/api/beneficiaries/${editId}`,
          submissionData
        );
      } else {
        // Create new beneficiary
        response = await axios.post("/api/beneficiaries", submissionData);
      }

      if (response.data) {
        router.push(`/staff/dashboard/document-upload?orderId=${orderId}`);
      }
    } catch (error) {
      setSubmitError(
        error instanceof z.ZodError
          ? "Validation failed. Please check all fields."
          : "Failed to submit beneficiary. Please try again."
      );
      console.error("Submission error:", error);
    }
  };

  const handleReset = () => {
    reset(defaultFormValues);
    setSelectedBeneficiary(null);
  };

  const selectReceiver = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setValue("selectedReceiverId", beneficiary.id);
  };

  const toggleStatus = async (beneficiaryId: string) => {
    try {
      const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId);
      if (!beneficiary) return;

      const newStatus = !beneficiary.status;
      await axios.put(`/api/beneficiaries/${beneficiaryId}`, {
        ...beneficiary,
        status: newStatus,
      });

      // Update local state
      setBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === beneficiaryId ? { ...b, status: newStatus } : b
        )
      );
    } catch (error) {
      console.error("Failed to update beneficiary status:", error);
    }
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const handleCountryFilter = (country: string | null) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const getSortedReceivers = () => {
    const filteredData = beneficiaries.filter((beneficiary) => {
      const matchesSearch =
        searchTerm === "" ||
        beneficiary.receiverFullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        beneficiary.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.receiverAccount
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCountry =
        !selectedCountry || beneficiary.receiverCountry === selectedCountry;

      return matchesSearch && matchesCountry;
    });

    if (sortConfig !== null) {
      return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Beneficiary];
        const bValue = b[sortConfig.key as keyof Beneficiary];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
        if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const shouldShowField = (fieldName: string, country: string) => {
    const fieldsToShow = Object.entries(countryBankFields).find(([countries]) =>
      countries.split(", ").includes(country)
    );

    return fieldsToShow ? fieldsToShow[1].includes(fieldName) : false;
  };

  const handleViewDetails = (beneficiaryId: string) => {
    router.push(`/staff/dashboard/beneficiary/${beneficiaryId}`);
  };

  const handleEditBeneficiary = (beneficiaryId: string) => {
    router.push(
      `/staff/dashboard/manage-receivers/add-receivers?edit=${beneficiaryId}`
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeStaffInfo &&
        !(event.target as Element).closest(".staff-info-popup")
      ) {
        setActiveStaffInfo(null);
      }

      if (
        showCountryDropdown &&
        !(event.target as Element).closest(".country-filter-dropdown")
      ) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeStaffInfo, showCountryDropdown]);

  if (loading && !beneficiaries.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Topbar */}
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.newBeneficiary} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <BreadcrumbMenubar />
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Show edit mode indicator */}
            {editId && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 font-medium">
                  Editing Beneficiary - Only Total Remittance and Field 70 need
                  to be filled manually
                </p>
              </div>
            )}

            {/* Existing receiver selection - hide in edit mode */}
            {!editId && (
              <div className="mb-6">
                <p className="text-gray-600 mb-2 font-jakarta">
                  Existing receiver?
                </p>
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <label className="flex items-center relative">
                    <span className="relative w-6 h-6 flex items-center justify-center">
                      <input
                        type="radio"
                        value="YES"
                        {...register("existingReceiver")}
                        className="appearance-none w-6 h-6 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                      />
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
                        watch("existingReceiver") === "YES"
                          ? "text-black"
                          : "text-light-gray"
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
                        {...register("existingReceiver")}
                        className="appearance-none w-6 h-6 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                      />
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
                        watch("existingReceiver") === "NO"
                          ? "text-black"
                          : "text-light-gray"
                      }`}
                    >
                      NO
                    </span>
                  </label>
                </div>
              </div>
            )}

            {existingReceiver === "YES" && !editId ? (
              /* Existing receivers table */
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 sm:gap-4">
                  <div className="relative country-filter-dropdown">
                    <button
                      type="button"
                      className="flex items-center bg-dark-blue text-white font-jakarta px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                      onClick={() =>
                        setShowCountryDropdown(!showCountryDropdown)
                      }
                    >
                      <span className="truncate">
                        {selectedCountry
                          ? `Filtered: ${selectedCountry}`
                          : "Filter by country"}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 sm:left-20 mt-1 bg-white shadow-lg rounded-md z-30 w-full sm:w-48">
                        <ul className="py-1 max-h-60 overflow-y-auto">
                          <li>
                            <button
                              type="button"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-medium text-sm"
                              onClick={() => handleCountryFilter(null)}
                            >
                              All Countries
                            </button>
                          </li>
                          {countries.map((country) => (
                            <li key={country.value}>
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() =>
                                  handleCountryFilter(country.value)
                                }
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
                      className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg font-jakarta bg-light-blue w-full sm:w-auto text-sm sm:text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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

                {/* Show message if no beneficiaries */}
                {beneficiaries.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No beneficiaries found. Please add a new beneficiary.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="block sm:hidden space-y-4">
                      {getSortedReceivers().map((beneficiary) => (
                        <div
                          key={beneficiary.id}
                          className={`bg-light-blue rounded-lg p-4 border ${
                            beneficiary.id === selectedBeneficiary?.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <label className="flex items-center">
                              <span className="relative w-5 h-5 flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="selectedReceiver"
                                  className="appearance-none w-5 h-5 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                                  checked={
                                    beneficiary.id === selectedBeneficiary?.id
                                  }
                                  onChange={() => selectReceiver(beneficiary)}
                                />
                                {beneficiary.id === selectedBeneficiary?.id && (
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
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const isCurrentlyActive = beneficiary.status;
                                  const message = isCurrentlyActive
                                    ? "Are you sure you want to deactivate this receiver?"
                                    : "Are you sure you want to activate this receiver?";
                                  if (window.confirm(message)) {
                                    toggleStatus(beneficiary.id);
                                  }
                                }}
                                className={`h-5 w-10 rounded-full flex items-center transition-colors ${
                                  beneficiary.status
                                    ? "bg-blue-100 justify-end"
                                    : "bg-gray-200 justify-start"
                                }`}
                              >
                                <div
                                  className={`h-4 w-4 rounded-full transition-all ${
                                    beneficiary.status
                                      ? "bg-blue-600 mr-0.5"
                                      : "bg-gray-400 ml-0.5"
                                  }`}
                                ></div>
                              </button>
                              <button
                                type="button"
                                className="text-orange-500 hover:text-orange-700"
                                onClick={() =>
                                  handleViewDetails(beneficiary.id)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                ID
                              </span>
                              <p className="font-semibold font-jakarta">
                                {beneficiary.id}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                Name
                              </span>
                              <p className="font-semibold font-jakarta">
                                {beneficiary.receiverFullName}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                Country
                              </span>
                              <p className="text-light-gray font-jakarta">
                                {beneficiary.receiverCountry}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                Account No.
                              </span>
                              <p className="font-semibold font-jakarta">
                                {beneficiary.receiverAccount}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-auto max-h-[500px] rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white sticky top-0 z-20">
                          <tr>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                            <th
                              className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                              className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => requestSort("receiverFullName")}
                            >
                              <div className="flex items-center font-jakarta text-gray-700">
                                Name
                                <span className="ml-1">
                                  {sortConfig?.key === "receiverFullName" ? (
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
                            <th className="hidden md:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                              <div className="flex items-center font-jakarta text-gray-700">
                                Country
                              </div>
                            </th>
                            <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <div className="flex items-center font-jakarta text-gray-700">
                                Address
                              </div>
                            </th>
                            <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <div className="flex items-center font-jakarta text-gray-700">
                                Bank name
                              </div>
                            </th>
                            <th className="hidden xl:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <div className="flex items-center font-jakarta text-gray-700">
                                Bank country
                              </div>
                            </th>
                            <th
                              className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => requestSort("receiverAccount")}
                            >
                              <div className="flex items-center font-jakarta text-gray-700">
                                Account No.
                                <span className="ml-1">
                                  {sortConfig?.key === "receiverAccount" ? (
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
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <div className="flex items-center font-jakarta text-gray-700">
                                Status
                              </div>
                            </th>
                            <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium font-jakarta text-gray-700 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-light-blue divide-y-4 divide-white">
                          {getSortedReceivers().map((beneficiary) => (
                            <tr
                              key={beneficiary.id}
                              className={
                                beneficiary.id === selectedBeneficiary?.id
                                  ? "bg-blue-50"
                                  : ""
                              }
                            >
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                <label className="flex items-center relative">
                                  <span className="relative w-5 h-5 flex items-center justify-center">
                                    <input
                                      type="radio"
                                      name="selectedReceiver"
                                      className="appearance-none w-5 h-5 border-2 rounded-md checked:bg-dark-blue checked:border-dark-blue transition-all duration-150 focus:outline-none"
                                      checked={
                                        beneficiary.id ===
                                        selectedBeneficiary?.id
                                      }
                                      onChange={() =>
                                        selectReceiver(beneficiary)
                                      }
                                    />
                                    {beneficiary.id ===
                                      selectedBeneficiary?.id && (
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
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium font-jakarta font-semibold">
                                {beneficiary.id}
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-jakarta font-semibold">
                                {beneficiary.receiverFullName}
                              </td>
                              <td className="hidden md:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                                {beneficiary.receiverCountry}
                              </td>
                              <td className="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                                {beneficiary.address}
                              </td>
                              <td className="hidden lg:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                                {beneficiary.receiverBank}
                              </td>
                              <td className="hidden xl:table-cell px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-jakarta text-light-gray">
                                {beneficiary.receiverBankCountry}
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-jakarta font-semibold">
                                {beneficiary.receiverAccount}
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const isCurrentlyActive =
                                      beneficiary.status;
                                    const message = isCurrentlyActive
                                      ? "Are you sure you want to deactivate this receiver?"
                                      : "Are you sure you want to activate this receiver?";
                                    if (window.confirm(message)) {
                                      toggleStatus(beneficiary.id);
                                    }
                                  }}
                                  className={`h-6 w-12 rounded-full flex items-center transition-colors ${
                                    beneficiary.status
                                      ? "bg-blue-100 justify-end"
                                      : "bg-gray-200 justify-start"
                                  }`}
                                >
                                  <div
                                    className={`h-5 w-5 rounded-full transition-all ${
                                      beneficiary.status
                                        ? "bg-blue-600 mr-0.5"
                                        : "bg-gray-400 ml-0.5"
                                    }`}
                                  ></div>
                                </button>
                              </td>
                              <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center space-x-3">
                                  <button
                                    type="button"
                                    className="text-orange-500 hover:text-orange-700"
                                    onClick={() =>
                                      handleViewDetails(beneficiary.id)
                                    }
                                  >
                                    <Eye className="h-5 w-5" />
                                  </button>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      className="text-gray-600 hover:text-gray-800"
                                      onClick={() => {
                                        setActiveStaffInfo(
                                          activeStaffInfo === beneficiary.id
                                            ? null
                                            : beneficiary.id
                                        );
                                      }}
                                    >
                                      ⋮
                                    </button>
                                    {activeStaffInfo === beneficiary.id && (
                                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 staff-info-popup">
                                        <div className="p-3 flex flex-col space-y-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleEditBeneficiary(
                                                beneficiary.id
                                              )
                                            }
                                            className="flex items-center space-x-3 w-full hover:bg-gray-50 p-2 rounded-md"
                                          >
                                            <div className="bg-blue-100 p-2 rounded-md">
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-blue-600"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <div className="font-medium text-sm">
                                                Edit Beneficiary
                                              </div>
                                            </div>
                                          </button>
                                          <div className="flex items-start space-x-3">
                                            <div className="bg-gray-100 p-2 rounded-md">
                                              <Trash2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                              <div className="font-medium text-sm">
                                                Added by : StaffA
                                              </div>
                                              <div className="text-xs text-gray-500 mt-1">
                                                {new Date(
                                                  beneficiary.createdAt
                                                ).toLocaleDateString("en-US", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  day: "2-digit",
                                                  month: "short",
                                                })}
                                              </div>
                                            </div>
                                          </div>
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
                  </>
                )}
              </div>
            ) : (
              /* New receiver form or edit mode - ALL FIELDS INCLUDED */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Receiver's full Name */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    {"Receiver's full Name"}
                  </label>
                  <input
                    type="text"
                    placeholder="Beneficiary's name"
                    {...register("receiverFullName")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.receiverFullName ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.receiverFullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverFullName.message}
                    </p>
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
                      className={`w-full p-3 bg-blue-50 rounded-md appearance-none pr-10 text-sm sm:text-base ${
                        errors.receiverCountry ? "border border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setValue("receiverCountry", e.target.value);
                        if (
                          !receiverBankCountry ||
                          receiverBankCountry === receiverCountry
                        ) {
                          setValue("receiverBankCountry", e.target.value);
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
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.receiverCountry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverCountry.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Address"
                    {...register("address")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.address ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* Receiver's bank */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    {"Receiver's bank"}
                  </label>
                  <input
                    type="text"
                    placeholder="Beneficiary's bank"
                    {...register("receiverBank")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.receiverBank ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.receiverBank && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverBank.message}
                    </p>
                  )}
                </div>

                {/* Receiver's bank address */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    {"Receiver's bank address"}
                  </label>
                  <input
                    type="text"
                    placeholder="Beneficiary's bank address"
                    {...register("receiverBankAddress")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.receiverBankAddress ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.receiverBankAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverBankAddress.message}
                    </p>
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
                      className={`w-full p-3 bg-blue-50 rounded-md appearance-none pr-10 text-sm sm:text-base ${
                        errors.receiverBankCountry
                          ? "border border-red-500"
                          : ""
                      }`}
                    >
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.receiverBankCountry && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverBankCountry.message}
                    </p>
                  )}
                </div>

                {/* Receiver's account */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    {"Receiver's account"}
                  </label>
                  <input
                    type="text"
                    placeholder="Beneficiary's account"
                    {...register("receiverAccount")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.receiverAccount ? "border border-red-500" : ""
                    }`}
                  />
                  {errors.receiverAccount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverAccount.message}
                    </p>
                  )}
                </div>

                {/* Receiver's bank swift code */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    {"Receiver's bank Swift/BIC code"}
                  </label>
                  <input
                    type="text"
                    placeholder="Beneficiary's bank Swift/BIC code"
                    {...register("receiverBankSwiftCode")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.receiverBankSwiftCode
                        ? "border border-red-500"
                        : ""
                    }`}
                  />
                  {errors.receiverBankSwiftCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverBankSwiftCode.message}
                    </p>
                  )}
                </div>

                {/* IBAN - conditionally shown */}
                {shouldShowField("iban", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      IBAN
                    </label>
                    <input
                      type="text"
                      placeholder="IBAN"
                      {...register("iban")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                        errors.iban ? "border border-red-500" : ""
                      }`}
                    />
                    {errors.iban && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.iban.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Sort code - conditionally shown */}
                {shouldShowField("sortCode", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Sort code
                    </label>
                    <input
                      type="text"
                      placeholder="Sort code"
                      {...register("sortCode")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                        errors.sortCode ? "border border-red-500" : ""
                      }`}
                    />
                    {errors.sortCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sortCode.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Transit number - conditionally shown */}
                {shouldShowField("transitNumber", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Transit number
                    </label>
                    <input
                      type="text"
                      placeholder="Transit number"
                      {...register("transitNumber")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                        errors.transitNumber ? "border border-red-500" : ""
                      }`}
                    />
                    {errors.transitNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.transitNumber.message}
                      </p>
                    )}
                  </div>
                )}

                {/* BSB code - conditionally shown */}
                {shouldShowField("bsbCode", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      BSB code
                    </label>
                    <input
                      type="text"
                      placeholder="BSB code"
                      {...register("bsbCode")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                        errors.bsbCode ? "border border-red-500" : ""
                      }`}
                    />
                    {errors.bsbCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bsbCode.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Routing number - conditionally shown */}
                {shouldShowField("routingNumber", receiverBankCountry) && (
                  <div>
                    <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                      Routing number
                    </label>
                    <input
                      type="text"
                      placeholder="Routing number"
                      {...register("routingNumber")}
                      className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                        errors.routingNumber ? "border border-red-500" : ""
                      }`}
                    />
                    {errors.routingNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.routingNumber.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Any Intermediary bank exists? */}
                <div className="lg:col-span-2 mt-4">
                  <p className="text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    Any Intermediary bank exists?
                  </p>
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
                          watch("anyIntermediaryBank") === "YES"
                            ? "text-black"
                            : "text-light-gray"
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
                          watch("anyIntermediaryBank") === "NO"
                            ? "text-black"
                            : "text-light-gray"
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
                        className="w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base"
                      />
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
                        className="w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base"
                      />
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
                        className="w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base"
                      />
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
                        className="w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base"
                      />
                    </div>
                  </>
                )}

                {/* Total remittance made in INR */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    Total remittance made in INR{" "}
                    {editId && (
                      <span className="text-blue-600">
                        (Manual Entry Required)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="Current Financial year"
                    {...register("totalRemittance")}
                    className={`w-full p-3 bg-blue-50 rounded-md text-sm sm:text-base ${
                      errors.totalRemittance ? "border border-red-500" : ""
                    } ${editId ? "border-blue-300 bg-blue-50" : ""}`}
                  />
                  {errors.totalRemittance && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalRemittance.message}
                    </p>
                  )}
                </div>

                {/* Field 70 - special information to receiver */}
                <div>
                  <label className="block text-gray-600 mb-2 font-jakarta text-sm sm:text-base">
                    Field 70 - special information to receiver{" "}
                    {editId && (
                      <span className="text-blue-600">
                        (Manual Entry Required)
                      </span>
                    )}
                  </label>
                  <textarea
                    placeholder="Type here"
                    {...register("field70")}
                    className={`w-full p-3 bg-blue-50 rounded-md h-24 text-sm sm:text-base ${
                      editId ? "border-blue-300 bg-blue-50" : ""
                    }`}
                  ></textarea>
                </div>
              </div>
            )}

            {/* Form buttons */}
            {submitError && (
              <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md text-center">
                {submitError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  (existingReceiver === "YES" &&
                    !selectedBeneficiary &&
                    !editId)
                }
                className={`bg-dark-blue text-white font-jakarta px-6 sm:px-8 py-3 rounded-md flex items-center justify-center text-sm sm:text-base ${
                  isSubmitting ||
                  (existingReceiver === "YES" &&
                    !selectedBeneficiary &&
                    !editId)
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Image
                      src="/continue.png"
                      alt="Continue"
                      className="mr-2 h-3 w-3"
                      width={20}
                      height={20}
                    />
                    {editId ? "UPDATE" : "CONTINUE"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="border border-gray-300 text-gray-700 font-jakarta px-6 sm:px-8 py-3 rounded-md flex items-center justify-center text-sm sm:text-base"
              >
                <Image
                  src="/reset.png"
                  alt="Reset"
                  className="mr-2 h-3 w-3"
                  width={20}
                  height={20}
                />
                RESET
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-8 pb-4">
        © 2025, Made by{" "}
        <span className="text-dark-blue font-bold">BuyExchange</span>.
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function BeneficiaryDetailsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BeneficiaryDetailsContent />
    </Suspense>
  );
}
