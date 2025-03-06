'use client'

import { useData } from "@/provider/DataProvider"
import { Button, Grid2 } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import { sendAuthRequest } from "./service/sendAuthRequest"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/provider/AuthProvider"
import { showAlert } from "@/utils/showAlert"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"



const NoAuthority = () => {
  const router = useRouter()
  const {session} = useAuth()
  const {teamId} = useParams()
  const {myTeam} = useData()
  const [isSending, setIsSending] = useState(false)


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
        console.log(data,error)
        if(error) throw error
        if(data) router.push(`/${teamId}/dashboard`)
      } catch(e){
      }finally{
      }
    }
    checkAuthority()
  },[])

  const onButtonClick = async () => {
    setIsSending(true)
    try{
      await sendAuthRequest(teamId, session.user.id )
      alert("권한을 요청했습니다.")
    }catch(e){
      showAlert(e)
    }
    setIsSending(false)
  }

  return(
    <Grid2 container className="fixed inset-0 w-screen h-screen bg-white">
    <Grid2 size={8} className="hidden md:block">
      <div className="ml-7 flex items-center">
        <div className="relative w-32 h-32">
          <Image
            src="/images/logo_nobg.png" 
            alt="로고"
            objectFit="contain" 
            fill
          />
        </div> 
      </div>
      <div className="relative w-full h-[80vh] overflow-hidden">
        <Image 
          src="/images/login_bg.png" 
          alt="배경화면" 
          objectFit="contain" 
          fill
        />
      </div>
    </Grid2>
    <Grid2 size={{md: 4, sm: 12, xs:12}} className="bg-white">
      <div className="
        justify-center flex items-center h-screen
      ">
        <div className="w-4/6">
          <h2 className="font-bold text-xl text-gray-700">
            {myTeam.name} 팀에 대한 엑세스 권한이 없습니다.
          </h2>
          <p className="mt-4 mb-6">
            아래의 버튼을 통해 관리자에게 권한을 신청하세요.
          </p>

          <Button
            variant="contained"
            onClick={onButtonClick}
            fullWidth
            disabled={isSending}
            style={{fontWeight:"bold"}}
          >
            {isSending ? "요청중입니다..." : "권한 요청"}
          </Button>
        </div>
      </div>
    </Grid2>
  </Grid2>
  )
}

export default NoAuthority