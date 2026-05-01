import { useGetUserDetailsForJobCardQuery } from "../redux/api/jobCard";

const useUserDetails = (tenantDomain, id, userType) => {
  const { data: userDetails, isLoading: userDetailsLoading } =
    useGetUserDetailsForJobCardQuery({
      tenantDomain,
      id,
      userType,
    });

  return { userDetails, userDetailsLoading };
};

export default useUserDetails;