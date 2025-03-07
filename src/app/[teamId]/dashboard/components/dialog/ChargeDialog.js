import { supabase } from "@/lib/supabase"
import { usePoints } from "@/utils/usePoints"
import { Button } from "@mui/material"
import { TextField } from "@mui/material"
import { useParams } from "next/navigation"
import { useState } from "react"



const ChargeDialog = () => {
  const {teamId} = useParams()
  const {points} = usePoints(teamId)

  const [chargePointAmount, setChargePointAmount] = useState("0")
  const [chargetPointAmountHelperText, setChargePointAmountHelperText] = useState(points.general)

  const [depositor, setDepositor] = useState("")

  const [isLoading, setIsLoading] = useState(false)

    
  const onChargePointAmountChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    setChargePointAmount(inputValue);
    if(e.target.value==="") setChargePointAmountHelperText(points.general)
    else setChargePointAmountHelperText(parseInt(points.general)+parseInt(inputValue))
  }

  const onSubmitClick = async () => {
    if(chargePointAmount==="" || chargePointAmount===0){
      alert("충전할 포인트를 입력해주세요.")
      return
    }
    if(depositor===""){
      alert("입금자 명을 입력해주세요.")
      return
    }
    if(confirm(
`충전 포인트: ${chargePointAmount}p
충전 금액: ${chargePointAmount}원
입금자 명: ${depositor}
충전 후 포인트: ${chargetPointAmountHelperText}p

입력한 입금자 명와 동일하게 입금해주시기 바랍니다.
영업일 기준 1~3일 이내 소요됩니다.`
    )){
      setIsLoading(true)
      const {error} = await supabase
        .from("point_charge_apply")
        .insert({
          team_id: teamId,
          points: chargePointAmount,
          depositor
        })

      if(error){
        alert(error?.message)
        setIsLoading(false)
        return
      }
      alert("충전 신청이 완료되었습니다. 영업일 기준 1~3일 이내 소요됩니다.")
      setIsLoading(false)
    }
  }


  return(
    <div className="
      bg-white p-5 flex justify-center items-center
      w-80 flex-wrap max-w-[960vw]
    ">
      <h3 className="font-bold text-lg w-full  text-center">
        한다 포인트 충전
      </h3>
      <div className="p-2 bg-gray-200 w-full rounded text-sm mt-2">
        잔여 일반 포인트 
        <strong className="pl-5">{points.general}p</strong>
      </div>

      <TextField
        label="충전할 포인트를 입력해주세요."
        margin="dense"
        size="small"
        fullWidth
        value={chargePointAmount}
        onChange={onChargePointAmountChange}
        helperText={`충전 후 포인트: ${chargetPointAmountHelperText}p`}
        sx={{mt:"17px"}}
      />
            <TextField
        label="충전 금액 (원)"
        value={`${chargePointAmount}원`}
        margin="dense"
        size="small"
        fullWidth
        sx={{mt:"12px"}}
      />
      <TextField
        label="입금자 명"
        value={depositor}
        onChange={(e) => setDepositor(e.target.value)}
        margin="dense"
        size="small"
        fullWidth
        sx={{mt:"12px"}}
      />
      <p className="text-xs">입금 계좌: 기업 326-147145-04-011 주식회사 더한다</p>


      <Button
        margin="dense"
        size="small"
        fullWidth
        variant="contained"
        sx={{mt:"20px"}}
        onClick={onSubmitClick}
        disabled={isLoading}
      >
        {isLoading ? "신청 중" : "충전신청"}
      </Button>
    </div>
  )
}

export default ChargeDialog