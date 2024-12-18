"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"


const LinkResetPwButton = () => {
  const router = useRouter()

  const onFindPwClick = () => {
    alert("팀 계정은 비밀번호 변경이 불가합니다. 비밀번호를 찾거나 변경하시려면 관리자에게 문의하세요.")
  }

  return(
    <Button
      variant="text"
      className="mt-3 font-bold"
      onClick={onFindPwClick}
    >
      비밀번호를 잊으셨나요?
    </Button>
  )
}
export default LinkResetPwButton