"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Download, ArrowRight, RotateCcw, Play } from "lucide-react"
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { orderDetailsFormSchema, OrderDetailsFormValues } from "@/schema/orderdetails"
import { useRouter } from "next/navigation"
import { calculateGst, calculateTcs, calculateTotalPayable, getLiveRate } from "@/lib/financial"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

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

 function generateQuotePDF(formData: OrderDetailsFormValues, calculatedValues: CalculatedValues) {
    const doc = new jsPDF() as JsPDFWithAutoTable;
    let lastY = 30; // Track the last Y position manually

    // Add logo
    const logo = "/header-logo.png";
    doc.addImage(logo, "PNG", 14, 10, 50, 20); // Adjusted size for better visibility

    // Title (moved slightly to the right to accommodate logo)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Send Money Abroad Quote", 105, 20, { align: "center" });

    // Quote Info Table
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

    // Bank Details Title
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Forex Partner Bank Account Details ", 14, lastY);
    doc.setTextColor(255, 0, 0);
    doc.text("(Cash deposit not accepted)", 130, lastY);

    // Bank Info Table
    autoTable(doc, {
      startY: lastY + 15,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] },
      body: [
        ["Bank Name", "HDFC BANK"],
        ["Account Name", "Wsfx Global Pay Ltd"],
        ["Account Number", "WALLST17960000"],
        ["IFSC Code", "HDFC0001372"],
        ["Branch", "MUMBAI"],
      ],
    });

    lastY = doc.lastAutoTable.finalY + 10;

    // Upload Info
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for choosing BuyExchange for your forex needs.", 14, lastY);
    doc.setFont("helvetica", "normal");
    doc.text(
      "To proceed with your transaction, please upload the required documents using the secure link below:",
      14,
      lastY + 6
    );
    doc.setTextColor(0, 0, 255);
    doc.textWithLink("www.buyexchange.in/upload-documents", 14, lastY + 12, {
      url: "https://www.buyexchange.in/upload-documents",
    });

    // Terms & Conditions
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
    terms.forEach(term => {
      doc.text(term, 14, y);
      y += 6;
    });

    doc.save("Send_Money_Abroad_Quote.pdf");
  }
  
export default function OrderDetailsForm() {
  const [showCalculation, setShowCalculation] = useState(false);
  const [, setIsSubmitting] = useState(false);
  const router = useRouter()
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
      margin: "1",
      receiverBankCountry: "",
      studentName: "",
      consultancy: "",
      ibrRate: "",
      amount: "",
      currency: "INR",
      totalAmount: "",
      customerRate: "",
      educationLoan: undefined, // Set to undefined to match type
    },
  });

  const COUNTRY_CURRENCY_MAP = {
    "Germany": "EUR",
    "UAE": "AED",
    "Australia": "AUD",
    "Canada": "CAD",
    "Switzerland": "CHF",
    "France": "EUR",
    "United States of America": "USD",
    "United Kingdom": "GBP",
    "New Zealand": "NZD",
    "Sweden": "SEK",
    "Geogia": "EUR",
    "Bulgaria": "EUR",
    "Ireland": "EUR",
    "Latvia": "EUR",
    "Lithuania": "EUR",
    "Uzbekistan": "USD"
  };


  async function onSubmit(data: OrderDetailsFormValues) {
    try {
      setIsSubmitting(true);

      const formData = {
        ...data,
        foreignBankCharges: data.foreignBankCharges === "OUR" ? 0 : 1,
        margin: parseFloat(data.margin),
        ibrRate: parseFloat(data.ibrRate),
        amount: parseFloat(data.amount),
        totalAmount: data.totalAmount ? parseFloat(data.totalAmount.replace(/,/g, '')) : 0,
        customerRate: data.customerRate ? parseFloat(data.customerRate) : 0,
      };

      const response = await axios.post('/api/orders', formData);

      if (response.status === 200) {
        if (typeof window !== 'undefined') {
          // Save to localStorage
          localStorage.setItem('selectedPayer', data.payer);
          localStorage.setItem('educationLoan', data.educationLoan || "no"); // Save education loan selection
          localStorage.setItem('fromPlaceOrder', 'true');
        }
        // Redirect to sender details page
        router.push("/staff/dashboard/sender-details");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  function resetForm() {
    form.reset();
    setShowCalculation(false);
  }

  function handleShowCalculation() {
    setShowCalculation(true);
  }



  const amount = form.watch("amount");
  const currency = form.watch("currency");
  // const receiverBankCountry = form.watch("receiverBankCountry");
  // const purpose = form.watch("purpose");
  const foreignBankCharges = form.watch("foreignBankCharges");
  // const payer = form.watch("payer");
  const margin = form.watch("margin");
  const ibrRate = form.watch("ibrRate");

  useEffect(() => {
    if (currency) {
      getLiveRate(currency, "INR").then((rate: number) => {
        form.setValue("ibrRate", rate.toString());
      });
    }
  }, [currency, form]);

  useEffect(() => {
    if (foreignBankCharges === "OUR") {
      setCalculatedValues(prev => ({
        ...prev,
        bankFee: "1500"
      }));
    } else {
      setCalculatedValues(prev => ({
        ...prev,
        bankFee: "300"
      }));
    }
  }, [foreignBankCharges]);

  useEffect(() => {
    const currentAmount = parseFloat(amount || '0');
    const currentMargin = parseFloat(margin || '0');
    const currentIbrRate = parseFloat(ibrRate || '0');

    if (currentAmount && currentMargin) {
      const totalAmount = (currentIbrRate + currentMargin) * currentAmount;
      form.setValue("customerRate", (currentIbrRate + currentMargin).toFixed(2).toString());

      setCalculatedValues(prev => ({
        ...prev,
        inrAmount: totalAmount.toString(),
        gst: calculateGst(totalAmount).toString(),
        tcsApplicable: form.watch("educationLoan") === "yes"
          ? "0"
          : calculateTcs(totalAmount).toString(),
        totalPayable: calculateTotalPayable(totalAmount, parseFloat(prev.bankFee)).toString(),
      }));
    }
  }, [amount, margin, ibrRate, calculatedValues.bankFee, form]);

  useEffect(() => {
    form.setValue("totalAmount", calculatedValues.totalPayable.toString());
  }, [calculatedValues.totalPayable, form]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get('/api/orders');
        // You can use the orders data if needed
        console.log('Fetched orders:', response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);


  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal">Purpose</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Automatically set country based on purpose
                      if (value === "Blocked account transfer") {
                        form.setValue("receiverBankCountry", "Germany")
                        form.setValue("currency", "EUR") // Set currency based on country
                      } else if (value === "GIC Canada fee deposite") {
                        form.setValue("receiverBankCountry", "Canada")
                        form.setValue("currency", "CAD") // Set currency based on country
                      } else {
                        // Reset to empty if not one of the special purposes
                        form.setValue("receiverBankCountry", "")
                        form.setValue("currency", "")
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-blue-50/50 border-blue-100 h-12 w-full">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="University fee transfer">University fee transfer</SelectItem>
                      <SelectItem value="Student Living expenses transfer">Student Living expenses transfer</SelectItem>
                      <SelectItem value="Student Visa fee payment">Student Visa fee payment</SelectItem>
                      <SelectItem value="Convera registered payment">Convera registered payment</SelectItem>
                      <SelectItem value="Flywire registered payment">Flywire registered payment</SelectItem>
                      <SelectItem value="Blocked account transfer">Blocked account transfer</SelectItem>
                      <SelectItem value="Application fee">Application fee</SelectItem>
                      <SelectItem value="Accomodation fee">Accomodation fee</SelectItem>
                      <SelectItem value="GIC Canada fee deposite">GIC Canada fee deposite</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row gap-6">
              {/* Education Loan Section */}
              <div className="flex-1">
                <p className="text-gray-700 font-normal mb-2">Education loan</p>
                <FormField
                  control={form.control}
                  name="educationLoan"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Update TCS applicability based on selection
                        if (value === "yes") {
                          setCalculatedValues(prev => ({
                            ...prev,
                            tcsApplicable: "0",
                          }));
                        } else {
                          setCalculatedValues(prev => ({
                            ...prev,
                            tcsApplicable: calculateTcs(parseFloat(prev.inrAmount)).toString(),
                          }));
                        }
                      }}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" className="border-blue-600 text-blue-600" />
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
                  <p className="text-xs text-green-600 mt-1">*No TCS applicable</p>
                ) : (
                  <p className="text-xs text-green-600 mt-1">*5% TCS applicable</p>
                )}
              </div>



              {/* Foreign Bank Charges Section */}
              <div className="flex-1">
                <p className="text-gray-700 font-normal mb-2">Foreign bank charges</p>
                <FormField
                  control={form.control}
                  name="foreignBankCharges"
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OUR" id="our" className="border-blue-600 text-blue-600" />
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
                  <p className="text-xs text-green-600 mt-1">*Zero foreign bank charges </p>
                ) : (
                  <p className="text-xs text-green-600 mt-1">*Receiver bank charges applicable</p>
                )}
              </div>
            </div>
            {/* Rest of the left column fields remain the same */}
            <FormField
              control={form.control}
              name="payer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal">Payer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-blue-50/50 border-blue-100 h-12 w-full">
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
                  <FormLabel className="text-gray-700 font-normal">Choose forex partner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-blue-50/50 border-blue-100 h-12 w-full">
                        <SelectValue placeholder="Select forex partner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nium Forex India Pvt Ltd">Nium Forex India Pvt Ltd</SelectItem>
                      <SelectItem value="Ebix Cash World Money Ltd">Ebix Cash World Money Ltd</SelectItem>
                      <SelectItem value="WSFX Global Pay Ltd">WSFX Global Pay Ltd</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="margin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal">Margin</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-blue-50/50 border-blue-100 h-12" placeholder="Enter margin" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - All fields remain the same */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="receiverBankCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal">Receiver&apos;s bank country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // Automatically set currency based on selected country
                      const currency = COUNTRY_CURRENCY_MAP[value as keyof typeof COUNTRY_CURRENCY_MAP] || ""
                      form.setValue("currency", currency)
                    }}
                    value={field.value}
                    disabled={
                      form.watch("purpose") === "Blocked account transfer" ||
                      form.watch("purpose") === "GIC Canada fee deposite"
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="bg-blue-50/50 border-blue-100 h-12 w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Switzerland">Switzerland</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="United States of America">United States of America</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Geogia">Geogia</SelectItem>
                      <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                      <SelectItem value="Ireland">Ireland</SelectItem>
                      <SelectItem value="Latvia">Latvia</SelectItem>
                      <SelectItem value="Lithuania">Lithuania</SelectItem>
                      <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                    </SelectContent>
                  </Select>
                  {(form.watch("purpose") === "Blocked account transfer" ||
                    form.watch("purpose") === "GIC Canada fee deposite") && (
                      <p className="text-xs text-gray-500 mt-1">Country automatically set based on purpose selection</p>
                    )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal">Student name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-blue-50/50 border-blue-100 h-12" placeholder="Enter name" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consultancy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal ">Choose consultancy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-blue-50/50 border-blue-100 h-12 w-full">
                        <SelectValue placeholder="Select consultancy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SPAN">SPAN</SelectItem>
                      <SelectItem value="Orion Study Abroad">Orion Study Abroad</SelectItem>
                      <SelectItem value="Join in campus">Join in campus</SelectItem>
                      <SelectItem value="Scope overseas">Scope overseas</SelectItem>
                      <SelectItem value="Triumph Education Centre">Triumph Education Centre</SelectItem>
                      <SelectItem value="Career Gyan">Career Gyan</SelectItem>
                      <SelectItem value="Entry Fly">Entry Fly</SelectItem>
                      <SelectItem value="Buy Exchange">Buy Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ibrRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-normal">IBR Rate</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-blue-50/50 border-blue-100 h-12" readOnly />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Updated Amount and Dynamic Currency Section */}
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-normal">Amount</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-blue-50/50 border-blue-100 h-12" placeholder="Enter amount" />
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
                      ? COUNTRY_CURRENCY_MAP[selectedCountry as keyof typeof COUNTRY_CURRENCY_MAP]
                      : "";

                    // Countries that already use USD
                    const usdCountries = ["United States of America", "Uzbekistan"];

                    // Only show USD option if the country doesn't already use USD
                    const showUsdOption = selectedCountry && !usdCountries.includes(selectedCountry);

                    return (
                      <FormItem>
                        <FormLabel className="font-normal">&nbsp;</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || countryCurrency}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-12 bg-dark-blue text-white hover:text-white hover:bg-medium-blue border-blue-800">
                              <SelectValue placeholder={field.value || countryCurrency} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* Always show the country's currency as the first option */}
                            {countryCurrency && (
                              <SelectItem value={countryCurrency}>
                                {countryCurrency}
                              </SelectItem>
                            )}
                            {/* Show USD option only if country doesn't already use USD */}
                            {showUsdOption && (
                              <SelectItem value="USD">USD</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Section */}
        <div className="mt-4">
          {showCalculation ? (
            <div className="relative border-t pt-6 pb-4">
              <div className="absolute right-0 top-4 flex items-center">
                <span className="text-gray-500 text-sm mr-1">Hide Calculation</span>
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
                  <div className="font-medium text-gray-700 pr-6">{calculatedValues.inrAmount}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">Bank Fee</div>
                  <div className="font-medium text-gray-700 pr-6">{calculatedValues.bankFee}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">GST</div>
                  <div className="font-medium text-gray-700 pr-6">{calculatedValues.gst}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600">TCS Applicable</div>
                  <div className="font-medium text-gray-700 pr-6">{calculatedValues.tcsApplicable}</div>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <div className="font-medium text-gray-700">Total Payable</div>
                  <div className="font-medium text-gray-700 pr-6">{calculatedValues.totalPayable}</div>
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
                      className="rounded-r-none bg-blue-50/50 border-blue-100 h-12"
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
          <div>
            <p className="text-gray-700 font-normal mb-2">Customer rate</p>
            <FormField
              control={form.control}
              name="customerRate"
              render={({ field }) => (
                <FormControl>
                  <Input {...field} readOnly placeholder=" customer rate" className="bg-blue-50/50 border-blue-100 h-12" />
                </FormControl>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button
            type="button"
            onClick={() => generateQuotePDF(form.getValues(), calculatedValues)}
            variant="outline"
            className="text-white border-none hover:opacity-90 flex items-center gap-2 h-12 rounded-md px-6"
            style={{
              background: 'linear-gradient(to right, #614385, #516395)',
            }}
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
          >
            <Play className="h-4 w-4" />
            <span className="font-medium">PROCEED</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2 h-12 rounded-md px-6"
            onClick={resetForm}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="font-medium">RESET</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}