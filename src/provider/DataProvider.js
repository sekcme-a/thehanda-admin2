'use client'

import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { createContext } from "react"
import { fetchTeamData } from "./dataService"
import { sendAlert } from "@/utils/sendAlert"

const DataContext = createContext()

export default function DataProvider ({children}) {
  const {teamId} = useParams()

  const [myTeam, setMyTeam] = useState({})

  useEffect(()=> {
    const fetchTeam = async () => {
      try{
        const result = await fetchTeamData(teamId)
        setMyTeam(result)
      } catch(e){
        sendAlert(e)
      }
    }
    if(teamId) fetchTeam()
  },[teamId])
  

  return(
    <DataContext.Provider
      value={{
        myTeam
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)