'use client'

import { useState, useCallback } from 'react'
import { Toast, ToastType } from '@/components/Toast'
import { createRoot } from 'react-dom/client'

let toastId = 0

export const useToast = () => {
  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${toastId++}`
    const container = document.createElement('div')
    container.id = id
    container.style.position = 'fixed'
    container.style.top = `${16 + (document.querySelectorAll('[id^="toast-"]').length * 72)}px`
    container.style.right = '16px'
    container.style.zIndex = '10000'
    
    document.body.appendChild(container)
    
    const root = createRoot(container)
    
    const handleClose = () => {
      root.unmount()
      container.remove()
    }
    
    root.render(<Toast message={message} type={type} duration={duration} onClose={handleClose} />)
  }, [])

  return {
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  }
}
