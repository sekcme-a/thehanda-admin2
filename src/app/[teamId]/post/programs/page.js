'use client'

import { Button, FormControl, Grid2, InputLabel, MenuItem, Select } from "@mui/material"
import Header from "../../components/Header"
import Title from "../../components/Title"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import MuiTextField from "@/components/mui/MuiTextField"
import { temp_fetchPostList } from "./service/getPosts"
import ProgramThumbnail from "./components/ProgramThumbnail"


const filterSelect = [
  {name:"전체"},
  {name:"게재중"},
  {name:"미게재"},
  {name:"예약게재"},
  {name:"접수중(미마감)"},
  {name:"마감됨"}
]
const Programs = () => {
  const {teamId} = useParams()
  const router = useRouter()
  const [filterType, setFilterType] = useState("전체")
  const [searchInput, setSearchInput] = useState("")
  const [programs, setPrograms] = useState([])
  const [filteredPrograms, setFilteredPrograms] = useState([])

  const [triggerReload, setTriggerReload] = useState(true)

  useEffect(()=> {
    const fetchData = async () => {
      try{
        const list = await temp_fetchPostList(teamId)
        setPrograms(list)
        setFilteredPrograms(list)
      }catch(e){
        alert("프로그램을 가져올 수 없습니다.")
      }
    }
    fetchData()
  },[triggerReload])


  const isSearchInputIncluded = (program) => {
    if(searchInput==="") return true
    if(program.title.includes(searchInput)||program.tags.includes(searchInput))
      return true
    else return false
  }

  useEffect(()=> {
    const filteredList = programs.map(program => {
      if(filterType==="전체") 
        if(isSearchInputIncluded(program))
          return program

      if(filterType==="게재중")
        if(program.program_condition==="published")
          if(isSearchInputIncluded(program))
            return program

      if(filterType==="미게재")
        if(program.program_condition==="unpublished")
          if(isSearchInputIncluded(program))
            return program

      if(filterType==="예약게재")
        if(
          program.program_post_data.hasReserve &&
          new Date(program.program_reserve_start_at) > new Date()
        )
          if(isSearchInputIncluded(program))
            return program

      if(filterType==="접수중(미마감)")
        if(
          program.program_condition==="published" 
          && 
          ( //프로그램이 신청중인지
            !program.program_apply_start_at
            || 
            new Date(program.program_apply_start_at) < new Date()
          )
          &&
          ( //프로그램 신청 데드라인이 안지났는지
            !program.deadline
            ||
            new Date(program.deadline) > new Date()
          )
        )
          if(isSearchInputIncluded(program))
            return program

      if(filterType==="마감됨")
        if(program.deadline && new Date(program.deadline) < new Date())
          if(isSearchInputIncluded(program))
            return program
    }).filter(Boolean)
    setFilteredPrograms(filteredList)
  },[filterType, searchInput])



  return(
    <>
      <Header
        title="프로그램 관리"
      />
      <div className="p-5">
        <Title
          title="프로그램 목록"
          text="프로그램을 편집하고 관리하실 수 있습니다."
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
            label="제목/태그 검색"
            placeholder="제목와 태그를 통해 검색됩니다."
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
            onClick={()=>router.push("programs/new")}
          >
            + 새 프로그램
          </Button>
        </div>
        
        <Grid2 container rowSpacing={1} columnSpacing={1} sx={{mt:3}}>
          {
            filteredPrograms.map((item, index) => {
              return(
                <Grid2 size={{xs:12, md:4, lg:3}} key={index}>
                  <ProgramThumbnail data={item} reloadPage={()=>setTriggerReload(prev => !prev)}/>
                </Grid2>
              )
            })
          }
        </Grid2>
      </div>
    </>
  )
}

export default Programs