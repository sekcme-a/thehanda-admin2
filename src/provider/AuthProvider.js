"use client"

import { supabase } from "@/lib/supabase"
import { CacheManager } from "@/utils/CacheManager"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { useEffect } from "react"
import { useState, createContext } from "react"

const AuthContext = createContext()

export default function AuthProvider ({children} ){
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)


  const fetchSession = async () => {
    const {data: {session: newSession}, error} = await supabase.auth.getSession()
    const prevSession = CacheManager.getCachedData("session")

    //새로운 session이 생겼을때만 다시 검증
    if(!prevSession || newSession.access_token !== prevSession.access_token){

      CacheManager.setCachedData("session", newSession, 50000)
      console.log("newSession: ", newSession)

      setSession(newSession)
      const {data: profileData} = await supabase
        .from("profiles")
        .select()
        .eq("uid", newSession.user.id)
        .maybeSingle()

      if(!profileData){
        const sessionData = {email: newSession.user.email}
        await supabase.from("profiles").insert(sessionData)
        setProfile(sessionData)
      }
      if(!profileData?.display_name)
        router.push("/initialsetting")
      else{
        setProfile(profileData)
        // router.push("/hallway")
      }
        
    }
  }


  useEffect(()=> {
    const {data} = supabase.auth.onAuthStateChange((event, session) => {
      console.log("event", event)
      setTimeout(async()=> {
        if (event === 'INITIAL_SESSION') {
          fetchSession()
        } else if (event === 'SIGNED_IN') {
          fetchSession()
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setProfile(null)
          router.push("/")
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log("recovery")
        } else if (event === 'TOKEN_REFRESHED') {
          // handle token refreshed event
        } else if (event === 'USER_UPDATED') {
          // handle user updated event
        }
      })
    },0)
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

export const useAuth = () => useContext(AuthContext)