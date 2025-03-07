


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import { Button, Dialog } from '@mui/material'
import { Grid2 } from '@mui/material'
import ChargeDialog from './dialog/ChargeDialog'
import { usePoints } from '@/utils/usePoints'
import { useParams } from 'next/navigation'
import CouponDialog from './dialog/CouponDialog'


// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 185,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}))

const Coupon = () => {
  const {teamId} = useParams()
  const {points} = usePoints(teamId)

  const [openChargeDialog, setOpenChargeDialog] = useState(false)
  const [openCouponDialog, setOpenCouponDialog] = useState(false)

  return (
    <>
      <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 } }}>
        <CardContent sx={{ p: theme => `${theme.spacing(4.25, 4.5, 2.25, 4.5)} !important` }}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={12}>
              <Typography variant='h5' sx={{ mb: 1.5 }}>
                한다 Point
              </Typography>
            
              <Typography variant='h5' >
                잔여 시즌 포인트: {points.season} SP
              </Typography>
              <p className="text-xs mb-1">시즌 포인트는 매달 1일 초기화됩니다.</p>
              <Typography variant='h5' >
                잔여 일반 포인트: {points.general}p
              </Typography>
              <div className='flex mt-3 mb-3'>
                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  onClick={()=>setOpenChargeDialog(true)}
                  sx={{mr: 1}}
                >
                  일반 포인트 충전 +
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  fullWidth
                  color="secondary"
                  onClick={()=>setOpenCouponDialog(true)}
                  sx={{ml: 1}}
                >
                  쿠폰 사용
                </Button>
              </div>
              <Typography variant='body2'>*포인트를 통해 사용자들에게 알림을 보내실 수 있습니다.</Typography>
              <Typography variant='body2'>*해당 알림은 알림을 꺼놓은 상대에게는 보내지지 않으며, 포인트가 차감되지 않습니다.</Typography>
            </Grid2>
            {/* <StyledGrid item xs={12} sm={6}>
              <Img alt='Congratulations John' src='/images/illustration-john-2.png' />
            </StyledGrid> */}
          </Grid2>
        </CardContent>
      </Card>

      <Dialog
        open={openChargeDialog}
        onClose={()=>setOpenChargeDialog(false)}
      >
        <ChargeDialog />
      </Dialog>
      <Dialog
        open={openCouponDialog}
        onClose={()=>setOpenCouponDialog(false)}
      >
        <CouponDialog />
      </Dialog>
    </>
  )
}

export default Coupon
