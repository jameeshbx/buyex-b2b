import React from 'react'
import Settings from './settings'

import { pagesData } from '@/data/navigation'
import { Topbar } from '../../(components)/Topbar'

function page() {
  return (
    <div>
        <div className="sticky top-0 z-10 bg-gray-50">
               <Topbar pageData={pagesData.Settings} />    
             </div>  
        <Settings/>
        
    </div>
  )
}

export default page