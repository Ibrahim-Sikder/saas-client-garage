import { useGetCompanyProfileQuery } from "../redux/api/companyProfile";
import { useTenantDomain } from "./useTenantDomain";

export const useCompanyProfileData = () => {
  const { tenantDomain } = useTenantDomain();

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useGetCompanyProfileQuery({ tenantDomain });

  const companyProfileData = profileData?.data
    ? {
        companyName: profileData.data.companyName,
        address: profileData.data.address,
        website: profileData.data.website,
        phone: profileData.data.phone,
        email: profileData.data.email,
        logo: profileData.data.logo?.[0] || null,
        companyNameBN: profileData.data.companyNameBN,
        description: profileData.data.description,
      }
    : null;

  return {
    companyProfileData,
    isLoading,
    isError,
    refetch,
  };
};
