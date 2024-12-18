'use client'

import Header from "@/app/[teamId]/components/Header"
import { useData } from "@/provider/DataProvider"
import Image from "next/image"


const Profile = () => {
  const {myTeam} = useData()
  
  return(
    <>
      <Header title="팀 프로필" />
      <p>현재 프로필 사진</p>
      <Image
        src={myTeam.image || null}
        alt="프로필"
        width={150}
        height={150}
      />

      <p>팀 프로필 사진 변경</p>
      <p>
        *가로 세로 사이즈가 동일한 정사각형 이미지 사용을 권장합니다.
      </p>
    </>
  )
}

export default Profile