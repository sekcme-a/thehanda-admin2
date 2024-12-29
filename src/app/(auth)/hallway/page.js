"use client"

import { useAuth } from "@/provider/AuthProvider"
import { useEffect } from "react"
import { fetchTeams } from "../service/auth"
import { useState } from "react"
import { CircularProgress } from "@mui/material"
import Image from "next/image"
import { useRouter } from "next/navigation"



const Hallway = () => {
  const router = useRouter()
  const {profile} = useAuth()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try{
      const fetchedTeams = await fetchTeams()
      setTeams(fetchedTeams)
    } catch(error) {
      alert(error.message ?? JSON.stringify(error))
    }finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    fetchData()
  },[])


  const onTeamClick = (teamId) => {
    router.push(`/${teamId}/dashboard`)
  }

  return(
    <>
      <h2 className="font-bold text-2xl text-gray-700">
        들어갈 팀을 선택해주세요 {profile?.display_name}님!🎉
      </h2>
      {
        loading && <CircularProgress />
      }
      <ul 
        className="
          max-h-[50vh]
          flex items-center w-full overflow-y-scroll
          my-3 flex-wrap py-1
          border border-[rgb(233,233,233)] rounded-md
        "
      >
        {
          teams?.map((team, index) => (
            <li key={index}
              className="    
                w-full flex items-center
                px-4 py-2
                border-b border-[rgb(222,222,222)]
                cursor-pointer transition duration-300
                hover:bg-[rgb(241,241,241)]
              "
              onClick={()=>onTeamClick(team.id)}
            >
              <Image
                src={team.image}
                width={50}
                height={50}
                alt="프로필"
              />
              <p className="ml-3 font-bold">{team.name}</p>
            </li>
          ))
        }
      </ul>

      <p>더한다 TEAM을 이용해 컨텐츠를 관리하세요.</p>
    </>
  )
}

export default Hallway