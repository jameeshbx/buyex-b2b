"use client"
import React from 'react'
import Sender from '@/app/(protected)/staff/dashboard/sender-details/Senderdetails'
import { Topbar } from '@/app/(protected)/staff/(components)/Topbar'
import { pagesData } from '@/data/navigation'
import BreadcrumbMenubar from '../../(components)/Menubar'


function page() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-gray-50">
      <Topbar pageData={pagesData.senderDetails}/>    
      </div>    
       <div className="sticky top-25 z-10 bg-gray-50">
       <BreadcrumbMenubar />
     </div>
      <Sender/>
    </div>
  )
}

export default page