"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking on a link or outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-50 bg-light-blue shadow-md transition-all duration-300 ${
        isScrolled ? "py-0" : "py-2"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" passHref>
            <div className="flex items-center w-40">
              <Image
                src="/buyex-main-logo.png"
                alt="Buy Exchange Logo"
                width={200}
                height={100}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {/* Student Services Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1 transition-colors duration-200 flex items-center gap-1"
                >
                  Student Services
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/blocked-account"
                      className="block pl-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Blocked Account Creation
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/"
                className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1 transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/benews"
                className="text-gray-800 uppercase text-sm font-medium hover:border-b-2 hover:border-gray-800 pb-1 transition-colors duration-200"
              >
                BE News
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex space-x-4 ml-8">
              {/* <Link
                href="/signup"
                className="bg-[#0a4d70] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#083d5a] transition-colors duration-200 whitespace-nowrap"
              >
                Register
              </Link> */}
              <Link
                href="/signin"
                className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${
            mobileMenuOpen ? "block" : "hidden"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="pt-2 pb-4 space-y-2 bg-white rounded-lg shadow-lg mt-2">
            <nav className="flex flex-col space-y-2 px-4">
              {/* Mobile Student Services */}
              <div className="space-y-1">
                <div className="text-gray-800 uppercase text-sm font-medium py-3 px-4">
                  Student Services
                </div>
                <Link
                  href="/blocked-account"
                  className="text-gray-600 text-sm py-2 px-8 rounded hover:bg-gray-100 transition-colors block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blocked Account Creation
                </Link>
              </div>
              
              <Link
                href="/"
                className="text-gray-800 uppercase text-sm font-medium py-3 px-4 rounded hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-800 uppercase text-sm font-medium py-3 px-4 rounded hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/benews"
                className="text-gray-800 uppercase text-sm font-medium py-3 px-4 rounded hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                BE News
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 px-4 pt-2">
              <Link
                href="/signup"
                className="bg-[#0a4d70] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#083d5a] transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
              <Link
                href="/signin"
                className="bg-white text-gray-800 px-6 py-3 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
