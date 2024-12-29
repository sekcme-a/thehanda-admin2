import { supabase } from "@/lib/supabase"



export const fetchUserTeamList = async (teamId) => {
  try{
    const {data: members, error} = await supabase
      .from("members")
      .select()
      .eq("team_id", teamId)

    if(error) throw error

    if(members){
      const list = await Promise.all(
        members.map(async (member) => {
          const {data, error} = await supabase
            .from("profiles")
            .select()
            .eq("uid", member.user_id)
            .maybeSingle()

          if(data) return {...data, role: member.role}
        })
      )
      return list
    }
  } catch(e){
    console.error("fetchUserTeamList:", e)
    throw e
  }
}

export const fetchAuthRequest = async (teamId) => {
  try{
    const {data:requests, error} = await supabase
      .from("member_auth_request")
      .select()
      .order("created_at", {ascending: false})
      .eq("team_id", teamId)

    if(error) throw error
    if(!requests) return []
    
    const list = await Promise.all(
      requests.map(async (request) => {
        const {data, error} = await supabase
          .from("profiles")
          .select()
          .eq("uid", request.user_id)
          .maybeSingle()
        if(data) return data
      })
    )
    return list
  }catch(e){
    console.error("fetchAuthRequest:", e)
    throw e
  }
}
export const giveAuthority = async (teamId, userId) => {
  try {
    const { data, error: selectError } = await supabase
      .from("members")
      .select()
      .eq("team_id", teamId)
      .eq("user_id", userId);

    if (selectError) throw selectError;

    // 이미 팀원인 경우, 권한 요청 삭제
    if (data && data.length > 0) {
      await deleteAuthRequest(teamId, userId)
      throw "이미 팀원으로 등록된 유저입니다."
    } else {
      // 팀원 추가
      const { error: insertError } = await supabase
        .from("members")
        .insert({ team_id: teamId, user_id: userId, role: "member" });

      if (insertError) throw insertError;

      // 권한 요청 삭제
      await deleteAuthRequest(teamId, userId)
    }
  } catch (error) {
    console.error("Error in giveAuthority:", error);
    throw error;
  }
};


export const deleteAuthRequest = async (teamId, userId) => {
  try{
    const {error} = await supabase
      .from("member_auth_request")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", userId)
    if(error) throw error
  } catch(error) {
    console.error("deleteAuthRequest: ",error)
    throw error
  }
}


export const changeDbRole = async (teamId, userId, newRole) => {
  try{
    const {error} = await supabase
      .from("members")
      .update({role: newRole})
      .eq("team_id", teamId)
      .eq("user_id", userId)

    if(error) throw error
  } catch(error) {
    console.error(error)
    throw error
  }
}

export const deleteAuth = async (teamId, userId) => {
  try{
    const {error} = await supabase
      .from("members")
      .delete()
      .eq("team_id", teamId)
      .eq("user_id", userId)

    if(error) throw error
  }catch(error) {
    console.error(error)
    throw error
  }
}