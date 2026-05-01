/* eslint-disable react/prop-types */
import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { tabsStyles, tabStyles } from "../../utils/customStyle";
import ProfileTab from "./ProfileTab";

const ProfileTabsSection = ({
  value,
  handleChange,
  config,
  profileData,
  companyProfileData,
  tenantDomain,
  performActionWithPermission,
  id,
  profileType,
}) => {
  const getTabProps = (tab) => {
    const baseProps = {
      tenantDomain,
      performActionWithPermission,
      companyProfileData: {
        companyName: companyProfileData?.data?.companyName,
        address: companyProfileData?.data?.address,
        website: companyProfileData?.data?.website,
        phone: companyProfileData?.data?.phone,
        email: companyProfileData?.data?.email,
        logo: companyProfileData?.data?.logo?.[0],
        companyNameBN: companyProfileData?.data?.companyNameBN,
      },
      profileData,
      id,
      customerId: profileData?.data?.[config.idKey],
      user_type: profileData?.data?.user_type,
    };

    // Add specific props for payment tab
    if (tab.label === "Payment" && profileType === "company") {
      return baseProps;
    }

    return baseProps;
  };

  return (
    <div className="mt-32 text-black tabClass">
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="profile tabs"
          sx={tabsStyles}
          variant="scrollable"
          scrollButtons="auto"
        >
          {config.tabs.map((tab, index) => (
            <Tab key={index} sx={tabStyles} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {config.tabs.map((tab, index) => (
        <ProfileTab key={index} value={value} index={index}>
          {React.createElement(tab.component, getTabProps(tab, index))}
        </ProfileTab>
      ))}

      <div>
        <p className="my-5 text-center">
          © Copyright 2024 | Garage Master | All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default ProfileTabsSection;
