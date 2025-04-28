'use client'

import { useParams } from "next/navigation"
import Header from "../../components/Header"
import { useEffect } from "react"
import { fetchPost } from "../../post/programs/[postId]/service/handlePost"
import { useState } from "react"
import FullScreenLoader from "@/components/FullScreenLoader"
import { Button, Dialog, TextField } from "@mui/material"


import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CSVTable from "./components/CSVTable"
import { fetchResult, refineResult, updateApplyCondition, updateApplyParticipate } from "./service/resultService"
import { isNotificationEnabledForType, sendSupabaseNotificationAndGetNotificationId } from "@/utils/supabase/notificationService"
import { useNotification } from "@/provider/NotificationProvider"
import { PlaylistRemove } from "@mui/icons-material"
import CustomNotificationDialog from "@/components/CustomNotificationDialog"
import { supabase } from "@/lib/supabase"

const Result = () => {
  const {sendExpoSupabaseNotifications} = useNotification()
  const {teamId, postId} = useParams()
  const [post, setPost] = useState({})

  const [isLoading, setIsLoading] = useState(true)


  const [header, setHeader] = useState([])
  const [result, setResult] = useState([])

  const [checkedList, setCheckedList] = useState([])

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)


  const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false)
  const [progress, setProgress] = useState("")
  const [isFinished, setIsFinished] = useState(false)

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const [isCustomNotificationDialogOpen, setIsCustomNotificationDialogOpen] = useState(false)

  useEffect(()=> {
    fetchData()
    handleUnread()
  },[])

  const handleUnread = async () => {
    const {error} = await supabase
      .from("program_apply")
      .update({is_viewed_by_admin: true})
      .eq("post_id", postId)
      .eq("is_viewed_by_admin", false)
  }

  const fetchData = async () => {
    try{
      setIsLoading(true)
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
        {key:"savedAt", label:"작성일자"},
        {key:"confirmed", label:"승인여부"},
        {key:"participated", label:"참여여부"},
        ...formData
      ])

      const fetchedResult = await fetchResult(postId, postData.program_post_data.autoConfirm)

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
      if(confirm("신청 승인하시겠습니까?\n신청을 승인한 이후엔 취소할 수 없습니다.")){
        
        const isSendAlarm = confirm("유저들에게 참여 확정 알림을 보내시겠습니까?\n취소 클릭 시, 알림 없이 참여 확정됩니다.\n(이미 참여 승인된 유저에게는 전송되지 않습니다.)")

        //미승인 상태의 데이터만
        const sendList = result.filter(item => 
          checkedList.includes(item.id) && item.confirmed==="미승인"
        )

        const confirmApplys = sendList.map(item => ({
          userId: item.uid, displayName: item.displayName, realName: item.realName
        }))

        const notificationResult = await sendExpoSupabaseNotifications(
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
          "program",
          {
            expoMessage: `${post.title} 프로그램에 참여가 확정되었습니다.`,
            onlySupabase: !isSendAlarm,
          }
        )
        if(!notificationResult) return;

        setIsConditionDialogOpen(true)
        setIsFinished(false)
        const confirmApplyIds = sendList.map(item => item.id)
        setProgress(`신청 승인 처리중입니다. (0/${confirmApplyIds.length})`)
        for(let i = 0; i < confirmApplyIds.length; i++) {
          await updateApplyCondition(confirmApplyIds[i], 1)
          setProgress(`신청 승인 처리중입니다. (${i+1}/${confirmApplyIds.length})`)
        }
        setProgress(`신청 승인 완료.`)
        setIsFinished(true)
        fetchData()
      }
    } catch(e){
      console.log(e)
    } 
  }

  const onRejectClick = async () => {
    if(checkedList.length===0){
      alert("선택된 유저가 없습니다.")
      return;
    }    
    setIsRejectDialogOpen(true)
  }
  const onRejectButtonClick = async () => {
    setIsRejectDialogOpen(false)
    if(!confirm("신청 거절하시겠습니까?\n 신청을 거절한 이유엔 취소할 수 없습니다.")) return;
    try{
        
      const isSendAlarm = confirm("유저들에게 신청 거절 알림을 보내시겠습니까?\n취소 클릭 시, 알림 없이 참여 거절됩니다.\n(이미 승인된 유저들은 거절되지 않으며, 알림이 전송되지 않습니다.) ")

      //미승인 상태의 데이터만
      const sendList = result.filter(item => 
        checkedList.includes(item.id) && item.confirmed==="미승인"
      )

      const confirmApplys = sendList.map(item => ({
        userId: item.uid, displayName: item.displayName, realName: item.realName
      }))

      const notificationResult = await sendExpoSupabaseNotifications(
        teamId, confirmApplys,
        {
          title: `[프로그램 거절됨] ${post.title}`,
          message: `${post.title} 프로그램 신청이 거절되었습니다.

[거절 사유]
${rejectReason}

신청 내용은 (마이페이지 > 신청 기록)에서 확인하실 수 있습니다.`,
          buttons: [{
            text:"프로그램 보러가기",
            url:`/(group)/post/${postId}`
          }]
        },
        "program",
        {
          expoMessage: `${post.title} 프로그램 신청이 거절되었습니다.`,
          // reloadPageWhenDialogClosed: true,
          onlySupabase: !isSendAlarm
        }
      )

      if(!notificationResult) return;

      setIsConditionDialogOpen(true)
      setIsFinished(false)
      const confirmApplyIds = sendList.map(item => item.id)
      setProgress(`신청 거절 처리중입니다. (0/${confirmApplyIds.length})`)
      for(let i = 0; i < confirmApplyIds.length; i++) {
        await updateApplyCondition(confirmApplyIds[i], 2)
        setProgress(`신청 거절 처리중입니다. (${i+1}/${confirmApplyIds.length})`)
      }
      setProgress(`신청 거절 완료.`)
      setIsFinished(true)
      setRejectReason("")
      fetchData()
    } catch(e){
      setRejectReason("")
      console.log(e)
    } 
  }

  const onParticipatedClick = async (isParticipate) => {
    const sendList = result.filter(item => 
      checkedList.includes(item.id) && item.confirmed==="승인"
    )
    let nameList = ""
    sendList.map(item => {nameList=`${nameList==="" ? "" : `${nameList}, `}${item.realName}(${item.displayName})`})
    if(confirm(`총 ${sendList.length}명의 유저에 ${isParticipate ? "참여" : "불참"}처리 합니다.
*참여 승인된 유저만 참여/불참 처리할 수 있습니다.
*참여/불참 처리는 언제든지 변경하실 수 있습니다.
*어플 유저들에게 공개되지 않습니다.

[선택된 유저 목록]
${nameList}`)){
    const confirmApplyIds = sendList.map(item => item.id)
    setIsConditionDialogOpen(true)
    setIsFinished(false)
    setProgress(`${isParticipate ? "참여" : "불참"} 처리중입니다. (0/${confirmApplyIds.length})`)
    for(let i = 0; i < confirmApplyIds.length; i++) {
      await updateApplyParticipate(confirmApplyIds[i], isParticipate)
      setProgress(`${isParticipate ? "참여" : "불참"} 처리중입니다. (${i+1}/${confirmApplyIds.length})`)
    }
    setProgress(`신청 승인 완료.`)
    setIsFinished(true)
    fetchData()
    }
  }

  const onConditionDialogClose = () => {
    if(!isFinished) return;
    setIsConditionDialogOpen(false)
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
        {post.program_post_data.autoConfirm && <p className="text-xs">*자동 승인이 적용된 프로그램입니다.</p>}
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
          onClick={onRejectClick}
          sx={{mt: 1, mr: 1}}
          color="error"
          disabled={post.program_post_data.autoConfirm}
        >
          <PlaylistRemove />
          신청 거절 처리
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
          onClick={() =>setIsCustomNotificationDialogOpen(true)}
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

      <Dialog
        open={isConditionDialogOpen}
        onClose={onConditionDialogClose}
      >
        <p className=" bg-white pt-3 px-5">{progress}</p>
        <Button
          disabled={!isFinished}
          onClick={onConditionDialogClose}
        >
          확인
        </Button>
      </Dialog>
      <Dialog
        open={isRejectDialogOpen}
        onClose={()=>{setIsRejectDialogOpen(false);setRejectReason("")}}
      >
        <div className="
          bg-white py-5 flex flex-wrap items-center justify-center
          px-4
        ">
          <TextField
            label="거절 사유를 작성해주세요."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            size="small"
            style={{width: 600}}
            multiline
          />
          <Button
            onClick={onRejectButtonClick}
            size="small"
            variant="contained"
            style={{marginTop: 10}}
            disabled={rejectReason===""}
            fullWidth
          >
            신청 거절
          </Button>
        </div>
      </Dialog>

      <CustomNotificationDialog
        open={isCustomNotificationDialogOpen}
        onClose={()=>setIsCustomNotificationDialogOpen(false)}
        uidList={
          result.filter(item => 
              checkedList.includes(item.id)
            ).map(item => ({
              userId: item.uid, displayName: item.displayName, realName: item.realName
            })
          )
        }
        teamId={teamId}
        notificationType="program"
      />
    </> 
  )
}

export default Result