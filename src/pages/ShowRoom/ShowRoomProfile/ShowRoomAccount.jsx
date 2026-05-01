/* eslint-disable react/prop-types */

import DynamicAccount from "../../../components/DynamicProfile/DynamicAccount";


const ShowRoomAccount = ({ profileData, tenantDomain }) => {
  return (
    <DynamicAccount
      profileType="showroom"
      profileData={profileData}
      tenantDomain={tenantDomain}
    />
  );
};

export default ShowRoomAccount;