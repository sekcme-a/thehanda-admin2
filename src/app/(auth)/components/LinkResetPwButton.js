"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"


const LinkResetPwButton = () => {
  const router = useRouter()


  return(
    <Button
      variant="text"
      className="mt-3 font-bold"
      onClick={()=>router.push(`/resetpw`)}
    >
      비밀번호를 잊으셨나요?
    </Button>
  )
}
export default LinkResetPwButton