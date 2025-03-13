import { Grid2 } from "@mui/material"
import PercentageRadial from "./PercentageRadial"
import { useEffect } from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import { CircularProgress } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"
import { Rating } from "@mui/material"
import { Button } from "@mui/material"
import { TextField } from "@mui/material"
import { CacheManager } from "@/utils/CacheManager"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"
import { useAuth } from "@/provider/AuthProvider"


const Comments = ({profile}) => {
  const {session} = useAuth()
  const {teamId} = useParams()
  const [participate, setParticipate] = useState(0)
  const [notParticipate, setNotParticipate] = useState(0)

  const [rate, setRate] = useState(0)
  const [rateCount, setRateCount] = useState(0)
  const [inputRate, setInputRate] = useState(0)
  const [text, setText] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [triggerReload, setTriggerReload] = useState(true)

  const [commentList, setCommentList] = useState([])

  useEffect(()=> {
    fetchData()
  },[triggerReload])

  const fetchData = async () => {
    setIsLoading(true)
    const {data} = await supabase
      .rpc("get_user_participated_history", {team_id: teamId, user_id: profile.uid })

    let yes = 0
    let no = 0
    data.map(item => {
      if(item.participated === true) yes +=1
      else if(item.participated===false) no +=1
    })
    setParticipate(yes)
    setNotParticipate(no)
    
    const {data: comments} = await supabase
      .from("profiles_rate_for_admin")
      .select()
      .eq("uid", profile.uid)
      .eq("team_id", teamId)
      .order("created_at", {ascending: false})

    if(comments){
      let ratingTotal = 0
      let count = 0
      const result = await Promise.all(
        comments.map(async comment => {
          ratingTotal += comment.rate
          count += 1
          const cacheKey = `profiles_${comment.author_id}`
          const cachedData = CacheManager.getCachedData(cacheKey)
          if(cachedData) return {...comment, author_name: cachedData.display_name}
          
          const {data: profile} = await supabase
            .from("profiles")
            .select("display_name")
            .eq("uid", comment.author_id)
            .maybeSingle()
          if(profile) return {...comment, author_name: profile.display_name}

        }).filter(Boolean)
      )
      console.log((((ratingTotal/count)/5)*100).toFixed(1))
      setRate((((ratingTotal/count)/5)*100).toFixed(1))
      setRateCount(count)
      console.log(result)
      setCommentList(result)
    }
    setIsLoading(false)
  }

  const onSubmitClick = async () => {
    if(inputRate===0){
      alert("평점을 선택해주세요.")
      return;
    }
    if(text===""){
      alert("평가를 입력해주세요.")
      return;
    }
    const {error} = await supabase
      .from("profiles_rate_for_admin")
      .insert({
        rate: inputRate,
        team_id: teamId,
        text: text,
        uid: profile.uid
      })

    if(error) alert(error.message)
    
    setText("")
    setInputRate(0)
    setTriggerReload(prev => !prev)
  }

  const onDeleteClick = async (id) => {
    if(confirm("해당 참여도를 삭제하시겠습니까?")){
      const {error} = await supabase
        .from("profiles_rate_for_admin")
        .delete()
        .eq("id", id)
      
      if(error) alert(error.message)
      else setTriggerReload(prev => !prev)
    }
  }

  return(
    <>
      <Grid2 container spacing={3}>
        {
          isLoading ? 
          <CircularProgress/>
          :
          <>
            <Grid2 size={{xs:12, sm: 12, md:6, lg: 6}}>
              <PercentageRadial
                  data={{
                    percentage: ((participate / (participate + notParticipate))*100).toFixed(1), 
                    title:`프로그램 중 ${participate}개 참여, ${notParticipate}개 미참여`, 
                    subtitle: '프로그램 참여율'
                  }}
                />
            </Grid2>
            <Grid2 size={{xs:12, sm: 12, md:6, lg: 6}}>

              <PercentageRadial
                data={{
                  percentage: rate,
                  title:`총 ${rateCount}개의 참여도`,
                  subtitle: '참여도'
                }}
              />
            </Grid2>
            
          </>
        }
        <Card sx={{width:"100%"}}>
          <CardContent>
            <h3 className="font-bold">유저 참여도</h3>

            <div className="h-52 overflow-y-scroll">
              {
                commentList?.map((item, index) => (
                  <div className="my-4" key={index}>
                    <div className="flex items-center p-0 m-0">
                      <Rating
                        name="simple-controlled"
                        value={item.rate}
                        size="small"
                        sx={{cursor:"default", padding: 0, margin: 0}}
                      />
                      <p className="text-xs p-0 ml-3">
                        {toYYYYMMDD_HHMM(item.created_at)} | 작성자: {item.author_name}
                      </p>
                      {
                        item.author_id === session.user.id &&
                        <p 
                          className="text-xs text-red-800 cursor-pointer ml-3" 
                          onClick={()=>onDeleteClick(item.id)}
                        >
                          삭제
                        </p>
                      }
                    </div>
                    <p>{item.text}</p>
                  </div>
                ))
              }
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <Rating
                name="simple-controlled"
                value={inputRate}
                onChange={(event, newValue) => {
                setInputRate(newValue);
                }}
              />
              <Button
                onClick={onSubmitClick}
                variant="contained"
                size="small"
              >
                제출
              </Button>

            </div>
            <TextField
              multiline
              fullWidth
              rows={4}
              value={text}
              onChange={(e)=>setText(e.target.value)}
              variant="standard"
            />
          </CardContent>
        </Card>
      </Grid2>
    
    </>
  )
}

export default Comments