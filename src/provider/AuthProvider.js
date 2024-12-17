"use client"

import { supabase } from "@/lib/supabase"
import { useEffect } from "react"
import { useState, createContext } from "react"

const AuthContext = createContext()

export default function AuthProvider ({children} ){
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(()=> {
    const {data} = supabase.auth.getSession()
    if(session){
      setSession(session)
      console.log(session)
    }
  },[])

  useEffect(()=> {
    const {data} = supabase.auth.onAuthStateChange((event, session) => {
      console.log(session)
      console.log(event)
    })
    return() => {
      data.subscription.unsubscribe()
    }
  },[])

  return(
    <AuthContext.Provider
      value={{session, profile, setProfile}}
    >
      {children}
    </AuthContext.Provider>
  )

}