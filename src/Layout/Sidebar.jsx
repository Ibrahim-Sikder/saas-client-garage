/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Layout.css";
import { useDispatch } from "react-redux";
import { useTenantLogoutMutation } from "../redux/api/authApi";
import { logout } from "../redux/feature/authSlice";
import toast from "react-hot-toast";
import { getMenuItems } from "./menuItems";
import { SIDEBAR_STYLES } from "./sidebarStyles";
import SingleMenuItem from "./SingleMenuItem";
import AccordionMenuItem from "./AccordionMenuItem";
import LeftSideBar from "../components/Appbar/LeftSideBar";

const Sidebar = ({ toggle }) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const [tenantLogout] = useTenantLogoutMutation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleLogout = async () => {
    try {
      const res = await tenantLogout().unwrap();
      dispatch(logout());
      if (res.success) {
        toast.success("Logged out successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  const menuItems = getMenuItems(user, handleLogout);

  return (
    <aside className={SIDEBAR_STYLES.container}>
      <div className={SIDEBAR_STYLES.sidebar(toggle)}>
        {menuItems.map((item) =>
          item.type === "single" ? (
            <SingleMenuItem key={item.id} item={item} />
          ) : (
            <AccordionMenuItem
              key={item.id}
              item={item}
              expanded={expanded}
              handleChange={handleChange}
            />
          )
        )}
      </div>
      <div className={SIDEBAR_STYLES.rightSidebar(toggle)}>
        <LeftSideBar />
      </div>
    </aside>
  );
};

export default Sidebar;
