"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Download, ArrowRight, RotateCcw, Play, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  orderDetailsFormSchema,
  type OrderDetailsFormValues,
} from "@/schema/orderdetails";
import { useRouter } from "next/navigation";
import {
  calculateGst,
  calculateTcs,
  calculateTotalPayable,
  getLiveRate,
} from "@/lib/financial";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ForexPartner, forexPartnerData } from "@/data/forex-partner";

interface CalculatedValues {
  inrAmount: string;
  bankFee: string;
  gst: string;
  tcsApplicable: string;
  totalPayable: string;
  customerRate: string;
}

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  agentRate?: number;
  buyexRate?: number;
}

async function generateQuotePDF(
  formData: OrderDetailsFormValues,
  calculatedValues: CalculatedValues,
  forexPartner: ForexPartner,
  orderId?: string
) {
  const doc = new jsPDF() as JsPDFWithAutoTable;
  let lastY = 30;

  // const logo = "/buyex-main-logo.png";
  // doc.addImage(logo, "PNG", 14, 10, 50, 20);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Send Money Abroad Quote", 105, 20, { align: "center" });

  autoTable(doc, {
    startY: lastY,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [240, 240, 240] },
    body: [
      ["Date & Time", new Date().toLocaleString()],
      ["Student Name", formData.studentName || ""],
      ["Country Name", formData.receiverBankCountry || ""],
      ["Purpose", formData.purpose || ""],
      ["Foreign Currency", formData.currency || ""],
      ["Foreign Currency Amount", formData.amount || ""],
      ["Exchange Rate", formData.customerRate || ""],

      ["Forex Conversion Tax", calculatedValues.gst],
      ["TCS", calculatedValues.tcsApplicable],
      ["Processing Charges", calculatedValues.bankFee],
      ["Total Payable Amount in INR", calculatedValues.totalPayable],
    ],
  });

  lastY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Forex Partner Bank Account Details ", 14, lastY);
  doc.setTextColor(255, 0, 0);
  doc.text("(Only Bank transfer is accepted)", 130, lastY);

  autoTable(doc, {
    startY: lastY + 15,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [240, 240, 240] },
    body: [
      ["Bank Name", forexPartner.bankName],
      ["Account Name", forexPartner.accountName],
      ["Account Number", forexPartner.accountNumber],
      ["IFSC Code", forexPartner.ifscCode],
      ["Branch", forexPartner.branch],
    ],
  });

  lastY = doc.lastAutoTable.finalY + 10;

  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Please upload your documents below",
    14,
    lastY
  );
  doc.setFont("helvetica", "normal");
  doc.text(
    "To proceed with your transaction, please upload the required documents using the secure link below:",
    14,
    lastY + 6
  );
  doc.setTextColor(0, 0, 255);
  doc.textWithLink("www.buyexforex.com/document-uploads", 14, lastY + 12, {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/document-uploads/${
      orderId || "pending"
    }`,
  });

  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions", 14, lastY + 25);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  const terms = [
    "• The above quote is generated for one time use only and must not be shared or used by any other remitter to make payments",
    "• Supported payment modes are RTGS, NEFT and Bank Transfer. No cash deposit accepted",
    "• The money should come from the Sender's Savings Bank Account in India. Third party funding is not accepted.",
    "• The payment must be made in full for the amount reflected in this quote and any part payments / multiple payments may get rejected or returned",
    "• The given exchange rate is subject to market fluctuations and valid between 10.00 AM to 2.45 PM on a bank working day.",
    "• The given rate is valid for 30 minutes.",
  ];

  let y = lastY + 32;
  terms.forEach((term) => {
    doc.text(term, 14, y);
    y += 6;
  });

  const pdfUrl = `Send_Money_Abroad_Quote-${Date.now()}.pdf`;
  doc.save(pdfUrl);
  return pdfUrl;
}

export default function OrderDetailsForm() {
  const [showCalculation, setShowCalculation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteDownloaded, setIsQuoteDownloaded] = useState(false);
  const { data: session, status } = useSession();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const router = useRouter();

  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    inrAmount: "0",
    bankFee: "1500",
    gst: "0",
    tcsApplicable: "0",
    totalPayable: "0",
    customerRate: "0",
  });

  const form = useForm<OrderDetailsFormValues>({
    resolver: zodResolver(orderDetailsFormSchema),
    defaultValues: {
      purpose: "",
      foreignBankCharges: "OUR",
      payer: "",
      forexPartner: "",
      margin: "0",
      receiverBankCountry: "",
      studentName: "",
      consultancy: "",
      ibrRate: "",
      amount: "",
      currency: "USD",
      totalAmount: "",
      customerRate: "",
      educationLoan: "no",
    },
  });

  const COUNTRY_CURRENCY_MAP = {
    Germany: "EUR",
    UAE: "AED",
    Australia: "AUD",
    Portugal: "EUR",
    Italy: "EUR",
    Greece: "EUR",
    Netherlands: "EUR",
    Spain: "EUR",
    Poland: "EUR",
    Belgium: "EUR",
    Malta: "EUR",
    Austria: "EUR",
    Albania: "EUR",
    Malaysia: "USD",
    Canada: "CAD",
    Switzerland: "CHF",
    France: "EUR",
    "United States of America": "USD",
    "United Kingdom": "GBP",
    "New Zealand": "NZD",
    Sweden: "SEK",
    Georgia: "USD",
    Bulgaria: "EUR",
    Ireland: "EUR",
    Latvia: "EUR",
    Lithuania: "EUR",
    Uzbekistan: "USD",
  };

  // Modified onSubmit to show popup first
  function onSubmit() {
    // ...any validation you want...
    if (!isQuoteDownloaded) {
      alert("Please download the quote first before proceeding.");
      return;
    }
    // Redirect to sender details page with orderId
    if (orderId) {
      router.push(`/staff/dashboard/sender-details?orderId=${orderId}`);
    } else {
      alert("Order ID not found. Please try again.");
    }
  }

  function resetForm() {
    form.reset();
    setShowCalculation(false);
    setIsQuoteDownloaded(false);
    setOrderId(null);
  }

  function handleShowCalculation() {
    setShowCalculation(true);
  }

  const amount = form.watch("amount");
  const currency = form.watch("currency");
  const foreignBankCharges = form.watch("foreignBankCharges");
  const margin = form.watch("margin");
  const ibrRate = form.watch("ibrRate");
  const educationLoan = form.watch("educationLoan");

  useEffect(() => {
    if (currency) {
      getLiveRate(currency, "INR").then((rate: number) => {
        form.setValue("ibrRate", rate.toFixed(2).toString());
      });
    }
  }, [currency, form]);

  useEffect(() => {
    const bankFee = foreignBankCharges === "OUR" ? 1500 : 300;
    setCalculatedValues((prev) => ({
      ...prev,
      bankFee: bankFee.toString(),
    }));
  }, [foreignBankCharges]);

  useEffect(() => {
    const currentAmount = Number.parseFloat(amount || "0");

    const currentMargin = Number.parseFloat(margin || "0");

    const currentIbrRate = Number.parseFloat(ibrRate || "0");

    const bankFee = foreignBankCharges === "OUR" ? 1500 : 300;

    if (currentAmount && currentMargin) {
      const totalAmount = (currentIbrRate + currentMargin) * currentAmount;
      const roundedTotalAmount = Math.round(totalAmount); // 101680

      form.setValue(
        "customerRate",
        (currentIbrRate + currentMargin).toFixed(2).toString()
      );
      setCalculatedValues((prev) => ({
        ...prev,
        inrAmount: roundedTotalAmount.toString(),
        gst: calculateGst(roundedTotalAmount).toString(),
        tcsApplicable: calculateTcs(
          roundedTotalAmount,
          educationLoan === "yes"
        ),
        totalPayable: calculateTotalPayable(
          roundedTotalAmount,
          bankFee,
          educationLoan === "yes"
        ).toString(),
      }));
    }
  }, [amount, margin, ibrRate, foreignBankCharges, educationLoan, form]);

  useEffect(() => {
    form.setValue("totalAmount", calculatedValues.totalPayable.toString());
  }, [calculatedValues.totalPayable, form]);

  useEffect(() => {
    const selectedCountry = form.watch("receiverBankCountry");
    const currencyValue = form.watch("currency");
    const countryCurrency = selectedCountry
      ? COUNTRY_CURRENCY_MAP[
          selectedCountry as keyof typeof COUNTRY_CURRENCY_MAP
        ]
      : "USD";

    if (selectedCountry && currencyValue !== "USD") {
      form.setValue("currency", countryCurrency, { shouldValidate: true });
    }
  }, [form.watch("receiverBankCountry")]);

  const handleDownloadQuote = async (
    formData: OrderDetailsFormValues,
    calculatedValues: CalculatedValues
  ) => {
    setIsSubmitting(true);
    if (!session?.user?.name) {
      console.error("User session not available");
      setIsSubmitting(false);
      return;
    }

    try {
      // First, create the order to get the orderId
      const forexPartnerObj = forexPartnerData.find(
        (partner) =>
          partner.accountName.toLowerCase() ===
          formData.forexPartner.toLowerCase()
      );
      const order = await axios.post("/api/orders", {
        purpose: formData.purpose,
        foreignBankCharges: formData.foreignBankCharges,
        payer: formData.payer,
        forexPartner: forexPartnerObj,
        margin: formData.margin,
        receiverBankCountry: formData.receiverBankCountry,
        studentName: formData.studentName,
        consultancy: formData.consultancy,
        ibrRate: formData.ibrRate,
        amount: formData.amount,
        currency: formData.currency,
        totalAmount: formData.totalAmount,
        customerRate: formData.customerRate,
        status: "QuoteDownloaded", // Use valid enum value
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.name,
        educationLoan: formData.educationLoan,
        quote: {
          ...formData,
          currency:
            formData.currency ||
            COUNTRY_CURRENCY_MAP[
              formData.receiverBankCountry as keyof typeof COUNTRY_CURRENCY_MAP
            ] ||
            "",
        },
        calculations: calculatedValues,
        generatedPDF: "https://www.buyexchange.in/upload-documents", // Will be updated after PDF generation
      });

      const orderId = order.data.id;

      // Now generate the PDF with the actual orderId
      const pdfUrl = await generateQuotePDF(
        formData,
        calculatedValues,
        forexPartnerObj as ForexPartner,
        orderId
      );

      // Update the order with the generated PDF URL
      await axios.patch(`/api/orders/${orderId}`, {
        generatedPDF: pdfUrl,
      });

      setIsQuoteDownloaded(true);
      if (typeof window !== "undefined") {
        setOrderId(orderId);
        localStorage.setItem("selectedPayer", order.data.payer);
        localStorage.setItem("educationLoan", order.data.educationLoan || "no");
        localStorage.setItem("fromPlaceOrder", "true");
      }
    } catch (error) {
      console.error("Error generating quote:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        alert(
          `Failed to create order: ${error.response?.data || error.message}`
        );
      } else {
        alert("Failed to generate quote. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add useEffect to handle navigation when unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Fetch agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const response = await axios.get("/api/users?role=AGENT");
        setAgents(response.data);
        // console.log("agents", response.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, []);

  // Assuming agents array contains agentRate and buyexRate for each agent
  const handleConsultancyChange = (selectedAgentName: string) => {
    form.setValue("consultancy", selectedAgentName);

    // Find the selected agent's details
    const selectedAgent = agents.find(
      (agent) => agent.name === selectedAgentName
    );

    if (selectedAgent) {
      // Calculate margin as agentRate + buyexRate
      const margin = (
        Number(selectedAgent.agentRate ?? 0) +
        Number(selectedAgent.buyexRate ?? 0)
      ).toString();
      form.setValue("margin", margin);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Remove the router.push call from here
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            console.log("Form submit triggered");
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
              Please fix the following errors:
              <ul className="list-disc pl-5">
                {Object.entries(form.formState.errors).map(([key, error]) => (
                  <li key={key}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Purpose
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "Blocked account transfer") {
                          form.setValue("receiverBankCountry", "Germany");
                          form.setValue("currency", "EUR");
                        } else if (value === "GIC Canada fee deposite") {
                          form.setValue("receiverBankCountry", "Canada");
                          form.setValue("currency", "CAD");
                        } else {
                          form.setValue("receiverBankCountry", "");
                          const selectedCountry = form.getValues(
                            "receiverBankCountry"
                          );
                          const countryCurrency =
                            COUNTRY_CURRENCY_MAP[
                              selectedCountry as keyof typeof COUNTRY_CURRENCY_MAP
                            ] || "";
                          form.setValue("currency", countryCurrency);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-blue-50/50 border-blue-200 shadow-lg h-12 w-full">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        className="w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto"
                        position="popper"
                        sideOffset={4}
                        align="start"
                        avoidCollisions={false}
                      >
                        <SelectItem
                          value="University fee transfer"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          University fee transfer
                        </SelectItem>
                        <SelectItem
                          value="Student Living expenses transfer"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Student Living expenses transfer
                        </SelectItem>
                        <SelectItem
                          value="Student Visa fee payment"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Student Visa fee payment
                        </SelectItem>
                        <SelectItem
                          value="Convera registered payment"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Convera registered payment
                        </SelectItem>
                        <SelectItem
                          value="Flywire registered payment"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Flywire registered payment
                        </SelectItem>
                        <SelectItem
                          value="Blocked account transfer"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Blocked account transfer
                        </SelectItem>
                        <SelectItem
                          value="Application fee"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Application fee
                        </SelectItem>
                        <SelectItem
                          value="Accommodation fee"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          Accommodation fee
                        </SelectItem>
                        <SelectItem
                          value="GIC Canada fee deposit"
                          className="hover:bg-blue-50 transition-colors text-sm sm:text-base"
                        >
                          GIC Canada fee deposit
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.purpose && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.purpose.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-gray-700 font-normal mb-2">
                    Education loan
                  </p>
                  <FormField
                    control={form.control}
                    name="educationLoan"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value === "yes") {
                            setCalculatedValues((prev) => ({
                              ...prev,
                              tcsApplicable: "0",
                            }));
                          } else {
                            setCalculatedValues((prev) => ({
                              ...prev,
                              tcsApplicable: calculateTcs(
                                Number.parseFloat(prev.inrAmount)
                              ).toString(),
                            }));
                          }
                        }}
                        value={field.value}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="yes"
                            id="yes"
                            className="border-blue-600 text-blue-600"
                          />
                          <Label htmlFor="yes" className="font-normal">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="font-normal">
                            No
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {form.watch("educationLoan") === "yes" ? (
                    <p className="text-xs text-green-600 mt-1">
                      No TCS applicable
                    </p>
                  ) : (
                    <p className="text-xs text-green-600 mt-1">
                      5% TCS applicable
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-gray-700 font-normal mb-2">
                    Foreign bank charges
                  </p>
                  <FormField
                    control={form.control}
                    name="foreignBankCharges"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="OUR"
                            id="our"
                            className="border-blue-600 text-blue-600"
                          />
                          <Label htmlFor="our" className="font-normal">
                            OUR
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="BEN" id="ben" />
                          <Label htmlFor="ben" className="font-normal">
                            BEN
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {form.watch("foreignBankCharges") === "OUR" ? (
                    <p className="text-xs text-green-600 mt-1">
                      Zero foreign bank charges{" "}
                    </p>
                  ) : (
                    <p className="text-xs text-green-600 mt-1">
                      Receiver bank charges applicable
                    </p>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="payer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Payer
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-blue-50/50 border-blue-200 shadow-lg h-12 w-full">
                          <SelectValue placeholder="Select payer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Siblings">Siblings</SelectItem>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forexPartner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Choose forex partner
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-blue-50/50 border-blue-200 shadow-lg h-12 w-full">
                          <SelectValue placeholder="Select forex partner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {forexPartnerData.map((partner) => (
                          <SelectItem
                            key={partner.accountName}
                            value={partner.accountName}
                          >
                            {partner.accountName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-normal">
                        Margin
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-50/50 border-blue-200 shadow-lg h-12"
                          placeholder="Enter margin"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="receiverBankCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Receiver&apos;s bank country
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        const currency =
                          COUNTRY_CURRENCY_MAP[
                            value as keyof typeof COUNTRY_CURRENCY_MAP
                          ] || "USD";
                        form.setValue("currency", currency, {
                          shouldValidate: true,
                        });
                      }}
                      value={field.value}
                      disabled={
                        form.watch("purpose") === "Blocked account transfer" ||
                        form.watch("purpose") === "GIC Canada fee deposite"
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="bg-blue-50/50 border-blue-200 shadow-lg h-12 w-full">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        className="w-[var(--radix-select-trigger-width)] max-h-[300px] overflow-y-auto"
                        position="popper"
                        sideOffset={4}
                        align="start"
                        avoidCollisions={false}
                      >
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Albania">Albania</SelectItem>
                        <SelectItem value="Austria">Austria</SelectItem>
                        <SelectItem value="Belgium">Belgium</SelectItem>
                        <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="Greece">Greece</SelectItem>
                        <SelectItem value="Ireland">Ireland</SelectItem>
                        <SelectItem value="Italy">Italy</SelectItem>
                        <SelectItem value="Latvia">Latvia</SelectItem>
                        <SelectItem value="Lithuania">Lithuania</SelectItem>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                        <SelectItem value="Malta">Malta</SelectItem>
                        <SelectItem value="Netherlands">Netherlands</SelectItem>
                        <SelectItem value="New Zealand">New Zealand</SelectItem>
                        <SelectItem value="Poland">Poland</SelectItem>
                        <SelectItem value="Portugal">Portugal</SelectItem>
                        <SelectItem value="Spain">Spain</SelectItem>
                        <SelectItem value="Sweden">Sweden</SelectItem>
                        <SelectItem value="Switzerland">Switzerland</SelectItem>
                        <SelectItem value="UAE">UAE</SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="United States of America">
                          United States of America
                        </SelectItem>
                        <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                      </SelectContent>
                    </Select>
                    {(form.watch("purpose") === "Blocked account transfer" ||
                      form.watch("purpose") === "GIC Canada fee deposite") && (
                      <p className="text-xs text-gray-500 mt-1">
                        Country automatically set based on purpose selection
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Student name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-blue-50/50 border-blue-200 shadow-lg h-12"
                        placeholder="Enter name"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal ">
                      Choose consultancy
                    </FormLabel>
                    <Select
                      onValueChange={handleConsultancyChange}
                      defaultValue={field.value}
                      disabled={isLoadingAgents}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-blue-50/50 border-blue-200 shadow-lg h-12 w-full">
                          <SelectValue
                            placeholder={
                              isLoadingAgents
                                ? "Loading agents..."
                                : "Select consultancy"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.name}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.consultancy && (
                      <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.consultancy.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-normal">
                          FCY Amount
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-blue-50/50 border-blue-200 shadow-lg h-12"
                            placeholder="Enter amount"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => {
                      const selectedCountry = form.watch("receiverBankCountry");
                      const countryCurrency = selectedCountry
                        ? COUNTRY_CURRENCY_MAP[
                            selectedCountry as keyof typeof COUNTRY_CURRENCY_MAP
                          ]
                        : "USD";

                      const usdPrimaryCountries = [
                        "United States of America",
                        "Uzbekistan",
                        "Georgia",
                        "Malaysia",
                        
                      ];

                      const showUsdOption =
                        selectedCountry &&
                        !usdPrimaryCountries.includes(selectedCountry);

                      return (
                        <FormItem>
                          <FormLabel className="font-normal">&nbsp;</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.trigger("currency");
                            }}
                            value={field.value || countryCurrency}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-12 bg-dark-blue text-white hover:text-white hover:bg-medium-blue border-blue-800">
                                <SelectValue
                                  placeholder={field.value || countryCurrency}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={countryCurrency}>
                                {countryCurrency}{" "}
                                {!showUsdOption && "(Default)"}
                              </SelectItem>
                              {showUsdOption && (
                                <SelectItem value="USD">
                                  USD (Alternative)
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          {field.value === "USD" &&
                            countryCurrency !== "USD" && (
                              <p className="text-xs text-gray-500 mt-1">
                                Using USD instead of {countryCurrency}
                              </p>
                            )}
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="ibrRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      IBR Rate
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-blue-50/50 border-blue-200 shadow-lg h-12"
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Calculation Section */}
          <div className="mt-4">
            {showCalculation ? (
              <div className="relative border-t pt-6 pb-4">
                <div className="absolute right-0 top-4 flex items-center">
                  <span className="text-gray-500 text-sm mr-1">
                    Hide Calculation
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCalculation(false)}
                    className="h-5 w-5 rounded-full border border-rose-400 flex items-center justify-center bg-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B93"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 7-7 7 7" />
                      <path d="M12 19V5" />
                    </svg>
                  </button>
                </div>
                <div className="absolute right-2 top-9 bottom-4 w-0.5 bg-rose-200">
                  <div className="absolute top-4 h-2 w-2 rounded-full bg-rose-200 border border-white -right-[3px]"></div>
                  <div className="absolute top-[26%] h-2 w-2 rounded-full bg-rose-200 border border-white -right-[3px]"></div>
                  <div className="absolute top-[46%] h-2 w-2 rounded-full bg-rose-200 border border-white -right-[3px]"></div>
                  <div className="absolute top-[66%] h-2 w-2 rounded-full bg-rose-200 border border-white -right-[3px]"></div>
                  <div className="absolute bottom-2 h-2 w-2 rounded-full bg-rose-200 border border-white -right-[3px]"></div>
                </div>
                <div className="space-y-6 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">INR Amount</div>
                    <div className="font-medium text-gray-700 pr-6">
                      {calculatedValues.inrAmount}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Bank Fee</div>
                    <div className="font-medium text-gray-700 pr-6">
                      {calculatedValues.bankFee}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">GST</div>
                    <div className="font-medium text-gray-700 pr-6">
                      {calculatedValues.gst}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">TCS Applicable</div>
                    <div className="font-medium text-gray-700 pr-6">
                      {calculatedValues.tcsApplicable}
                    </div>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div className="font-medium text-gray-700">
                      Total Payable
                    </div>
                    <div className="font-medium text-gray-700 pr-6">
                      {calculatedValues.totalPayable}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-500 flex items-center gap-1 p-0"
                  onClick={handleShowCalculation}
                >
                  <span>Enter amount to view calculation</span>
                  <div className="h-5 w-5 rounded-full border border-rose-400 flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-rose-400" />
                  </div>
                </Button>
              </div>
            )}
          </div>

          {/* Total Amount and Customer Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <p className="text-gray-700 font-normal mb-2">Total amount</p>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        placeholder="Total amount"
                        className="rounded-r-none bg-gray-150 shadow-lg border-blue-100 h-12"
                      />
                    </FormControl>
                  )}
                />
                <Button
                  type="button"
                  className="rounded-l-none h-12 bg-dark-blue text-white hover:bg-medium-blue border-blue-800"
                >
                  INR
                </Button>
              </div>
            </div>

            <div className="pt-4 mb-2 md:mb-0 gap-6">
              <FormField
                control={form.control}
                name="customerRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-normal">
                      Customer rate
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        placeholder=" customer rate"
                        className="bg-blue-50/50 border-blue-200 shadow-lg h-12"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              type="button"
              onClick={form.handleSubmit((data) =>
                handleDownloadQuote(data, calculatedValues)
              )}
              variant="outline"
              className="text-white border-none hover:opacity-90 flex items-center gap-2 h-12 rounded-md px-6"
              style={{
                background: "linear-gradient(to right, #614385, #516395)",
              }}
              disabled={isSubmitting || isQuoteDownloaded}
            >
              <Download className="h-5 w-5" />
              <span>Download Quote</span>
              <div className="flex ml-1">
                <span className="text-white font-bold">&gt;&gt;&gt;</span>
              </div>
            </Button>

            <Button
              type="submit"
              className="bg-dark-blue hover:bg-medium-blue text-white flex items-center gap-2 h-12 rounded-md px-6 border-none"
              disabled={isSubmitting || !isQuoteDownloaded}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span className="font-medium">PROCEED</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2 h-12 rounded-md px-6 bg-transparent"
              onClick={resetForm}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="font-medium">RESET</span>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
