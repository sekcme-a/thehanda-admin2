'use client'

import { CircularProgress, Grid2 } from "@mui/material"
import Header from "../components/Header"
import Title from "../components/Title"
import UserCountCard from "./components/UserCountCard"
import { useData } from "@/provider/DataProvider"
import UserList from "./components/UserList"
import { useEffect } from "react"
import { useState } from "react"


const Users = ()=> {
  const {myTeam, userList, userCount, fetchUserCount} = useData()
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    await fetchUserCount()
    setLoading(false)
  }

  return(
    <>
      <Header title="구성원 관리" />

      <div className="p-5">
        <Title
          title="사용자 현황"
          text="사단법인 미래로의 컨텐츠를 1회 이상 확인한 사용자 현황입니다."
        />
        {loading ? 
          <CircularProgress />
          :
          <Grid2 container spacing={1}>
            <Grid2 size={{xs: 12, sm: 4, md: 4}}>
              <UserCountCard
                small="Total users"
                medium={myTeam.name}
                large="사용자 수"
                count={userCount}
              />
            </Grid2>
          </Grid2>
        }

        <div className="h-10" />
        <Title
          title="사용자 목록"
          text="사단법인 미래로 사용자 목록입니다. 변경사항은 새로고침 시 표시됩니다."
        />

        <UserList />

      </div>
    </>
  )
}

export default Users