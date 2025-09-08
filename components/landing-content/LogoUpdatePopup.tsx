"use client"
import { X } from "lucide-react"

interface LogoUpdatePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function LogoUpdatePopup({ isOpen, onClose }: LogoUpdatePopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 max-w-sm relative animate-in slide-in-from-right">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-700 pr-6">
          <img src="/BE.svg" alt="Previous Logo" className="h-16 w-16 object-contain" />
          <span>is now</span>
          <img src="/buyex-main-logo.png" alt="New Logo" className="h-16 w-16 object-contain" />
        </div>
      </div>
    </div>
  )
}
