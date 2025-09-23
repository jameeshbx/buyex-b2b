"use client"

import PrivacyPolicy from './privacy'
import Topbar from '@/components/landing-content/Topbar'
import Footer from '@/components/landing-content/Footer'

export default function PrivacyPolicyPage() {
  return (
    <div>
      <Topbar/>
      <PrivacyPolicy/>
      <Footer/>
    </div>
  )
}