import { useCoupons } from "@/utils/useCoupons"
import { Button } from "@mui/material"
import { TextField } from "@mui/material"
import { useParams } from "next/navigation"
import { useState } from "react"



const CouponDialog = () => {
  const {teamId} = useParams()
  const {redeemCoupon} = useCoupons(teamId)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onCouponUseClick = async ()=> {
    const result = await redeemCoupon(code)
    if(!result) {
      alert("존재하지 않거나 사용된 쿠폰입니다.")
    }
  }



  return(
    <d className="
      bg-white p-5 flex justify-center items-center
      w-80 flex-wrap max-w-[960vw]
    ">
      <h3 className="font-bold text-lg w-full  text-center">
        한다 쿠폰 사용
      </h3>

      <TextField
        label="쿠폰 번호를 입력하세요."
        margin="dense"
        size="small"
        fullWidth
        value={code}
        onChange={e => setCode(e.target.value)}
        sx={{mt:2}}
      />

      <Button
        margin="dense"
        size="small"
        fullWidth
        variant="contained"
        sx={{mt:3}}
        onClick={onCouponUseClick}
        disabled={isLoading}
      >
        {isLoading ? "검색 중" : "쿠폰 검색"}
      </Button>
    </d>
  )
}

export default CouponDialog