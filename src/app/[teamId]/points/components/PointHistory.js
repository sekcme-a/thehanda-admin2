'use client'

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

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { Button } from "@mui/material"

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';import { TextField } from "@mui/material"
;


const PointHistory = () => {
  const {teamId} = useParams()
  const router = useRouter()

  const [list, setList] = useState([])
  const [checkedList, setCheckedList] = useState([])


  // const [sortStartDate, setSortStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  // const [sortEndDate, setSortEndDate] = useState(new Date())

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const HEADERS = [
    {key:"description", label:"제목"},
    {key:"author", label:"사용자"},
    {key:"created_at", label:"사용일"},
    {key:"amount", label:"포인트 사용"},
    {key:"remaining_season", label:"잔여 시즌 포인트"},
    {key:"remaining_general", label:"잔여 일반 포인트"},
  ]

  const fetchLogs = async () => {
    if (!startDate || !endDate) return alert("검색 기간을 선택해 주세요!");

    const from = moment(startDate).startOf("day").toISOString();
    const to = moment(endDate).endOf("day").toISOString();
    if(from > to ) return alert("시작/종료 날짜를 정확히 입력해주세요.")

    const { data, error } = await supabase
      .from("point_logs")
      .select("*")
      .eq("team_id", teamId)
      .gte("created_at", from)
      .lte("created_at", to)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("검색 중 오류가 발생했습니다.");
    } else if(data) {
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
  };


  return(
    <Card 
      sx={{ 
        position: 'relative', overflow: 'visible', 
        mt: { xs: 0, sm: 7.5, md: 0 }, height:"100%" 
      }}
    >
      <CardContent
        sx={{ 
          p: theme => `${theme.spacing(2.25, 2.5, 2.25, 2.5)}  !important` ,
          display: "inline-block"
        }}
      >
        <h4 className="font-bold mb-3">
          {`포인트 사용 현황`}
        </h4>

        <div className="flex items-center mb-5">
          <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="시작 날짜"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          </LocalizationProvider>
          <p className="text-xl font-bold ml-3 mr-3">~</p>
          <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="종료 날짜"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
          </LocalizationProvider>
          <Button
            size="small"
            variant="contained"
            sx={{ml:"15px"}}
            onClick={fetchLogs}
          >
            검색
          </Button>
        </div>

        <CSVTable
            title={`${startDate}~${endDate} 포인트 사용 현황`}
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