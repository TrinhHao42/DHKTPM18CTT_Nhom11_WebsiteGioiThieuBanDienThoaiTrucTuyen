'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CartService } from '@/services/cartService'
import AxiosInstance from '@/configs/AxiosInstance'

export default function DebugApiPage() {
  const { user, token } = useAuth()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testBackend = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/actuator/health')
      const data = await response.json()
      setResult({ success: true, data })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testGetCart = async () => {
    if (!user?.userId) {
      setResult({ success: false, error: 'No user logged in' })
      return
    }
    
    setLoading(true)
    try {
      const data = await CartService.getCart(user.userId)
      setResult({ success: true, data })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testAddToCart = async () => {
    if (!user?.userId) {
      setResult({ success: false, error: 'No user logged in' })
      return
    }
    
    setLoading(true)
    try {
      // Test với product ID = 1
      const data = await CartService.addToCart(user.userId, 1, 1)
      setResult({ success: true, data })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testAxiosConfig = () => {
    setResult({
      success: true,
      data: {
        baseURL: AxiosInstance.defaults.baseURL,
        timeout: AxiosInstance.defaults.timeout,
        headers: AxiosInstance.defaults.headers,
      }
    })
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🐛 API Debug Tool</h1>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Info</h2>
        <div className="space-y-2 text-sm">
          <div><strong>User ID:</strong> {user?.userId || 'N/A'}</div>
          <div><strong>Username:</strong> {user?.userName || 'N/A'}</div>
          <div><strong>Token:</strong> {token ? `${token.substring(0, 30)}...` : 'N/A'}</div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Tests</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={testBackend}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Test Backend Health
          </button>
          
          <button
            onClick={testAxiosConfig}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Check Axios Config
          </button>
          
          <button
            onClick={testGetCart}
            disabled={loading || !user}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            GET /cart/{user?.userId}
          </button>
          
          <button
            onClick={testAddToCart}
            disabled={loading || !user}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            POST /cart/add/{user?.userId}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <div className={`p-4 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="font-semibold mb-2">
              {result.success ? '✅ Success' : '❌ Error'}
            </div>
            <pre className="text-xs overflow-auto max-h-96 bg-white p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
