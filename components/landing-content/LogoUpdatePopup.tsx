"use client"
import { X } from "lucide-react"
import Image from "next/image"

interface LogoUpdatePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoUpdatePopup({ isOpen, onClose }: LogoUpdatePopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-light-blue rounded-lg shadow-lg border p-16 max-w-md relative animate-in fade-in-90">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-8">Same Vision, Different Look!</h3>
          <div className="flex items-center justify-center gap-4 text-gray-700">
            <div className="flex flex-col items-center">
              <Image 
                src="/BE.svg" 
                alt="Previous Logo" 
                width={112} 
                height={112}
                className="h-28 w-28 object-contain" 
              />
            </div>
            <span className="text-sm font-medium">is now</span>
            <div className="flex flex-col items-center">
              <Image 
                src="/buyex-main-logo.png" 
                alt="New Logo" 
                width={112} 
                height={112}
                className="h-28 w-28 object-contain" 
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-dark-rose text-white rounded-md hover:bg-dark-rose transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}