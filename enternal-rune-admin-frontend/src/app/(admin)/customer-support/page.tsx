"use client";
import React, { useEffect, useState } from 'react'
import CustomerSupport from '@/components/staff/CustomerSupport'
import { useSidebar } from '@/context/SidebarContext'

export default function CustomerSupportPage() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [leftMargin, setLeftMargin] = useState('left-0')

  useEffect(() => {
    const computeLeft = () => {
      if (isMobileOpen) return 'left-0'
      if (typeof window === 'undefined') return 'left-0'
      if (window.innerWidth < 1024) return 'left-0'
      if (isExpanded || isHovered) return 'left-[290px]'
      return 'left-[90px]'
    }

    const newValue = computeLeft()
    setLeftMargin(prev => (prev === newValue ? prev : newValue))

    const onResize = () => setLeftMargin(computeLeft())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isExpanded, isHovered, isMobileOpen])

  return (
    <div className={`fixed inset-0 top-16 ${leftMargin} overflow-hidden flex flex-col`}>
      <CustomerSupport />
    </div>
  )
}