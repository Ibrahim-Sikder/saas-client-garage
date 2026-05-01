import { useGetAllJobCardsQuery } from "../redux/api/jobCard";

const useJobCardNumber = (tenantDomain, limit, page) => {
  const { data: allJobCards } = useGetAllJobCardsQuery({
    tenantDomain,
    limit,
    page,
  });

  const lastJobCard = allJobCards?.data?.jobCards
    ? [...allJobCards.data.jobCards].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
    : null;

  const jobNumber =
    (Number(lastJobCard?.job_no) && !isNaN(Number(lastJobCard.job_no))
      ? Number(lastJobCard.job_no)
      : 0) + 1;

  return jobNumber?.toString().padStart(4, "0");
};

export default useJobCardNumber;