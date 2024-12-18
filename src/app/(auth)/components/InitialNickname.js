"use client"

import { isBadWord } from "@/utils/isBadWord"
import { getByte } from "@/utils/stringSize"
import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { saveDisplayName } from "../service/auth"
import { useAuth } from "@/provider/AuthProvider"
import { useRouter } from "next/navigation"




const InitialNickname = () => {
  const router = useRouter()
  const {session, setProfile} = useAuth()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const validateDisplayName = () => {
    if(getByte(name) > 32)
      return {error: "닉네임이 너무 깁니다."}
    if(getByte(name) < 4)
      return {error: "닉네임이 너무 짧습니다."}
    if(isBadWord(name))
      return {error: "부적절한 닉네임입니다."}
    if(/[!@#$%^&*(),.?":{}|<>]/.test(name))
      return {error: "특수문자는 포함시킬 수 없습니다."}
    else return true

  }

  const onNameClick = async () => {
    const {error: isUnvalid} = validateDisplayName()
    if(isUnvalid){alert(error); return;}

    try{
      setLoading(true)
      await saveDisplayName(session.user.id, name)
      
      setProfile(prev => ({...prev, display_name: name}))
      router.push("/hallway")
    } catch(error){
      alert(error.message || JSON.stringify(error))
    }finally{
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if(e.key==="Enter") onNameClick()
  }

  return(
    <div className="mt-2">
      <TextField
        label="닉네임"
        variant="outlined"
        className="mt-5 mb-8"
        value={name}
        onChange={e=>setName(e.target.value)}
        fullWidth
        size="small"
        onKeyDown={onKeyDown}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={onNameClick}
        disabled={loading}
      >
        {!loading ? "확인" : "적용 중"}
      </Button>
    
    </div>
  )
}

export default InitialNickname