"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface SuccessModalProps {
  onClose: () => void
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
    const router = useRouter()

  const handleDashboardRedirect = () => {
    onClose() // Close the modal first
    router.push("/staff/dashboard") // Adjust this path to your actual dashboard route
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center">
          <Image src="/successpop.png" alt="Success illustration" width={300} height={300} className="mb-4" />
          <h2 className="text-sm font-bold mb-4">Your order is created successfully.</h2>
         <Button 
            onClick={handleDashboardRedirect} 
            className="bg-dark-blue hover:bg-dark-blue text-white px-8 py-2 rounded-md"
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
