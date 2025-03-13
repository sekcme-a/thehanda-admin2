import { Grid2 } from "@mui/material"
import Header from "../components/Header"
import Coupon from "../dashboard/components/Coupon"
import { Card } from "@mui/material"
import PointHistory from "./components/PointHistory"



const Points = () => {


  return(
    <>
      <Header title="한다 포인트" />
      <div className="p-5">
        <Grid2 container spacing={3}>
          <Grid2 size={{xs:12, sm:12, md:6, lg: 6}}>
            <Coupon />
          </Grid2>
          <Grid2 size={{xs:12, sm:12, md:6, lg: 6}}>
            <Card sx={{height:"100%",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
               <div
                style={{
                  width: "100%",
                  aspectRatio: "8/3", // 가로세로 비율 고정
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/images/commerce/dashboard_main.png"
                  alt="더한다"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // 이미지가 비율을 유지하며 들어가도록 설정
                  }}
                />
              </div>
            </Card>
          </Grid2>

          <Grid2 size={12}>
            <PointHistory />
          </Grid2>
        </Grid2>
      </div>
    </>
  )
}

export default Points