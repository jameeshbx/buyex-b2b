"use client"

import React from 'react'
import OrderDetailsForm from './order-details-form'
import { Topbar } from '../../(components)/Topbar'
import { pagesData } from '@/data/navigation'
import BreadcrumbMenubar from '../../(components)/Menubar'

function page() {
  return (
     <div>
      <div className="sticky top-0 z-10 bg-gray-50">
      <Topbar pageData={pagesData.placeOrder}/>    
      </div>    
       <div className="sticky top-25 z-10 bg-gray-50">
       <BreadcrumbMenubar />
     </div>
     <div>
    <OrderDetailsForm/>
    </div>
    </div>
  )
}

export default page