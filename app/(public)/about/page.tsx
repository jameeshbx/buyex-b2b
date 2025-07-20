"use client"
import Topbar from '@/components/landing-content/Topbar'
import React from 'react'

import Footer from '@/components/landing-content/Footer'
import AboutUs from './about'

function page() {
  return (
    <div>
        <Topbar/>
        <AboutUs/>
        <Footer/>
    </div>
  )
}

export default page