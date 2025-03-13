'use client'

import Header from "../components/Header"
import { useParams } from "next/navigation"
import { Grid2 } from "@mui/material"
import CardStatsCharacter from "./components/CardStatsCharacter"
import { useData } from "@/provider/DataProvider"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { Card } from "@mui/material"
import Coupon from "./components/Coupon"
import PostSituations from "./components/PostSituations"
import PointHistory from "./components/PointHistory"
import NewApplies from "./components/NewApplies"





const Dashboard = () => {
  const {teamId} = useParams()

  const {userCount, fetchUserCount} = useData()
  const [memberCount, setMemberCount] = useState(0)

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    fetchUserCount()
    const {count} =  await supabase
      .from("members")
      .select("*", {count: 'exact', head: true})
      .eq("team_id", teamId)
    if(count) setMemberCount(count)
  }

  return(
    <>
      <Header title="대쉬보드" />
      <div className="p-5">
       <Grid2 container spacing={3} sx={{mt: 2}}>
          <Grid2 item size={{xs:12,  md:3, sm: 12}}>
            <CardStatsCharacter
              data={{
                stats: `총 ${userCount}명`,
                title: "이용자 수",
                url: "/users",
                src:"/images/pose_f9.png"
              }}
            />
          </Grid2>
          <Grid2 item size={{xs:12,  md:3, sm: 12}}>
            <CardStatsCharacter
              data={{
                stats: `총 ${memberCount}명`,
                title: "팀원 수",
                url: "/team/manage",
                src:"/images/pose_m18.png"
              }}
            />
          </Grid2>

          <Grid2 item size={{xs:12, md: 6, sm: 12}}>
            <Card sx={{
                height:"100%",
                display:"flex", justifyContent:"center", alignItems:"center"
              }}
            >
              <img src="/images/commerce/dashboard_main.png" alt="더한다" />
            </Card>
          </Grid2>

          <Grid2 item size={{xs:12, md: 6, sm: 12}}>
            <Coupon />
          </Grid2>
          <Grid2 item size={{xs:12, md: 6, sm: 12}}>
            <PostSituations />
          </Grid2>

          <Grid2 item size={12}>
            <NewApplies />
          </Grid2>
          <Grid2 item size={12}>
            <PointHistory />
          </Grid2>
        </Grid2>
      </div>
    </>
  )
}

export default Dashboard