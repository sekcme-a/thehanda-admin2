//data = {title, receiver_id, message, buttons}

import { supabase } from "@/lib/supabase"
import { checkisValidPoint } from "./pointService"
import { NoteSharp } from "@mui/icons-material"

//buttons = [{text, url:""}]  url에 http 가 포함되면 외부 링크로, 아니면 앱 링크로
export const sendSupabaseNotificationAndGetNotificationId = async (
  notificationData
) => {
  try{
    const {data, error} = await supabase
      .from("notifications")
      .insert(notificationData)
      .select("id")

    if(error) throw error

    return data?.[0]?.id ?? null

  }catch(error){
    console.error(error)
    throw error
  }
}




// 특정 알림 타입에 대한 사용자의 알림 설정 상태를 확인하는 함수
export const isNotificationEnabledForType = async (
  userId, notificationType
) => 
  {
    try{
      const {data, error} = await supabase
        .from("user_notification_settings")
        .select("is_enabled")
        .eq("notification_type", notificationType)
        .eq("user_id", userId)
        .maybeSingle()
      if(error) throw error
      
      if(data)
        return data.is_enabled
      return true
    } catch(error){
      console.error(`isNotificationEnabledForType: `, error)
      throw error
    }
  }


export const fetchPushToken = async (userId) => {
  try{
    const {data, error} = await supabase
      .from("profiles")
      .select("push_token")
      .eq("uid", userId)
      .single()

    if(error) throw "해당 유저를 찾을 수 없습니다."

    if(data.push_token)
      return data.push_token
    else throw "해당 유저의 알림 토큰을 찾을 수 없습니다. (유저가 알림 권한을 허용하지 않았거나 오류로 인해 받을 수 없음)"
  }catch(error) {
    throw error
  }
}