"use client"

import { Button, IconButton, TextField } from "@mui/material"
import { useState } from "react"

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LinkResetPwButton from "./LinkResetPwButton";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const IdAndPw = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")

  const [isPwVisible, setIsPwVisible] = useState(false)


  const login = async () => {
    const {error, data} = await supabase.auth.signInWithPassword({
      email: email,
      password: pw
    })

    if(error){
      console.error(error)
    }
  }

  const loginIfEnterKeyPress = (e) => {
    if(e.key==="Enter") login()
  }

  return(
    <>
      <div className="mt-8">
        <TextField
          label="이메일"
          variant="outlined"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="비밀번호"
          variant="outlined"
          className="mt-3"
          type={isPwVisible ? "text" : "password"}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={loginIfEnterKeyPress}
          size="small"
          fullWidth
          slotProps={{
            input: {
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
      </div>

      <LinkResetPwButton />

      <Button
        fullWidth
        variant="contained"
        onClick={login}
        className="mt-5 font-bold"
      >
        로그인
      </Button>

      <Button
        fullWidth
        variant="contained"
        className="mt-3 font-bold"
        color="secondary"
        onClick={()=>router.push("/signin")}
      >
        회원가입
      </Button>
    </>
  )
}

export default IdAndPw