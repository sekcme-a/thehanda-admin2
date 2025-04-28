'use client'

import { Card, CardContent, CardMedia } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"
import ThumbnailMenu from "./ThumbnailMenu"
import { publishPost } from "../[postId]/service/handlePost"
import { useEffect } from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import moment from "moment/moment"




const ProgramThumbnail = ({data, reloadPage, type="programs"}) => {
  const {teamId} = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unapprovedCount, setUnapprovedCount] =useState(0)
  const [daily, setDaily] = useState(0)
  const [weekly, setWeekly] = useState(0)


  useEffect(()=> {
    if(type==="programs")
      fetchData()
    else setLoading(false)
  },[])

  const fetchData = async () => {
    const query = supabase
      .from("program_apply")
      .select("*", {count:"exact", head: true})
      .eq("post_id", data.id)

    const {count: unread} = await supabase
    .from("program_apply")
    .select("*", {count:"exact", head: true})
    .eq("post_id", data.id)
      .eq("is_viewed_by_admin", false)
    setUnreadCount(unread)

    const {count: unapproved} = await supabase
      .from("program_apply")
      .select("*", {count:"exact", head: true})
      .eq("post_id", data.id)
      .eq("condition", 0)
    setUnapprovedCount(unapproved)

    // 오늘 날짜를 구하는 코드
    const todayStart = moment().startOf('day').toISOString();  // 오늘 00:00:00
    const todayEnd = moment().endOf('day').toISOString();      // 오늘 23:59:59

    const {count: day} = await supabase
      .from("program_apply")
      .select("*", {count:"exact", head: true})
      .eq("post_id", data.id) 
      .gte('saved_at', todayStart)  // saved_at이 오늘 00:00 이후
      .lte('saved_at', todayEnd);   // saved_at이 오늘 23:59 이전
    setDaily(day)

    // 이번 주의 시작과 끝 날짜를 구하는 코드
    const startOfWeek = moment().startOf('week').toISOString();  // 이번 주의 첫 번째 날짜 (일요일 또는 월요일, 로케일 설정에 따라)
    const endOfWeek = moment().endOf('week').toISOString();      // 이번 주의 마지막 날짜 (토요일 또는 일요일, 로케일 설정에 따라)

    const {count: week} = await supabase
      .from("program_apply")
      .select("*", {count:"exact", head: true})
      .eq("post_id", data.id) 
      .gte('saved_at', startOfWeek)  // saved_at이 오늘 00:00 이후
      .lte('saved_at', endOfWeek);   // saved_at이 오늘 23:59 이전
    setWeekly(week)

    setLoading(false)
  }

  //예약게재시간 지났나 확인
  const isStarted = (startAt) => {
    if(!startAt) return false
    if(new Date(startAt) <= new Date()){
      publishPost(teamId, data.id)
      return true
    }
    else return false

  }
  
  //신청 마감 여부 확인
  const isOverApplyDate = (deadline) => {
    if(!deadline) return false
    if(new Date(deadline) <= new Date())
      return true
    else return false
  }

  const isApplyStarted = (applyStartAt) => {
    if(!applyStartAt) return false
    if(new Date(applyStartAt) <= new Date())
      return true
    else return false
  }


  return(
    <Card sx={{p:"10px 5px 0px 5px", cursor:"pointer", position:"relative"}} 
    >
      <ThumbnailMenu postId={data.id} reloadPage={reloadPage} type={type}/>
      {type!=="announcements" &&
        <CardMedia
          component="img"
          style={{aspectRatio:"10/7"}}
          sx={{aspectRatio:"10/7", width:"100%"}}
          image={data.images[0] ?? "/images/logo_nobg.png"}
          alt={data.title}
          onClick={()=>router.push(`/${teamId}/post/${type}/${data.id}`)}
        />
      }
      <CardContent sx={{p:"5px"}} 
        style={{paddingBottom: "5px"}}
        onClick={()=>router.push(`/${teamId}/post/${type}/${data.id}`)}
      >
        <div className="flex items-center">
          {data.program_condition==="unpublished" ? 
            isStarted(data.program_reserve_start_at) ? 
              <p className="text-xs text-blue-800">
                게재중
              </p>
              :
              data.program_reserve_start_at ? 
              <p className="text-xs text-green-800">
                예약게재 - {toYYYYMMDD_HHMM(data.program_reserve_start_at)}
              </p>
              :
              <p className="text-xs text-gray-800">
                미게재
              </p>
            :
            <p className="text-xs text-blue-800">
              게재중
            </p>
          }

          {
            isOverApplyDate(data.deadline) ? 
              <p className="text-xs text-red-700 ml-2">
                접수 마감
              </p>
            :
            isApplyStarted(data.program_apply_start_at) &&
            <p className="text-xs text-blue-800 ml-2">
              신청 접수중
            </p>

          }
        </div>
        <h4 className="font-semibold line-clamp-1">
          {data.title}
        </h4>
        <p className="text-xs mb-2">
          마지막 변경일: {toYYYYMMDD_HHMM(data.program_saved_at)}
        </p>
        <div>
          {loading ?
            <p className="text-xs">신청 현황 불러오는 중..</p>
            :
            <>
              {type==="programs" &&
              <>
                <div className="flex items-center">
                  {unreadCount===0 && (unapprovedCount===0 || data.program_post_data?.autoConfirm ) 
                    && <p className="text-xs text-green-800">모든 항목이 확인되었습니다.</p>
                  }
                  {unreadCount!==0 &&
                    <p className="text-xs mr-4 text-red-700">읽지 않음: {unreadCount}</p>
                  }
                  {unapprovedCount!==0 && !data.program_post_data?.autoConfirm  &&
                    <p className="text-xs text-blue-700">미승인: {unapprovedCount}</p>
                  }
                </div>
                <div className="flex items-center">
                  <p className="text-xs mr-4">오늘 신청자: {daily}명</p>
                  <p className="text-xs">이번주 신청자: {weekly}명</p>  
                </div>
              </>
              }
            </>
          }

        </div>
      </CardContent>
    </Card>
  )
}

export default ProgramThumbnail