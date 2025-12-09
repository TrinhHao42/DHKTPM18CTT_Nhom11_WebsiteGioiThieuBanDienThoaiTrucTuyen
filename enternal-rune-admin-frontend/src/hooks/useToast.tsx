'use client'

import toast from 'react-hot-toast'

export const useToast = () => {
  return {
    success: (message: string, duration?: number) =>
      toast.success(message, {
        duration: duration || 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          cursor: 'pointer',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      }),

    error: (message: string, duration?: number) =>
      toast.error(message, {
        duration: duration || 3000,
        style: {
          background: '#EF4444',
          color: '#fff',
          cursor: 'pointer',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#EF4444',
        },
      }),

    info: (message: string, duration?: number) =>
      toast(message, {
        duration: duration || 3000,
        icon: 'ℹ️',
        style: {
          background: '#3B82F6',
          color: '#fff',
          cursor: 'pointer',
        },
      }),

    warning: (message: string, duration?: number) =>
      toast(message, {
        icon: '⚠️',
        duration: duration || 3000,
        style: {
          background: '#F59E0B',
          color: '#fff',
          cursor: 'pointer',
        },
      }),
  }
}
