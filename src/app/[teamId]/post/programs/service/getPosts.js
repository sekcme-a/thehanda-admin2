import { supabase } from "@/lib/supabase"




export const temp_fetchPostList = async (teamId) => {
  try{
    const {data, error} = await supabase.from("posts")
      .select()
      .eq("program_team_id", teamId)
      .order("program_saved_at", {ascending: false})
    
    if(error) throw error

    return data
  }catch(e){
    console.error(e)
    throw e
  }
}