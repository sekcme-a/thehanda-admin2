'use client'

import { useData } from "@/provider/DataProvider"
import { useState } from "react"
import { useEffect } from "react"
import CSVTable from "../../result/[postId]/components/CSVTable"
import { Button, Card, CardContent, CircularProgress } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import UserCSVTable from "./UserCSVTable"


import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import CustomNotificationDialog from "@/components/CustomNotificationDialog"


const UserList = () => {
  const router = useRouter()
  const {teamId} = useParams()
  const {myTeam, userList, fetchUserList} = useData()

  const [loading, setLoading] = useState(true)

  const [checkedList, setCheckedList] = useState([])

  const [isCustomNotificationDialogOpen, setIsCustomNotificationDialogOpen] = useState(false)

  useEffect(()=> {
    fetchData()
  },[])

  const fetchData = async () => {
    await fetchUserList()
    setLoading(false)
  }

  const HEADER = [
    {key:"realName", label:"실명"},
    {key:"display_name", label:"닉네임"},
    {key:"phoneNumber", label:"전화번호"},
    {key:"email", label:"이메일"},
    {key:"gender", label:"성별"},
    {key:"countryFlag", label:"국적"},
    {key:"date", label:"생년월일"},
  ]


  const onItemClick = (data) => {
    router.push(`/${teamId}/users/${data.uid}`)
  }

  return(
    <Card>
      <CardContent>

        <Button
            variant="contained"
            size="small"
            sx={{mt: 1, mr: 1, ml:1, mb: 1}}
            color="secondary"
            onClick={() =>setIsCustomNotificationDialogOpen(true)}
          >
          <EditNotificationsOutlinedIcon />
          알림 보내기
        </Button>

      {loading ? 
        <CircularProgress />
        :
        <UserCSVTable
          title={`${myTeam.name} 사용자 목록`}
          header={HEADER}
          data={userList}
          style={{width:"50%"}}
          hasCheck
          {...{checkedList, setCheckedList, onItemClick}}
        />
      
      }
      </CardContent>



      <CustomNotificationDialog
        open={isCustomNotificationDialogOpen}
        onClose={()=>setIsCustomNotificationDialogOpen(false)}
        uidList={
          userList.filter(item => 
              checkedList.includes(item.uid)
            ).map(item => ({
              userId: item.uid, displayName: item.display_name, realName: item.realName
            })
          )
        }
        teamId={teamId}
        notificationType="program"
      />
    </Card>
  )
}

export default UserList