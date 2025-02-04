'use client'

import { fetchPushToken, isNotificationEnabledForType, sendSupabaseNotificationAndGetNotificationId } from "@/utils/supabase/notificationService"
import { checkisValidPoint } from "@/utils/supabase/pointService"
import { Dialog } from "@mui/material"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
// import Expo from "expo-server-sdk"
import { useState } from "react"
import { useContext } from "react"
import { createContext } from "react"


const NotificationContext = createContext()

export default function NotificationProvider ({children}) {
  const router = useRouter()
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const [successes, setSuccesses] = useState([])
  const [fails, setFails] = useState([])
  const [duplicates, setDuplicates] = useState(0)
  const [allCount, setAllCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const [progress, setProgress] = useState("")

  const [reloadOnDialogClosed, setReloadOnDialogClosed] = useState(false)
  
  //userList=[{userId: "", displayName, realName}]
//   {
//     title: `[프로그램 참여 확정] ${post.title}`,
//     message: `${post.title} 프로그램에 참여가 확정되었습니다.
// 신청 내용은 (마이페이지 > 신청 기록)에서 확인하실 수 있습니다.
// 프로그램의 일정을 참고해서 잊지 말고 프로그램에 참여해주세요!
// 해당 프로그램에 관심을 가져주셔서 감사합니다.`,
//     buttons: [{
//       text:"프로그램 보러가기",
//       url:`/(group)/post/${postId}`
//     }]
//   },
  const sendExpoSupabaseNotifications = async (
    teamId, userList, notificationData, notificationType,
    options = {
      withoutUsingPoint: false, 
      onlyExpo: false, onlySupabase: false, 
      hideDialog: false,
      customData: null, //알림을 클릭했을 때 이동할 url 등 변경하려면
      //예) {url: `/(screen)/notification/${notificationId}`}
      expoMessage: null, //휴대폰 알림의 메세지는 다르게 출력하려면
      reloadPageWhenDialogClosed: false,
    }
  ) => {
    try{
      setFinished(false)
      if(!options.hideDialog) setIsOpenDialog(true)

      if(!options.hideDialog && options.reloadPageWhenDialogClosed) 
        setReloadOnDialogClosed(true)

      if(teamId && !options.withoutUsingPoint) {
        const isValidPoint = await checkisValidPoint(teamId, userList.length)
        if(!isValidPoint) throw "포인트가 부족합니다."
      }
      
      setAllCount(userList.length)

      const sendedUserId = []
      for(const user of userList) {
        if(sendedUserId.includes(user.userId)){
          setDuplicates(prev => prev+1)
        }else {
          try{
            setProgress(`${user.displayName}(${user.realName})님에게 알림을 전송합니다.`)

            const notificationId = await sendSupabaseNotificationAndGetNotificationId(
              {...notificationData, receiver_id: user.userId}
            )

            if(!options.onlySupabase){
              const isNotificationEnabled = await isNotificationEnabledForType(
                user.userId, notificationType
              )
              if(!isNotificationEnabled) throw "해당 유저의 알림 설정이 꺼져있습니다."

              const pushToken = await fetchPushToken(user.userId)

              await sendExpoNotification(
                pushToken, notificationId, 
                {
                  ...notificationData, 
                  message: options.expoMessage ?? notificationData.message
                },
                options?.customData
              )
            }

            setSuccesses(prev => ([...prev, {name: `${user.displayName}(${user.realName})`}]))

          }catch(error) {
            setFails(prev => ([
              ...prev,
              {
                name: `${user.displayName}(${user.realName})`,
                reason: error
              }
            ]))
          }
        }
      }
    } catch (error) {
      alert(error)
    }finally{
      setProgress("전송 완료.")
      setFinished(true)
    }
  }


  const sendExpoNotification = async (
    pushToken, notificationId, notificationData, customData
  ) => {
    const response = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pushToken,
        title: notificationData.title,
        message: notificationData.message,
        data: customData ?? {url: `/(screen)/notification/${notificationId}`}
      }),
    });
  
    const data = await response.json();
    const errorObject = data?.tickets?.find(item => item.status === 'error');
    const errorMessage = errorObject ? errorObject.message : null
    if(!data || !data.success || !data?.tickets || errorMessage)
      throw errorMessage
  }


  const onDialogClose = () => {
    if(!finished) return;
    setIsOpenDialog(false)
    setSuccesses([])
    setFails([])
    setProgress("")
    setDuplicates(0)
  }
  useEffect(()=> {
    console.log(isOpenDialog, reloadOnDialogClosed)
    if(!isOpenDialog && reloadOnDialogClosed && window) {
      setReloadOnDialogClosed(false)
      window.location.reload()
    }
  },[isOpenDialog, reloadOnDialogClosed])

  return(
    <NotificationContext.Provider
      value={{
        sendExpoSupabaseNotifications
      }}
    >
      <Dialog open={isOpenDialog} onClose={onDialogClose}>
        <div className="w-[80vw] md:w-[65vw]   bg-white h-[70vh]
          pt-3 px-5"
        >
          <h3 className="mt-2 font-bold text-lg">알림 전송</h3>
          <p className="text-xs">*중복된 사용자에게는 알림이 1번만 발송됩니다.</p>
          <p className="font-bold">{`성공: ${successes.length}, 실패: ${fails.length}, 중복: ${duplicates}, 대기: ${
            allCount-successes.length-fails.length-duplicates}`}
          </p>
          <h4 className="text-sm">{progress}</h4>

          <h5 className="mt-5 font-bold mb-1 text-green-700">성공</h5>
          {
            successes.map((item, index) => (
              <div key={index} className="w-full mb-1 flex items-center">
                <p className="font-bold mr-1 text-xs">{item.name}</p>
                <p className="text-xs">{JSON.stringify(item.reason)}</p>
              </div>
            ))
          }
          <h5 className="mt-5 font-bold mb-1 text-red-700">실패 사유</h5>
          {
            fails.map((item, index) => (
              <div key={index} className="w-full mb-1 flex items-center">
                <p className="font-bold mr-1 text-xs">{item.name}</p>
                <p className="text-xs">{JSON.stringify(item.reason)}</p>
              </div>
            ))
          }
        </div>
      </Dialog>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)