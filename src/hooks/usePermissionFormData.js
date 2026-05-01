import { useMemo } from "react";
import { useTenantDomain } from "./useTenantDomain";
import { useGetAllUserQuery } from "../redux/api/userApi";
import { useGetAllPagesQuery } from "../redux/api/pageApi";
import { useGetAllRolesQuery } from "../redux/api/roleApi";

export const usePermissionFormData = () => {
  const { tenantDomain } = useTenantDomain();
  const { data: userData, isLoading: userLoading } = useGetAllUserQuery({
    tenantDomain,
  });
  const { data: pageData, isLoading: pageLoading } = useGetAllPagesQuery({
    tenantDomain,
  });
  const { data: roleData, isLoading: roleLoading } = useGetAllRolesQuery({
    tenantDomain,
  });


  const pageOptions = useMemo(() => {
    if (!pageData?.data) return [];
    return pageData.data.map((page) => ({
      label: page.name,
      value: page._id,
    }));
  }, [pageData?.data]);

  const userOptions = useMemo(() => {
    if (!userData?.data) return [];
    return userData.data.map((user) => ({
      label: user.name,
      value: user._id,
    }));
  }, [userData?.data]);
  const roleOptions = useMemo(() => {
    if (!roleData?.data) return [];
    return roleData.data.map((user) => ({
      label: user.name,
      value: user._id,
    }));
  }, [roleData?.data]);




  return {
    tenantDomain,
    userOptions,
    pageOptions,
    userLoading,
    pageLoading,
    roleLoading,
    roleData,
    roleOptions,
    pageData,
    userData
  };
};
