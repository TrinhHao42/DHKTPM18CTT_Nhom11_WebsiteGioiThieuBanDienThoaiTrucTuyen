import React from 'react'
import { moonDance } from '@/lib/fonts'
const page = () => {
  return (
    <div className='flex-1'>
      <p
        className={`${moonDance.className} text-6xl md:text-7xl lg:text-8xl text-center`}
      >
        Admin Page
      </p>
    
    </div>
  )
}

export default page