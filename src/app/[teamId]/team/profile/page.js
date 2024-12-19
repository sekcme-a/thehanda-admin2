'use client'

import Header from "@/app/[teamId]/components/Header"
import Dropzone from "@/components/Dropzone"
import { useData } from "@/provider/DataProvider"
import Image from "next/image"
import { useState } from "react"


const Profile = () => {
  const {myTeam} = useData()
  const [files, setFiles] = useState([])

  const titles="text-lg font-bold mb-1"
  // const 
  
  return(
    <>
      <Header title="팀 프로필" />

      <div className="p-5">
      
        <p className={titles}>현재 프로필 사진</p>
        <Image
          src={myTeam.image || null}
          alt="프로필"
          width={150}
          height={150}
        />

        <p className={titles}>팀 프로필 사진 변경</p>
        <p className="text-xs text-blue-700 mb-5">
          *가로 세로 사이즈가 동일한 정사각형 이미지 사용을 권장합니다.
        </p>
        <Dropzone 
          maxFiles={1} 
          acceptOnlyImages={false} 
          maxImageSizeMB={2} 
          {...{files, setFiles}}
        />
      </div>
    </>
  )
}

export default Profile