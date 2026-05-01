import { useGetAllCompaniesQuery } from "../redux/api/companyApi";
import { useGetAllCustomersQuery } from "../redux/api/customerApi";
import { useGetAllJobCardsQuery, useGetUserDetailsForJobCardQuery } from "../redux/api/jobCard";
import { useGetAllShowRoomsQuery } from "../redux/api/showRoomApi";
import { useTenantDomain } from "./useTenantDomain";

export const useJobCardData = (userId, newId, currentPage) => {
  const { tenantDomain } = useTenantDomain();
  const limit = 10;
  const jobCardLimit = 500000;

  // API calls
  const { data: customerData, isLoading: customerLoading } = useGetAllCustomersQuery({
    tenantDomain,
    limit: jobCardLimit,
    page: currentPage,
  });

  const { data: companyData, isLoading: companyLoading } = useGetAllCompaniesQuery({
    tenantDomain,
    limit: jobCardLimit,
    page: currentPage,
  });

  const { data: showroomData, isLoading: showroomLoading } = useGetAllShowRoomsQuery({
    tenantDomain,
    limit: jobCardLimit,
    page: currentPage,
  });

  const { data: userDetails, isLoading: userDetailsLoading } = useGetUserDetailsForJobCardQuery({
    tenantDomain,
    id: userId,
    userType: newId,
  });

  const { data: allJobCards, isLoading: jobCardLoading } = useGetAllJobCardsQuery({
    tenantDomain,
    limit,
    page: currentPage,
  });

  // Calculate job number
  const lastJobCard = allJobCards?.data?.jobCards
    ? [...allJobCards.data.jobCards].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0]
    : null;

  const jobNumber = (Number(lastJobCard?.job_no) && !isNaN(Number(lastJobCard.job_no))
    ? Number(lastJobCard.job_no)
    : 0) + 1;

  const paddedJobNumber = jobNumber?.toString().padStart(4, "0");

  return {
    customerData,
    companyData,
    showroomData,
    userDetails,
    allJobCards,
    paddedJobNumber,
    loading: customerLoading || companyLoading || showroomLoading || jobCardLoading || userDetailsLoading
  };
};