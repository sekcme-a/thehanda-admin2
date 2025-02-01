'use client'

import React, { useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Drawer, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore, Menu } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useData } from '@/provider/DataProvider';


import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import EditIcon from '@mui/icons-material/Edit';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';


const NavBar = () => {
  const router = useRouter()
  const {teamId} = useParams()
  const {myTeam} = useData()
  const [openedItem, setOpenedItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (item) => {
    setOpenedItem((prev) => (prev === item ? null : item));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onClick = (path) => {
    router.push(`/${teamId}/${path}`)
  };

  const drawerContent = (
    <List>
      <div className="flex items-center px-5">
        {myTeam.image &&
          <img
            width={50} height={50}
            src={myTeam?.image}
            alt="프로필 사진"
          />
        }
        <div className='ml-3'>
          <p className='font-bold text-purple-950 text-sm'>더한다 +</p>
          <p className='font-bold leading-none text-sm'>{myTeam?.name}</p>
        </div>
      </div>

            {/* 대쉬보드 */}
      <ListItemButton onClick={() => onClick('dashboard')}>
        <ListItemIcon>
          <DashboardRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="대쉬보드" className="font-bold" />
      </ListItemButton>




      {/* 팀 관리 */}
      <ListItemButton onClick={() => handleItemClick(1)}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="팀 관리" sx={{pr:4}} className="font-bold"/>
        {openedItem === 1 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openedItem === 1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4, pr: 4 }} onClick={() => onClick('team/profile')}>
            <ListItemIcon>
              <AccountBoxOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="팀 프로필" className="font-bold"/>
          </ListItemButton>

          <ListItemButton sx={{ pl: 4, pr: 4 }} onClick={() => onClick('team/manage')}>
            <ListItemIcon>
              <Diversity3Icon />
            </ListItemIcon>
            <ListItemText primary="구성원 관리" className="font-bold" />
          </ListItemButton>
        </List>
      </Collapse>


       <ListItemButton onClick={()=>handleItemClick(2)}>
        <ListItemIcon>
          <PostAddOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="게시물 관리" />
        {openedItem===2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openedItem===2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("post/programs")}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="프로그램 관리" />
          </ListItemButton>
        </List>
        {/* <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("schedule/programSchedule")}>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="프로그램 스케쥴" />
          </ListItemButton>
        </List> */}
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("post/storys")}>
              <ListItemIcon>
                <AutoStoriesOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="스토리 관리" />
            </ListItemButton>
          </List>

          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>onClick("post/announcements")}>
              <ListItemIcon>
                <CampaignOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="공지사항 관리" />
            </ListItemButton>
          </List>

        </Collapse>

      
    </List>
  );

  return (
    <div className="flex">
      {/* PC Navbar */}
      <div className="
        hidden md:flex 
        bg-white border-r border-gray-200
       
        h-screen
      ">
        {drawerContent}
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden">
        <IconButton onClick={handleDrawerToggle}>
          <Menu />
        </IconButton>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </div>
    </div>
  );
};

export default NavBar;
