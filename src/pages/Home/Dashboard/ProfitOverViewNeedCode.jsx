import { Stack, styled } from "@mui/material";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useGetAllExpensesQuery } from "../../../redux/api/expense";

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
  const { data, error, isLoading } = useGetAllExpensesQuery({
    limit: 10,
    page: 1,
  });

  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="profiteCardWrap lg:flex-nowrap flex-wrap flex items-center justify-between sectionMargin">
      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Earnings</b>
          <small className="text-[#55CE63]">+35%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳46785</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress variant="determinate" value={50} />
          </Stack>
          <small className="block">
            Previous month <b className="text-[#]">৳ 5785</b>
          </small>
        </div>
      </div>

      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Expense</b>
          <small className="text-[#55CE63]">+35%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳465785</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress variant="determinate" value={50} />
          </Stack>
          <small className="block">
            Previous month <b className="text-[#]">৳ 305785</b>
          </small>
        </div>
      </div>
      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Profit</b>
          <small className="text-[#55CE63]">+35%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳465785</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress variant="determinate" value={50} />
          </Stack>
          <small className="block">
            Previous month <b className="text-[#]">৳ 305785</b>
          </small>
        </div>
      </div>
      <div className="profitCard ">
        <div className="flex items-center justify-between">
          <b>Donations</b>
          <small className="text-[#55CE63]">+35%</small>
        </div>

        <div className="space-y-2 mt-3">
          <b className="block ">৳465785</b>
          <Stack spacing={2} sx={{ flexGrow: 1, color: " red" }}>
            <BorderLinearProgress variant="determinate" value={50} />
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
