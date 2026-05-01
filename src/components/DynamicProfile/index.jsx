/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppOptions } from "../../hooks/useAppOptions";
import Loading from "../Loading/Loading";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useGetSingleCustomerQuery } from "../../redux/api/customerApi";
import { useGetSingleShowRoomQuery } from "../../redux/api/showRoomApi";
import { useGetSingleCompanyQuery } from "../../redux/api/companyApi";
import { PROFILE_CONFIG } from "./ProfileConfig";
import ErrorState from "./ErrorState";
import ProfileTabsSection from "./ProfileTabSection";
import ProfileHeader from "./ProfileHeader";
import "../../../src/pages/Customer/Customer.css";

const QUERY_HOOKS = {
  useGetSingleCustomerQuery,
  useGetSingleShowRoomQuery,
  useGetSingleCompanyQuery,
};

const DynamicProfile = ({ profileType = "customer" }) => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const config = PROFILE_CONFIG[profileType];
  if (!config) {
    throw new Error(`Invalid profile type: ${profileType}`);
  }

  const useQueryHook = QUERY_HOOKS[config.queryHook];
  const {
    data: profileData,
    isLoading,
    error: profileError,
  } = useQueryHook({ id, tenantDomain });

  const { data: companyProfileData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  // Tab state management
  const [value, setValue] = useState(() => {
    const savedTab = localStorage.getItem(`${config.localStorageKey}-${id}`);
    return savedTab !== null ? Number.parseInt(savedTab, 10) : 0;
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem(
      `${config.localStorageKey}-${id}`,
      newValue.toString(),
    );
  };

  useEffect(() => {
    localStorage.setItem(`${config.localStorageKey}-${id}`, value.toString());
  }, [value, id, config.localStorageKey]);

  // Loading and error states
  if (isLoading) return <Loading />;
  if (profileError) return <ErrorState />;

  return (
    <div>
      <ProfileHeader
        profileType={profileType}
        profileData={profileData}
        config={config}
      />

      <ProfileTabsSection
        value={value}
        handleChange={handleChange}
        config={config}
        profileData={profileData}
        companyProfileData={companyProfileData}
        tenantDomain={tenantDomain}
        performActionWithPermission={performActionWithPermission}
        id={id}
        profileType={profileType}
      />
    </div>
  );
};

export default DynamicProfile;
