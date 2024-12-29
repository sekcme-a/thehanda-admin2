'use client'

import { Button, CircularProgress, Dialog } from "@mui/material"
import { useEffect } from "react"
import { deleteAuthRequest, fetchAuthRequest, giveAuthority } from "../service/teamManage"
import { useParams } from "next/navigation"
import { useState } from "react"
import { showAlert } from "@/utils/showAlert"


const AppliedListDialog = ({
  onClose, open,
  appliedList, setAppliedList
}) => {
  const {teamId} = useParams()

  const [submitting, setSubmitting] = useState(false)


  const onAcceptClick = async (user) => {
    if(confirm(
`이름: ${user.display_name}\n이메일: ${user.email}
해당 유저에게 관리자 권한을 부여하겠습니까?`)
    ){
      try{
        setSubmitting(user.uid)
        await giveAuthority(teamId, user.uid)
        const newList = appliedList.map(item => {
          if(item.uid!==user.uid) return item
        }).filter(Boolean)
        setAppliedList(newList)
        alert("권한을 부여했습니다.")
      } catch (e) {
        showAlert(e)
      } finally{
        setSubmitting(false)
      }
    }
  }

  const onDeclineClick = async (user) => {
    if(confirm(
      `이름: ${user.display_name}\n이메일: ${user.email}
      해당 유저에게 관리자 권한을 거절하시겠습니까?`)
    ){
      try{
        setSubmitting(user.uid)
        await deleteAuthRequest(teamId, user.uid)
        const newList = appliedList.map(item => {
          if(item.uid!==user.uid) return item
        }).filter(Boolean)
        setAppliedList(newList)
        alert("권한신청을 거절했습니다.")
      } catch (e) {
        showAlert(e)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return(
    <Dialog
      onClose={onClose}
      open={open}
    >
      <ul className="p-5 max-h-4/6 overflow-y-scroll bg-white min-w-64">
        <h2 className="text-center font-bold text-lg mb-5">신청인 목록</h2>
        {appliedList?.length===0 &&
          <p className="text-center">신청자가 없습니다.</p>
        }
        {appliedList?.map((user, index)=>{
          return(
            <li key={index} className="flex flex-wrap items-center px-2 mb-4 ">
              <h3 className="font-bold mr-3">{user?.display_name}</h3>
              <p className="text-sm mr-10">{user?.email}</p>
              <Button
                variant="contained"
                sx={{mr:1}}
                size="small"
                onClick={()=>onAcceptClick(user)}
                disabled={submitting === user.uid}
              >
                수락
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={()=>onDeclineClick(user)}
                disabled={submitting === user.uid}
              >
                거절
              </Button>
            </li>
          )
        })}
      </ul>
    </Dialog>
  )
}
export default AppliedListDialog