import { Avatar, Box, Card, CardContent, Divider, Typography } from "@mui/material"


const UserViewLeft = ({profile}) => {



  const renderUserAvatar = () => {
    if (profile) {
      if (profile.image) {
        return (
          <Avatar src={profile.image} sx={{ width: 120, height: 120 }} variant="rounded"/>
        )
      } else {
        return (
          <Avatar src={profile.image} sx={{ width: 120, height: 120 }} variant="rounded"/>
        )
      }
    } else {
      return null
    }
  }

  const renderData = (title, text, small) => {
    return(
      <Box sx={{ display: 'flex', mb: 1.5, alignItems:"center" }}>
        <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '1rem' }}>
          {title}
        </Typography>
        {small ? 
          <p className="text-sm">{text}</p>
          :
          <Typography variant={'body5'}>{text}</Typography>
        }
      </Box>
    )
  }


  if(profile)
  return(
    <Card>
      <CardContent sx={{ pt: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {renderUserAvatar()}
        <Typography variant='h6' sx={{ mt: 2 ,}} textTransform="capitalize">
          {profile.display_name}
        </Typography>
      </CardContent>
    
      <CardContent sx={{pt:0}}>
        <Typography variant='h6'>Details</Typography>
        <Divider />
        <Box sx={{pt:2, pb:2}}>
          {renderData("닉네임: ", profile.display_name)}
          {renderData("실명: ", profile.program_profile?.realName)}
          {renderData("전화번호: ", profile.program_profile?.phoneNumber)}
          {renderData("생년월일: ", profile.program_profile?.date)}
          {renderData("국적: ", 
          `${profile.program_profile?.country?.flag} ${profile.program_profile?.country?.text}`
          )}
          {renderData("성별: ", 
            `${profile?.program_profile?.gender==="male" ? "남" : 
              profile?.program_profile?.gender==="female" ? "여" :
              !profile?.program_profile?.gender ? "-" : "기타"
            }`
          )}
          {renderData("이메일: ", profile.email)}
          {renderData("코드: ", profile.uid, true)}
        </Box>
      </CardContent>
    </Card>
  )
}

export default UserViewLeft