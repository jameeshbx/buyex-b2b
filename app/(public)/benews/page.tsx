"use client"

import Topbar from '@/components/landing-content/Topbar'
import React from 'react'
import Benews from './Be-news'
import Footer from '@/components/landing-content/Footer'

function page() {
  return (
    <div>
        <Topbar/>
        <Benews />
        <Footer/>
    </div>
  )
}

export default page