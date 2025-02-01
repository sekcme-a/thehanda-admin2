'use client'

import { IconButton, Menu, MenuItem } from "@mui/material"
import { useParams, useRouter } from "next/navigation"

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";

import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { copyProgram, deleteProgram } from "../service/programThumbnail";
import { showAlert } from "@/utils/showAlert";
import { useAuth } from "@/provider/AuthProvider";

const ThumbnailMenu = ({postId, reloadPage, type="programs"}) => {
  const router = useRouter()
  const {teamId} = useParams()
  const {role} = useAuth()

  const [anchorEl, setAnchorEl] = useState(null)

  const open=Boolean(anchorEl)

  



  const onCopyClick = async () => {
    if(confirm("해당 게시물을 복사하시겠습니까?")){
      try{
        setAnchorEl(null)
        const newPostId = await copyProgram(teamId, postId)
        alert("게시물을 복사했습니다.")
        reloadPage()
      } catch(e){
        showAlert(e)
      }
    }
  }

  const onCodeClick = () => {
    navigator.clipboard.writeText(postId)
    setAnchorEl(null)
    alert(`코드가 복사되었습니다.\n알림을 보낼 때 해당 코드를 붙여넣기하여 알림을 보내보세요.`)
  }

  const onDeleteClick = async () => {
    if(role!=="admin" && role!=="manager")
      alert("매니저 이상의 권한이 필요합니다.")
    else if(confirm("해당 게시물을 삭제하시겠습니까?")){
      setAnchorEl(null)
      await deleteProgram(teamId, postId)
      alert("해당 게시물이 삭제되었습니다.")
      reloadPage()
    }
  }


  return(
    <div className="absolute bottom-0 right-0">
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-haspopup="true"
      >
        <MoreVertIcon  />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={()=>setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          
        }}
      >
        <MenuItem 
          onClick={()=>router.push(`/${teamId}/post/${type}/${postId}`)} 
          sx={{px: 2, py:.5}}
        >
          <BorderColorOutlinedIcon sx={{fontSize:16, mr:2}}/>
          편집
        </MenuItem>
        {type==="programs"
        &&
          <MenuItem 
            onClick={onCopyClick} 
            sx={{px: 2, py:.5}}
          >
            <ContentCopyIcon sx={{fontSize:16, mr:2}}/>
            복사
          </MenuItem>
        }
        {type==="programs"
        &&
          <MenuItem 
            onClick={()=>router.push(`/${teamId}/result/${postId}`)} 
            sx={{px: 2, py:.5}}
          >
            <ListAltIcon sx={{fontSize:16, mr:2}}/>
            결과 보기
          </MenuItem>
        }

        {type!=="announcements" &&
          <MenuItem 
            onClick={onCodeClick} 
            style={{px: 2, py: .5}}
          >
            <DifferenceOutlinedIcon sx={{fontSize:16, mr:2}}/>
            코드 복사
          </MenuItem>
        }

        <MenuItem 
          onClick={onDeleteClick} 
          style={{px: 2, py: .5, color:"rgb(172, 1, 1)"}}
        >
          <DeleteOutlineIcon sx={{fontSize:16, mr:2}}/>
          삭제
        </MenuItem>
      </Menu>
    
    </div>
  )
}

export default ThumbnailMenu