'use client'

import { useNotification } from "@/provider/NotificationProvider"
import { Button, Dialog, TextField } from "@mui/material"
import { useState } from "react"




const CustomNotificationDialog = ({
  open, onClose,
  uidList, 
  teamId,
  notificationType,
  options={},
  withoutProgramCode
}) => {
  const {sendExpoSupabaseNotifications} = useNotification()
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [message, setMessage] = useState("")
  const [programCode, setProgramCode] = useState("")
  const [buttons, setButtons] = useState([])




  const onSendAlarmClick = async () => {
    if(title.trim()==="")
      alert("제목은 빈칸일 수 없습니다.")
    else if(subtitle.trim()==="")
      alert("부제목은 빈칸일 수 없습니다.")
    else if(buttons.some(button => button.text.trim() === ""))
      alert("버튼명은 빈칸일 수 없습니다.")
    else if(buttons.some(button => !button.url.includes("http")))
      alert("버튼 링크는 http나 https 가 포함된 전체 주소여야 합니다.")
    else {
      try{
        await sendExpoSupabaseNotifications(
          teamId, uidList,
          {
            title: title,
            message: message,
            buttons: programCode.trim()!=="" ? 
            [
              {text:"프로그램 보러가기", url: `/(group)/post/${programCode}`},
              ...buttons
            ]
            : buttons,
          },
          notificationType,
          {
            ...options,
            expoMessage: subtitle
          }
        )
      }catch(error) {
        alert(error)
      }
    }
  }



  const handleRemoveButton = (index) => {
    setButtons(prevButtons => prevButtons.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    onClose()
    setTitle("")
    setSubtitle("")
    setMessage("")
    setProgramCode("")
    setButtons([])
  }

  return(
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <div className="px-5 py-3 bg-white">
        <h3 className="text-lg font-bold">
          유저에게 보낼 알림 메세지를 작성해주세요.
        </h3>
        <h5 className=" mt-1">제목/부제목 내용은 모바일 알림창에 표시되게 됩니다.</h5>
        <h5 className=""
          >제목/내용 은 어플 내 알림 화면에 표시되게 됩니다. {`(부제목은 표시되지 않습니다.)`}
        </h5>

        <TextField
          label="제목*"
          size="small"
          variant="standard"
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          sx={{mt:1}}
        />

        <TextField
          label="부제목*"
          size="small"
          variant="standard"
          fullWidth
          value={subtitle}
          onChange={e => setSubtitle(e.target.value)}
          sx={{mt:1}}
        />

        <TextField
          label="내용"
          size="small"
          variant="standard"
          fullWidth
          value={message}
          onChange={e => setMessage(e.target.value)}
          multiline
          sx={{mt:1}}
        />

        {!withoutProgramCode &&
          <>
            <TextField
            label="프로그램 코드"
            size="small"
            variant="standard"
            fullWidth
            value={programCode}
            onChange={e => setProgramCode(e.target.value)}
            multiline
            sx={{mt:1}}
            />
            <p className="text-xs text-gray-700 mt-1">
              유저의 알림 화면에 "프로그램으로 이동" 버튼이 생기며, 클릭 시 해당 게시물로 이동됩니다.
              게시물 관리의 "코드 복사" 기능을 활용해 원하는 프로그램의 코드를 복사하세요.
            </p>
          </>
        }
        
        <p className="mt-5 font-bold ">링크 버튼 생성</p>
        {
          buttons.map((item, index) => (
            <div key={index} className="my-2 flex">
              <TextField
                label="버튼 명"
                size="small"
                variant="standard"
                value={item.text}
                onChange={e => {
                  const newButtons = [...buttons];
                  newButtons[index].text = e.target.value;
                  setButtons(newButtons);
                }}
                fullWidth
                sx={{mr: 1}}
              />
              <TextField
                label="링크 (https:// 가 포함된 전체 주소)"
                size="small"
                variant="standard"
                value={item.url}
                onChange={e =>{
                  const newButtons = [...buttons];
                  newButtons[index].url = e.target.value;
                  setButtons(newButtons);
                }}
                sx={{ml: 1}}
                fullWidth
              />
              <Button
                variant="text"
                size="small"
                color="error"
                onClick={()=>handleRemoveButton(index)}
              >
                삭제
              </Button>
            </div>
          ))
        }
        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{mt: 2}}
          onClick={()=>setButtons(prev => [...prev, {text:"", url:""}])}
          disabled={buttons.length>2}
          color="secondary"
        >
          버튼 추가 +
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="small"
          sx={{mt: 2}}
          onClick={onSendAlarmClick}
        >
          알림 보내기
        </Button>
      </div>
    </Dialog>
  )
}

export default CustomNotificationDialog