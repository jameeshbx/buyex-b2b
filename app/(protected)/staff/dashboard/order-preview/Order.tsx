"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import React from "react"

interface TransactionDetailsProps {
  onCreateOrder: () => void
}
export default function TransactionDetails({ onCreateOrder }: TransactionDetailsProps) {
  return (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Details Section */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 font-jakarta">Transaction Details</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Title</div>
                <div className="text-black font-semibold text-sm sm:text-base font-jakarta">Content</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Purpose</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">University fee transfer</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Receiver&apos;s Bank Country</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">United States of America</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Foreign Bank Charges</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">OUR (Sender bears bank charges)</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Payer</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">Parent</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Student Name</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">Zoe Fernandes</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Consultancy</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">EduQuest Overseas</div>
              </div>
            </div>
          </div>

          {/* Currency & Rate Details Section */}
         <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 font-jakarta">Currency & Rate Details</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Title</div>
                <div className="text-sm sm:text-base">Content</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base">Amount</div>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    placeholder="9,000" 
                    className="border rounded p-1 w-full mr-2 text-sm sm:text-base" 
                    readOnly 
                  />
                  <div className="bg-dark-blue text-white px-2 sm:px-3 py-1 rounded text-sm sm:text-base font-jakarta">GBP</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">FX Rate (IBR + Margin)</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">₹101.1972</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Customer Rate</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">₹113.13</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Margin</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">0.40</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm sm:text-base font-jakarta">Total INR Amount</div>
                <div className="text-gray-600 text-sm sm:text-base font-jakarta">₹10,11,399.30</div>
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
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">INR Amount</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">8,33,420.06</div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">Bank Fee</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">16,428.80</div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">GST</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">0</div>
            </div>
            <div className="flex justify-between items-center h-8">
              <div className="text-gray-500 text-sm sm:text-base font-jakarta">TCS Applicable</div>
              <div className="font-medium text-gray-500 text-sm sm:text-base font-jakarta">1,69,953.15</div>
            </div>

            {/* Total Payable section */}
           <div className="relative pt-6 sm:pt-8">
              <div className="absolute top-0 left-0 right-0 border-t border-dark-rose mr-[-33px]"></div>
              <div className="flex justify-between items-center">
                <div className="font-bold text-font-gray text-sm sm:text-base font-jakarta">Total Payable</div>
                <div className="font-bold text-font-gray text-sm sm:text-base font-jakarta">10,11,399.30</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
         <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8">
          <Button
            onClick={onCreateOrder}
            className="bg-dark-blue hover:bg-dark-blue text-white font-jakarta px-8 sm:px-12 py-3 sm:py-4 rounded flex items-center w-full sm:w-auto"
          >
            <Image src="/continue.svg" alt="" width={15} height={15} className="mr-2" /> 
            <span>Create</span>
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-600 px-8 sm:px-12 py-3 sm:py-4 font-jakarta w-full sm:w-auto"
          >
            <Image src="/reset.svg" alt="" width={15} height={15} className="mr-2 sm:mr-0 sm:ml-2" /> 
            <span>Back</span>
          </Button>
        </div>
      </div>
    </div>
  )
}