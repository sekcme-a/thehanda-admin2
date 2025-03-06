'use client'

import { Button, FormControl, Grid2, InputLabel, MenuItem, Select } from "@mui/material"
import Header from "../../components/Header"
import Title from "../../components/Title"
import { useParams } from "next/navigation"
import { useState } from "react"
import MuiTextField from "@/components/mui/MuiTextField"
import { useRouter } from "next/navigation"
import ProgramThumbnail from "../programs/components/ProgramThumbnail"
import { useEffect } from "react"
import { fetchStoryList } from "./storysService"
import { showAlert } from "@/utils/showAlert"



const filterSelect = [
  {name:"전체"},
  {name:"게재중"},
  {name:"미게재"},
]
const Storys = () => {
  const {teamId} = useParams()
  const router = useRouter()
  const [filterType, setFilterType] = useState("전체")
  const [searchInput, setSearchInput] = useState("")
  
  const [storys, setStorys] = useState([])
  const [filteredStorys, setFilteredStorys] = useState([])

  const [triggerReload, setTriggerReload] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try{
        const list = await fetchStoryList(teamId)
        setStorys(list)
        setFilteredStorys(list)
      }catch(e){
        showAlert(e)
      }
    }

    fetchData()
  },[triggerReload])



  const isSearchInputIncluded = (story) => {
    if(searchInput==="") return true
    if(story.title.includes(searchInput)||story.tags.includes(searchInput))
      return true
    else return false
  }

  useEffect(()=> {
    const fileteredList = storys.map(story => {
      if(filterType==="전체")
        if(isSearchInputIncluded(story))
          return story

      if(filterType==="게재중")
        if(story.program_condition==="published")
          if(isSearchInputIncluded(story))
            return story

      if(filterType==="미게재")
        if(story.program_condition==="unpublished")
          if(isSearchInputIncluded(story))
            return story
    }).filter(Boolean)
    setFilteredStorys(fileteredList)
  },[filterType, searchInput])

  return(
    <>
      <Header title="스토리 관리" />

      <div className="p-5">
        <Title
          title="스토리 목록"
          text="스토리를 편집하고 관리하실 수 있습니다."
        />

        <div className="flex items-center flex-wrap">
          <FormControl sx={{width:"200px", marginRight:"25px", marginTop: 1}} size="small">
            <InputLabel id="simple-select-label">필터링</InputLabel>
            <Select
              value={filterType}
              label="유형 선택"
              onChange={(e)=>setFilterType(e.target.value)}
            >
              {
                filterSelect.map((item, index) => {
                  return(
                    <MenuItem value={item.name} key={index} name={item.name}>{item.name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>

          <MuiTextField
            template="search"
            outlined
            label="키워드 검색"
            placeholder="키워드를 통해 검색됩니다."
            value={searchInput}
            setValue={setSearchInput}
            sx={{mr:"10px"}}
            secondary
            onEnterPress={()=>onSearchClick(searchInput)}
          />

          <Button
            variant="contained"
            size="small"
            sx={{fontWeight:"bold"}}
            onClick={()=>router.push("storys/new")}
          >
            + 새 스토리
          </Button>
        </div>
        

        <Grid2 container rowSpacing={1} columnSpacing={1} sx={{mt:3}}>
          {
            filteredStorys.map((item, index) => {
              return(
                <Grid2 size={{xs:12, md:4, lg:3}} key={index}>
                  <ProgramThumbnail data={item}
                   reloadPage={()=>setTriggerReload(prev => !prev)}
                   type="storys"  
                  />
                </Grid2>
              )
            })
          }
        </Grid2>


      </div>
    
    </>
  )
}

export default Storys