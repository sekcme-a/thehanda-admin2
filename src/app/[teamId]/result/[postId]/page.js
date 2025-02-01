'use client'

import { useParams } from "next/navigation"
import Header from "../../components/Header"
import { useEffect } from "react"
import { fetchPost } from "../../post/programs/[postId]/service/handlePost"
import { useState } from "react"
import FullScreenLoader from "@/components/FullScreenLoader"
import { Button } from "@mui/material"


import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CSVTable from "./components/CSVTable"
import { fetchResult, refineResult, updateApplyCondition } from "./service/resultService"
import { isNotificationEnabledForType, sendSupabaseNotificationAndGetNotificationId } from "@/utils/supabase/notificationService"
import { useNotification } from "@/provider/NotificationProvider"

const Result = () => {
  const {sendExpoSupabaseNotifications} = useNotification()
  const {teamId, postId} = useParams()
  const [post, setPost] = useState({})

  const [isLoading, setIsLoading] = useState(true)


  const [header, setHeader] = useState([])
  const [result, setResult] = useState([])

  const [checkedList, setCheckedList] = useState([])

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    try{
      const postData = await fetchPost(teamId, postId)
      setPost(postData)

      if(!postData?.program_post_data?.formData) return;

      const formData = postData.program_post_data.formData.map(item => {
        if(item.type!=="text_area")
          return {key: item.id, label: item.title}
      }).filter(Boolean)
      setHeader([
        {key:"realName", label:"실명(프로필 상)"}, 
        {key:"displayName", label:"닉네임"}, 
        {key:"phoneNumber", label:"전화번호(프로필 상)"},
        ...formData
      ])

      const fetchedResult = await fetchResult(postId)

      if(!fetchedResult || fetchResult.length===0) return;
      const refinedResult = await refineResult(fetchedResult)

      setResult(refinedResult)
    } catch(error) {
      console.log(error)
      alert("해당 프로그램이 삭제되었거나 존재하지 않습니다.")
    } finally{
      setIsLoading(false)
    }
  }


  const onConfirmClick = async () => {
    if(checkedList.length===0){
      alert("선택된 유저가 없습니다.")
      return;
    }    
    try{
      if(confirm("신청 승인하시겠습니까?")){
        
        const isSendAlarm = confirm("유저들에게 참여 확정 알림을 보내시겠습니까?\n취소 클릭 시, 알림 없이 참여 확정됩니다.\n(이미 참여 확정된 유저에게는 전송되지 않습니다.)")

        //미승인 상태의 데이터만
        const sendList = result.filter(item => 
          checkedList.includes(item.id) && item.confirmed==="미승인"
        )
        console.log(sendList)
        const confirmApplys = sendList.map(item => ({
          userId: item.uid, displayName: item.displayName, realName: item.realName
        }))

        await sendExpoSupabaseNotifications(
          teamId, confirmApplys,
          {
            title: `[프로그램 참여 확정] ${post.title}`,
            message: `${post.title} 프로그램에 참여가 확정되었습니다.
신청 내용은 (마이페이지 > 신청 기록)에서 확인하실 수 있습니다.
프로그램의 일정을 참고해서 잊지 말고 프로그램에 참여해주세요!
해당 프로그램에 관심을 가져주셔서 감사합니다.`,
            buttons: [{
              text:"프로그램 보러가기",
              url:`/(group)/post/${postId}`
            }]
          },
          "program"
        )
//         const confirmApplyUids = sendList.map(item => item.uid)
//         await updateApplyCondition(confirmApplyIds)
//         for(const uid of confirmApplyUids){
//           const notificationId = await sendSupabaseNotificationAndGetNotificationId(
//             uid,
//             {
//               title: `[프로그램 참여 확정] ${postData.title}`,
//               receiver_id: uid,
//               message: `${postData.title} 프로그램에 참여가 확정되었습니다.
// 신청 내용은 (마이페이지 > 신청 기록)에서 확인하실 수 있습니다.
// 프로그램의 일정을 참고해서 잊지 말고 프로그램에 참여해주세요!
// 해당 프로그램에 관심을 가져주셔서 감사합니다.`,
//               buttons: [{
//                 text:"프로그램 보러가기",
//                 url:`/(group)/post/${postId}`
//               }]
//             }
//           )
//         }

//         const isNotificationAllowed = await isNotificationEnabledForType(
//           uid, "program"
//         )
        // if(isNotificationAllowd)
      }
    } catch(e){
      console.log(e)
    } 
  }

  const onParticipatedClick = async () => {

  }


  if(isLoading) return <FullScreenLoader />
  return(
    <>
      <Header title="신청 결과" />
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">
          폼 결과 확인
        </h3>
        <p className="text-sm font-bold mb-1">{`${post.title} 프로그램의 신청결과입니다.`}</p>

        <Button
          variant="contained"
          size="small"
          onClick={onConfirmClick}
          sx={{mt: 1, mr: 1}}
          disabled={post.program_post_data.autoConfirm}
        >
          <PlaylistAddCheckIcon />
          신청 승인 처리
        </Button>

        <Button
          variant="contained"
          size="small"
          sx={{mt: 1, mr: 1}}
          onClick={()=> onParticipatedClick(true)}
        >
          <HowToRegOutlinedIcon />
          참여 처리
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{mt: 1, mr: 1}}
          color="error"
          onClick={()=> onParticipatedClick(false)}
          className="mt-4"
        >
          <PersonOffOutlinedIcon />
          불참 처리
        </Button>

        <Button
          variant="contained"
          size="small"
          sx={{mt: 1, mr: 1}}
          color="secondary"
          // onClick={() =>setIsAlertDialogOpen(true)}
        >
          <EditNotificationsOutlinedIcon />
          알림 보내기
        </Button>

        <div className="mt-3" />

        <CSVTable 
          title={post.title}
          header={header}
          data={result}
          postId={postId}
          {...{checkedList, setCheckedList}}
        />
      </div>
    </> 
  )
}

export default Result