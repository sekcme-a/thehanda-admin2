import { supabase } from "@/lib/supabase"


export const sendAuthRequest = async (teamId, userId) => {

  try{
    const {data, error} = await supabase
      .from("member_auth_request")
      .select()
      .eq("user_id",userId)
      .eq("team_id", teamId)
      .maybeSingle()
    if(error) throw error
    if(data) throw "이미 권한요청을 보냈습니다. 관리자가 권한을 수락할때까지 기달려주세요."

    const {error: sendRequestError} = await supabase
      .from("member_auth_request")
      .insert({team_id: teamId})
      .eq("team_id", teamId)

    if(sendRequestError) throw sendRequestError
  }catch(e){
    console.error("sendAuthRequest: ", e)
    throw e
  }

}