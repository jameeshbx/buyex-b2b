"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Download, ArrowRight, RotateCcw, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { orderDetailsFormSchema, OrderDetailsFormValues } from "@/schema/orderdetails"

export default function OrderDetailsForm() {
  const [showCalculation, setShowCalculation] = useState(false);
  const router = useRouter()
  const [calculatedValues] = useState({
    inrAmount: "8,33,420.06",
    bankFee: "16,428.80",
    gst: "0",
    tcsApplicable: "1,69,953.15",
    totalPayable: "10,11,399.30",
    customerRate: "113.18",
  });

  const form = useForm<OrderDetailsFormValues>({
    resolver: zodResolver(orderDetailsFormSchema),
    defaultValues: {
      purpose: "",
      foreignBankCharges: "OUR",
      payer: "",
      forexPartner: "",
      margin: "",
      receiverBankCountry: "",
      studentName: "",
      consultancy: "",
      ibrRate: "",
      amount: "",
      currency: "INR",
      totalAmount: "",
      customerRate: "",
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

 
 function onSubmit(data: OrderDetailsFormValues) {
  console.log(data);
  localStorage.setItem('selectedPayer', data.payer);
  router.push("/staff/dashboard/sender-details");
}

  function resetForm() {
    form.reset();
    setShowCalculation(false);
  }

  function handleShowCalculation() {
    setShowCalculation(true);
    form.setValue("totalAmount", "10,11,399.30");
    form.setValue("customerRate", "113.18");
  }


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

        <div>
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

          <p className="text-xs text-green-600 mt-1">*Zero foreign bank charges</p>
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
                <Input {...field} className="bg-blue-50/50 border-blue-100 h-12" />
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
