import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { TextField, Switch, Grid2 } from '@mui/material';

const DateTimePicker = ({
  postValues, setPostValues,
  type, value, text
}) => {

  return(
    <>
      <Grid2 container rowSpacing={2}>
        <Grid2 size={{xs: 12, md:3}} className="flex items-center">
          <Switch
            checked={postValues[type]}
            onChange={(e) => setPostValues(
              prev => ({...prev, [type]: e.target.checked}))}
            size="small"
          />
          <p>{text} {postValues[type] ? "있음" : "없음"}</p>
        </Grid2>
        <Grid2 size={{xs:12, md:9}}>
          {postValues[type] && 
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                label={`${text}을 선택해주세요.`}
                value={postValues[value]} 
                onChange={(e)=>setPostValues({...postValues, [value]: e})}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          }
        </Grid2>
      </Grid2>
    </>
)
}

export default DateTimePicker