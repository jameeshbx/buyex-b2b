"use client"

import Topbar from '@/components/landing-content/Topbar'
import React from 'react'
import Benews from './Be-news'
import Footer from '@/components/landing-content/Footer'
import Head from 'next/head'

function Page() {
  return (
    <div>
      {/* Add Head component with meta tags */}
      <Head>
        <title>study abroad consultant money transfer – Buyex Forex trusted international payments partner</title>
        <meta 
          name="description" 
          content="Looking for the best study abroad consultant money transfer solution? Buyex Forex offers fast, RBI-compliant, and transparent international payments for students and consultancies." 
        />
        <meta 
          name="title" 
          content="How to Pay University Fees Abroad from India | Buyex Forex" 
        />
        <meta 
          name="description" 
          content="Discover the best ways to pay tuition fees abroad from India. Learn about costs, documents, and fast transfers with Buyex Forex." 
        />
      </Head>
      
      <Topbar/>
      <Benews />
      <Footer/>
    </div>
  )
}

export default Page