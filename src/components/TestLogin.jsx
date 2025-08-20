import { useState } from 'react'
import { authAPI } from '../services/api'

const TestLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('Testing login with:', { email, password: '***' })
      const response = await authAPI.login({ email, password })
      console.log('Login response:', response.data)
      setResult(JSON.stringify(response.data, null, 2))
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message
      setResult(`Error (${error.response?.status}): ${errorMsg}\n\nFull response: ${JSON.stringify(error.response?.data, null, 2)}`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Test Vendor Login</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="vendor@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="password"
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={loading || !email || !password}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          {result && (
            <div>
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TestLogin