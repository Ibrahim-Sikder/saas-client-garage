/* eslint-disable react/prop-types */

import DynamicAccount from "../../../components/DynamicProfile/DynamicAccount";

const CustomerAccount = ({ profileData, tenantDomain }) => {
  return (
    <DynamicAccount
      profileType="customer"
      profileData={profileData}
      tenantDomain={tenantDomain}
    />
  );
};

export default CustomerAccount;