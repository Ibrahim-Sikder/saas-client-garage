/* eslint-disable no-unused-vars */
import { Stack, styled } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useGetAllExpensesQuery } from "../../../redux/api/expense";
import { useGetAllIncomesQuery } from "../../../redux/api/income";
import { useGetAllDonationQuery } from "../../../redux/api/donationApi";
import Loading from "../../../components/Loading/Loading";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const BorderLinearProgress = styled(LinearProgress)(({ theme, color }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      color || (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
  },
}));

const ProfitOverView = () => {
  const tenantDomain = useTenantDomain();


  const { data: donationData, isLoading } =
    useGetAllDonationQuery();
  const {
    data: expenseData,
    error: expenseError,
    isLoading: expenseLoading,
  } = useGetAllExpensesQuery({
    tenantDomain,
    limit: 9000000000000,
    page: 1,
  });

  const {
    data: incomeData,
    error: incomeError,
    isLoading: incomeLoading,
  } = useGetAllIncomesQuery({
    tenantDomain,
    limit: 900000000000,
    page: 1,
  });

  if (expenseLoading || incomeLoading) return <Loading />;
  if (expenseError || incomeError)
    return <div>Error: {expenseError?.message || incomeError?.message}</div>;

  const totalIncome =
    incomeData?.data?.incomes?.reduce(
      (sum, income) => sum + income.amount,
      0
    ) || 0;

  const totalExpenses =
    expenseData?.data?.expenses?.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    ) || 0;

  const profit = totalIncome - totalExpenses;

  const totalDonation =
    donationData?.data?.reduce((sum, donate) => {
      return sum + parseFloat(donate.donation_amount);
    }, 0) || 0;

  const incomePercentage = Number(
    Math.round((totalIncome / (totalIncome + totalExpenses)) * 100)
  );

  const expensePercentage = Number(
    Math.round((totalExpenses / (totalIncome + totalExpenses)) * 100)
  );

  const profitPercentage = Number(
    Math.round((profit / (totalIncome + totalExpenses)) * 100)
  );

  const donationPercentage = Number(
    Math.round((totalDonation / (totalDonation + profit)) * 100)
  );

  const previousMonthEarnings = 5785;
  const previousMonthExpenses = 305785;

  if (isLoading) return <Loading />;

  return (
    <div className="profiteCardWrap lg:flex-nowrap flex-wrap flex items-center justify-between sectionMargin gap-5">
      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Earnings</b>
          <small className="text-[#55CE63]">+{incomePercentage}%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳{totalIncome}</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress
              variant="determinate"
              value={incomePercentage}
            />
          </Stack>
          <small className="block">
            Previous month <b className="text-[#]">৳ {previousMonthEarnings}</b>
          </small>
        </div>
      </div>

      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Expense</b>
          <small className="text-[#55CE63]">+{expensePercentage}%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳{totalExpenses}</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress
              variant="determinate"
              value={expensePercentage}
            />
          </Stack>
          <small className="block">
            Previous month <b className="text-[#]">৳ {previousMonthExpenses}</b>
          </small>
        </div>
      </div>

      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Profit</b>
          <small className="text-[#55CE63]">+{profitPercentage}%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳{profit}</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress
              variant="determinate"
              value={profitPercentage}
            />
          </Stack>
          <small className="block">
            Previous month{" "}
            <b className="text-[#]">৳ {profit - previousMonthExpenses}</b>
          </small>
        </div>
      </div>
      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Donations</b>
          <small className="text-[#55CE63]">+{donationPercentage}%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳{totalDonation}</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress
              variant="determinate"
              value={donationPercentage}
            />
          </Stack>
          <small className="block">
            Previous month <b className="text-[#]">৳ 305785</b>
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProfitOverView;
