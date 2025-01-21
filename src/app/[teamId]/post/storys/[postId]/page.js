'use client'

import Header from "@/app/[teamId]/components/Header";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone from "@/components/Dropzone"
import { Switch, TextField } from "@mui/material";
import StoryButtons from "./StoryButtons";
import { useEffect } from "react";
import { fetchStory } from "./storyService";
import FullScreenLoader from "@/components/FullScreenLoader";

const EditStory = () => {
  const {teamId, postId} = useParams()
  const router = useRouter()
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState([])

  const [condition, setCondition] = useState("unpublished")

  const [showLikes, setShowLikes] = useState(true)
  const [allowComments, setAllowComments] = useState(true)

  const BORDER = "my-5 border-[0.5px] border-[rgb(211,211,211)]"

  useEffect(() => {
    if(postId && teamId && postId!=="new")
      fetchData()
  },[])

  const fetchData = async () => {
    try{
      setLoading(true)
      const data = await fetchStory(postId)
      setTitle(data.title)
      setText(data.text)
      setImages(data.images)
      setTags(data.tags)
      setCondition(data.program_condition)
      setShowLikes(data.program_post_data.show_likes)
      setAllowComments(data.program_post_data.allow_comments)
    }catch(error){
      alert("해당 게시물이 삭제되었거나 존재하지 않습니다.")
    }finally{
      setLoading(false)
    }
  }



  // 서버 렌더링 방지
  if (typeof window === "undefined") return null;

  if(loading) return <FullScreenLoader />

  return(
    <>
      <Header title="스토리 편집" />
      
      <div className="bg-white rounded-lg px-5 py-6 mt-5 shadow m-5">
        <p className="font-bold mb-2 text-sm">
          사진 업로드
        </p>
        <Dropzone
          maxFiles={7}
          acceptOnlyImages={true}
          maxImageSizeMB={3}
          files={images}
          setFiles={setImages}
        />
        <p className="text-xs mt-1">
          *권장 사이즈 1850*1300
        </p>

        <div className={BORDER} />

        <div style={{display:"flex", alignItems:"center", margin:"10px 0"}}>
          <h1 style={{fontSize:"15px", width:"14vw", fontWeight:"bold"}}>
            제목
          </h1>
          <TextField 
          size="small" placeholder="제목을 입력하세요."
            value={title} onChange={e=>setTitle(e.target.value)}
            InputProps={{style:{fontSize:"14px"}}} 
            fullWidth
          />
        </div>
        <div style={{display:"flex", alignItems:"center", marginTop: "10px"}}>
          <h1 style={{fontSize:"15px", width:"14vw", fontWeight:"bold"}}>
            태그
          </h1>
          <TextField 
          size="small" placeholder="검색 태그를 입력하세요. (띄어쓰기 없이 쉼표로 구분)"
            value={tags} onChange={e=>setTags(e.target.value)}
            InputProps={{style:{fontSize:"14px"}}} 
            fullWidth
          />
        </div>
        <p className="text-sm mt-1 mb-1">
          *어플/관리자 홈페이지에서 유저가 해당 단어로 검색했을 경우 노출됩니다.
        </p>

        <div style={{display:"flex", alignItems:"center", margin:"10px 0"}}>
          <h1 style={{fontSize:"15px", width:"14vw", fontWeight:"bold"}}>
            내용
          </h1>
          <TextField 
            size="small" placeholder="내용을 입력하세요."
            value={text} onChange={e=>setText(e.target.value)}
            InputProps={{style:{fontSize:"14px"}}} 
            fullWidth
            multiline
          />
        </div>

        <div className={BORDER} />

        <div className="flex items-center">
          <p className="font-bold mr-1">
            좋아요 수 표시
          </p>
          <Switch
            checked={showLikes}
            onChange={e=>setShowLikes(e.target.checked)}
            size="small"
          />
        </div>
        
        <div className="flex items-center mt-2">
          <p className="font-bold mr-1">
            댓글 허용
          </p>
          <Switch
            checked={allowComments}
            onChange={e=>setAllowComments(e.target.checked)}
            size="small"
          />
        </div>

        <StoryButtons 
          {...{title, text, images, tags, 
          condition, setCondition,
          showLikes, allowComments}} 
        />
      </div>
    </>
  )
}

export default EditStory