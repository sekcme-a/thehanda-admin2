'use client'

import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { fetchTeamData } from "./dataService"
import { showAlert } from "@/utils/showAlert"
import { useAuth } from "./AuthProvider"
import { supabase } from "@/lib/supabase"
import { CacheManager } from "@/utils/CacheManager"
import { ChartBarStacked } from "mdi-material-ui"

const DataContext = createContext()

export default function DataProvider ({children}) {
  const {teamId} = useParams()
  const {session} = useAuth()

  const [myTeam, setMyTeam] = useState({})

  useEffect(()=> {
    const fetchTeam = async () => {
      try{
        const result = await fetchTeamData(teamId)
        setMyTeam(result)
      } catch(e){
        showAlert(e)
      }
    }
    if(teamId) fetchTeam()
  },[teamId])


  const [userCount, setUserCount] = useState(0)
  const [userList, setUserList] = useState([])

  const fetchUserCount = async () => {
    const {count} = await supabase
      .from("team_users")
      .select("*", {count: 'exact', head: true})
      .eq("team_id", teamId)

    setUserCount(count)
  }
  
  const fetchUserList = async () => {
    const {data: userIds} = await supabase.from("team_users")
      .select("user_id")
      .eq("team_id", teamId)

    const refineData = (data) => {
      let newData = data
      if(data.program_profile) newData = {...data, ...data.program_profile}
      if(data.program_profile?.country?.flag)
        newData = {...newData, countryFlag: data.program_profile.country.flag}
      return newData
    }
    const users = await Promise.all(userIds.map(async (user) => {
      const cacheKey = `profile_${user.user_id}`
      const cachedData = CacheManager.getCachedData(cacheKey)
      if(cachedData) {
        const refinedData = refineData(cachedData)
        return refinedData
      }
        const {data} = await supabase.from("profiles").select()
          .eq("uid", user.user_id)
          .maybeSingle()

        if(data){
          CacheManager.setCachedData(cacheKey, data, 600)
          const refinedData = refineData(data)
          return refinedData
        }
        
    }).filter(Boolean))
    setUserList(users)
    setUserCount(users.length)
  }

  

  return(
    <DataContext.Provider
      value={{
        myTeam, setMyTeam,
        userCount, userList, fetchUserList, fetchUserCount
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)