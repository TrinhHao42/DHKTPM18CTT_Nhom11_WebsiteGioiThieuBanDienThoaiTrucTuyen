"use client";
import React from 'react'
import CustomerSupport from '@/components/customerSupport/CustomerSupport'
import { useSidebar } from '@/context/SidebarContext'

export default function CustomerSupportPage() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  
  // Dynamic left margin based on sidebar state, nhưng trên mobile luôn left-0 để full width
  const leftMargin = isMobileOpen
    ? "left-0"
    : (window.innerWidth < 1024)  
    ? "left-0"
    : isExpanded || isHovered
    ? "left-[290px]"
    : "left-[90px]";

  return (
    <div className={`fixed inset-0 top-16 ${leftMargin} overflow-hidden flex flex-col`}>
      <CustomerSupport />
    </div>
  )
}