"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Shield, Users, } from 'lucide-react'
import Link from "next/link"

export default function Component() {
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bank: "",
    phone: ""
  })

  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/email/blocked-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        toast({
          title: "Your details shared successfully",
          description: "Our team will contact you soon.",
        })
        setFormData({ fullName: "", email: "", bank: "", phone: "" })
      } else {
        toast({
          title: "Failed to share details",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Failed to share details",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-14 py-14 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-700 leading-tight">
                Open Your Blocked Account Germany
                  <br />
                  Online with Buyexforex
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                Open your German student blocked account online from India with ease. Compare leading providers like Coracle, Expatrio, and Fintiba to choose the right fit for you.
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
      <div className="px-10 pt-4">
            {/* Logo */}
          <Link href="/" passHref>
            <div className="flex items-center w-40">
              <Image
                src="/simplify-study-abroad-payments.webp"
                alt="Buyex Forex Logo – Trusted Student Payment Platform"
                width={170}
                height={100}
                priority
              />
            </div>
          </Link>
          </div>
      {/* Main Hero Section */}
      <div className="container mx-auto px-10 pb-4 lg:pb-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Form */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl xl:text-4xl font-bold font-playfair text-deep-blue leading-tight">
              Open Your Blocked Account Germany 
                <br />
                Online with Buyexforex
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
              Open your German student blocked account online from India with ease. Compare leading providers like Coracle, Expatrio, and Fintiba to choose the right fit for you.
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

                {/* Phone Number */}
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
                  className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-lg flex items-center justify-center gap-2 rounded-lg"
                >
                  Register Now
                </Button>
              </form>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
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

      {/* Additional Content Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-deep-blue leading-tight">
                Open your Germany Blocked Account in just{" "}
                <span className="text-deep-blue">1 hour</span> 100% online and hassle-free.
              </h2>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Choose your trusted provider, share basic details, and we &apos;ll handle your Blocked Account setup.
              </p>
              
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Fast and secure blocked account opening service for students and job seekers planning to migrate to Germany
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="h-8 w-8 text-purple-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Quick Setup</h3>
                  <p className="text-gray-600">
                    Complete your blocked account setup in just 1 hour with our streamlined online process.
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">100% Secure</h3>
                  <p className="text-gray-600">
                    Your data and funds are protected with bank-grade security and encryption.
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Trusted Providers</h3>
                  <p className="text-gray-600">
                    Choose from leading providers like Coracle, Expatrio & Fintiba for your blocked account.
                  </p>
                </div>
              </Card>
            </div>

            {/* Process Steps */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-12">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Choose Provider</h4>
                  <p className="text-gray-600">Select your preferred blocked account provider from our trusted partners.</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Share Details</h4>
                  <p className="text-gray-600">Provide your basic information and documents through our secure platform.</p>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Account Ready</h4>
                  <p className="text-gray-600">We handle the setup and your blocked account is ready within 1 hour.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
