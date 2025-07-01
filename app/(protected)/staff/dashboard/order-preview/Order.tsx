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

      // Generate and download A2 form PDF
      await generateA2FormPDF({ ...order, ...updateData });

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

// Helper to generate A2 form PDF
async function generateA2FormPDF(order: Order) {
  const pdfDoc = await PDFDocument.create();
  const PAGE_HEIGHT = 842;
  const PAGE_WIDTH = 595;
  const MARGIN_TOP = 30;
  const MARGIN_BOTTOM = 30;
  const LINE_HEIGHT = 18;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper to manage y position and page breaks
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN_TOP;

  const addNewPage = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN_TOP;
  };

  const drawText = (text: string, x: number, size = 10) => {
    if (y < MARGIN_BOTTOM + size) {
      addNewPage();
    }
    const safeText = text.replace(/₹/g, "Rs.");
    page.drawText(safeText, { x, y, size, font, color: rgb(0, 0, 0) });
    y -= LINE_HEIGHT;
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
  drawText(`Date:${new Date().toLocaleDateString()}`, 30, 12);
  drawText("The Branch Manager", 30, 12);
  drawText("________________", 30, 12);
  drawText("________________Branch", 30, 12);
  drawText("Dear Sir,", 30, 12);
  drawText(
    "Subject: Remittance / Release of Foreign Exchange for Private Visit /Medical Treatment / Emigrations / University Fee",
    30,
    10
  );
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
  drawText("1. Details of Applicant / Remitter", 30, 12);
  drawText(`Applicant Name: ${order.payer}`, 30, 10);
  drawText("Date of Birth: __/__/____", 300, 10);
  drawText("Address: ___________________________", 30, 10);
  drawText("City: __________________ Pin Code: ___________", 30, 10);
  drawText(
    "State: __________________ Telephone No.: ______________ Mobile No.: _______________",
    30,
    10
  );
  drawText(
    "Email ID.: ___________________________ Nationality: Indian",
    30,
    10
  );
  drawText(
    "PAN No.: ___________________________ Residential Status: resident",
    30,
    10
  );
  drawText(
    "Passport No: __________________ Date of Expiry: __________ Place of Issue: __________",
    30,
    10
  );
  drawText(
    "2. Details of Person on whose behalf remittance is being made only under overseas education or Medical Treatment",
    30,
    12
  );
  drawText(
    "Student /Patient Name: __________________ Passport No.: _______________",
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
    "**Relationship with the Applicant / Remitter _______________",
    30,
    10
  );
  drawText("Signature of the applicant", 400, 10);

  // Add page 2
  addNewPage();

  // -------- PAGE 2 --------
  drawText(
    "3. Foreign exchange amount to be released / remitted (Please provide the exact split)",
    30,
    12
  );
  drawText(
    "Cash Currency & Amount __________________ Travellers Cheque Currency & Amount __________________",
    30,
    10
  );
  drawText(
    "Card Currency & Amount __________________ Draft Currency & Amount __________________",
    30,
    10
  );
  drawText(`TT Currency & Amount ${order.currency} ${order.amount}`, 30, 10);
  drawText(
    `Equivalent to Rs ${order.totalAmount} Equivalent to USD __________`,
    30,
    10
  );
  drawText(
    `Country of Travel / Remittance: ${order.receiverBankCountry} Date of Travel: __________`,
    30,
    10
  );
  drawText("Source of Funds: Personal Savings", 30, 10);
  drawText("In case of Demand Draft", 30, 10);
  drawText("Source of Funds: __________________", 30, 10);
  drawText("In case of swift / Telegraphic transfer", 30, 10);
  drawText("Beneficiary Details:", 30, 10);
  drawText("Beneficiary Name __________________", 30, 10);
  drawText("Beneficiary Address __________________", 30, 10);
  drawText("Beneficiary Bank Account Number __________________", 30, 10);
  drawText("Beneficiary Bank Name and Address __________________", 30, 10);
  drawText("Swift Code / Routing No. __________________", 30, 10);
  drawText(
    "ABA routing / BLZ / Sort Code / Bank Code: __________________",
    30,
    10
  );
  drawText("Id IBAN International: __________________", 30, 10);
  drawText(
    "Additional information to the beneficiary (if available) __________________",
    30,
    10
  );
  drawText(
    "Information to be sent with wire transfer, if any __________________",
    30,
    10
  );
  drawText(
    "Correspondent Bank Charges: Ours (Strike out whichever is not applicable)",
    30,
    10
  );
  drawText(
    "4. # Details of the remittance made / transaction effected under the LRS in the current financial year. (April ______ March ______ ) (if needed attach additional sheets in the same format)",
    30,
    10
  );
  drawText(
    "Sr. No.   Date   FCN & Amount   Equivalent to Rs.   Equivalent to USD   Name and address of AD branch/FFMC through which the transaction has been effected",
    30,
    10
  );
  drawText(
    "# I, undertake that in case, if it is reported that I have breached the LRS limit, I will be my responsibility to bring back/surrender the amount purchased/remitted in excess of the LRS limit and thereafter I will approach RBI for compounding of contravention under FEMA 1999.",
    30,
    10
  );
  drawText("Signature of the applicant", 400, 10);

  // Add page 3
  addNewPage();

  // -------- PAGE 3 --------
  drawText("Declaration cum undertaking", 30, 12);
  drawText(
    "I, the undersigned, hereby declare that the total amount of foreign exchange purchased from or remitted through, all sources in India during the financial year as per item no. 4 of the Application, including the current transaction is within the overall limit of USD 250,000/- (USD Two Hundred and Fifty Thousand Only), which is the limit prescribed by the Reserve Bank of India for the said purpose. I certify that the source of funds for making the said remittance belongs to me and the foreign exchange shall not be used for prohibited purposes. The transaction details of which are mentioned above does not involve and is not designed for the purpose of any contravention or evasion of the provisions of the FEMA, 1999 or of any Rule, Regulation, Notification, Direction or order made there under. I also hereby agree and undertake to provide such information /documents as will reasonably satisfy you about this transaction in terms of this declaration. I shall be responsible and liable for any incorrect information provided by me. I agree that in the event the transaction is cancelled or revoked by me after submitting the request, any exchange losses incurred in this connection to be recovered from the refund amount. I further agree that once the funds remitted by me have been transmitted by the Bank / AD to the correspondent and/or beneficiary banks, the Bank / AD shall not be responsible for any delays in the disbursement of such funds including the withholding of such funds by the correspondent and/or beneficiary bank. I agree that once funds are remitted, intermediary bank charges may be levied by Correspondent and/or Beneficiary Banks, which may vary from Bank to Bank. I agree that in the event the transaction being rejected by the beneficiary bank because of incorrect information submitted by me, any charges levied by the beneficiary bank or exchange losses incurred in this connection, I will be liable to pay the same to............. I further confirm that the foreign exchange released for the above mentioned purpose will be used within 60 days of purchase. In case it is not possible to use the foreign exchange within the period of 60 days, same will be surrendered to an authorized person. I am neither a politically Exposed Person (PEP), not related to any of the Pep's. I hereby give my consent for sharing details/documents/information provided by us regards to this transaction with the AD I bank to use, disclose, store and/or process my information, including for undertaking any verification, checks, authentication etc. Also to share the information with Regulator or any Enforcing Agencies wherever asked for as per extant Law/Rules/directions/Guidelines. I hereby state and undertake that I have no objection in authenticating myself with Aadhaar based Authentication system and hereby give my voluntary consent to ..............., as required under the Aadhaar Act 2016 and all other applicable laws. In case of payment by cash I hereby declare that the aggregate value of foreign exchange, so purchased by me, including this particular transaction, during the last 30 days, including the present date, either from............. or from any other Authorized Dealers, by making payment in Cash does not exceed Rs. 50,000/-.",
    30,
    8
  );
  drawText(
    "I understand that it is mandatory for you to collect copy of ticket and/or evidence for release of foreign exchange and keep the same on record. In this case, the VISA will be on (i) stamped only after the entire amount of foreign exchange; (ii) on arrival at the destination country; (iii) copy enclosed (strike off which is not applicable). I also undertake to produce my passport to you any time after my return from this trip as a proof of obtaining visa as well as undertaking the trip abroad.",
    30,
    8
  );
  drawText(
    "Payment is made by Self ______ or **Close Relative (Relation) ______ PAN ______",
    30,
    10
  );
  drawText(
    "Payment mode: Cash / Cheque / DD / PO /Bank Transfer / RTGS / NEFT (strike off which is not applicable)",
    30,
    10
  );
  drawText("Bank Details from which payment is made", 30, 12);
  drawText(
    "Bank Account Holder Name: __________________ Bank __________________",
    30,
    10
  );
  drawText(
    "Bank Branch __________________ Account No. _______________ IFSC _______________",
    30,
    10
  );
  drawText(
    "Cheque No./DD No/PO No./URT No./ Transfer No.: __________________",
    30,
    10
  );
  drawText(
    "Signature of the applicant __________________ Signature of the natural guardian (if applicant is minor) __________________",
    30,
    10
  );
  drawText("Name: __________________ Name __________________", 30, 10);
  drawText("Relationship with the Applicant: __________________", 30, 10);
  drawText("Certificate by the Authorized Dealer", 30, 12);
  drawText(
    "This is to certify that the remittance is not being made by/ to ineligible entities and that the remittance is in conformity with the instructions issued by the Reserve Bank from time to time under the Scheme. I have verified KYC documents in original.",
    30,
    10
  );
  drawText(
    "Name and designation of the authorized official: __________________",
    30,
    10
  );
  drawText(
    "Signature __________________ Date __________________ Place __________________ Stamp / seal __________________",
    30,
    10
  );

  // Save and trigger download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `A2_Form_${order.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
