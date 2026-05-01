/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { HiMiniPhone } from "react-icons/hi2";
import { ImUserTie } from "react-icons/im";
import "../Customer.css";
import CustomerJobCardList from "./CustomerJobCardList";
import CustomerQoutationList from "./CustomerQoutationList";
import CustomerInvoiceList from "./CustomerInvoiceList";
import CustomerMoneyList from "./CustomerMoneyList";
import CustomerAccount from "./CustomerAccount";
import VehicleDetails from "./VehicleDetails";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useGetSingleCustomerQuery } from "../../../redux/api/customerApi";
import { useGetCompanyProfileQuery } from "../../../redux/api/companyProfile";
import Loading from "../../../components/Loading/Loading";
import { tabsStyles, tabStyles } from "../../../utils/customStyle";
import Message from "../../../shared/Message/Message";
import CustomerNote from "./CustomerNote";
import CustomerTab from "./CustomerTab";
import { useCompanyProfileData } from "../../../hooks/useCompanyProfileData";

const CustomerProfile = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const [value, setValue] = useState(() => {
    const savedTab = localStorage.getItem(`customer-tab-${id}`);
    return savedTab !== null ? Number.parseInt(savedTab, 10) : 0;
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    localStorage.setItem(`customer-tab-${id}`, newValue.toString());
  };

  useEffect(() => {
    localStorage.setItem(`customer-tab-${id}`, value.toString());
  }, [value, id]);

  const { tenantDomain } = useTenantDomain();

  const {
    data: profileData,
    isLoading,
    error: customerError,
  } = useGetSingleCustomerQuery({ id, tenantDomain });

  const { companyProfileData } = useCompanyProfileData();

  if (isLoading) {
    return <Loading />;
  }

  if (customerError) {
    return <div>Something went wrong</div>;
  }

  const filteredInvoices =
    profileData?.data?.invoices?.filter((receipt) => !receipt?.isRecycled) ||
    [];

  const totalAmount = filteredInvoices.reduce(
    (sum, receipt) => sum + (receipt?.net_total || 0),
    0,
  );
  const discount = filteredInvoices.reduce(
    (sum, receipt) => sum + (receipt?.discount || 0),
    0,
  );
  const totalDue = filteredInvoices.reduce(
    (sum, receipt) => sum + (receipt?.due || 0),
    0,
  );
  const totalAdvance = filteredInvoices.reduce(
    (sum, receipt) => sum + (receipt?.advance || 0),
    0,
  );

  return (
    <div>
      <div className="w-full lg:h-52 mt-5 lg:bg-gradient-to-r from-[#FE4728] via-[#9A8BFD] to-[#15C294] text-white flex items-center">
        <div className="singleCustomerProfileWrap ">
          <div className="bg-gradient-to-r from-[#15C294] via-[#568DFA] to-[#2B8AE0] border rounded-md py-5 px-5 relative singleCustomerProfileCard ">
            <div className="flex flex-col flex-wrap gap-3 items-center py-5">
              <div className="md:w-24 md:h-24 bg-[#42A1DA] border rounded-full p-3 absolute -top-14">
                <ImUserTie size="70" className="text-white" />
              </div>
              <div className="text-sm mt-3">
                <div className="flex items-center">
                  <span>Customer ID :</span>{" "}
                  <span className="ml-3 font-semibold">
                    {profileData?.data?.customerId}
                  </span>
                </div>
                <div className="flex items-center mt-3">
                  <Person size="20" className="mr-2" />
                  <span className="capitalize">
                    {profileData?.data?.customer_name}{" "}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <HiMiniPhone size="20" className="mr-2" />
                    <span>{profileData?.data?.fullCustomerNum} </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 gap-x-36 md:gap-x-30 lg:gap-x-4 items-center relative customerSingleRightCard">
            <div className="bg-gradient-to-r from-[#528AFA] to-[#FEBF17] border h-16 w-32 rounded-md  relative   ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Total Amount </p>
                <b>{totalAmount} ৳ </b>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#2F7EDD] to-[#15C193] border h-16 w-32 rounded-md  relative   ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Advance </p>
                <b>{totalAdvance} ৳ </b>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#998AFD] to-[#998AFD] border h-16 w-32 rounded-md  relative   ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Discount </p>
                <b>{discount} ৳ </b>
              </div>
            </div>

            <div className=" bg-gradient-to-r from-[#FE331D] to-[#fe5d1df5] border h-16 w-32 rounded-md  relative ">
              <div className="flex mt-2 flex-col items-center justify-center">
                <p>Due </p>
                <b>{totalDue} ৳</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:mt-32 text-black tabClass">
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={tabsStyles}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab sx={tabStyles} label="Account" />
            <Tab sx={tabStyles} label="Vehicle List" />
            <Tab sx={tabStyles} label="Jobs Card" />
            <Tab sx={tabStyles} label="Quotation" />
            <Tab sx={tabStyles} label="Invoice" />
            <Tab sx={tabStyles} label="Money Receipt" />
            <Tab sx={tabStyles} label="Message" />
            <Tab sx={tabStyles} label="Note" />
          </Tabs>
        </Box>

        <CustomerTab value={value} index={0}>
          <CustomerAccount
            tenantDomain={tenantDomain}
            profileData={profileData}
          />
        </CustomerTab>

        <CustomerTab value={value} index={1}>
          <VehicleDetails
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </CustomerTab>

        <CustomerTab value={value} index={2}>
          <CustomerJobCardList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            customerId={profileData?.data?.customerId}
            user_type={profileData?.data?.user_type}
            id={id}
          />
        </CustomerTab>
        <CustomerTab value={value} index={3}>
          <CustomerQoutationList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </CustomerTab>
        <CustomerTab value={value} index={4}>
          <CustomerInvoiceList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </CustomerTab>
        <CustomerTab value={value} index={5}>
          <CustomerMoneyList
            companyProfileData={companyProfileData}
            tenantDomain={tenantDomain}
            id={id}
            user_type={profileData?.data?.user_type}
          />
        </CustomerTab>
        <CustomerTab value={value} index={6}>
          <Message data={profileData?.data} />
        </CustomerTab>
        <CustomerTab value={value} index={7}>
          <CustomerNote tenantDomain={tenantDomain} id={id} />
        </CustomerTab>

        <div>
          <p className="my-5 text-center">
            © Copyright 2024 | Garage Master | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
