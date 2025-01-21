import { useAuth } from "@/provider/AuthProvider"
import { showAlert } from "@/utils/showAlert"
import { uploadFilesToSupabase } from "@/utils/supabase/supabaseStorageHandle"
import { Button } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { v4 as uuidV4 } from "uuid"
import { publishAnnouncement, saveAnnouncement } from "./announcementService"

const AnnoucementButtons = ({
  title, text, tags, condition, setCondition,
}) => {
  const router = useRouter()
  const {teamId, postId} = useParams()
  const {session} = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [hasSaved, setHasSaved] = useState(postId!=="new" ? true : false)

  const onSaveClick = async (needRefresh=false) => {
    if(title===""||title===null){
      alert("제목을 입력해주세요"); return
    }

    try{
      setIsLoading(true)
      const postUid = postId !=="new" ? postId : uuidV4()

      await saveAnnouncement(
        teamId, postUid, 
        {
          title, text, tags
        }
      )
      alert("저장되었습니다.")
      if(!hasSaved)
        router.push(`/${teamId}/post/announcements/${postUid}`)
    }catch(error){
      showAlert(error)
    }finally{
      setIsLoading(false)
    }
  }

  const onPublishClick = async () => {
    try{
      await onSaveClick()
      setIsLoading(true)
      await publishAnnouncement(teamId, postId)
      setCondition("published")
      alert("게재되었습니다.")
    }catch(error){
      showAlert(error)
    }finally{
      setIsLoading(false)
    }
  }

  const onUnpublishClick = async () => {
    try{
      setIsLoading(true)
      await publishStory(teamId, postId, "unpublished")
      setCondition("unpublished")
      alert("게재 취소되었습니다.")
    }catch(error){
      showAlert(error)
    }finally{
      setIsLoading(false)
    }
  }

  return(
    <div className="mt-10">
      <Button
        variant="contained"
        size="small"
        onClick={onSaveClick}
        sx={{mr: 3}}
        disabled={isLoading}
      >
        저장
      </Button>

      <Button
        variant="contained"
        size="small"
        onClick={condition==="unpublished" ? 
          onPublishClick : onUnpublishClick
        }
        color="secondary"
        disabled={isLoading || !hasSaved}
      >
        {condition==="unpublished" ? "게재" : "게재 취소"}
      </Button>
    </div>
  )
  
}

export default AnnoucementButtons