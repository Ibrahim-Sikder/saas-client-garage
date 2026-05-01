"use client";

/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";
import { IconButton } from "@mui/material";
import { MenuOpen } from "@mui/icons-material";
import "./Layout.css";

import TopSearchbar from "../components/TopSearchbar/TopSearchbar";
import UserProfile from "../components/UserProfile/UserProfile";
import Loading from "../components/Loading/Loading";
import { useGetAllMetaQuery } from "../redux/api/meta.api";
import { useTenantDomain } from "../hooks/useTenantDomain";
import { useCompanyProfileData } from "../hooks/useCompanyProfileData";

const AppBar = ({ toggle, navRef, toggleSideBar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
  const { companyProfileData } = useCompanyProfileData();

  if (isLoading) return <Loading />;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const Buttons = () => {
    const navButtons = [
      {
        label: "Visit Website",

        onClick: () => window.open("https://trustautosolution.com", "_blank"),
      },
      {
        label: "BD Shop",
      },
      {
        label: "Global Shop",
      },
    ];
    return (
      <div className="md:flex gap-2 space-y-3 md:space-y-0">
        {navButtons.map((btn) => (
          <button
            key={btn.label}
            className="px-3 lg:px-[3px] xl:px-3 py-2 lg:py-1 xl:py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl lg:rounded-lg xl:rounded-xl hover:bg-white/30 hover:scale-105 active:scale-95 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 lg:text-[13px]  xl:text-base lg:font-medium xl:font-medium"
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </div>
    );
  };

  const Calender = () => {
    return (
      <Link
        to="/dashboard/holiday"
        className="p-2 lg:p-1 xl:p-3 bg-white/20 rounded-xl lg:rounded-lg xl:rounded-xl border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300"
      >
        <FaCalendarDays className="text-white h-6 lg:h-4 xl:h-5 w-6 lg:w-4 xl:w-5" />
      </Link>
    );
  };

  // 🟢 Define reusable navigation buttons

  const SubscriptionChip = () => {
    if (!allMetaData?.data?.subscriptionInfo) return null;
    const { daysRemaining } = allMetaData.data.subscriptionInfo;

    const getChipColor = () => {
      if (daysRemaining <= 0) return "bg-red-500 border-red-300";
      if (daysRemaining < 15) return "bg-red-500 border-red-300";
      if (daysRemaining < 60) return "bg-orange-500 border-orange-300";
      return "bg-green-500 border-green-300";
    };

    return (
      <div className="relative group">
        <div
          className={`lg:px-1 xl:px-3 lg:py-1 xl:py-1.5 ${getChipColor()} text-white text-sm xl:font-semibold rounded-xl lg:rounded-lg xl:rounded-xl shadow-lg border`}
        >
          {daysRemaining > 0
            ? `${daysRemaining} Days Left`
            : "Subscription Expired"}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-16 bg-[#42A0D9] fixed z-10 flex items-center">
      <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-8 lg:px-2 xl:px-16 gap-2">
        {/* Left Sidebar Toggle */}
        <div
          className={`${toggle ? "activeToggle" : "navActive"}`}
          ref={navRef}
          onClick={toggleSideBar}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </div>

        {/* Company Name + Buttons */}
        <div className="flex items-center gap-2 md:gap-4 lg:gap-2 xl:gap-10">
          <Link to="/dashboard">
            <h3 className=" text-white font-semibold text-lg md:text-xl lg:text-[17px] xl:text-2xl truncate max-w-[205px] md:max-w-[230px] lg:max-w-[220px] xl:max-w-[240px] pl-8 md:pl-7 lg:pl-14 xl:pl-0 ">
              {companyProfileData?.companyNameBN ||
                companyProfileData?.companyName}
            </h3>
          </Link>

          {/* Show nav buttons on md+ instead of lg+ */}
          <div className="hidden lg:flex items-center gap-2 lg:gap-3">
            <Buttons />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Show Menu Icon only on small (<md) */}
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: "#fff",
              display: { xs: "flex", md: "none" },
              marginRight: "4px",
            }}
          >
            <MenuOpen sx={{ fontSize: "36px" }} />
          </IconButton>

          {/* Desktop Section */}
          <div className="hidden lg:flex items-center gap-4 lg:gap-2 xl:gap-4">
            <SubscriptionChip />
            <TopSearchbar />
            <Calender />
            <UserProfile tenantDomain={tenantDomain} />
          </div>
        </div>
      </div>

      {/* 🟢 Mobile Dropdown Menu */}
      <div
        className={`absolute top-16 left-0 w-full backdrop-blur-md bg-[#42A1DA] transition-all duration-500 overflow-hidden rounded-b-2xl shadow-2xl ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center pt-4 space-y-3">
          <TopSearchbar />
        </div>

        <div className="flex flex-col items-stretch gap-3 w-full max-w-[400px] mx-auto p-4">
          <Buttons />
        </div>

        <div className="flex items-center justify-center py-4 space-x-8">
          <Calender />
          <UserProfile tenantDomain={tenantDomain} />
        </div>
      </div>
    </div>
  );
};

export default AppBar;
