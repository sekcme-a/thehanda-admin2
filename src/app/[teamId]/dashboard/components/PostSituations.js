import { supabase } from "@/lib/supabase"
import { useData } from "@/provider/DataProvider"
import { Grid2 } from "@mui/material"
import { CardContent } from "@mui/material"
import { Card } from "@mui/material"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"



const PostSituations = () => {
  const {teamId} = useParams()
  const {myTeam} = useData()

  const [program, setProgram] = useState({
    all: "-",
    published:"-",
    main:"-",
    applying:"-"
  })
  const [story, setStory] = useState({
    published:"-"
  })
  const [announcement, setAnnouncement] = useState("-")


  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    const {count: all} = await supabase
      .from("posts")
      .select("*", {count: 'exact', head: true})
      .eq("program_team_id", teamId)
      .eq("type", "program")
      
    const {count: published} = await supabase
      .from("posts")
      .select("*", {count: 'exact', head: true})
      .eq("type", "program")
      .eq("program_team_id", teamId)
      .eq("program_condition", "published")

      const {count: main} = await supabase
      .from("posts")
      .select("*", {count: 'exact', head: true})
      .eq("type", "program")
      .eq("program_team_id", teamId)
      .eq("program_is_main", true)

      const { count: applying, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("type", "program")
      .eq("program_team_id", teamId)
      .or("program_apply_start_at.is.null,program_apply_start_at.lte.now")
      .or("deadline.is.null,deadline.gt.now");

    setProgram({all, published, main, applying})


    const {count: storyPublished} = await supabase
    .from("posts")
    .select("*", {count: 'exact', head: true})
    .eq("program_team_id", teamId)
    .eq("type", "story")
    .eq("program_condition", "published")
    setStory({published: storyPublished})
    const {count: announcement} = await supabase
    .from("posts")
    .select("*", {count: 'exact', head: true})
    .eq("program_team_id", teamId)
    .eq("type", "announcement")
    .eq("program_condition", "published")
    setAnnouncement(announcement)
  }


  return(
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 }, height:"100%" }}>
      <CardContent sx={{ p: theme => `${theme.spacing(2.25, 2.5, 2.25, 2.5)} !important` }}>
        <h3 className="font-bold text-xl">
          게시물
        </h3>
        <h4 className="mt-1 mb-4 font-semibold">
        {myTeam?.name}의 게시물 현황입니다.
        </h4>

        <Grid2 container spacing={3}>

        <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">메인 프로그램 수</p>
            <h4 className="text-lg font-bold">총 {program.main}개</h4>
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">신청 모집중인 프로그램 수</p>
            <h4 className="text-lg font-bold">총 {program.applying}개</h4>
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">게재중 프로그램 수</p>
            <h4 className="text-lg font-bold">총 {program.published}개</h4>
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">전체 프로그램 수</p>
            <h4 className="text-lg font-bold">총 {program.all}개</h4>
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">게재중 스토리 수</p>
            <h4 className="text-lg font-bold">총 {story.published}개</h4>
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:4}}>
            <p className="text-sm">게재중 공지사항 수</p>
            <h4 className="text-lg font-bold">총 {announcement}개</h4>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  )
}

export default PostSituations