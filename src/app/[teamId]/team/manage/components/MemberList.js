'use client'

// ** React Imports
import { useEffect, useCallback, useState } from 'react'

// ** Next Images
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box';
import { DataGrid,GridToolbarQuickFilter  } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { Button, Grid2 } from '@mui/material'
import { useAuth } from '@/provider/AuthProvider'
import { showAlert } from '@/utils/showAlert'
import { changeDbRole, deleteAuth } from '../service/teamManage'
import { useParams } from 'next/navigation'
// ** Icons Imports

const MemberList = ({data}) => {
  const {role, session} = useAuth()
  const {teamId} = useParams()



const COLUMNS = [
  {
    flex: 0.09,
    minWidth: 180,
    field: 'fullName',
    headerName: '이름',
    renderCell: ({ row }) => {
      const { display_name, image } = row
      return (
        <div className="flex items-center cursor-pointer">
          <Avatar src={image} sx={{width: 30, height: 30}}/>
          <p className='ml-3'>{display_name}</p>
        </div>
      )
    }
  },
  {
    flex: 0.18,
    minWidth: 180,
    field: 'email',
    headerName: '이메일',
    renderCell: ({ row }) => {
      const { email } = row
      return (
        <p variant='body2' noWrap>
          {email ?? "-"}
        </p>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    headerName: "권한",
    field: "roles",
    renderCell: ({row}) => {
      const roleName = row.role ==="admin" ? 
      "어드민" : 
      row.role==="manager" ? 
      "매니저": "멤버"
      return(
        <p>
          {roleName}
        </p>
      )
    }
  },
  {
    flex: 0.25,
    minWidth:300,
    headerName:"관리", 
    renderCell: ({row}) => {
      return(
        <>
          <Button
            variant='contained'
            onClick={()=>onDeleteAuthorityClick(row.user_id)}
            size="small"
            disabled={row.role === "admin" || role!=="admin" }
          >
            권한 해제
          </Button>
          <Button
            variant='contained'
            onClick={()=>onRoleUpClick(row)}
            sx={{ml:3}}
            color="success"
            size="small"
            disabled={row.role==="admin" || role==='member'}
          >
            승격
          </Button>
          <Button
            variant='contained'
            onClick={()=>onRoleDownClick(row)}
            sx={{ml:3}}
            color='error'
            size="small"
            disabled={row.role==="member" || role==="member"}
          >
            강등
          </Button>
        </>
      )
    }
  }
]

  const onRoleUpClick = async (selectedRow) => {
    try{
      if(selectedRow.role==="member"){
        await changeDbRole(teamId, selectedRow.user_id, "manager")
        changeRole(selectedRow, "manager")
      }
      if(selectedRow.role==="manager"){
        await changeDbRole(teamId, selectedRow.user_id, "admin")
        changeRole(selectedRow, "admin")
      }
      alert("권한이 변경되었습니다.")
    }catch(error) {
      showAlert(error)
    }
  }
  const onRoleDownClick = async (selectedRow) => {
    try{
      if(selectedRow.role==="admin"){
        await changeDbRole(teamId, selectedRow.user_id, "manager")
        changeRole(selectedRow, "manager")
      }
      if(selectedRow.role==="manager"){
        await changeDbRole(teamId, selectedRow.user_id, "member")
        changeRole(selectedRow, "member")
      }
      alert("권한이 변경되었습니다.")
    }catch(error) {
      showAlert(error)
    }
  }
  const changeRole = (selectedRow, newRole) => {
    const list = members.map(item => {
      if(item.user_id === selectedRow.user_id)
        return{...item, role: newRole}
      else return item
    })
    setMembers(list)
  }


  const onDeleteAuthorityClick = async (userId) => {
    try{
      await deleteAuth(teamId, userId)
      const list = members.filter(item => item.user_id !== userId);
      setMembers(list)
      alert("권한을 해제했습니다.")
    } catch (error) {
      showAlert(error)
    }
  }

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [members, setMembers] = useState([])

  function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        pt: 2,
        pl: 2,
        pb:1,
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
}

  useEffect(()=> {
    if(data?.length>0){
      const list = data.map((item, index) => (
        {
          id: index,
          display_name: item.display_name,
          email: item.email,
          image: item.image ?? "/images/default_profile.png",
          role: item.role,
          user_id: item.uid
        }
      ))
      setMembers(list)
    }
  },[data])

  
  return (
      <Grid2 container>
        <Grid2 size={11.9}>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rows={members}
            columns={COLUMNS}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            // components={{ Toolbar: QuickSearchToolbar }}
        // componentsProps={{
        //   toolbar: {
        //     showQuickFilter: true,
        //     quickFilterProps: { debounceMs: 500 },
        //   },
        // }}
          />
        </Card>
        </Grid2>
      </Grid2>
  )
}

export default MemberList
