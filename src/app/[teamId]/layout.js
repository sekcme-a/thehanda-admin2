'use client'

import { useEffect } from "react"
import NavBar from "./components/Navbar"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/provider/AuthProvider"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import FullScreenLoader from "@/components/FullScreenLoader"

const Layout = ({children}) => {
  const {teamId} = useParams()
  const {session} = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    const checkAuthority = async () => {
      try{
        if(!session){
          alert("로그인 후 이용해주세요.")
          router.push("/")
          return;
        }
        const {data, error} = await supabase
          .from("members")
          .select()
          .eq("user_id", session.user.id)
          .eq("team_id", teamId)
          .single()

        if(error) throw error
        if(!data) router.push(`/${teamId}/noAuthority`)
      } catch(e){
        router.push(`/${teamId}/noAuthority`)
      }finally{
        setLoading(false)
      }
    }
    checkAuthority()
  },[])


  if(loading) return <FullScreenLoader />
  return(
    <div className="flex flex-col md:flex-row">
      <div className="bg-gray-100 hidden md:block">
        <NavBar />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default Layout
