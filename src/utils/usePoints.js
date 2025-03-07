import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useEffect } from "react";





export const usePoints = (teamId) => {
  const [points, setPoints] = useState({
    season: 0,
    general: 0
  })

  useEffect(()=> {
    fetchPoints()
  },[teamId])

  const fetchPoints = async () => {
    if(!teamId) return;
    
    const {data, error} = await supabase
      .from("points")
      .select("season_points, general_points")
      .eq("team_id", teamId)
      .single()

    if(error){
      console.error("포인트 조회 실패:", error.message)
      return;
    }

    setPoints({season: data.season_points, general: data.general_points})
  }



  const deductPoints = async (amount, description, postId) => {
    if(!teamId) return;

    let {season, general} = points

    if(season >= amount) {
      season -= amount
    } else {
      amount -= season
      season = 0;
      general = Math.max(0, genral - amount)
    }

    const {error} = await supabase
      .from("points")
      .upsert({
        season_points: season, 
        general_points: general, 
        team_id: teamId
      })
      .eq("team_id", teamId)

    if(error) {
      console.error("포인트 차감 실패: ", error.message)
      return false
    }

        // 포인트 사용 내역 기록
    const { error: logError } = await supabase.from("point_logs").insert([
      {
        team_id: teamId,
        amount: usedSeason + usedGeneral,
        remaining_season: season,
        remaining_general: general,
        postId,
        type:"사용",
        description,
      },
    ]);

    if (logError) {
      console.error("포인트 사용 내역 기록 실패:", logError.message);
    }

    setPoints({season, general})
    return true;
  }


  // 포인트 충분한지 확인
  const hasEnoughPoints = (amount) => {
    return points.season + points.general >= amount;
  };

  return{points, fetchPoints, deductPoints, hasEnoughPoints,}
}