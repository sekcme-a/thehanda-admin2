// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Button } from '@mui/material'
import { useData } from '@/provider/DataProvider'
import { useParams, useRouter } from 'next/navigation'

// ** Custom Components Imports
// import CustomChip from 'src/@core/components/mui/chip'

// ** Styled component for the image
const Img = styled('img')({
  right: 7,
  bottom: 0,
  height: 177,
  position: 'absolute'
})

const CardStatsCharacter = ({ data }) => {
  // ** Vars
  const { title, chipText, src, stats, trendNumber, trend = 'positive', chipColor = 'primary' } = data

  const router = useRouter()
  const {teamId} = useParams()

  return (
    <Card sx={{ overflow: 'visible', position: 'relative' }}>
      <CardContent>
        <Typography sx={{ mb: 3.5, fontWeight: 600 }}>{title}</Typography>
        <Box sx={{ mb: 1.5, rowGap: 1, width: '55%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Typography variant='h5' sx={{ mr: 1.5 }}>
            {stats}
          </Typography>
          <Typography
            component='sup'
            variant='caption'
            sx={{ color: trend === 'negative' ? 'error.main' : 'success.main' }}
          >
            {trendNumber}
          </Typography>
        </Box>
        <p style={{fontSize:"13px", color:"purple", cursor:"pointer"}}
          onClick={()=>router.push(`/${teamId}/${data.url}`)}
        >
          자세히 보기
        </p>
        {/* <CustomChip
          size='small'
          skin='light'
          label={chipText}
          color={chipColor}
          sx={{ height: 20, fontWeight: 500, fontSize: '0.75rem', '& .MuiChip-label': { lineHeight: '1.25rem' } }}
        /> */}
        <Img src={src} alt={title} />
      </CardContent>
    </Card>
  )
}

export default CardStatsCharacter
