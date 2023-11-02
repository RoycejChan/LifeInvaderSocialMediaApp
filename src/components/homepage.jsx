import React from "react"


import SideBar from './sidebar/sidebar'
import MainFeed from "./mainfeed/mainfeed"
import UsersBar from "./usersbar/usersbar"
const Homepage = ({user}) => {
  return (
    <div className="homepage">
        <SideBar />
        <MainFeed user={user}/>
        <UsersBar />
    </div>
    )
}

export default Homepage