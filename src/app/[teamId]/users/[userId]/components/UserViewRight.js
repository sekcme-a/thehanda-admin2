import { styled } from "@mui/material"
import { useState } from "react"
import { TabContext, TabList } from '@mui/lab';

import { AccountOutline } from "mdi-material-ui";
import TimelineIcon from '@mui/icons-material/Timeline';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import MuiTab from '@mui/material/Tab'
import { Box } from "@mui/material";
import { Card } from "@mui/material";
import Overview from "./Overview";
import Memo from "./Memo";
import Timeline from "./Timeline";
import Comments from "./Comments";

const Tab = styled(MuiTab)(({ theme }) => ({
  minHeight: 48,
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(3)
  }
}))

const UserViewRight = ({profile}) => {
  const [value, setValue] = useState('overview')
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }


  return(
    <TabContext value={value}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
      >
        <Tab value='overview' label='Overview' icon={<AccountOutline />} />
        <Tab value='timeline' label='Timeline' icon={<TimelineIcon />} />
        <Tab value='comments' label="Comments" icon={<SummarizeOutlinedIcon />} />
        <Tab value='memo' label="Memo" icon={<DriveFileRenameOutlineIcon />} />
      </TabList>

      <Box sx={{mt:2}}>
        <Card style={value!=="overview" ? {display:"none"}: {padding: '30px 20px'}}>
          <Overview profile={profile}/>
        </Card>
        <Card style={value!=="memo" ? {display:"none"}: {padding: '30px 20px'}}>
          <Memo profile={profile} />
        </Card>
        <Card style={value!=="timeline" ? {display:"none"}: {padding: '30px 20px'}}>
          <Timeline profile={profile} />
        </Card>
        <Card style={value!=="comments" ? {display:"none"}: {padding: '30px 20px'}}>
          <Comments profile={profile} />
        </Card>
      </Box>
    </TabContext>
  )
}

export default UserViewRight