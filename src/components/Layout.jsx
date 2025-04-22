import React from 'react'
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';


const Layout = () => {

  return <>
    <Sidebar/>
    <Outlet></Outlet>
  </>
}

export default Layout