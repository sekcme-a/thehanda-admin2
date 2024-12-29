'use client'

import Header from "@/app/[teamId]/components/Header"
import Dropzone from "@/components/Dropzone"
import { useData } from "@/provider/DataProvider"
import { Button, TextField } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import { updateTeamProfile } from "./service/teamSettings"
import { useParams } from "next/navigation"
import { useAuth } from "@/provider/AuthProvider"
import { showAlert } from "@/utils/showAlert"
import { useEffect } from "react"


const Profile = () => {
  const {session} = useAuth()
  const {teamId} = useParams()
  const {myTeam, setMyTeam} = useData()
  const [files, setFiles] = useState([])
  const [name, setName] = useState(myTeam.name)

  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    if(myTeam)setName(myTeam.name)
  },[myTeam])

  // const 

  const onSubmitClick = async () => {
    try{
      setLoading(true)
      const uploadedUrl = await updateTeamProfile(
        files[0],name,teamId, session.user.id
      )
      if(files[0])
        setMyTeam(prev => ({...prev, image: uploadedUrl, name: name}))
      else
        setMyTeam(prev => ({...prev,name: name}))
        alert("프로필이 변경되었습니다.")
    }catch(e) {
      showAlert(e)
    }finally{setLoading(false)}
  }
  
  return(
    <>
      <Header title="팀 프로필" />

      <div className="p-5">
{/*       
        <p className={titles}>현재 프로필 사진</p>
        <Image
          src={myTeam.image || null}
          alt="프로필"
          width={150}
          height={150}
        /> */}

        <p className="text-lg font-bold mb-1 ">팀 프로필 사진 변경</p>
        <p className="text-xs text-blue-700 mb-5">
          *가로 세로 사이즈가 동일한 정사각형 이미지 사용을 권장합니다.
        </p>
        <Dropzone 
          maxFiles={1} 
          acceptOnlyImages={false} 
          maxImageSizeMB={2} 
          {...{files, setFiles}}
        />

        <p className="text-lg font-bold mb-1 mt-5" >팀명 변경</p>
        <p className="text-xs text-blue-700 mb-5">
          *팀명은 12글자 이내여야 합니다.
        </p>
        <TextField
          value={name}
          onChange={e=>setName(e.target.value)}
          size="small"
          className="w-64"
        />

        <Button
          onClick={onSubmitClick}
          variant="contained"
          className="block mt-10 w-32"
          style={{marginTop: 10, display:"block"}}
          disabled={loading}
        >
          {loading ? "적용 중" : "프로필 적용" }
        </Button>
  
      </div>
    </>
  )
}

export default Profile