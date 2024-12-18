'use client'

import React, { useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Drawer, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore, Menu } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { useParams, useRouter } from 'next/navigation';

const NavBar = () => {
  const router = useRouter()
  const {teamId} = useParams()
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
      {/* 팀 관리 */}
      <ListItemButton onClick={() => handleItemClick(1)}>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary="팀 관리" sx={{pr:4}}/>
        {openedItem === 1 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openedItem === 1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4, pr: 4 }} onClick={() => onClick('team/profile')}>
            <ListItemIcon>
              <AccountBoxOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="팀 프로필" />
          </ListItemButton>

          <ListItemButton sx={{ pl: 4, pr: 4 }} onClick={() => onClick('team/manage')}>
            <ListItemIcon>
              <Diversity3Icon />
            </ListItemIcon>
            <ListItemText primary="구성원 관리" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* 대쉬보드 */}
      <ListItemButton onClick={() => onClick('dashboard')}>
        <ListItemText primary="대쉬보드" />
      </ListItemButton>
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
