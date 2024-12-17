"use client"

import { Button, IconButton, TextField } from "@mui/material"
import { useState } from "react"

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useRouter } from "next/navigation";

const SignInWithIdAndPw = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [isPwVisible, setIsPwVisible] = useState(false)
  const [isConfirmPwVisible, setIsConfirmPwVisible] = useState(false)

  
  const signIn = () => {
    
  }

  return(
    <>
      <TextField
        label="이메일"
        variant="outlined"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        fullWidth
        size="small"
        className="mt-8"
      />

      <TextField
        label="비밀번호"
        variant="outlined"
        className="mt-5"
        value={pw}
        onChange={e=>setPw(e.target.value)}
        size="small"
        type={isPwVisible ? "text":"password"}
        fullWidth
        slotProps={{
          input:{
            endAdornment: 
              <IconButton
              onClick={()=>setIsPwVisible(!isPwVisible)}
              >
                {isPwVisible ? 
                  <VisibilityOutlinedIcon /> 
                  : 
                  <VisibilityOffOutlinedIcon />
                }
              </IconButton>
          }
        }}
      />
    
    <TextField
        label="비밀번호 재확인"
        variant="outlined"
        className="mt-5"
        value={confirmPw}
        onChange={e=>setConfirmPw(e.target.value)}
        size="small"
        fullWidth
        type={isConfirmPwVisible ? "text":"password"}
        slotProps={{
          input:{
            endAdornment: 
              <IconButton
              onClick={()=>setIsConfirmPwVisible(!isConfirmPwVisible)}
              >
                {isConfirmPwVisible ? 
                  <VisibilityOutlinedIcon /> 
                  : 
                  <VisibilityOffOutlinedIcon />
                }
              </IconButton>
          }
        }}
      />

      <Button
        variant="contained"
        onClick={signIn}
        className="mt-8"
        fullWidth
      >
        회원가입
      </Button>

      <div className="justify-center items-center flex">
        <Button
          onClick={()=>router.back()}
          className="font-bold mt-3"
        >
          {`< 뒤로가기`}
        </Button>
      </div>
    </>
  )
}

export default SignInWithIdAndPw