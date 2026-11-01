'use client'

import { Button } from '@/components/ui/button'
import { supabaseClient } from '../../lib/supabase/client'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Signup = () => {
  const supabase = supabaseClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const signup = async () => {
    const response = await supabase.auth.signUp({
      email: email,
      password: password
    })
    console.log(response)
    alert("success")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
          <p className="text-sm text-gray-500">Enter your details to get started</p>
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

          <Button onClick={signup} className="w-full">
            Signup
          </Button>

          <div className="text-center text-sm text-gray-500 pt-2">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline font-medium">Login</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup