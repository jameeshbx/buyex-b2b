"use client"

import Topbar from '@/components/landing-content/Topbar'
import React from 'react'
import Benews from './Be-news'
import Footer from '@/components/landing-content/Footer'
import Head from 'next/head' // Import the Head component

function Page() {
  return (
    <div>
      {/* Add Head component with meta tags */}
      <Head>
        <title>study abroad consultant money transfer – Buyex Forex trusted international payments partner </title>
        <meta 
          name="description" 
          content="Looking for the best study abroad consultant money transfer solution? Buyex Forex offers fast, RBI-compliant, and transparent international payments for students and consultancies." 
        />
      </Head>
      
      <Topbar/>
      <Benews />
      <Footer/>
    </div>
  )
}

export default Page