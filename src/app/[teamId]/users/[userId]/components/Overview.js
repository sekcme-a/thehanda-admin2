import { supabase } from "@/lib/supabase"
import { isNotificationEnabledForType } from "@/utils/supabase/notificationService"
import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { Grid2 } from "@mui/material"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"



const Overview = ({profile}) => {
  const {teamId} = useParams()
  const [isProgramAlarmOn, setIsProgramAlarmOn] = useState(null)

  const [realName, setRealName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    try{
      const programAlarm = await isNotificationEnabledForType(profile.uid, "program")
      setIsProgramAlarmOn(programAlarm)
      const {data, error} = await supabase
        .from("profiles_for_admin")
        .select("real_name, phone_number")
        .eq("uid", profile.uid)
        .eq("team_id", teamId)
        .maybeSingle()
      
      if(error) throw error
      if(data){
        setRealName(data.real_name ?? "")
        setPhoneNumber(data.phone_number ?? "")
      }
    }catch(e){
      console.error(e)

    }finally{
      setIsLoading(false)
    }
  }


  const onSaveClick = async () => {
    setIsSaving(true)
    const {error} = await supabase
      .from("profiles_for_admin")
      .upsert({
        uid: profile.uid,
        real_name: realName, 
        phone_number: phoneNumber,
        team_id: teamId
      })
      .eq("uid", profile.uid)
      .eq("team_id", teamId)

      console.log(profile.uid, teamId)
    if(error) {
      alert(error)
      console.error(error)
    }
    setIsSaving(false)
  }

  return(
    <Grid2 container rowSpacing={2} columnSpacing={1}>
      <Grid2 item size={{lg: 12, xs:12}}>
        <p>프로그램 알림: 
          <strong 
            style={{
              color:isProgramAlarmOn ? "green" : "red", fontWeight:"normal"
            }}
          >
            {isProgramAlarmOn ? " ON" : " OFF"}
          </strong>
        </p>
      </Grid2>
      
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={profile?.program_profile?.realName}
          label="실명"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={realName}
          helperText="해당 내용은 수정하실 수 있습니다. (유저에게 공개되지 않습니다.)"
          label="실명(관리자 메모)"
          size="small"
          onChange={(e) => setRealName(e.target.value)}
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={profile?.program_profile?.phoneNumber}
          label="전화번호"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={phoneNumber}
          helperText="해당 내용은 수정하실 수 있습니다. (유저에게 공개되지 않습니다.)"
          label="전화번호(관리자 메모)"
          size="small"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={profile?.display_name}
          label="닉네임"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={
            `${profile?.program_profile?.country?.flag} ${profile?.program_profile?.country?.text}`
          }
          label="국적"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={
            profile?.program_profile?.gender==="male" ? "남" : 
            profile?.program_profile?.gender==="female" ? "여": 
            !profile?.program_profile?.gender ? "-" : "기타"
          }
          label="성별"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={profile?.program_profile?.date}
          label="생년월일"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={profile?.email}
          label="이메일"
          size="small"
        />
      </Grid2>
      <Grid2 size={{lg:6, xs: 12}}>
        <TextField
          fullWidth
          variant="outlined"
          value={profile?.uid}
          label="유저 코드"
          size="small"
        />
      </Grid2>

      <Grid2 size={{xs:12, lg: 12}}>
        <Button
          fullWidth
          onClick={onSaveClick}
          variant="contained"
          disabled={isSaving}
        >
          {isSaving ? "저장중" : "저 장"}
        </Button>
      </Grid2>
    </Grid2>
  )
}

export default Overview