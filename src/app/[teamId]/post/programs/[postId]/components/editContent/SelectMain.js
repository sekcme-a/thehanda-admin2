'use client'

import { Checkbox, Grid2 } from "@mui/material"




const SelectMain = ({postValues, setPostValues}) => {

  const onMainChange = (e) => {
    setPostValues(prevValues => (
      {...prevValues, isMain: e.target.checked}))
  }
  const onCommonChange = (e) => {
    setPostValues(prevValues => (
      {...prevValues, isMain: !e.target.checked}))
  }

  return(
    <Grid2 container rowSpacing={1}>
      <Grid2 size={{xs:12,md:1}} 
        sx={{
          display:"flex", 
          alignItems:"center"
        }}
      >
        <h3 className="font-bold">등급</h3>
      </Grid2>
      <Grid2 size={{xs:12, md:11}}>
        <div className="flex">
          <div className="flex items-center mr-4">
            <Checkbox
              size="small"
              sx={{pr:1}}
              onChange={onMainChange}
              checked={postValues.isMain}
            />
            <p>메인 프로그램</p>
          </div>
          <div className="flex items-center mr-4">
            <Checkbox
              size="small"
              sx={{pr:1}}
              onChange={onCommonChange}
              checked={!postValues.isMain}
            />
            <p>일반 프로그램</p>
          </div>
        </div>
      </Grid2>
      <Grid2 size={{xs:2, md: 1}}>
        <h3 className="font-bold">상태</h3>
      </Grid2>
      <Grid2 size={{xs:10, md:11}}>
        <p>
          {postValues.condition==="unpublished" ? 
            "미게재" : "게재중"
          }
        </p>
      </Grid2>
    </Grid2>

  )
}

export default SelectMain