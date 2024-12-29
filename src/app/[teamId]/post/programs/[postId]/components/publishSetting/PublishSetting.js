import { Button, Switch } from "@mui/material"
import DateTimePicker from "./DateTimePicker"
import PostButtons from "./PostButtons"




const PublishSetting = ({
  postValues, setPostValues,
  onPrevClick,
  // onSaveClick, onPublishClick, onUnpublishClick
}) => {

  return(
    <>
      <DateTimePicker
        {...{postValues, setPostValues}}
        type="hasReserve"
        value="startAt"
        text="예약게재일"
      />
      <div className="h-3" />
      <DateTimePicker 
        {...{postValues, setPostValues}} 
        type="hasDeadline" 
        value="endAt" 
        text="신청마감일" 
      />
      <div className="h-3" />
      <DateTimePicker 
        {...{postValues, setPostValues}} 
        type="hasProgramStart" 
        value="programStartAt" 
        text="프로그램 시작일" 
      />
      <div className="h-3" />
      <div className="flex items-center">
        <Switch
          checked={postValues.autoConfirm}
          onChange={e=>setPostValues(prev => 
            ({...prev, autoConfirm: e.target.checked}))}
          size="small"
        />
        <h4 className="">
          {postValues.autoConfirm ? 
            "자동 참가확정" : "수동 참가확정"
          }
        </h4>
      </div>
      <p className="text-xs mt-1 ml-3">
        {postValues.autoConfirm ? 
          "유저가 제출한 즉시 프로그램 참가가 확정됩니다."
          :
          `관리자가 '결과보기' 화면에서 수동으로 참가확정을 클릭해야 합니다.
참가 확정 전에는 유저들에게 '참가 미확정'으로 표시됩니다.`
        }
      </p>
      
      <div className="flex mt-6">
        <PostButtons
          {...{postValues, setPostValues}}
        />
        
      </div>
    
    </>
  )
}

export default PublishSetting