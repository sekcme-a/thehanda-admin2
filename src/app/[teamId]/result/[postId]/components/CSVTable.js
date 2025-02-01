'use client'

import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useState } from "react"

import { CSVDownload, CSVLink } from "react-csv";

import ImportExportIcon from '@mui/icons-material/ImportExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Router } from "mdi-material-ui";
import { useParams, useRouter } from "next/navigation";


const CSVTable = ({
  title, header, data, checkedList, setCheckedList
}) => {
  const {router} = useRouter()
  const {teamId, postId} = useParams()
  
  const [filter, setFilter] = useState("all")

  const [filteredList, setFilteredList] = useState(data)

  const [isAllCheck, setIsAllCheck] = useState(false)

  const handleIsAllCheckChange = (e) => {
    setIsAllCheck(e.target.checked)
    if(e.target.checked){
        const idList = filteredList.map((item) => {
            if(!item.deleted) return item.id
        }).filter(Boolean)
        setCheckedList(idList)
    } else {
        setCheckedList([])
    }
  }
  const onCheckChange = (e,item) => {
    if(e.target.checked && !checkedList.includes(item.id)){
        setCheckedList(prevCheckedList => ([...prevCheckedList, item.id]))
    } else if(!e.target.checked){
        const updatedList = checkedList.filter(checkedItem => checkedItem !== item.id);
        setCheckedList(updatedList);
    }
  }



  const onFileDownloadClick = () => {

  }

  return(
    <>
      <div className="flex items-center flex-wrap">
        <FormControl
          size="small"
          style={{minWidth: "150px"}}
          sx={{mr: 2, mt:1}}
        >
          <InputLabel id="simple-select-label" size='small'>필터</InputLabel>
          <Select
          value={filter}
          label="제목"
          size='small'
          onChange={(e) => setFilter(e.target.value)}
          >
              <MenuItem value="all" size='small'>전체</MenuItem>
              <MenuItem value="confirmedOnly" size='small'>신청 승인만</MenuItem>
              <MenuItem value="unconfirmedOnly" size='small'>참여 미승인만</MenuItem>
              <MenuItem value="participatedOnly" size='small'>참여한 사용자만</MenuItem>
              <MenuItem value="unparticipatedOnly" size='small'>불참 사용자만</MenuItem>
          </Select>
        </FormControl>
        <div>
        <Button
          variant="contained"
          size="small"
          style={{backgroundColor:"rgb(0, 98, 196)" }} 
          sx={{mr: 2, mt:1}}
        >
          <ImportExportIcon style={{fontSize:"20px", marginRight:"4px"}}/>
          <CSVLink
            headers={header} 
            data={filteredList} 
            filename={`${title}.csv`}
            target="_blank"
            style={{color:"white"}}
          >
              엑셀로 추출
          </CSVLink>
        </Button>
        </div>
      </div>

      <div 
        className=" max-w-[80vw] 
          overflow-x-scroll 
          overflow-y-scroll rounded-[5px] 
          border border-black mt-3"
      >
        <table
          className="
            border border-[#a39485]
            shadow-md rounded-md
            w-max border-collapse overflow-hidden
          "
        >
          <thead className="font-bold  text-white bg-[#73685d]">
            <tr className="cursor-pointer">
              <th className="text-left pl-4 pr-4 align-middle">
                <Checkbox
                  checked={isAllCheck}
                  onChange={handleIsAllCheckChange}
                  style={{
                      color: isAllCheck ? 'white' : 'initial', // check color
                      '&.MuiCheckboxRoot': {
                        backgroundColor: isAllCheck ? 'black' : 'initial', // checkbox background color
                        borderColor: isAllCheck ? 'white' : 'initial', // checkbox border color
                      },
                    }}
                />
              </th>

              {header?.map((item, index)=>{
                return(
                  <th key={index} className="text-left pl-4 pr-4 align-middle">
                      {item.label}
                  </th>
                )
              })}
            </tr>
          </thead>


          <tbody>
            {
              filteredList && filteredList.map((item, index) => {
                return(
                  <tr key={index}>
                    <td className="p-4 align-middle">
                      <Checkbox
                        checked = {checkedList.includes(item.id)}
                        onChange = {(event) => onCheckChange(event, item)}
                        disabled = {item.deleted}
                      />
                    </td>
                    {
                      header.map((head, index) => {
                        if(typeof item[head.key] === "string")
                          return(
                            <td 
                              key={index} 
                              onClick={()=>router.push(`/${teamId}/user/${item.id}`)}
                              style={
                                item[head.key]==="불참" ||item[head.key]==="미승인" ? 
                                {color:'red'} :
                                item[head.key]==="참여" ||item[head.key]==="승인" ? 
                                {color:'blue'} : {} }
                              className="p-4 align-middle"
                            >
                              {item[head.key]?.length>30 ? 
                              `${item[head.key].substr(0,30)}...` : item[head.key]}
                            </td>
                          )
                          else return(<td key={index}>-</td>)
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>

        </table>

      </div>



    </>
  )
}

export default CSVTable