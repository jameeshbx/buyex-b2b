import React from 'react'
import PrivacyPolicy from './privacy'
import Topbar from '@/components/landing-content/Topbar'
import Footer from '@/components/landing-content/Footer'

function page() {
  return (
    <div>
        <Topbar/>
        <PrivacyPolicy/>
        <Footer/>
    </div>
  )
}

export default page