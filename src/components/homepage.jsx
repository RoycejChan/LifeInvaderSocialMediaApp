import React, { useState } from "react"

// RENDERES ALL 3 components
import SideBar from './sidebar/sidebar'
import MainFeed from "./mainfeed/mainfeed"
import UsersBar from "./usersbar/usersbar"
import "../index.css"

const Homepage = () => {


  return (
    <div className="homepage">
        <SideBar/>
        <MainFeed/>
        <UsersBar />
    </div>
    )
}

export default Homepage