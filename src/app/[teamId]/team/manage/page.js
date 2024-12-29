'use client'

import { Grid2 } from "@mui/material"
import Header from "../../components/Header"
import Title from "../../components/Title"
import CountCard from "./components/CountCard"
import { useEffect } from "react"
import { fetchAuthRequest, fetchUserTeamList } from "./service/teamManage"
import { useState } from "react"
import { showAlert } from "@/utils/showAlert"
import { useParams } from "next/navigation"
import MemberList from "./components/MemberList"



const Manage = () => {
  const {teamId} = useParams()
  const [membersList, setMembersList] = useState([])
  const [membersProfileList, setMembersProfileList] = useState([])

  const [appliedList, setAppliedList] = useState([])

  useEffect(()=> {
    const fetchMemberList = async () => {
      try{
        const members = await fetchUserTeamList(teamId)
        setMembersList(members)
        const imgList = members.map(member => member.image)
        setMembersProfileList(imgList)
      } catch(error){
        showAlert(error)
      }
    }
    const fetchAuths = async () => {
      try{
        const result = await fetchAuthRequest(teamId)
        if(result) setAppliedList(result)
      }catch(e){
        showAlert(e)
      }finally{
      }
    }
    fetchMemberList()
    fetchAuths()
  },[])

  return(
    <>
      <Header title="구성원 관리" />
      
      <div className="p-5">
        <Title 
          title="팀 구성원 현황"
          text="팀 구성원 현황입니다."
        />
        <Grid2 container spacing={1}>
          <Grid2 size={{xs: 12, sm: 6, md: 6}}>
            <CountCard
              title="팀 구성원"
              count={membersList.length}
              withAvatar
              profileImages={membersProfileList}
            />
          </Grid2>
          <Grid2 size={{xs: 12, sm: 6, md: 6}}>
            <CountCard
              title="권한 신청인"
              count={appliedList.length}
              profileImages={[
                "/images/default_avatar.png"
              ]}
              withButton
              {...{appliedList, setAppliedList}}
            />
          </Grid2>
        </Grid2>
        
        <Title
          title="팀 구성원 목록"
          text="팀의 모든 구성원 목록입니다. 변경사항은 새로고침 시 표시됩니다."
          className="mt-5"
        />
        <MemberList data={membersList} />
      </div>
    </>
  )
}

export default Manage