import { useState, useEffect } from 'react'
import { useAuth } from '../App'

const TestAuth = () => {
  const { vendor, isAuthenticated } = useAuth()
  const [tokenInfo, setTokenInfo] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('token')
    setTokenInfo({
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Authentication State:</h3>
            <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Token Info:</h3>
            <p className="text-sm">Has Token: {tokenInfo.hasToken ? 'Yes' : 'No'}</p>
            <p className="text-sm">Token Length: {tokenInfo.tokenLength}</p>
            <p className="text-sm">Token Preview: {tokenInfo.tokenPreview}</p>
          </div>

          <div>
            <h3 className="font-semibold">Vendor Info:</h3>
            <pre className="text-sm bg-gray-100 p-3 rounded">
              {JSON.stringify(vendor, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">LocalStorage Contents:</h3>
            <pre className="text-sm bg-gray-100 p-3 rounded">
              {JSON.stringify({
                token: localStorage.getItem('token') ? 'Present' : 'Missing',
                keys: Object.keys(localStorage)
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestAuth