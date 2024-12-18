"use client"

import { Button, TextField } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { isEmailExists } from "../service/auth"





const ResetPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")


  const onSendEmailClick = async () => {
    try{
      const isEmailExist = await isEmailExists(email)
      if(!isEmailExist){
        alert("해당 이메일이 존재하지 않습니다.")
        return;
      }

    }catch(error) {
      
    }
  }

  return(
    <div className="mt-5">
      <TextField
        label="이메일"
        variant="outlined"
        className="mt-5 mb-5"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        size="small"
      />

      <Button
        variant="contained"
        fullWidth
        onClick={onSendEmailClick}
      >
        재설정 이메일 받기
      </Button>

      <div className="justify-center items-center flex">
        <Button
          onClick={()=>router.back()}
          className="font-bold mt-3"
        >
          {`< 뒤로가기`}
        </Button>
      </div>
    </div>
  )
}

export default ResetPassword