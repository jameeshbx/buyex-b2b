'use client'

import React, { useState } from 'react'
import { Topbar } from '@/app/(protected)/staff/(components)/Topbar'
import { pagesData } from '@/data/navigation'
import TransactionDetails from './Order'
import SuccessModal from './Popup'

function Page() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleCreateOrder = () => {
    setShowSuccessModal(true)
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-gray-50">
        <Topbar pageData={pagesData.orderPreview} />    
      </div>    
      <TransactionDetails onCreateOrder={handleCreateOrder} orderId={''} onBack={function (): void {
        throw new Error('Function not implemented.')
      } } />
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
    </div>
  )
}

export default Page