'use client'

import { Button } from '@/components/ui/button'
import { supabaseClient } from '../../lib/supabase/client'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const supabase = supabaseClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const login = async () => {
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    console.log(response)
    alert("logged in")

    router.push('/quiz')

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="email" 
              className="w-full" 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="password" 
              placeholder="password" 
              className="w-full" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button onClick={login} className="w-full">
            Login
          </Button>
          <div className="text-center text-sm text-gray-500 pt-2">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline font-medium">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login