/* eslint-disable react/prop-types */
import { HiMiniPhone } from "react-icons/hi2";
import { ImUserTie } from "react-icons/im";
import { Person } from "@mui/icons-material";
import { calculateFinancialMetrics } from "../../utils/FinancialUtils";
import FinancialCards from "./FinancialCard";

const ProfileHeader = ({ profileType, profileData, config }) => {
  const { totalAmount, discount, totalDue, totalAdvance } =
    calculateFinancialMetrics(profileData?.data?.invoices, profileType);

  const financialCards = [
    {
      label: "Total Amount",
      value: totalAmount,
      gradient: "from-[#528AFA] to-[#FEBF17]",
    },
    {
      label: "Advance",
      value: totalAdvance,
      gradient: "from-[#2F7EDD] to-[#15C193]",
    },
    {
      label: "Discount",
      value: discount,
      gradient: "from-[#998AFD] to-[#998AFD]",
    },
    {
      label: "Due",
      value: totalDue,
      gradient: "from-[#FE331D] to-[#fe5d1df5]",
    },
  ];

  console.log("profileType", profileType);

  console.log("profile data check there ", profileData);

  return (
    <div className="w-full lg:h-52 mt-5 lg:bg-gradient-to-r from-[#FE4728] via-[#9A8BFD] to-[#15C294] text-white flex items-center">
      <div className="singleCustomerProfileWrap">
        {/* Profile Card */}
        <div className="bg-gradient-to-r from-[#15C294] via-[#568DFA] to-[#2B8AE0] border rounded-md py-5 px-5 relative w-[300px] singleCustomerProfileCard">
          <div className="flex flex-col flex-wrap gap-3 items-center py-5">
            <div className="md:w-24 md:h-24 bg-[#42A1DA] border rounded-full p-3 absolute -top-14">
              <ImUserTie size="70" className="text-white" />
            </div>

            <div className="text-sm mt-3">
              <div className="flex items-center">
                <span>
                  {profileType === "showroom" ? "Showroom ID" : "Company ID"} :
                </span>
                <span className="ml-3 font-semibold">
                  {profileData?.data?.[config.idKey]}
                </span>
              </div>

              <div className="flex items-center mt-3">
                <Person size="20" className="mr-2" />
                <span className="capitalize">
                  {profileData?.data?.[config.nameKey]}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <HiMiniPhone size="20" className="mr-2" />
                  <span>{profileData?.data?.[config.phoneKey]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Cards */}
        <FinancialCards financialCards={financialCards} />
      </div>
    </div>
  );
};

export default ProfileHeader;
