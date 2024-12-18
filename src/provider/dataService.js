import { supabase } from "@/lib/supabase"
import { CacheManager } from "@/utils/CacheManager"


export const fetchTeamData = async (teamId) => {
  const cacheKey = `team_${teamId}`
  const cachedData = CacheManager.getCachedData(cacheKey)
  if(cachedData)
    return cachedData
  
  try{
    const {data, error} = await supabase
      .from("teams")
      .select()
      .eq("id", teamId)
      .single()

    if(error) throw error

    CacheManager.setCachedData(cacheKey, data, 6000)
    return data
  } catch(error) {
    console.error("fetchTeamData: ", error)
    throw error
  }
}