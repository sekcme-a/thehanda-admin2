import { supabase } from "@/lib/supabase"



export const fetchUserProfile = async (userId) => {
  try{
    const {data, error} = await supabase
      .from("profiles")
      .select()
      .eq("uid", userId )
      .maybeSingle()

    if(error) throw error
    if(!data) throw "존재하지 않는 사용자입니다."

    return data
  }catch(e){
    console.error(e)
    throw e
  }
}