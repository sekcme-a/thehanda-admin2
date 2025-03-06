'use client'

import { useParams, useRouter } from "next/navigation"
import Header from "../../components/Header"
import { useEffect } from "react"
import { CacheManager } from "@/utils/CacheManager"
import { useState } from "react"
import { fetchUserProfile } from "./service/userService"
import { Grid2 } from "@mui/material"
import UserViewLeft from "./components/UserViewLeft"
import UserViewRight from "./components/UserViewRight"




const User = () => {
  const router = useRouter()
  const {userId} = useParams()

  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    try{
      const cacheKey = `profile_${userId}`
      const cachedData = CacheManager.getCachedData(cacheKey)

      if(cachedData){
        setProfile(cachedData)
        return;
      }

      const userProfile = await fetchUserProfile(userId)
      console.log(userProfile)
      setProfile(userProfile)
      CacheManager.setCachedData(cacheKey, userProfile, 600)
    } catch(e){
      alert("존재하지 않거나 탈퇴한 사용자입니다.")
      router.back()
    } finally{
      setLoading(false)
    }
  }

  if(!loading)
  return(
    <>
      <Header title="사용자 정보" />
      <div className="p-5">
        <Grid2 container spacing={2}>
          <Grid2 size={{lg:4, md:5, xs:12}}>
            <UserViewLeft profile={profile} />
          </Grid2>
          <Grid2 size={{lg:8, md:7, xs:12}}>
            <UserViewRight profile={profile} />
          </Grid2>
        </Grid2>
      </div>
    
    </>
  )
}

export default User