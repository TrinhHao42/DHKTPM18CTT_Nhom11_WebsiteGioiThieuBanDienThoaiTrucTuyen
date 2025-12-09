'use client'

import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import toast from "react-hot-toast"

export default function ToasterProvider() {
  useEffect(() => {
    const handleToastClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const toastElement = target.closest('[data-sonner-toast], [role="status"]')
      
      if (toastElement) {
        const toastId = toastElement.getAttribute('data-toast-id')
        if (toastId) {
          toast.dismiss(toastId)
        } else {
          // Dismiss all if no specific ID
          toast.dismiss()
        }
      }
    }

    document.addEventListener('click', handleToastClick)
    return () => document.removeEventListener('click', handleToastClick)
  }, [])

  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '10px',
          fontWeight: '500',
          cursor: 'pointer',
        },
        success: {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
        loading: {
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        },
      }}
    />
  )
}
