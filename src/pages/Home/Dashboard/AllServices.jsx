/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import {
  FaCarSide,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaPercent,
  FaUsers,
  FaWrench,
} from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import "./AllService.css";
import { useGetAllMetaQuery } from "../../../redux/api/meta.api";
import { AssuredWorkload } from "@mui/icons-material";
import { useTenantDomain } from "../../../../src/hooks/useTenantDomain";
import PropTypes from "prop-types";

const AllServices = ({ showSensitiveData }) => {
  const { tenantDomain } = useTenantDomain();
  const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
  if (isLoading) return <Loading />;

  const card =
    "flex flex-col  items-center justify-center content-center gap-x-2 mt-3 md:mt-4 space-y-2 ";
  const amount = "text-center text-[32px] font-bold text-center ";

  const WaveBg = () => (
    <div className="wave-background">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="100 10 390 190"
        className="wave-svg"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          fillOpacity="0.25"
          d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,90.7C672,75,768,85,864,85.3C960,85,1056,75,1152,90.7C1248,107,1344,149,1392,170.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>
    </div>
  );

  return (
    <div className="dashBoardRight mt-5 lg:mt-0 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-3 lg:gap-3 xl:gap-7 mb-5">
        <div className="invoice-card">
          <WaveBg />
          <Link to="/dashboard/complete-project">
            <div className={card}>
              <div className="dashboardCardIconWrap">
                <HiOutlineBriefcase className="dashboardCardIcon" />
              </div>
              <div className="invoice-info ">
                <h2 className={amount}>
                  {allMetaData?.data?.statusSummary?.completed}
                </h2>
                <p className="label">Completed Services</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="invoice-card">
          <WaveBg />
          <Link to="/dashboard/running-project">
            <div className={card}>
              <div className="dashboardCardIconWrap2 ">
                <FaWrench className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>
                  {allMetaData?.data?.statusSummary?.running}
                </h2>
                <p className="label">Running Services</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Total Product (always visible) */}
        <div className="invoice-card">
          <WaveBg />
          <div className={card}>
            <div className="dashboardCardIconWrap4">
              <FaCarSide className="dashboardCardIcon" />
            </div>
            <div className="invoice-info">
              <h2 className={amount}> {allMetaData?.data?.totalProduct}</h2>
              <p className="label">Total Product</p>
            </div>
          </div>
        </div>

        {/* All Customers (always visible) */}
        <div className="invoice-card">
          <WaveBg />
          <Link to="/dashboard/all-customer">
            <div className={card}>
              <div className="dashboardCardIconWrap7">
                <FaUsers className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>{allMetaData?.data?.totalEntities}</h2>
                <p className="label">All Customer</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {showSensitiveData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 place-content-center gap-3 lg:gap-3 xl:gap-7 mb-5">
          {/* Total Sale */}
          <div className="invoice-card invoice-card2">
            <WaveBg />
            <div className={card}>
              <div className="dashboardCardIconWrap3">
                <FaPercent className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>000</h2>
                <p className="label">Total Sale</p>
              </div>
            </div>
          </div>

          <div className="invoice-card invoice-card2">
            <WaveBg />
            <div className={card}>
              <div className="dashboardCardIconWrap">
                <AssuredWorkload className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>{allMetaData?.data?.totalAmount} ৳</h2>
                <p className="label">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Paid Services Bill */}
          <div className="invoice-card invoice-card2">
            <WaveBg />
            <div className={card}>
              <div className="dashboardCardIconWrap5">
                <FaFileInvoice className="dashboardCardIcon" />
              </div>
              <div className="invoice-info">
                <h2 className={amount}>{allMetaData?.data?.totalAdvance} ৳</h2>
                <p className="label">Paid Services Bill</p>
              </div>
            </div>
          </div>

          {/* Due Service Bill */}
          <div className="invoice-card invoice-card2">
            <WaveBg />
            <Link to="/dashboard/money-receipt-due">
              <div className={card}>
                <div className="dashboardCardIconWrap6">
                  <FaFileInvoiceDollar className="dashboardCardIcon" />
                </div>
                <div className="invoice-info">
                  <h2 className={amount}>
                    {allMetaData?.data?.totalRemaining} ৳
                  </h2>
                  <p className="label">Due Service Bill</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

AllServices.propTypes = {
  showSensitiveData: PropTypes.bool.isRequired,
};

export default AllServices;
