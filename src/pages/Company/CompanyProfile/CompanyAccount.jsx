/* eslint-disable react/prop-types */

import DynamicAccount from "../../../components/DynamicProfile/DynamicAccount";

const CompanyAccount = ({ profileData, tenantDomain }) => {
  return (
    <DynamicAccount
      profileType="company"
      profileData={profileData}
      tenantDomain={tenantDomain}
    />
  );
};

export default CompanyAccount;