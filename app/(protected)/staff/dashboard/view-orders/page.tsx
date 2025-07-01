"use client"

import React from 'react'
import { Topbar } from '../../(components)/Topbar'
import { pagesData } from '@/data/navigation'
import StaffViewOrders from '../../(components)/staff-vieworders'

function page() {
  return (
    <div>
      <Topbar pageData={pagesData.viewOrders}/>  
      <div className='p-4 bg-white'>
        <StaffViewOrders/>
      </div>
    </div>
  )
}

export default page