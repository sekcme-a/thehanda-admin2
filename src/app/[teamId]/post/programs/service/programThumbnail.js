import { supabase } from "@/lib/supabase"
import { v4 as uuidV4 } from "uuid"




export const copyProgram = async (teamId, postId) => {
  try{
    const {data, error} = await supabase
      .from("posts")
      .select()
      .eq("program_team_id", teamId)
      .eq("id", postId)
      .maybeSingle()

    if(error) throw error
    if(!data) throw "해당 프로그램을 찾을 수 없습니다."

    const {data:copyData, error: copyError} = await supabase
      .from("posts")
      .insert({
        ...data,
        id: uuidV4(),
        title: `${data.title}_복사본`,
        created_at: new Date().toISOString(),
        program_condition: "unpublished",
        program_saved_at: new Date().toISOString(),
        // program_reserve_start_at: null,
        program_post_data: {
          ...data.program_post_data,
          condition:"unpublished"
        }
      })
      .select("id")
      .single()
    if(copyError) throw copyError

    return copyData.id
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const deleteProgram = async (teamId, postId) => {
  try{
    const {error} = await supabase
      .from("posts")
      .delete()
      .eq("program_team_id", teamId)
      .eq("id", postId)

    if(error) throw error

  }catch(e){
    console.error(e)
    throw e
  }
}