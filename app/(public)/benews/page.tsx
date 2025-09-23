"use client"

import Topbar from '@/components/landing-content/Topbar'
import Benews from './Be-news'
import Footer from '@/components/landing-content/Footer'

export default function BeNewsPage() {
  return (
    <div>
      <Topbar/>
      <Benews />
      <Footer/>
    </div>
  )
}