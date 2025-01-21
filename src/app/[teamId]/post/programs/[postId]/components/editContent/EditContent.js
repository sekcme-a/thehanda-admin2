'use client'


import { Button, Grid2 } from "@mui/material"
import SelectMain from "./SelectMain"
import TextInput from "./TextInput"
import Dropzone from "@/components/Dropzone"
import { useState } from "react"
import { useEffect } from "react"
import InfoInput from "./InfoInput"

const EditContent = ({
  postValues,
  setPostValues,
  onNextClick
}) => {
  const [list, setList] = useState(postValues.images)

  useEffect(()=> {
    setPostValues(prev=>({...prev, images: list}))
  },[list])

  const BORDER = "my-5 border-[0.5px] border-[rgb(211,211,211)]"
  return(
    <>
      <SelectMain {...{postValues, setPostValues}}/>

      <div className={BORDER} />

      <TextInput 
        title="제목" placeholder="제목을 입력하세요." id="title"
        {...{postValues, setPostValues}} 
      />
      <TextInput 
        title="부제목" placeholder="부제목을 입력하세요." id="subtitle"
        {...{postValues, setPostValues}} 
      />
      <TextInput 
        title="기간문구" placeholder="기간문구를 입력하세요." id="dateText"
        {...{postValues, setPostValues}} 
      />

      <TextInput 
        title="태그" 
        placeholder="검색 태그를 입력하세요. (띄어쓰기 없이 쉼표로 구분)" 
        id="tags"
        {...{postValues, setPostValues}} 
      />
      <p style={{fontSize:"13px"}}>*어플/관리자 홈페이지에서 유저가 해당 단어로 검색했을 경우 노출됩니다.</p>

      <div className={BORDER}/>

      <p className="font-bold mb-2 text-sm">사진 업로드</p>
      <Dropzone
        maxFiles={7}
        acceptOnlyImages={true}
        maxImageSizeMB={3}
        files={list}
        setFiles={setList}
      />

      <div className={BORDER} />
      <TextInput 
        title="소개문구" placeholder="페이지 최상단에 위치합니다." 
        id="welcome"
        {...{postValues, setPostValues}} 
        multiline 
      />
      <div className="mt-5" />
      <TextInput 
        title="메인정보창 작성" 
        placeholder="페이지 상단 회색 정보창에 위치합니다." 
        id="mainInfo"
        {...{postValues, setPostValues}} multiline 
      />

      <InfoInput 
        id="info"
        {...{postValues, setPostValues}}
        title="정보창 작성"
        label1="제목"
        label2="내용"
        addButtonText="정보 추가 +"
      />

      <div className={BORDER} />
      <InfoInput 
        id="quickLink" 
        {...{postValues, setPostValues}}
        title="바로가기 작성"
        label1="바로가기 제목"
        label2="링크"
        placeholder2="https:// 혹은 http://가 포함된 전체주소를 입력해주세요."
        addButtonText="바로가기 추가 +"
      />
      
      <div className="flex justify-end">
        <Button
          variant="contained"
          onClick={onNextClick}
        >
          {`다음`}
        </Button>
      </div>
    </>
  )
}

export default EditContent