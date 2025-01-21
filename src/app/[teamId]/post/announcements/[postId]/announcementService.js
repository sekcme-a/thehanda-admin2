import { supabase } from "@/lib/supabase"




export const fetchAnnoucnement = async (postId) => {
  try{
    const {data, error} = await supabase
      .from("posts")
      .select()
      .eq("id", postId)
      .single()

    if(error) throw error

    return data
  }catch(error) {
    console.error(error)
    throw error
  }
}

export const saveAnnouncement = async (teamId, postId, data) => {
  try{
    const {error} = await supabase
      .from("posts")
      .upsert({
          id: postId,
          title: data.title,
          text: data.text,
          type:"announcement",
          tags: data.tags,
          program_team_id: teamId,
          program_saved_at: new Date().toISOString(),
        },
        {onConflict:"id"}
      )
    if(error) throw error
  }catch(e) {
    console.error(e)
    throw e
  }
}

export const publishAnnouncement = async (teamId, postId, condition="published") => {
  try{
    const {error} = await supabase
      .from("posts")
      .update({
        program_condition: condition
      })
      .eq("program_team_id", teamId)
      .eq("id", postId)
    
    if(error) throw error
  }catch(error) {
    console.error(error)
    throw error
  }
}
