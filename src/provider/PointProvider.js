'use client'

import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import { useContext } from "react"
import { createContext } from "react"

const PointContext = createContext()


export default function PointProvider({children}) {

  const {teamId} = useParams()


  const [points, setPoints] = useState({
    season: 0,
    general: 0
  })

  useEffect(()=> {
    if(teamId)
      fetchPoints()
  },[teamId])

  const fetchPoints = async () => {
    if(!teamId) return;
    
    const {data, error} = await supabase
      .from("points")
      .select("season_points, general_points")
      .eq("team_id", teamId)
      .maybeSingle()

    if(error){
      console.error("포인트 조회 실패:", error.message)
      return;
    }
    if(!data){
      setPoints({season: 0, general: 0})
      return {season: 0, general: 0}
    }

    setPoints({season: data.season_points, general: data.general_points})
    return {season: data.season_points, general: data.general_points}
  }



  const deductPoints = async (amount, description) => {
    if(!teamId) return;
    if(amount === 0 )return;

    let {season, general} = await fetchPoints()

    if(season >= amount) {
      season -= amount
    } else {
      amount -= season
      season = 0;
      general = Math.max(0, general - amount)
    }

    const {error} = await supabase
      .from("points")
      .update({
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
        amount,
        remaining_season: season,
        remaining_general: general,
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
    return {
      result: points.season + points.general >= amount,
      remainPoints: points.season + points.general,
      insufficientPoints: amount - points.season - points.general
    }
  };

  return(
    <PointContext.Provider
      value={{
        points, fetchPoints, deductPoints, hasEnoughPoints,
      }}
    >
      {children}
    </PointContext.Provider>
  )

}

export const usePoint = () => useContext(PointContext)