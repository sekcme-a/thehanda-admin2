'use client'

import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Typography } from "@mui/material"
import { useState } from "react"
import AppliedListDialog from "./AppliedListDialog"
import { useEffect } from "react"
import { fetchUserTeamList } from "../service/teamManage"
import { useParams } from "next/navigation"


const CountCard = ({
  title, count, onButtonClick, profileImages,
  withButton,
  appliedList, setAppliedList
}) => {
  const {teamId} = useParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)




  return(
    <>
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2'>Total {count} users</Typography>
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatarGroup-avatar': { fontSize: '.875rem' },
                '& .MuiAvatar-root, & .MuiAvatarGroup-avatar': { width: 32, height: 32 },
              }}
            >
              {profileImages?.map((img, index) => (
                <Avatar key={index} alt={title} src={`${img}`} />
              ))}
            </AvatarGroup>
          </Box>
          <Box sx={{display:"flex", justifyContent:"space-between"}}>
            <Typography variant='h6'>{title}</Typography>
            {
              withButton &&
              <Button
                variant="contained"
                onClick={()=>setIsDialogOpen(true)}
                size="small"
              >
                신청 목록
              </Button>
            }
          </Box>
        </CardContent>
      </Card>

      <AppliedListDialog 
        onClose={()=>setIsDialogOpen(false)}
        open={isDialogOpen}
        {...{appliedList, setAppliedList}}
      />
    </>
  )
}

export default CountCard