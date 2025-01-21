import { supabase } from "@/lib/supabase"

export const saveProgramPost = async (teamId, postId, postValues, images) => {
  try{
    const {error} = await supabase
      .from("posts")
      .upsert({
        id: postId,
        title: postValues.title,
        type: "program",
        deadline: postValues.hasDeadline ? postValues.endAt.toISOString() : null,
        tags: postValues.tags,
        images: images,
        program_is_main: postValues.isMain,
        program_condition: postValues.condition,
        program_reserve_start_at: postValues.hasReserve ? postValues.startAt.toISOString() : null,
        program_saved_at: new Date().toISOString(),
        program_apply_start_at: postValues.hasProgramStart ? postValues.programStartAt.toISOString() : null,
        program_post_data: {
          ...postValues,
          images: images
        },
        program_team_id: teamId,
      },
        {onConflict: "id"}
      )
   

    if(error) throw error
    

  } catch(e){
    console.error(e)
    throw e
  }
}



export const fetchPost = async (teamId, postId) => {
  try{
    const {data, error} = await supabase
      .from("posts")
      .select()
      .eq("program_team_id", teamId)
      .eq("id", postId)
      .maybeSingle()

    if(error) throw error

    let updatedData = data

    if(updatedData){
      //예약 게재일이 지났으면 자동 게재
      if(data.program_reserve_start_at && 
        new Date(data.program_reserve_start_at) < new Date() &&
        data.program_condition==="unpublished"
      ){
          updatedData={
            ...updatedData, 
            program_condition: "published",
            program_post_data: {
              ...data.program_post_data,
              condition:"published"
            }
          }
          const {error: updateError} = await supabase
            .from("posts")
            .update({
              program_condition: "published", 
              program_post_data: {
                ...data.program_post_data,
                condition:"published"
              }
            })
            .eq("program_team_id", teamId)
            .eq("id", postId)
          if(updateError)console.error(updateError)
        }
    }
    return updatedData
  } catch (e){
    console.error(e)
    throw e
  }
}



export const publishPost = async (teamId, postId, condition="published") => {
  const {data} = await supabase
    .from("posts")
    .select("program_post_data")
    .eq("program_team_id", teamId)
    .eq("id", postId)
    .maybeSingle()

  const {error} = await supabase
    .from("posts")
    .update({
      program_condition: condition,
      program_post_data: {
        ...data.program_post_data,
        condition: condition
      }
    })
    .eq("program_team_id", teamId)
    .eq("id", postId)

  if(error) console.error(error)
}
