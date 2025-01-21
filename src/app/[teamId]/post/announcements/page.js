'use client'

import { Button, FormControl, Grid2, InputLabel, MenuItem, Select } from "@mui/material"
import Header from "../../components/Header"
import Title from "../../components/Title"
import MuiTextField from "@/components/mui/MuiTextField"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import ProgramThumbnail from "../programs/components/ProgramThumbnail"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { showAlert } from "@/utils/showAlert"


const filterSelect = [
  {name:"전체"},
  {name:"게재중"},
  {name:"미게재"},
]

const Announcements = () => {
  const {teamId} = useParams()
  const router = useRouter()
  const [filterType, setFilterType] = useState("전체")
  const [searchInput, setSearchInput] = useState("")
  
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])

  const [triggerReload, setTriggerReload] = useState(true)

  useEffect(()=> {
    const fetchData = async () => {
      try{
        const {data, error} = await supabase
          .from("posts")
          .select()
          .eq("program_team_id", teamId)
          .eq("type", "announcement")
          .order("program_saved_at", {ascending: false})

        if(error) throw error
        console.log(data)
        setAnnouncements(data)
        setFilteredAnnouncements(data)
      }catch(e){
        showAlert(e)
      }
    }

    fetchData()
  },[triggerReload])


  const isSearchInputIncluded = (announcement) => {
    if(searchInput==="") return true
    if(announcement.title.includes(searchInput)||announcement.tags.includes(searchInput))
      return true
    else return false
  }

  useEffect(()=> {
    const fileteredList = announcements.map(announcement => {
      if(filterType==="전체")
        if(isSearchInputIncluded(announcement))
          return announcement

      if(filterType==="게재중")
        if(announcement.program_condition==="published")
          if(isSearchInputIncluded(announcement))
            return announcement

      if(filterType==="미게재")
        if(announcement.program_condition==="unpublished")
          if(isSearchInputIncluded(announcement))
            return announcement
    }).filter(Boolean)
    setFilteredAnnouncements(fileteredList)
  },[filterType, searchInput])

  return(
    <>
      <Header title="공지사항 관리" />

      <div className="p-5">
        <Title
          title="공지사항 목록"
          text="공지사항을 편집하고 관리하실 수 있습니다."
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
            onClick={()=>router.push("announcements/new")}
          >
            + 새 공지사항
          </Button>
        </div>
        

        <Grid2 container rowSpacing={1} columnSpacing={1} sx={{mt:3}}>
          {
            filteredAnnouncements.map((item, index) => {
              return(
                <Grid2 size={{xs:12, md:4, lg:3}} key={index}>
                  <ProgramThumbnail data={item}
                   reloadPage={()=>setTriggerReload(prev => !prev)}
                   type="announcements"  
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

export default Announcements