'use client'

import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { fetchTeamData } from "./dataService"
import { showAlert } from "@/utils/showAlert"
import { useAuth } from "./AuthProvider"

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


  

  return(
    <DataContext.Provider
      value={{
        myTeam, setMyTeam
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)