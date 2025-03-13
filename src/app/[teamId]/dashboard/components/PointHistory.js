import { getYYYYMMDDWithSlash, getYYYYMMWithSlash } from "@/utils/getDate"
import { CardContent } from "@mui/material"
import { Card } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import CSVTable from "@/components/CSVTable"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import moment from "moment/moment"
import { CacheManager } from "@/utils/CacheManager"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"


const PointHistory = () => {
  const {teamId} = useParams()
  const router = useRouter()

  const [list, setList] = useState([])
  const [checkedList, setCheckedList] = useState([])

  const HEADERS = [
    {key:"description", label:"제목"},
    {key:"author", label:"사용자"},
    {key:"created_at", label:"사용일"},
    {key:"amount", label:"포인트 사용"},
    {key:"remaining_season", label:"잔여 시즌 포인트"},
    {key:"remaining_general", label:"잔여 일반 포인트"},
  ]

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    const startOfMonth = moment().startOf("month").toISOString();
    const endOfMonth = moment().endOf("month").toISOString();

    console.log(moment().startOf("month"), moment().endOf("month"))
    const {data, error} = await supabase
      .from("point_logs")
      .select()
      .eq("team_id", teamId)
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth);
    if(error) console.log(error)
    if(data){
      const result = await Promise.all(
        data.map(async(item) => {
          const cacheKey = `profile_${item.uid}`
          const cachedData = CacheManager.getCachedData(cacheKey)
          if(cachedData)
            return{
              ...item, 
              author: cachedData.display_name, 
              created_at: toYYYYMMDD_HHMM(item.created_at),
              amount: item.type==="충전" ? `+ ${item.amount}` : `- ${item.amount}`
            }
          const {data: profile} = await supabase.from("profiles")
            .select("display_name")
            .eq("uid", item.uid)
            .maybeSingle()
          if(profile)
            return{
              ...item, 
              author: profile.display_name,
              created_at: toYYYYMMDD_HHMM(item.created_at),
              amount: item.type==="충전" ? `+ ${item.amount}` : `- ${item.amount}`
            }
          else return{
            ...item, 
            author: "삭제된 유저",
            created_at: toYYYYMMDD_HHMM(item.created_at),
              amount: item.type==="충전" ? `+ ${item.amount}` : `- ${item.amount}`
          }
        })
      )
      setList(result)
      console.log(result)
    }
  }

  return(
    <Card 
      sx={{ 
        position: 'relative', overflow: 'visible', 
        mt: { xs: 0, sm: 7.5, md: 0 }, height:"100%" 
      }}
    >
      <CardContent
        sx={{ p: theme => `${theme.spacing(2.25, 2.5, 2.25, 2.5)}  !important` }}
      >
        <div className="flex items-end">
          <h4 className="font-bold">
            {`이번달 포인트 사용 현황 (${getYYYYMMWithSlash()})`}
          </h4>
          <p 
            className="text-sm underline ml-3 cursor-pointer"
            onClick={()=>router.push(`/${teamId}/points`)}
          >
            자세히 보기
          </p>
        </div>
        <CSVTable
            title={`${getYYYYMMWithSlash()} 포인트 사용 현황`}
            headers={HEADERS}
            data={list}
            {...{checkedList, setCheckedList}}
            onItemClick={()=>{}}
          />
      </CardContent>
    </Card>
  )
}
export default PointHistory