'use client'

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import { fetchAnnoucnement } from "./announcementService"
import FullScreenLoader from "@/components/FullScreenLoader"
import Header from "@/app/[teamId]/components/Header"
import AnnoucementButtons from "./AnnouncementButtons"
import { TextField } from "@mui/material"




const EditAnnouncements = () => {
  const {teamId, postId} = useParams()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [tags, setTags] = useState("")

  const [condition, setCondition] = useState("unpublished")

  const BORDER = "my-5 border-[0.5px] border-[rgb(211,211,211)]"

  useEffect(() => {
    if(postId && teamId && postId!=="new")
      fetchData()
  },[])

  const fetchData = async () => {
    try{
      setLoading(true)
      const data = await fetchAnnoucnement(postId)
      setTitle(data.title)
      setText(data.text)
      setTags(data.tags)
      setCondition(data.program_condition)
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

      
        <AnnoucementButtons
          {...{title, text, tags, 
          condition, setCondition}} 
        />
      </div>
    </>
  )
}

export default EditAnnouncements