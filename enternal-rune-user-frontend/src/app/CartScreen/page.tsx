'use client'

import React from 'react'
import { moonDance } from '@/lib/fonts'
import Cart from '@/pages/Cart'

const CartPage = () => {
  return (
    <div className='flex-1'>
      <p
        className={`${moonDance.className} text-6xl md:text-7xl lg:text-8xl text-center`}
      >
        Giỏ hàng
      </p>
      <Cart />
    </div>
  )
}

export default CartPage
