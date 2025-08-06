"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast" // or "@/hooks/use-toast" if you prefer hot-toast

export default function Component() {
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bank: "",
    phone: ""
  })
  const { toast } = useToast(); // for shadcn/ui toast

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/email/blocked-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({
          title: "Yours details shared successfully",
          description: "Our team will contact you soon.",
        });
        setFormData({ fullName: "", email: "", bank: "", phone: "" });
      } else {
        toast({
          title: "Failed to share details",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch{
      toast({
        title: "Failed to share details",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-14 py-14 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Show loading or skeleton while client-side rendering */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  Open <span className="text-purple-700">Blocked Account</span>
                  <br />
                  Online From India
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Open a student Blocked account online in Germany. Compare and choose from leading providers such as Coracle, Expatrio & Fintiba.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Form */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-playfair text-deep-blue leading-tight">
                Open <span className="text-deep-blue font-playfair">Blocked Account</span>
                <br />
                Online From India
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Open a student Blocked account online in Germany. Compare and choose from leading providers such as Coracle, Expatrio & Fintiba.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="h-12 text-gray-600 placeholder:text-gray-400 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Email ID */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email ID
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your preferred email ID"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 text-gray-600 placeholder:text-gray-400 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* phone number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="h-12 text-gray-600 placeholder:text-gray-400 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Select Bank */}
                <div className="space-y-2">
                  <Label htmlFor="bank" className="text-gray-700 font-medium">
                    Select Bank
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("bank", value)}>
                    <SelectTrigger className="h-12 text-gray-600 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Choose a Bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coracle">Coracle</SelectItem>
                      <SelectItem value="expatrio">Expatrio</SelectItem>
                      <SelectItem value="fintiba">Fintiba</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-dark-rose hover:bg-dark-rose text-white font-semibold text-lg flex items-center justify-center gap-2 rounded-lg"
                >
                  
                  Register Now
                </Button>
              </form>
            </div>
          </div>

          {/* Right Side - Image and Notifications */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Student Image */}
              <div className="relative">
                <Image
                  src="/images/blocked account.avif"
                  alt="Happy student with backpack"
                  width={500}
                  height={600}
                  className="rounded-2xl object-cover"
                />
              </div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
