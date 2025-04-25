import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Sidebar>
      <Outlet /> {/* Pass Outlet as a child to Sidebar */}
    </Sidebar>
  );
};

export default Layout;