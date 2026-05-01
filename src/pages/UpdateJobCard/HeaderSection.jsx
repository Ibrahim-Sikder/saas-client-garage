/* eslint-disable react/prop-types */

import TrustAutoAddress from "../../../components/TrustAutoAddress/TrustAutoAddress";
import '../AddJobCard/AddJobCard.css'
const HeaderSection = ({ CompanyInfoData }) => {
  return (
    <div className="mb-5 pb-5 mx-auto text-center border-b-2 border-[#42A1DA]">
      <div className="addJobCardHeads">
        <img
          src={CompanyInfoData?.data?.logo || "/placeholder.svg"}
          alt="logo"
          className="addJobLogoImg"
        />
        <div>
          <div className="flex-1 text-center">
            <h2 className="trustAutoTitle">
              {CompanyInfoData?.data?.companyNameBN}
            </h2>
            <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
              ({CompanyInfoData?.data?.companyName})
            </h3>
          </div>
          <span className="text-[12px] lg:text-xl mt-5 block">
            Office: {CompanyInfoData?.data?.address}
          </span>
        </div>
        <TrustAutoAddress/>
      </div>
    </div>
  );
};

export default HeaderSection;