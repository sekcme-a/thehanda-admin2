import { supabase } from "@/lib/supabase"
import { toYYYYMMDD_HHMM } from "@/utils/supabase/FormatTimeStamptz"




export const fetchResult = async (postId) => {
  try{
    const {data: applies} = await supabase
      .from("program_apply")
      .select()
      .eq("post_id", postId)
      .order("saved_at", {ascending: false})

    const result = await Promise.all(
      applies.map(async (apply) => {
        const {data: user} = await supabase
          .from("profiles")
          .select()
          .eq("uid", apply.uid)
          .maybeSingle()
        console.log(apply)
        return{
          id: apply.id,
          uid: apply.uid,
          ...apply.data,
          confirmed:apply.condition === 1 ? "승인" : 
            apply.condition === 2 ? "거절" : "미승인",
          participated: apply.participated ? "참여" :
            apply.participated===null ? "-" : "불참",
          realName: !user ? "삭제된 유저" : user.program_profile?.realName ?? "-",
          phoneNumber: !user ? "삭제된 유저" : user.program_profile?.phoneNumber ?? "-",
          deleted: !user ? true : false,
          displayName: !user ? "삭제된 유저" : user.display_name ?? "-",
          savedAt: toYYYYMMDD_HHMM(apply.saved_at)
        }
      })
    )

    return result
    
  }catch(error){
    console.error(error)
    return []
  }
}


export const refineResult = async (data) => {
  try{
    const refinedData =  data.map(obj => {
      for(let [key, value] of Object.entries(obj)){
        //다중 선택 & 파일
        if (Array.isArray(value)) {
          if(typeof value === "object" && typeof value[0] !=="string"){
            //파일 일때
            const tempList = value.map(file => file.path.split("/")[5])
            obj[key] = tempList.join(",")
            obj["result_files"] = value
          }else 
            obj[key] = value.join(",");
        } else if (value.main) { // 주소 핸들
          obj[key] = `${value.main} ${value.sub}`;
        } else if (typeof value.sub === "string") { // 주소 핸들
          obj[key] = `${value.sub}`;
        }
      }
      return obj
    })

    return refinedData
  }catch(error){
    console.error(error)
    return []
  }
}


export const updateApplyCondition = async (confirmApplyId, condition) => {
  try {
    // for (const id of confirmApplyIds) {
      const { error } = await supabase
        .from("program_apply")
        .update({ condition: condition })
        .eq("id", confirmApplyId);

      if (error) {
        console.error(`Error updating ID ${confirmApplyId}:`, error);
        throw error;
      }
    // }
  } catch (error) {
    console.error("Failed to update apply conditions:", error);
    // throw error;
  }
};


export const updateApplyParticipate = async (id, isParticipate) => {
  try{
    const {error} = await supabase
      .from("program_apply")
      .update({participated: isParticipate})
      .eq("id", id)

      if (error) {
        throw error;
      }
  }catch(error) {
    console.error("Failed to update apply participate:", error);
  }
}