"use client"

import type React from "react"

import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"

interface FormData {
  fullName: string
  username: string
  bio: string
  email: string
  phoneNumber: string
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    bio: "",
    email: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const [imageFile, setImageFile] = useState<File | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profile Settings</title>
      </Head>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "profile"
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
          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile Picture</h3>
              <div className="flex flex-col space-y-4">
                <label
                  htmlFor="profile-upload"
                  className="h-40 w-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {imageFile ? (
                    <Image
                      src={URL.createObjectURL(imageFile)}
                      alt="Profile"
                      className="h-full w-full object-cover" width={10} height={10}
                    />
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
  <Image 
    src="/gallery-add.png" 
    alt="Upload photo" 
    width={40}  // Add appropriate width
    height={50} // Add appropriate height
  />
  <span className="text-sm font-medium text-gray-700">Upload your photo</span>
</div>
                  )}
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
                {imageFile && (
                  <button
                    onClick={() => setImageFile(null)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
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
                    className="w-full px-3  bg-light-blue py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="w-full bg-light-blue  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="w-full px-3 py-2 bg-light-blue  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 bg-light-blue  rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
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
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-dark-blue hover:bg-dark-blue focus:outline-none focus:ring-2 focus:ring-dark-blue"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
