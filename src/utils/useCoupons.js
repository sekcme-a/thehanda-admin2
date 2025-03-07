import { supabase } from "@/lib/supabase"
import { usePoints } from "./usePoints"




export const useCoupons = (teamId) => {
  const {fetchPoints} = usePoints(teamId)

  const redeemCoupon = async (code) => {
    const {data: coupon, error} = await supabase
      .from("coupons")
      .select("id, points, used")
      .eq("code", code)
      .single()

    if(error || !coupon){
      console.error("쿠폰이 존재하지 않거나 잘못된 코드입니다.")
      return false;
    }

    if(coupon.used){
      console.error("이미 사용된 쿠폰입니다.")
      return false;
    }

    const {error: updateError} = await supabase
      .from("points")
      .update({
        general_points: supabase.raw("general_points + " + coupon.points ),
        team_id: teamId
      })
      .eq("team_id", teamId)

    if(updateError){
      console.error("포인트 충전 실패:", updateError.message)
      return false;
    }

    // 쿠폰 사용 처리
    const { error: couponError } = await supabase
    .from("coupons")
    .update({ used: true })
    .eq("id", coupon.id);

    if (couponError) {
      console.error("쿠폰 상태 업데이트 실패:", couponError.message);
      return false;
    }

    // 포인트 충전 내역 기록
    const { error: logError } = await supabase.from("point_logs").insert([
      {
        team_id: teamId,
        type: "충전",
        amount: coupon.points,
        remaining_season: points.season,
        remaining_general: updateError.data.general_points,
        description: "쿠폰 사용",
      },
    ]);

    if (logError) {
      console.error("포인트 충전 내역 기록 실패:", logError.message);
    }

    // 최신 포인트 정보 가져오기
    fetchPoints();

    return true;
  }

  return {redeemCoupon}
}