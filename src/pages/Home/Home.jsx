/* eslint-disable no-unused-vars */
import { Visibility, VisibilityOff, CalendarToday } from "@mui/icons-material";
import { Tooltip, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import {
  useAccountSummaryQuery,
  useGetAllMetaQuery,
} from "../../redux/api/meta.api";
import AllServices from "./Dashboard/AllServices";
import EmployeeStatistics from "./Dashboard/EmployeeStatistics";
import DashboardSummary from "./Dashboard/IncomeCard";
import ProjectOverView from "./Dashboard/ProjectOverView";
import RecentClient from "./Dashboard/RecentClient";
import RecentInvoice from "./Dashboard/RecentInvoice";
import RecentProject from "./Dashboard/RecentProject";
import RecentQuotation from "./Dashboard/RecentQuotation";
import "./Home.css";

const Home = () => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const { tenantDomain } = useTenantDomain();
  const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
  const { data: accountSummary } = useAccountSummaryQuery({ tenantDomain });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-5 xl:mt-10 ">
      <div className="flex items-center justify-between ">
        <div>
          <h3 className="md:text-3xl font-bold">Welcome Admin !</h3>
          <span className="text-sm">Home / Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            component={Link}
            to="/dashboard/calender"
            variant="contained"
            startIcon={<CalendarToday />}
            sx={{
              backgroundColor: "#4285F4",
              color: "#fff",
              "&:hover": { backgroundColor: "#3367D6" },
            }}
          >
            Connect Google Calendar
          </Button>
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
          >
            {showSensitiveData ? (
              <>
                <Tooltip title="Hide">
                  <VisibilityOff />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Show">
                  <Visibility />
                </Tooltip>
              </>
            )}
          </button>
        </div>
      </div>

      <AllServices
        showSensitiveData={showSensitiveData}
        tenantDomain={tenantDomain}
      />

      {showSensitiveData && (
        <DashboardSummary
          tenantDomain={tenantDomain}
          data={allMetaData?.data}
          accountSummary={accountSummary}
        />
      )}

      <ProjectOverView tenantDomain={tenantDomain} />

      <div className="recentCardWrap gap-5 grid grid-cols-1 xl:grid-cols-2 justify-between sectionMargin">
        <RecentClient tenantDomain={tenantDomain} />
        <RecentProject tenantDomain={tenantDomain} />
      </div>

      <div className="xl:flex gap-5 justify-between mt-[30px]">
        <RecentQuotation tenantDomain={tenantDomain} />
        <RecentInvoice tenantDomain={tenantDomain} />
      </div>
      <EmployeeStatistics tenantDomain={tenantDomain} />
    </div>
  );
};

export default Home;
