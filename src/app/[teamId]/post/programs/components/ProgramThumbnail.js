import { Card, CardContent, CardMedia } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"
import ThumbnailMenu from "./ThumbnailMenu"
import { publishPost } from "../[postId]/service/handlePost"




const ProgramThumbnail = ({data, reloadPage}) => {
  const {teamId} = useParams()
  const router = useRouter()

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
    <Card sx={{p:"10px 5px", cursor:"pointer", position:"relative"}} 
    >
      <ThumbnailMenu postId={data.id} reloadPage={reloadPage}/>
      <CardMedia
        component="img"
        height="140px"
        style={{height:"140px"}}
        image={data.images[0]}
        alt={data.title}
        onClick={()=>router.push(`/${teamId}/post/programs/${data.id}`)}
      />
      <CardContent sx={{p:"5px"}} 
        style={{paddingBottom: "5px"}}
        onClick={()=>router.push(`/${teamId}/post/programs/${data.id}`)}
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
        <h4 className="font-semibold line-clamp-2">
          {data.title}
        </h4>
        <p className="text-xs">
          마지막 변경일: {toYYYYMMDD_HHMM(data.program_saved_at)}
        </p>
      </CardContent>
    </Card>
  )
}

export default ProgramThumbnail