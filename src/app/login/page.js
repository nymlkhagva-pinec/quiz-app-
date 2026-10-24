'use client'

import { Button } from '@/components/ui/button'
import { supabaseClient } from '../../lib/supabase/client'
import { Input } from '@/components/ui/input'

const Login = () => {
  const supabase = supabaseClient()

  const login = async () => {
    const response = await supabase.auth.signInWithPassword({
      email: 'turbold959@gmail.com',
      password: '1234abc!!!!'
    })
    console.log(response)
  }

  return (
    <div>
      <Input placeholder="email" className='w-50' />
      <Input placeholder="password" className='w-50' />
      <Button onClick={login}>Login</Button>
    </div>
  )
}

export default Login