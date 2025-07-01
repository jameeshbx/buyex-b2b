"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  calculateGst,
  calculateTcs,
  calculateTotalPayable,
  getLiveRate,
} from "@/lib/financial";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface Order {
  id: string;
  purpose: string;
  foreignBankCharges: number;
  payer: string;
  forexPartner: string;
  margin: number;
  receiverBankCountry: string;
  studentName: string;
  consultancy: string;
  ibrRate: number;
  amount: number;
  currency: string;
  totalAmount: number;
  customerRate: number;
  educationLoan?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    studentName: string;
    studentEmailOriginal: string;
    studentEmailFake: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    postalCode: string;
    nationality: string;
    relationship: string;
    senderName: string;
    bankCharges: string;
    mothersName: string;
    dob: string;
    senderNationality: string;
    senderEmail: string;
    sourceOfFunds: string;
    occupationStatus: string;
    payerAccountNumber: string;
    payerBankName: string;
    senderAddressLine1: string;
    senderAddressLine2: string;
    senderState: string;
    senderPostalCode: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  beneficiary?: {
    id: string;
    receiverFullName: string;
    receiverCountry: string;
    address: string;
    receiverBank: string;
    receiverBankAddress: string;
    receiverBankCountry: string;
    receiverAccount: string;
    receiverBankSwiftCode: string;
    iban: string;
    sortCode: string;
    transitNumber: string;
    bsbCode: string;
    routingNumber: string;
    anyIntermediaryBank: string;
    intermediaryBankName: string;
    intermediaryBankAccountNo: string;
    intermediaryBankIBAN: string;
    intermediaryBankSwiftCode: string;
    totalRemittance: string;
    field70: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface TransactionDetailsProps {
  orderId: string;
  onCreateOrder: () => void;
  onBack: () => void;
}

interface CalculatedValues {
  inrAmount: number;
  bankFee: number;
  gst: number;
  tcsApplicable: number;
  totalPayable: number;
  customerRate: number;
}

export default function TransactionDetails({
  orderId,
  onCreateOrder,
  onBack,
}: TransactionDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    inrAmount: 0,
    bankFee: 1500,
    gst: 0,
    tcsApplicable: 0,
    totalPayable: 0,
    customerRate: 0,
  });

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
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${orderId}`);
        const orderData = response.data;
        setOrder(orderData);
        setAmount(orderData.amount.toString());
        setCurrency(orderData.currency);

        // Set initial bank fee based on foreign bank charges
        setCalculatedValues((prev) => ({
          ...prev,
          bankFee: orderData.foreignBankCharges === 0 ? 1500 : 300,
        }));
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Update live rate when currency changes
  useEffect(() => {
    const updateLiveRate = async () => {
      if (currency && order) {
        try {
          const rate = await getLiveRate(currency, "INR");
          const newCustomerRate = rate + order.margin;
          setCalculatedValues((prev) => ({
            ...prev,
            customerRate: newCustomerRate,
          }));
        } catch (error) {
          console.error("Error fetching live rate:", error);
        }
      }
    };

    updateLiveRate();
  }, [currency, order]);

  // Calculate values when amount, currency, or other factors change
  useEffect(() => {
    if (amount && calculatedValues.customerRate && order) {
      const numAmount = Number.parseFloat(amount);
      const inrAmount = numAmount * calculatedValues.customerRate;
      const gstAmount = Number.parseFloat(calculateGst(inrAmount));
      const tcsAmount = Number.parseFloat(
        calculateTcs(
          inrAmount,
          order.educationLoan === "yes" ? "education" : ""
        )
      );
      const totalPayable = Number.parseFloat(
        calculateTotalPayable(inrAmount, calculatedValues.bankFee)
      );

      setCalculatedValues((prev) => ({
        ...prev,
        inrAmount,
        gst: gstAmount,
        tcsApplicable: tcsAmount,
        totalPayable,
      }));
    }
  }, [amount, calculatedValues.customerRate, calculatedValues.bankFee, order]);

  const handleUpdateOrder = async () => {
    if (!order) return;

    try {
      setUpdating(true);

      const updateData = {
        ...order,
        amount: Number.parseFloat(amount),
        currency,
        customerRate: calculatedValues.customerRate,
        totalAmount: calculatedValues.totalPayable,
        ibrRate: calculatedValues.customerRate - order.margin,
      };

      await axios.patch(`/api/orders/${orderId}`, updateData);

      // Update local state
      setOrder((prev) => (prev ? { ...prev, ...updateData } : null));

      // Generate and upload A2 form PDF
      const pdfResult = await generateA2FormPDF({ ...order, ...updateData });

      if (pdfResult.success) {
        console.log("A2 Form PDF uploaded successfully:", pdfResult);
        // You can show a success message here if needed
      }

      onCreateOrder();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const getCurrencyOptions = () => {
    if (!order) return [];

    const countryCurrency =
      COUNTRY_CURRENCY_MAP[
        order.receiverBankCountry as keyof typeof COUNTRY_CURRENCY_MAP
      ];
    const options = [countryCurrency];

    // Add USD option for non-USD countries
    if (countryCurrency !== "USD") {
      options.push("USD");
    }

    return options.filter(Boolean);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested order could not be found.
          </p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Details Section */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 font-jakarta">
              Transaction Details
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Order ID
                </div>
                <div className="text-black font-semibold text-sm sm:text-base font-jakarta">
                  {order.id}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Purpose
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.purpose}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Receiver&apos;s Bank Country
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.receiverBankCountry}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Foreign Bank Charges
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.foreignBankCharges === 0
                    ? "OUR (Sender bears bank charges)"
                    : "BEN (Receiver bears bank charges)"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Payer
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.payer}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Student Name
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.studentName}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Consultancy
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.consultancy}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Forex Partner
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.forexPartner}
                </div>
              </div>
            </div>
          </div>

          {/* Currency & Rate Details Section */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 font-jakarta">
              Currency & Rate Details
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Status
                </div>
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
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Customer Rate
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  ₹{calculatedValues.customerRate.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Margin
                </div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">
                  {order.margin}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">
                  Total INR Amount
                </div>
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
              <Image
                src="/round.png"
                alt="Timeline point"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
            <div className="absolute top-[22%] -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image
                src="/round.png"
                alt="Timeline point"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
            <div className="absolute top-[44%] -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image
                src="/round.png"
                alt="Timeline point"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
            <div className="absolute top-[66%] -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image
                src="/round.png"
                alt="Timeline point"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
            <div className="absolute bottom-0 -right-2 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              <Image
                src="/round.png"
                alt="Timeline point"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 sm:space-y-6 sm:pr-16 mb-[-12px]">
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">
                INR Amount
              </div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹
                {calculatedValues.inrAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">
                Bank Fee
              </div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹{calculatedValues.bankFee.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">
                GST
              </div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">
                ₹
                {calculatedValues.gst.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">
                TCS Applicable
              </div>
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
                <div className="font-bold text-font-gray text-sm sm:text-base font-jakarta">
                  Total Payable
                </div>
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
              <Image
                src="/continue.svg"
                alt=""
                width={15}
                height={15}
                className="mr-2"
              />
            )}
            <span>{updating ? "Updating..." : "Update & Continue"}</span>
          </Button>
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-600 px-8 sm:px-12 py-3 sm:py-4 font-jakarta w-full sm:w-auto"
          >
            <Image
              src="/reset.svg"
              alt=""
              width={15}
              height={15}
              className="mr-2 sm:mr-0 sm:ml-2"
            />
            <span>Back</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper to generate A2 form PDF and upload to S3
async function generateA2FormPDF(order: Order) {
  try {
    const pdfDoc = await PDFDocument.create();
    const PAGE_HEIGHT = 842;
    const PAGE_WIDTH = 595;
    const MARGIN_TOP = 30;
    const MARGIN_BOTTOM = 30;
    const LINE_HEIGHT = 18;

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Helper to manage y position and page breaks
    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN_TOP;

    const addNewPage = () => {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN_TOP;
    };

    const drawText = (text: string, x: number, size = 10, bold = false) => {
      if (y < MARGIN_BOTTOM + size) {
        addNewPage();
      }
      const safeText = text.replace(/₹/g, "Rs.");
      page.drawText(safeText, {
        x,
        y,
        size,
        font: bold ? fontBold : font,
        color: rgb(0, 0, 0),
      });
      y -= LINE_HEIGHT;
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
    };

    // -------- PAGE 1 --------
    drawText(
      "FORM A2 and Application cum Declaration for purchase of foreign exchange under Liberalized Remittance Scheme (LRS) as amended by RBI",
      30,
      10
    );
    drawText(
      "vide Master Direction-LRS dated June 20, 2018 for INDIAN PASSPORT HOLDER (To be completed by the applicant in BLOCK letters)",
      30,
      10
    );
    drawText(`Date: ${new Date().toLocaleDateString()}`, 30, 12);
    drawText("The Branch Manager", 30, 12);
    drawText("________________", 30, 12);
    drawText("________________Branch", 30, 12);
    drawText("Dear Sir,", 30, 12);

    // Fill in the purpose based on order data
    const purposeText =
      order.purpose === "Overseas Education"
        ? "Subject: Remittance / Release of Foreign Exchange for Overseas Education"
        : "Subject: Remittance / Release of Foreign Exchange for Private Visit /Medical Treatment / Emigrations / University Fee";
    drawText(purposeText, 30, 10);

    drawText(
      "Overseas Education / Employment / Other purposes Transfer (Please Specify) (Strike out whichever is not applicable).",
      30,
      10
    );
    drawText(
      "With reference to the above I request you to release foreign exchange for the purpose mentioned above and furnish the following details:",
      30,
      10
    );
    drawText("1. Details of Applicant / Remitter", 30, 12, true);
    drawText(
      `Applicant Name: ${order.sender?.senderName || order.payer}`,
      30,
      10
    );
    drawText(`Date of Birth: ${order.sender?.dob || "__/__/____"}`, 300, 10);
    drawText(
      `Address: ${
        order.sender?.senderAddressLine1 || "___________________________"
      }`,
      30,
      10
    );
    drawText(
      `City: ${order.sender?.senderState || "__________________"} Pin Code: ${
        order.sender?.senderPostalCode || "___________"
      }`,
      30,
      10
    );
    drawText(
      `State: ${
        order.sender?.senderState || "__________________"
      } Telephone No.: ${
        order.sender?.phoneNumber || "______________"
      } Mobile No.: ${order.sender?.phoneNumber || "_______________"}`,
      30,
      10
    );
    drawText(
      `Email ID.: ${
        order.sender?.senderEmail || "___________________________"
      } Nationality: ${order.sender?.senderNationality || "Indian"}`,
      30,
      10
    );
    drawText(
      `PAN No.: ___________________________ Residential Status: ${
        order.sender?.bankCharges || "resident"
      }`,
      30,
      10
    );
    drawText(
      "Passport No: __________________ Date of Expiry: __________ Place of Issue: __________",
      30,
      10
    );

    // Only show student details if purpose is Overseas Education
    if (order.purpose === "Overseas Education") {
      drawText(
        "2. Details of Person on whose behalf remittance is being made only under overseas education or Medical Treatment",
        30,
        12,
        true
      );
      drawText(
        `Student /Patient Name: ${
          order.sender?.studentName || order.studentName
        } Passport No.: _______________`,
        30,
        10
      );
      drawText(
        "PAN No.: _______________ *College/University/Hospital: _______________",
        30,
        10
      );
      drawText(
        "Academic Year: __________ City / Country: __________ Date of Travel: __________",
        30,
        10
      );
      drawText(
        `**Relationship with the Applicant / Remitter: ${
          order.sender?.relationship || "_______________"
        }`,
        30,
        10
      );
    }
    drawText("Signature of the applicant", 400, 10);

    // Add page 2
    addNewPage();

    // -------- PAGE 2 --------
    drawText(
      "3. Foreign exchange amount to be released / remitted (Please provide the exact split)",
      30,
      12,
      true
    );

    // Draw split fields on one line
    drawText("Cash Currency & Amount", 30, 10, false);
    drawText("Travellers Cheque Currency & Amount", 280, 10, false);
    y -= 12;
    drawLine(30, y, 150, y); // underline
    drawLine(280, y, 450, y); // underline

    y -= 8;
    drawText("Card Currency & Amount", 30, 10, false);
    drawText("Draft Currency & Amount", 280, 10, false);
    y -= 12;
    drawLine(30, y, 150, y);
    drawLine(280, y, 450, y);

    y -= 10;
    drawText(
      `TT Currency & Amount: ${order.currency} ${order.amount}`,
      30,
      10,
      false
    );
    y -= 12;
    drawLine(150, y + 10, 330, y + 10); // underline for value

    drawText(`Equivalent to Rs: ${order.totalAmount}`, 30, 10, false);
    drawText("Equivalent to USD", 280, 10, false);
    y -= 12;
    drawLine(130, y + 10, 230, y + 10);
    drawLine(380, y + 10, 480, y + 10);

    y -= 10;
    drawText(
      `Country of Travel / Remittance: ${order.receiverBankCountry}`,
      30,
      10,
      false
    );
    drawText("Date of Travel:", 280, 10, false);
    y -= 12;
    drawLine(210, y + 10, 270, y + 10);
    drawLine(380, y + 10, 480, y + 10);

    y -= 10;
    drawText(
      `Source of Funds: ${order.sender?.sourceOfFunds || "Personal Savings"}`,
      30,
      10,
      false
    );

    y -= 15;
    drawText("In case of Demand Draft", 30, 10, true);
    drawText(
      `Source of Funds: ${order.sender?.sourceOfFunds || "________________"}`,
      30,
      10,
      false
    );
    y -= 12;
    drawLine(130, y + 10, 330, y + 10);

    y -= 15;
    drawText("In case of swift / Telegraphic transfer", 30, 10, true);
    drawText("Beneficiary Details:", 30, 10, true);

    y -= 12;
    drawText(
      `Beneficiary Name: ${
        order.beneficiary?.receiverFullName || "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Beneficiary Address: ${
        order.beneficiary?.address || "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Beneficiary Bank Account Number: ${
        order.beneficiary?.receiverAccount || "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Beneficiary Bank Name and Address: ${
        order.beneficiary?.receiverBank || "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Swift Code / Routing No.: ${
        order.beneficiary?.receiverBankSwiftCode ||
        "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `ABA routing / BLZ / Sort Code / Bank Code: ${
        order.beneficiary?.sortCode ||
        order.beneficiary?.routingNumber ||
        order.beneficiary?.bsbCode ||
        "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Id IBAN International: ${
        order.beneficiary?.iban || "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Additional information to the beneficiary (if available): ${
        order.beneficiary?.field70 || "____________________________"
      }`,
      30,
      10,
      false
    );
    y -= 12;
    drawText(
      `Information to be sent with wire transfer, if any: ____________________________`,
      30,
      10,
      false
    );

    y -= 15;
    drawText(
      "Correspondent Bank Charges: Ours (Strike out whichever is not applicable)",
      30,
      10,
      false
    );

    // --- Remittance Table ---
    y -= 20;
    drawText(
      "4. # Details of the remittance made / transaction effected under the LRS in the current financial year. (April ______ March ______ ) (if needed attach additional sheets in the same format)",
      30,
      10,
      false
    );
    y -= 15;

    // Table headers
    const tableX = 30;
    const colWidths = [30, 60, 80, 80, 80, 150];
    const headers = [
      "Sr. No.",
      "Date",
      "FCN & Amount",
      "Equivalent to Rs.",
      "Equivalent to USD",
      "Name and address of AD branch/FFMC through which the transaction has been effected",
    ];
    let colX = tableX;
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: colX + 2,
        y: y,
        size: 7,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      colX += colWidths[i];
    });
    y -= 12;

    // Table rows (empty for manual fill)
    for (let i = 0; i < 3; i++) {
      colX = tableX;
      colWidths.forEach((w, j) => {
        drawLine(colX, y, colX + w, y); // top line
        drawLine(colX, y - 12, colX + w, y - 12); // bottom line
        drawLine(colX, y, colX, y - 12); // left line
        if (j === colWidths.length - 1) {
          drawLine(colX + w, y, colX + w, y - 12); // right line
        }
        colX += w;
      });
      y -= 12;
    }

    y -= 20;
    drawText(
      "I, undertake that in case, if it is reported that I have breached the LRS limit, I will be my responsibility to bring back/surrender the amount purchased/remitted in excess of the LRS limit and thereafter I will approach RBI for compounding of contravention under FEMA 1999.",
      30,
      8,
      false
    );
    y -= 20;
    drawText("Signature of the applicant", 400, 10);

    // --- PAGE 3: Declaration, Payment, Bank Details, Certificate ---
    addNewPage();
    y -= 10;

    // Declaration
    drawText("Declaration cum undertaking", 30, 12, true);
    y -= 10;
    const declaration = [
      "I, the undersigned, hereby declare that the total amount of foreign exchange purchased from or remitted through, all sources in India during this financial year including the present application does not exceed USD 2,50,000/- (US Dollar Two Lakh Fifty Thousand only) or equivalent and certify that the source of funds for making the said remittance belongs to me and the foreign exchange will not be used for prohibited purposes. I am aware that the total amount of foreign exchange purchased from or remitted through, all sources in India during this financial year including the present application does not exceed the limit prescribed by RBI under the Liberalised Remittance Scheme.",
      "I also declare that the above information given by me is true and correct and that I am not a minor. If any information is found to be incorrect, I will be liable for action under FEMA 1999.",
      "I also undertake to submit further information/documents as may be required by the bank.",
      "I further declare that the funds for remittance are not from any borrowed funds or loans and are not intended for any prohibited activities such as margin trading, lottery, etc.",
      "I am aware that the bank may refuse to process the remittance if the information provided is found to be incorrect or incomplete.",
    ];
    declaration.forEach((line) => {
      drawText(line, 30, 8, false);
    });

    y -= 10;
    drawText(
      "Payment is made by Self ______ or **Close Relative (Relation) ______ PAN ______",
      30,
      10,
      false
    );
    y -= 10;
    drawText(
      "Payment mode: Cash / Cheque / DD / PO / Bank Transfer / RTGS / NEFT (strike off which is not applicable)",
      30,
      10,
      false
    );

    y -= 15;
    drawText("Bank Details from which payment is made", 30, 10, true);
    y -= 10;
    drawText(
      "Bank Account Holder Name: ___________________________ Bank: ___________________________",
      30,
      10,
      false
    );
    drawText(
      "Bank Branch: ___________________________ Account No.: ___________________________ IFSC: ___________________________",
      30,
      10,
      false
    );
    drawText(
      "Cheque No./DD No./PO No./JRT No./ Transfer No.: ___________________________",
      30,
      10,
      false
    );

    y -= 15;
    drawText(
      "Signature of the applicant: ___________________________",
      30,
      10,
      false
    );
    drawText(
      "Signature of the natural guardian (if applicant is minor): ___________________________",
      300,
      10,
      false
    );
    drawText("Name: ___________________________", 30, 10, false);
    drawText("Name: ___________________________", 300, 10, false);
    drawText(
      "Relationship with the Applicant: ___________________________",
      30,
      10,
      false
    );

    y -= 20;
    drawText("Certificate by the Authorized Dealer", 30, 10, true);
    y -= 10;
    drawText(
      "This is to certify that the remittance is not being made by ineligible entities and that the remittance is in conformity with the instructions issued by the Reserve Bank from time to time under the Scheme. I have verified KYC documents in originals.",
      30,
      8,
      false
    );
    drawText(
      "Name and designation of the authorized official: ___________________________",
      30,
      10,
      false
    );

    y -= 15;
    drawText(
      "Signature: ___________________________ Date: ___________________________ Place: ___________________________ Stamp / seal: ___________________________",
      30,
      10,
      false
    );

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Create a File object from the PDF bytes
    const fileName = `A2_Form_${order.id}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

    // Step 1: Get presigned URL for S3 upload
    const presignedResponse = await fetch("/api/upload/s3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: fileName,
        fileType: "application/pdf",
        folder: "buyex-documents/a2-forms",
      }),
    });

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json();
      throw new Error(errorData.error || "Failed to get upload URL");
    }

    const presignedData = await presignedResponse.json();

    // Step 2: Upload PDF to S3
    const uploadResponse = await fetch(presignedData.presignedUrl, {
      method: "PUT",
      body: pdfFile,
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload PDF to S3");
    }

    // Step 3: Save document record to database
    const documentResponse = await fetch("/api/upload/document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "SENDER",
        userId: order.sender?.id, // You'll need to get this from your auth context
        type: "OTHER",
        imageUrl: presignedData.cloudFrontUrl,
        orderId: order.id,
      }),
    });

    if (!documentResponse.ok) {
      const errorData = await documentResponse.json();
      throw new Error(errorData.error || "Failed to save document record");
    }

    const documentData = await documentResponse.json();

    console.log("PDF generated and uploaded successfully:", {
      fileName,
      s3Url: presignedData.cloudFrontUrl,
      documentId: documentData.id,
    });

    return {
      success: true,
      fileName,
      s3Url: presignedData.cloudFrontUrl,
      documentId: documentData.id,
    };
  } catch (error) {
    console.error("Error generating and uploading PDF:", error);
    throw error;
  }
}
