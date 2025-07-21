import React from "react";
import "./Sidebar.css";
import { useState } from "react";
import { SidebarData } from "../Data/Data";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  return (
    <div className="sidebar">
      {/* {logo} */}
      <div className="logo">
        <span>
          JP F<span>OO</span>DS
        </span>
      </div>
      {/* {menu} */}
      <div className="menu">
        {SidebarData.map((item, index) => {
          return (
            <NavLink
              to={item.path}
              className={
                selected === index
                  ? "menuItem active no-link-style"
                  : "menuItem no-link-style"
              }
              key={index}
              onClick={() => setSelected(index)}
            >
              <item.icon className="icon" />
              <span>{item.heading}</span>
            </NavLink>
          );
        })}
        <div className="menuItem">
          <UilSignOutAlt className="icon" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
