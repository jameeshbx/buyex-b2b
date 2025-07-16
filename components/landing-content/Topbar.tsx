"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

export default function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Default state (not scrolled) */}
      {!scrolled && (
        <div className="container mx-auto px-4 py-4 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-4">
            <Link href="/" passHref>
  <div className="cursor-pointer">
    <Image 
      src="/header-logo.png" 
      alt="Buy Exchange Logo" 
      width={200} 
      height={150} 
      className="mb-6"
    />
  </div>
</Link>
          </div>

          {/* Topbar Container */}
          <div className="bg-light-blue w-full rounded-lg px-4 py-4">
            {/* Top Row */}
            <div className="flex items-center justify-between md:justify-center">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <Link
                  href="/"
                  className="text-gray-800 uppercase text-sm font-medium border-b-2 border-transparent hover:border-gray-800 pb-1"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-800 uppercase text-sm font-medium border-b-2 border-transparent hover:border-gray-800 pb-1"
                >
                  About
                </Link>
                <Link
                  href="/benews"
                  className="text-gray-800 uppercase text-sm font-medium border-b-2 border-transparent hover:border-gray-800 pb-1"
                >
                  BE News
                </Link>
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex space-x-4 ml-8">
                <Link
                  href="/signup"
                  className="bg-dark-blue text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#083d5a] transition-colors"
                >
                  Register
                </Link>
                <Link
                  href="/signin"
                  className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 bg-white rounded-lg p-4 shadow-md">
                <nav className="flex flex-col items-center space-y-4">
                  <Link
                    href="/"
                    className="text-gray-800 uppercase text-sm font-medium w-full text-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-800 uppercase text-sm font-medium w-full text-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/benews"
                    className="text-gray-800 uppercase text-sm font-medium w-full text-center py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    BE News
                  </Link>
                </nav>

                <div className="flex flex-col items-center mt-6 space-y-3">
                  <Link
                    href="/signup"
                    className="bg-dark-blue text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#083d5a] transition-colors w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    href="/signin"
                    className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scrolled state */}
      {scrolled && (
        <div className="container mx-auto px-4 py-2 bg-light-blue max-w-full">
          <div className="flex items-center justify-between bg-light-blue ">
            {/* Logo in scrolled state */}
            <div className="flex items-center w-40">
              <Image src="/header-logo.png" alt="" width={200} height={150} />
            </div>

            {/* Desktop Navigation in scrolled state */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1"
              >
                About
              </Link>
              <Link
                href="/benews"
                className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1"
              >
                BE News
              </Link>
            </nav>

            {/* Auth Buttons in scrolled state */}
            <div className="hidden md:flex space-x-4">
              <Link
                href="/signup"
                className="bg-dark-blue text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-[#083d5a] transition-colors"
              >
                Register
              </Link>
              <Link
                href="/signin"
                className="bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Mobile Menu Button in scrolled state */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Navigation in scrolled state */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-light-blue rounded-lg p-4 shadow-md ">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-800 uppercase text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-gray-800 uppercase text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/benews"
                  className="text-gray-800 uppercase text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  BE News
                </Link>
              </nav>

              <div className="flex flex-col mt-6 space-y-3">
                <Link
                  href="/signup"
                  className="bg-[#0a4d70] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#083d5a] transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href="/signin"
                  className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  )
}