import { supabase } from "@/lib/supabase"
import { useAuth } from "@/provider/AuthProvider"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"
import { TextField } from "@mui/material"
import { Button } from "@mui/material"
import { CircularProgress } from "@mui/material"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"



const Memo = ({profile}) => {
  const {teamId} = useParams()
  const {session, profile: myProfile} = useAuth()

  const [memo, setMemo] = useState("")
  const [memoCreatedAt, setMemoCreatedAt]= useState("")
  const [authorDisplayName, setAuthorDisplayName] = useState("")
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    const {data, error} = await supabase
      .from("profiles_for_admin")
      .select("memo, memo_created_at, memo_last_author_id")
      .eq("uid", profile.uid)
      .eq("team_id", teamId)
      .maybeSingle()
    
    if(error) {
      alert("메모를 불러올 수 없습니다.")
      console.error(error)
    }

    if(data?.memo) setMemo(data.memo) 
    if(data?.memo_created_at) setMemoCreatedAt(data.memo_created_at)
    if(data?.memo_last_author_id){
      const {data: authorData, error} = await supabase
        .from("profiles")
        .select("display_name")
        .eq("uid", data.memo_last_author_id)
        .maybeSingle()
      if(authorData) setAuthorDisplayName(authorData?.display_name ?? "")
    }

    setLoading(false)

  }


  const onSaveClick = async () => {
    setSaving(true)
    const {error} = await supabase
      .from("profiles_for_admin")
      .upsert({
        memo, 
        memo_created_at: new Date().toISOString(), 
        memo_last_author_id: session.user.id,
        uid: profile.uid,
        team_id: teamId
      })
      .eq("uid", profile.uid)
      .eq("team_id", teamId)

    if(error) {
      console.error(error)
      alert(error); setSaving(false); return;
    }

    setMemoCreatedAt(new Date().toISOString())
    setAuthorDisplayName(myProfile.display_name)
    setSaving(false)
  }

  return(
    <div className="p-3">
      <h3 className="font-bold">유저 메모를 자유롭게 입력하세요.</h3>
      <p>해당 내용은 같은 팀 내 모든 관리자와 공유됩니다.</p>

      {loading ? <CircularProgress />
      
      :
        <>
          {authorDisplayName.length>0 &&
            <p className="text-sm">
              최근 저장일: {toYYYYMMDD_HHMM(memoCreatedAt)} | {authorDisplayName}
            </p>
          }

          <TextField    
            label="유저 메모"
            multiline
            fullWidth
            sx={{mt: 3}}
            rows={10}
            value={memo}
            placeholder="유저 메모를 입력하세요!"
            onChange={(e)=>setMemo(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{mt: 2}}
            onClick={onSaveClick}
            disabled={saving}
          >
            {saving ? "저장중" : "저 장"}
          </Button>
        </>
      }
    </div>
  )
}

export default Memo