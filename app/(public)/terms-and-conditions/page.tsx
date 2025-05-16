import Topbar from '@/components/landing-content/Topbar'
import TermsAndConditions from './terms'
import React from 'react'
import Footer from '@/components/landing-content/Footer'

function page() {
  return (
    <div>
        <Topbar/>
        <TermsAndConditions/>
        <Footer/>
    </div>
  )
}

export default page