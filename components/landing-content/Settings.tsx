"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface FormData {
  fullName: string
  username: string
  bio: string
  email: string
  phoneNumber: string
}

export default function SettingsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    bio: "",
    email: "",
    phoneNumber: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Initialize form data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("session.user",session.user)
      setFormData({
        fullName: session.user.name || "",
        username: session.user.email?.split("@")[0] || "",
        bio: "",
        email: session.user.email || "",
        phoneNumber: "",
      })
      // Set existing profile image if available
      if (session.user.image) {
        setImagePreview(session.user.image)
      }
    } else if (status === "unauthenticated") {
      router.push("/api/auth/signin")
    }
  }, [status, session, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // Here you can add your actual API call
      // Example API call structure:
      /*
      const formDataToSend = new FormData()
      formDataToSend.append('fullName', formData.fullName)
      formDataToSend.append('username', formData.username)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phoneNumber', formData.phoneNumber)
      if (imageFile) {
        formDataToSend.append('profileImage', imageFile)
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      */

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Profile data to update:", formData)
      if (imageFile) {
        console.log("Image file:", imageFile.name)
      }

      setSuccess("Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    if (session?.user) {
      setFormData({
        fullName: session.user.name || "",
        username: session.user.email?.split("@")[0] || "",
        bio: "",
        email: session.user.email || "",
        phoneNumber: "",
      })
      setImagePreview(session.user.image || "")
    }
    setImageFile(null)
    setError("")
    setSuccess("")
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access your settings.</p>
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profile Settings</title>
      </Head>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Profile
            </button>
            <Link
              href="/super-admin/dashboard/change-password"
              className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              Change password
            </Link>
          </nav>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile Picture</h3>
              <div className="flex flex-col space-y-4">
                <label
                  htmlFor="profile-upload"
                  className="h-40 w-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      width={160}
                      height={160}
                    />
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Image src="/gallery-add.png" alt="Upload photo" width={40} height={50} />
                      <span className="text-sm font-medium text-gray-700">Upload your photo</span>
                    </div>
                  )}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <button type="button" onClick={removeImage} className="text-sm text-red-500 hover:text-red-700">
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Please enter your full name"
                    className="w-full px-3 bg-light-blue py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Please enter your email"
                    className="w-full bg-light-blue px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Please enter your username"
                    className="w-full px-3 py-2 bg-light-blue border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 bg-light-blue rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Please enter your phone number"
                      className="flex-1 min-w-0 block bg-light-blue w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write your Bio here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-light-blue focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark-blue hover:bg-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
