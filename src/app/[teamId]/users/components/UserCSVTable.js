'use client'

import { Button, Checkbox, FormControl, Input, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material"
import { useState } from "react"

import { CSVDownload, CSVLink } from "react-csv";

import ImportExportIcon from '@mui/icons-material/ImportExport';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Router } from "mdi-material-ui";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";


const UserCSVTable = ({
  title, header, data, checkedList, setCheckedList
}) => {
  const router = useRouter()
  const {teamId, postId} = useParams()
  
  const [filter, setFilter] = useState("all")

  const [filteredList, setFilteredList] = useState(data)

  const [isAllCheck, setIsAllCheck] = useState(false)

  const [searchInput, setSearchInput] = useState("")

  

  const handleIsAllCheckChange = (e) => {
    setIsAllCheck(e.target.checked)
    if(e.target.checked){
        const idList = filteredList.map((item) => {
            if(!item.deleted) return item.uid
        }).filter(Boolean)
        setCheckedList(idList)
    } else {
        setCheckedList([])
    }
  }
  const onCheckChange = (e,item) => {
    console.log(item)
    if(e.target.checked && !checkedList.includes(item.uid)){
        setCheckedList(prevCheckedList => ([...prevCheckedList, item.uid]))
    } else if(!e.target.checked){
        const updatedList = checkedList.filter(checkedItem => checkedItem !== item.uid);
        setCheckedList(updatedList);
    }
  }


  const handleSearchInput = (value) => {
    setSearchInput(value)
    if(value===""){
      setFilteredList(data)
    } else {
      let searchResults = [];
      for (let i = 0; i < data.length; i++) {
        // 객체의 각 키를 순회하면서 검색 수행
        let dataKeys = Object.keys(data[i]);
        
        // 각 키에서 검색 수행
        for (let j = 0; j < dataKeys.length; j++) {
            // 현재 키의 값을 소문자로 변환하여 검색어와 비교
            if (data[i][dataKeys[j]]?.toString()?.toLowerCase()?.includes(value.toLowerCase())) {
                // 검색어를 포함하는 경우, 결과 배열에 추가하고 루프 종료
                searchResults.push(data[i]);
                break;
            }
        }
      }
      setFilteredList(searchResults)
    }
  }


  const onFileDownloadClick = () => {

  }

  return(
    <>
      <div className="flex items-center flex-wrap">
        <div>
        <FormControl sx={{ m: 1 }} letiant="standard">
          <Input
            id="standard-adornment-amount"
            value={searchInput}
            onChange={(e)=>handleSearchInput(e.target.value)}
            startAdornment={<InputAdornment position="start"><SearchRoundedIcon /></InputAdornment>}
          />
        </FormControl>
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
        className=" max-w-[80vw] w-fit
          overflow-x-scroll 
          overflow-y-scroll rounded-[5px] 
          border border-black mt-3"
      >
        <table
          className="
            border border-[#a39485]
            shadow-md rounded-md
            border-collapse overflow-hidden
          "
        >
          <thead className="font-bold  text-white bg-[#73685d]">
            <tr className="cursor-pointer">
              <th className="text-left px-2 align-middle">
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
                  <th key={index} className="text-left px-2 align-middle">
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
                    <td className="py-1 px-2 align-middle">
                      <Checkbox
                        checked = {checkedList.includes(item.uid)}
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
                              onClick={()=>router.push(`/${teamId}/users/${item.uid}`)}
                              style={
                                item[head.key]==="불참" ||item[head.key]==="미승인" ? 
                                {color:'red'} :
                                item[head.key]==="참여" ||item[head.key]==="승인" ? 
                                {color:'blue'} : 
                                item[head.key]==="거절" ? 
                                {color: 'gray'}
                                : {} }
                              className="py-1 px-2 align-middle cursor-pointer"
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
        {filteredList.length===0 && 
          <p className="my-3 ml-5 ">신청 데이터가 없습니다.</p>
        }
      </div>



    </>
  )
}

export default UserCSVTable