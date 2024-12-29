'use client'

import { useAuth } from "@/provider/AuthProvider"
import { useData } from "@/provider/DataProvider"
import { useEffect } from "react"
import { useState } from "react"
import Header from "../components/Header"
import { Button, TextField } from "@mui/material"
import Dropzone from "@/components/Dropzone"
import { updateMyProfile } from "./service/myProfileSettings"
import { showAlert } from "@/utils/showAlert"

const MyProfile = () => {
  const {session, profile, setProfile} = useAuth()
  const [files, setFiles] = useState([])
  const [name, setName] = useState("")

  const [loading, setLoading] = useState(false)

  useEffect(()=> {
    if(profile?.display_name) setName(profile.display_name)
  },[profile])

  const onSubmitClick = async () => {
    try{
      setLoading(true)
      const uploadedUrl = await updateMyProfile(
        files[0], name, session.user.id
      )
      if(files[0])
        setProfile(prev => ({...prev, image: uploadedUrl, display_name: name}))
      else
        setProfile(prev => ({...prev, display_name: name}))
      alert("프로필이 변경되었습니다.")
    } catch(e){
      showAlert(e)
    }finally{
      setLoading(false)
    }
  }
  return(
    <>
      <Header title="내 프로필"/>

      <div className="p-5">

        <p className="text-lg font-bold mb-1 ">내 프로필 사진 변경</p>
        <p className="text-xs text-blue-700 mb-5">
          *가로 세로 사이즈가 동일한 정사각형 이미지 사용을 권장합니다.
        </p>
        <Dropzone
          maxFiles={1} 
          acceptOnlyImages={false} 
          maxImageSizeMB={2} 
          {...{files, setFiles}}
        />

        <p className="text-lg font-bold mb-1 mt-5" >닉네임 변경</p>
        <p className="text-xs text-blue-700 mb-5">
          *닉네임은 12글자 이내여야 합니다.
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

export default MyProfile