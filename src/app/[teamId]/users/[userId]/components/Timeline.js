import CSVTable from "@/components/CSVTable"
import { supabase } from "@/lib/supabase"
import { useData } from "@/provider/DataProvider"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"



const Timeline = ({profile}) => {
  const router = useRouter()
  const {teamId} = useParams()
  const {myTeam} = useData()
  const [list, setList] = useState([])
  const HEADERS = [
    {key:"title", label:"제목"},
    {key:"savedAt", label:"신청 날짜"},
    {key:"confirmed", label:"승인 여부"},
    {key:"participated", label:"참여 여부"},
  ]

  useEffect(()=> {
    fetchData()
  },[])
  
  const fetchData = async () => {
    const {data, error} = await supabase
      .rpc("get_user_program_apply_history", {team_id: teamId, user_id: profile.uid})
    
    if(error) alert(error.message)
    
    if(data){
      const result = await Promise.all(
          data.map(async apply => {
          const {data: postData} = await supabase
            .from("posts")
            .select("title")
            .eq("id", apply.post_id)
            .maybeSingle()
          return {
            id: apply.id,
            postId: apply.post_id,
            title: postData.title,
            confirmed:apply.condition === 1 ? "승인" : 
            apply.condition === 2 ? "거절" : "미승인",
            participated: apply.participated ? "참여" :
            apply.participated===null ? "-" : "불참",
            savedAt: toYYYYMMDD_HHMM(apply.saved_at)
          }
        })
      )
      setList(result)
    }
    
  }

  return(
    <>
      <h3 className="text-lg font-semibold">
        {profile.display_name}
        {profile.program_profile?.realName ? ` (${profile.program_profile.realName}) ` : " "}
        의 참여 기록입니다.
      </h3>
      <p className="text-xs ">{myTeam.name}의 기록만 표시됩니다.</p>

      <CSVTable
        title={`${profile.display_name}${profile.program_profile?.realName ? ` (${profile.program_profile.realName}) ` : " "} 유저의 참여 기록`}
        headers={HEADERS}
        data={list}
        onItemClick={(data)=>router.push(`/${teamId}/result/${data.postId}`)}
      />
    </>
  )
}

export default Timeline