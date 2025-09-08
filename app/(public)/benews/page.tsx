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
        <title>Buy Exchange – Best International Money Transfer Partner for Study Abroad Consultancies</title>
        <meta 
          name="description" 
          content="Discover why Buy Exchange is India's most trusted partner for study abroad consultancies. Offer students the fastest, cheapest, and most transparent way to send money abroad." 
        />
      </Head>
      
      <Topbar/>
      <Benews />
      <Footer/>
    </div>
  )
}

export default Page