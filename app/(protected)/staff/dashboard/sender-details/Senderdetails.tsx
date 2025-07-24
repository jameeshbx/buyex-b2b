"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formSchema,
  type FormValues as OriginalFormValues,
} from "@/schema/senderdetails";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import type { Sender } from "@prisma/client";

type FormValues = OriginalFormValues & {
  status?: string;
  pancardNumber?: string;
};

function Senderdetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  // On mount, get orderId from URL or localStorage
  useEffect(() => {
    const urlOrderId = searchParams.get("orderId");
    if (urlOrderId) {
      setOrderId(urlOrderId);
      localStorage.setItem("currentOrderId", urlOrderId);
    } else {
      const storedOrderId = localStorage.getItem("currentOrderId");
      if (storedOrderId) {
        setOrderId(storedOrderId);
      }
    }
  }, [searchParams]);

  const [payer, setPayer] = useState<string>("self");
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [sameAddress, setSameAddress] = useState(false);
  const [senderDetails, setSenderDetails] = useState<Sender | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      studentName: "",
      studentEmailOriginal: "",
      studentEmailFake: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      state: "",
      postalCode: "",
      nationality: "indian",
      relationship: "self",
      senderName: "",
      bankCharges: "resident",
      dob: "",
      senderNationality: "indian",
      senderEmail: "",
      sourceOfFunds: undefined,
      occupationStatus: undefined,

      senderAddressLine1: "",
      senderAddressLine2: "",
      senderState: "",
      senderPostalCode: "",
      status: "pending",
      pancardNumber: "",
    },
  });

  // Consolidated useEffect for fetching order, sender details, and controlling popup visibility
  useEffect(() => {
    const fetchOrderAndSenderDetails = async () => {
      if (orderId) {
        try {
          const order = await axios.get(`/api/orders/${orderId}`);
          console.log("Fetched order:", order.data);

          const orderPayer = order.data.payer?.toLowerCase?.() || "self";
          console.log("Setting payer from order:", orderPayer);
          setPayer(orderPayer);

          let currentSenderDetails: Sender | null = null; // Use a local variable for immediate check
          if (order.data.senderId) {
            console.log(
              "Fetching sender details for senderId:",
              order.data.senderId
            );
            const sender = await axios.get(
              `/api/senders/${order.data.senderId}`
            );
            console.log("Fetched sender details:", sender.data);
            if (sender.data) {
              setSenderDetails(sender.data);
              currentSenderDetails = sender.data;
            }
          } else {
            console.log(
              "No existing sender details, but payer is set to:",
              orderPayer
            );
            setSenderDetails(null); // Ensure senderDetails is null if no senderId
          }

          // Set form status from order data
          form.setValue("status", order.data.status || "pending");

          // Determine if popup should show: ONLY if orderId exists AND senderDetails are NOT yet filled.
          // This directly addresses "only the before filling sender details shown teh popup"
          setShowStatusPopup(orderId !== null && currentSenderDetails === null);
        } catch (error) {
          console.error("Error fetching order:", error);
          setSenderDetails(null);
          form.reset();
          setShowStatusPopup(false); // Hide popup on error
        }
      } else {
        // If no orderId, ensure popup is hidden
        setShowStatusPopup(false);
      }
    };
    fetchOrderAndSenderDetails();
  }, [orderId, form]); // Dependencies: orderId and form (for setValue/reset)

  useEffect(() => {
    // Update relationship field based on payer
    form.setValue(
      "relationship",
      payer as
        | "self"
        | "parent"
        | "brother"
        | "sister"
        | "spouse"
        | "other"
        | undefined
    );
    // If payer is self, update sender email when student email changes
    if (payer === "self") {
      const studentEmail = form.getValues("studentEmailOriginal");
      if (studentEmail) {
        form.setValue("senderEmail", studentEmail);
      }
    }
  }, [payer, form]);

  // Watch for changes in student email and update sender email when payer is self
  const studentEmail = form.watch("studentEmailOriginal");
  useEffect(() => {
    if (payer === "self" && studentEmail) {
      form.setValue("senderEmail", studentEmail);
    }
  }, [studentEmail, payer, form]);

  useEffect(() => {
    if (senderDetails) {
      // Ensure all values match your form schema types
      const allowedBankCharges = ["resident", "nri", "pio"] as const;
      const allowedOccupationStatus = [
        "employed",
        "self-employed",
        "business-owner",
        "retired",
        "student",
      ] as const;
      const allowedSourceOfFunds = [
        "salary",
        "savings",
        "business",
        "investment",
      ] as const;
      const safeSourceOfFunds =
        senderDetails.sourceOfFunds &&
        (allowedSourceOfFunds as readonly string[]).includes(
          senderDetails.sourceOfFunds
        )
          ? (senderDetails.sourceOfFunds as (typeof allowedSourceOfFunds)[number])
          : undefined;
      form.reset({
        ...senderDetails,
        pancardNumber: senderDetails.pancardNumber ?? "",
        addressLine1: senderDetails.addressLine1 ?? "",
        addressLine2: senderDetails.addressLine2 ?? "",
        state: senderDetails.state ?? "",
        postalCode: senderDetails.postalCode ?? "",
        studentName: senderDetails.studentName ?? "",
        studentEmailOriginal: senderDetails.studentEmailOriginal ?? "",
        studentEmailFake: senderDetails.studentEmailFake ?? "",
        phoneNumber: senderDetails.phoneNumber ?? "",
        relationship: (senderDetails.relationship ?? payer) as
          | "self"
          | "parent"
          | "brother"
          | "sister"
          | "spouse"
          | "other"
          | undefined,
        senderName: senderDetails.senderName ?? "",
        bankCharges:
          senderDetails.bankCharges &&
          (allowedBankCharges as readonly string[]).includes(
            senderDetails.bankCharges
          )
            ? (senderDetails.bankCharges as (typeof allowedBankCharges)[number])
            : "resident",

        dob: senderDetails.dob ?? "",
        senderNationality: (senderDetails.nationality ?? "indian") as
          | "indian"
          | "american"
          | "british"
          | "canadian"
          | "australian"
          | undefined,
        senderEmail:
          payer === "self"
            ? senderDetails.studentEmailOriginal ?? ""
            : senderDetails.senderEmail ?? "",
        sourceOfFunds: safeSourceOfFunds,
        occupationStatus:
          senderDetails.occupationStatus &&
          (allowedOccupationStatus as readonly string[]).includes(
            senderDetails.occupationStatus
          )
            ? (senderDetails.occupationStatus as (typeof allowedOccupationStatus)[number])
            : "employed",
        senderAddressLine1: senderDetails.senderAddressLine1 ?? "",
        senderAddressLine2: senderDetails.senderAddressLine2 ?? "",
        senderState: senderDetails.senderState ?? "",
        senderPostalCode: senderDetails.senderPostalCode ?? "",
        nationality: (senderDetails.nationality ?? "indian") as
          | "indian"
          | "american"
          | "british"
          | "canadian"
          | "australian"
          | undefined,
        status: senderDetails.status || "pending",
      });
    }
  }, [senderDetails, form, payer]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted with data:", data);
    console.log("Current payer value:", payer);
    console.log("Current relationship value:", data.relationship);
    setIsSubmitting(true);
    try {
      // Validate form before submission
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("Form validation failed");
        const errors = form.formState.errors;
        console.log("Form errors:", errors);
        // Show specific error messages
        const errorMessages = Object.entries(errors)
          .map(([field, error]) => {
            return `${field}: ${error?.message || "Invalid value"}`;
          })
          .join("\n");
        alert(`Please fix the following errors:\n${errorMessages}`);
        setIsSubmitting(false);
        return;
      }
      let response;
      if (senderDetails?.id) {
        // Update sender
        response = await axios.put(`/api/senders/${senderDetails.id}`, {
          ...data,
          orderId,
        });
        if (orderId && response.data?.id) {
          await axios.patch(`/api/orders/${orderId}`, {
            senderId: response.data.id,
            status: "Pending",
          });
        }
      } else {
        // Create sender
        response = await axios.post("/api/senders", {
          ...data,
          orderId,
        });
        if (orderId && response.data?.id) {
          await axios.patch(`/api/orders/${orderId}`, {
            senderId: response.data.id,
            status: "Pending",
          });
        }
      }
      console.log("order id is ", orderId);
      // Continue navigation
      if (orderId) {
        router.push(`/staff/dashboard/beneficiary-details?orderId=${orderId}`);
      } else {
        alert("Order ID is missing. Cannot continue.");
      }
    } catch (error) {
      console.error("Failed to create sender:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setSameAddress(false);
    form.setValue("status", "pending");
    if (payer === "self") {
      const studentEmail = form.getValues("studentEmailOriginal");
      if (studentEmail) {
        form.setValue("senderEmail", studentEmail);
      }
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) {
      const { addressLine1, addressLine2, state, postalCode } =
        form.getValues();
      form.setValue("senderAddressLine1", addressLine1);
      form.setValue("senderAddressLine2", addressLine2);
      form.setValue("senderState", state);
      form.setValue("senderPostalCode", postalCode);
    }
  };

  const handleStatusConfirm = async () => {
    if (selectedStatus === "Blocked") {
      try {
        // Update the order status to "Blocked"
        if (orderId) {
          await axios.patch(`/api/orders/${orderId}`, {
            status: "Blocked",
          });
          console.log("Order status updated to Blocked");
        }

        setShowStatusPopup(false);
        setStatusError(null);
      } catch (error) {
        console.error("Failed to update order status:", error);
        setStatusError("Failed to update order status. Please try again.");
      }
    } else {
      setStatusError("Please select 'Blocked' to proceed.");
    }
  };

  const handleOpenChange = (open: boolean) => {
    // Only allow closing if sender details exist or if we're opening
    // This ensures the user must interact with the popup if sender details are missing
    if (open || senderDetails) {
      setShowStatusPopup(open);
    }
  };

  // Debug: Add temporary display to show current payer value
  console.log("Current payer state:", payer);
  console.log("Sender details section should show:", payer !== "self");

  return (
    <div>
      {/* Status Popup Dialog */}
      <Dialog open={showStatusPopup} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[90vw] max-w-[425px] md:w-full">
          <DialogHeader className="px-4 sm:px-6">
            <DialogTitle className="text-lg sm:text-xl">
              Rate Status
            </DialogTitle>
            <DialogDescription className="mt-2 sm:mt-3 text-sm sm:text-base">
              Update rate status
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 sm:px-6 py-2 sm:py-4">
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-full h-10 sm:h-12 text-sm sm:text-base">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base z-50">
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            {statusError && (
              <p className="text-red-500 text-xs px-4">{statusError}</p>
            )}
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
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 sm:space-y-8"
                  >
                    {/* Student Details Section - Always shown */}
                    <div className="p-6 sm:p-6 mb-5">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-jakarta">
                        Student Details
                      </h2>
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
                        {/* Phone Number - Only show when payer is "self" */}
                        {payer === "self" && (
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
                        )}
                        {/* Address Line 1 */}
                        <FormField
                          control={form.control}
                          name="addressLine1"
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
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                State
                              </FormLabel>
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

                        {payer === "self" && (
                          <FormField
                            control={form.control}
                            name="pancardNumber"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  PAN Card Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="ABCDE1234F"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    onChange={(e) => {
                                      const value =
                                        e.target.value.toUpperCase();
                                      field.onChange(value);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                        )}
                        {/* Nationality */}

                        {/* DOB Field - Show in Student Details when payer is "self" */}
                        {payer === "self" && (
                          <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Date of Birth
                                </FormLabel>
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
                        )}

                        <FormField
                          control={form.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem className="space-y-1 sm:space-y-2">
                              <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                Nationality
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-blue-50 h-12 sm:h-14 rounded-none">
                                    <SelectValue placeholder="Select nationality" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-none text-gray-500">
                                  <SelectItem
                                    value="indian"
                                    className="rounded-none"
                                  >
                                    Indian
                                  </SelectItem>
                                  <SelectItem
                                    value="american"
                                    className="rounded-none"
                                  >
                                    American
                                  </SelectItem>
                                  <SelectItem
                                    value="british"
                                    className="rounded-none"
                                  >
                                    British
                                  </SelectItem>
                                  <SelectItem
                                    value="canadian"
                                    className="rounded-none"
                                  >
                                    Canadian
                                  </SelectItem>
                                  <SelectItem
                                    value="australian"
                                    className="rounded-none"
                                  >
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
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-jakarta">
                          Sender Details
                        </h2>
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-blue-50 font-jakarta h-12 sm:h-14 rounded-none">
                                      <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-none">
                                    <SelectItem
                                      value="parent"
                                      className="rounded-none"
                                    >
                                      Parent
                                    </SelectItem>
                                    <SelectItem
                                      value="brother"
                                      className="rounded-none"
                                    >
                                      Brother
                                    </SelectItem>
                                    <SelectItem
                                      value="sister"
                                      className="rounded-none"
                                    >
                                      Sister
                                    </SelectItem>
                                    <SelectItem
                                      value="spouse"
                                      className="rounded-none"
                                    >
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
                        {/* Sender Email */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mt-4 sm:mt-6">
                          <FormField
                            control={form.control}
                            name="senderEmail"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="ex: sender@gmail.com"
                                    type="email"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    disabled={payer === "self"}
                                    {...field}
                                  />
                                </FormControl>
                                {payer === "self" && (
                                  <p className="text-xs text-gray-500">
                                    Automatically set to student&apos;s email
                                  </p>
                                )}
                                <FormMessage className="text-xs sm:text-sm" />
                              </FormItem>
                            )}
                          />
                          {/* Phone Number - Only show when payer is not "self" */}
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
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
                        </div>

                        {/* Foreign bank charges */}
                        <div className="space-y-1 sm:space-y-2 mt-4 sm:mt-6">
                          <Label className="text-sm sm:text-base text-gray-500">
                            Residence Status
                          </Label>
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
                                      onChange={() =>
                                        field.onChange("resident")
                                      }
                                    />
                                  </FormControl>
                                  <Label
                                    htmlFor="resident"
                                    className="text-sm sm:text-base "
                                  >
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
                                      className="h-4 w-4 rounded-none opacity-50 cursor-not-allowed"
                                      checked={field.value === "nri"}
                                      onChange={() => field.onChange("nri")}
                                      disabled={true}
                                    />
                                  </FormControl>
                                  <Label
                                    htmlFor="nri"
                                    className="text-sm sm:text-base text-gray-400 cursor-not-allowed"
                                  >
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
                                      className="h-4 w-4 rounded-none opacity-50 cursor-not-allowed"
                                      checked={field.value === "pio"}
                                      onChange={() => field.onChange("pio")}
                                      disabled={true}
                                    />
                                  </FormControl>
                                  <Label
                                    htmlFor="pio"
                                    className="text-sm sm:text-base text-gray-400 cursor-not-allowed"
                                  >
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
                        {/*  DOB */}
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mt-4 sm:mt-6">
                          {/* DOB - Show in Sender Details when payer is not "self" */}
                          <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  Date of Birth
                                </FormLabel>
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

                          <FormField
                            control={form.control}
                            name="pancardNumber"
                            render={({ field }) => (
                              <FormItem className="space-y-1 sm:space-y-2">
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  PAN Card Number
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="ABCDE1234F"
                                    className="bg-blue-50 h-12 sm:h-14 rounded-none"
                                    onChange={(e) => {
                                      const value =
                                        e.target.value.toUpperCase();
                                      field.onChange(value);
                                    }}
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
                              onChange={(e) =>
                                handleSameAddressChange(e.target.checked)
                              }
                            />
                            <Label
                              htmlFor="sameAddress"
                              className="text-sm sm:text-base "
                            >
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
                                <FormLabel className="font-jakarta text-sm sm:text-base text-gray-500">
                                  State
                                </FormLabel>
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
                                <FormLabel className="font-jakarta text-sm sm:text-base">
                                  Source of funds
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-blue-50 font-jakarta h-12 sm:h-14 rounded-none">
                                      <SelectValue placeholder="Source of funds" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-none">
                                    <SelectItem
                                      value="salary"
                                      className="rounded-none"
                                    >
                                      Salary
                                    </SelectItem>
                                    <SelectItem
                                      value="savings"
                                      className="rounded-none"
                                    >
                                      Savings
                                    </SelectItem>
                                    <SelectItem
                                      value="business"
                                      className="rounded-none"
                                    >
                                      Business Income
                                    </SelectItem>
                                    <SelectItem
                                      value="investment"
                                      className="rounded-none"
                                    >
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
                                <FormLabel className="font-jakarta text-sm sm:text-base">
                                  Occupation status
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-blue-50 font-jakarta h-12 sm:h-14 rounded-none">
                                      <SelectValue placeholder="Employment status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-none">
                                    <SelectItem
                                      value="employed"
                                      className="rounded-none"
                                    >
                                      Employed
                                    </SelectItem>
                                    <SelectItem
                                      value="self-employed"
                                      className="rounded-none"
                                    >
                                      Self-employed
                                    </SelectItem>
                                    <SelectItem
                                      value="business-owner"
                                      className="rounded-none"
                                    >
                                      Business Owner
                                    </SelectItem>
                                    <SelectItem
                                      value="retired"
                                      className="rounded-none"
                                    >
                                      Retired
                                    </SelectItem>
                                    <SelectItem
                                      value="student"
                                      className="rounded-none"
                                    >
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
                      </div>
                    )}
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center p-4 sm:p-6 gap-3 sm:gap-4 border-t border-gray-200">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-dark-blue hover:bg-dark-blue text-white px-4 sm:px-8 h-12 sm:h-15 w-full sm:w-55 rounded-none disabled:opacity-50"
                      >
                        <Image
                          src="/placeholder.svg?height=15&width=15"
                          alt=""
                          width={15}
                          height={15}
                          className="mr-2"
                        />
                        {isSubmitting ? "SUBMITTING..." : "CONTINUE"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white hover:bg-white text-dark-gray border-gray-300 h-12 sm:h-15 w-full sm:w-55 rounded-none"
                        onClick={handleReset}
                        disabled={isSubmitting}
                      >
                        <Image
                          src="/placeholder.svg?height=15&width=15"
                          alt=""
                          width={15}
                          height={15}
                          className="mr-2"
                        />
                        RESET
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
        © 2025, Made by{" "}
        <span className="text-bold text-dark-blue">Buy Exchange</span>.
      </div>
    </div>
  );
}

export default Senderdetails;
