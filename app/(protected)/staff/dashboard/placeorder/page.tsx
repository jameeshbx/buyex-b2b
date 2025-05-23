import React from 'react'
import OrderDetailsForm from './order-details-form'
import { Topbar } from '../../(components)/Topbar'
import { pagesData } from '@/data/navigation'

function page() {
  return (
    <div>
      <Topbar 
        pageData={{
          ...pagesData.orderDetails,
          breadcrumbs: [
            { label: 'Dashboard', href: '/staff/dashboard' },
            { label: 'Place Order', href: '/staff/dashboard/placeorder' }
          ]
        }}
      />
      <OrderDetailsForm/>
    </div>
  )
}

export default page