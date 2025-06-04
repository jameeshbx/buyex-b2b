"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface BlockRateStatusPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (status: string) => void
}

export function BlockRateStatusPopup({ open, onOpenChange, onSubmit }: BlockRateStatusPopupProps) {
  const [status, setStatus] = useState<string>("")

  const handleSubmit = () => {
    onSubmit(status)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">Block rate status</DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Rate block status
            </label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger id="status" className="bg-gray-50 h-12 rounded-none">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-dark-blue hover:bg-dark-blue/90 text-white rounded-none h-12"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
