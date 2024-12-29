'use client'

import { useAuth } from "@/provider/AuthProvider"
import { uploadFilesToSupabase } from "@/utils/supabase/supabaseStorageHandle"
import { Button } from "@mui/material"
import { useState } from "react"
import { v4 as uuidV4 } from "uuid"
import { publishPost, savePost } from "../../service/handlePost"
import { showAlert } from "@/utils/showAlert"
import { useParams } from "next/navigation"



const PostButtons = ({
  postValues, setPostValues
}) => {
  const {teamId, postId} = useParams()
  const {session} = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const onSaveClick = async () => {
    if(postValues.title===""||postValues.title===null){
      alert("제목을 입력해주세요");return;
    }
    setIsLoading(true)
    try{
      const postUid = postId!=="new" ? postId : uuidV4()
      console.log(postUid, postId)
      const imgUrlList = await uploadFilesToSupabase(
        postValues.images, `${session.user.id}/teams/${postUid}`
      )
      await savePost(teamId, postUid, postValues, imgUrlList)
      alert("저장되었습니다.")
    }catch(e){
      showAlert(e)
    }

  }

  const onPublishClick = async () => {
    await publishPost(teamId, postId)
    setPostValues(prev => ({
      ...prev,
      condition:"published"
    }))
    alert("게재되었습니다.")
  }
  
  const onUnpublishClick = async () => {
    await publishPost(teamId, postId, "unpublished")
    setPostValues(prev => ({
      ...prev,
      condition: "unpublished"
    }))
    alert("게재 취소되었습니다.")
  }

  return(
    <>
      <Button
        variant="contained"
        size="small"
        onClick={onSaveClick}
        sx={{mr: 3}}
      >
        저장
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={postValues.condition==="unpublished" ? 
          onPublishClick : onUnpublishClick
        }
        color="secondary"
      >
        {postValues.condition==="unpublished" ? 
          "게재" : "게재 취소"
        }
      </Button>
    </>
  )
}

export default PostButtons