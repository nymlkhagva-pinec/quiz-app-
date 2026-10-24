'use client'

import { supabaseClient } from '../../lib/supabase/client'

const Signup = () => {
  const supabase = supabaseClient()

  const signup = async () => {
    const response = await supabase.auth.signUp({
      email: 'turbold959@gmail.com',
      password: '1234abc!!!!'
    })
    console.log(response)
  }

  return (
    <div>
      <input placeholder="email" />
      <input placeholder="password" />
      <button onClick={signup}> signup</button>
    </div>
  )
}

export default Signup