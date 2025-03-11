import { supabase } from "@/lib/supabase"
import { CardContent } from "@mui/material"
import { Grid2 } from "@mui/material"
import { Button } from "@mui/material"
import { Card } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"


const NewApplies = () => {
  const router = useRouter()
  const {teamId} = useParams()
  const [weekly, setWeekly] = useState("-")
  const [daily, setDaily] = useState("-")
  const [unread, setUnread] = useState("-")
  const [unapproved, setUnapproved] = useState("-")

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    // const {data: postIds} = await supabase
    //   .from("posts").select("id").eq("program_team_id", teamId)

    // if(postIds){
    //   const postIdList = postIds.map(post => post.id)
    //   if(postIdList.length===0) setUnread(0)
    //   else {
    //     const { count, error: applyError } = await supabase
    //       .from("program_apply")
    //       .select("post_id", { count: "exact", head: true })
    //       .eq("is_viewed_by_admin", false)
    //       .in("post_id", postIdList);
    //     if(applyError) console.log(error)
    //     setUnread(count)
    //   }
    // }
    const {data: unre,} = await supabase.rpc("get_unread_count", {team_id: teamId})
    setUnread(unre)
    const { data: unap, } = await supabase.rpc("get_unapproved_count", { team_id: teamId});
    setUnapproved(unap)
    const { data: dai, } = await supabase.rpc("get_daily_apply_count", { team_id: teamId});
    setDaily(dai)
    const { data: week, } = await supabase.rpc("get_weekly_apply_count", { team_id: teamId});
    setWeekly(week)

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
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl">
            신규 프로그램 신청 현황
          </h3>
          <Button
            variant="contained"
            size="small"
            sx={{fontWeight:700}}
            onClick={()=>router.push(`/${teamId}/post/programs`)}
          >
            프로그램 관리
          </Button>
        </div>
        <Grid2 container spacing={3} sx={{mt: 2}}>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">확인하지 않은 프로그램 신청</p>
            <p className="text-xs">아직 아무도 확인하지 않은 신규 신청 데이터입니다.</p>
            <h4 className="text-lg font-bold">{unread}개</h4>
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">미승인 신청</p>
            <p className="text-xs">승인/거절 처리하지 않은 신청 현황입니다.</p>
            <h4 className="text-lg font-bold">{unapproved}개</h4>
          </Grid2>
          <Grid2 size={{xs:6, sm:6, md:2}}>
            <p className="text-sm">오늘 신규 신청</p>
            <h4 className="text-lg font-bold">{daily}개</h4>
          </Grid2>
          <Grid2 size={{xs:6, sm:6, md:2}}>
            <p className="text-sm">이번주 신규 신청</p>
            <h4 className="text-lg font-bold">{weekly}개</h4>
          </Grid2>
        </Grid2>

      </CardContent>
    </Card>
  )
}

export default NewApplies