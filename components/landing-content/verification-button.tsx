"use client"

import { useState, useEffect, useRef } from "react"
import { RefreshCcw, Check, Clock, AlertCircle } from "lucide-react"

type VerificationState = "idle" | "verifying" | "incomplete" | "succeeded" | "timeout"

interface VerificationButtonProps {
  onVerificationComplete: (success: boolean) => void
  isVerified: boolean
}

export default function VerificationButton({ onVerificationComplete, isVerified }: VerificationButtonProps) {
  const [verificationState, setVerificationState] = useState<VerificationState>("idle")
  const [mousePath, setMousePath] = useState<{x: number, y: number}[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const verificationTimeoutRef = useRef<number | undefined>(undefined)
  const movementThreshold = 50 // Minimum mouse movement required for verification
  const verificationTime = 2000 // Time allowed for verification

  const startVerification = () => {
    if (verificationState !== "idle" && verificationState !== "timeout") return

    setVerificationState("verifying")
    setMousePath([])

    // Set timeout for verification
    verificationTimeoutRef.current = window.setTimeout(() => {
      if (mousePath.length === 0) {
        setVerificationState("timeout")
        onVerificationComplete(false)
      }
    }, verificationTime)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (verificationState !== "verifying") return
    
    // Record mouse position relative to the button
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setMousePath(prev => [...prev, {x, y}])
      
      // Check if enough movement has been detected
      if (mousePath.length > 0) {
        const totalMovement = mousePath.reduce((acc, point, index) => {
          if (index === 0) return acc
          const prevPoint = mousePath[index - 1]
          return acc + Math.sqrt(
            Math.pow(point.x - prevPoint.x, 2) + 
            Math.pow(point.y - prevPoint.y, 2)
          )
        }, 0)
        
        if (totalMovement > movementThreshold) {
          completeVerification(true)
        }
      }
    }
  }

  const completeVerification = (success: boolean) => {
    if (verificationTimeoutRef.current !== null) {
      clearTimeout(verificationTimeoutRef.current)
    }
    const result = success ? "succeeded" : "incomplete"
    setVerificationState(result)
    onVerificationComplete(success)
  }

  const resetVerification = () => {
    setVerificationState("idle")
    setMousePath([])
  }

  useEffect(() => {
    if (verificationState === "verifying") {
      window.addEventListener('mousemove', handleMouseMove)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(verificationTimeoutRef.current)
    }
  }, [verificationState, mousePath])

  // Reset to idle state if isVerified is set to false externally
  useEffect(() => {
    if (!isVerified && verificationState === "succeeded") {
      resetVerification()
    }
  }, [isVerified, verificationState])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={startVerification}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-md border transition-colors ${
        verificationState === "succeeded"
          ? "border-green-500 bg-green-50 text-green-600"
          : verificationState === "timeout"
            ? "border-red-300 bg-red-50 text-red-500"
            : verificationState === "verifying"
              ? "border-blue-300 bg-blue-50 text-blue-600"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {verificationState === "idle" && (
          <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}

        {verificationState === "verifying" && (
          <div className="animate-spin">
            <RefreshCcw size={18} className="text-blue-500" />
          </div>
        )}

        {verificationState === "incomplete" && (
          <AlertCircle size={18} className="text-gray-400" />
        )}

        {verificationState === "succeeded" && (
          <Check size={18} className="text-green-500" />
        )}

        {verificationState === "timeout" && (
          <Clock size={18} className="text-red-500" />
        )}

        <span>
          {verificationState === "idle" && "Click to verify"}
          {verificationState === "verifying" && " verifying"}
          {verificationState === "incomplete" && "Incomplete "}
          {verificationState === "succeeded" && "succeeded"}
          {verificationState === "timeout" && " timed out"}
        </span>
      </div>

      {verificationState === "timeout" && (
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            resetVerification()
          }}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Retry
        </button>
      )}

      {verificationState === "verifying" && (
        <div className="text-xs text-gray-500">
          {Math.min(Math.floor((mousePath.length / 10) * 100), 100)}%
        </div>
      )}
    </button>
  )
}