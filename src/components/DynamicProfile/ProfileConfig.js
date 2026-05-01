import CompanyAccount from "../../pages/Company/CompanyProfile/CompanyAccount";
import CustomerAccount from "../../pages/Customer/CustomerProfile/CustomerAccount";
import CustomerInvoiceList from "../../pages/Customer/CustomerProfile/CustomerInvoiceList";
import CustomerJobCardList from "../../pages/Customer/CustomerProfile/CustomerJobCardList";
import CustomerMoneyList from "../../pages/Customer/CustomerProfile/CustomerMoneyList";
import CustomerNote from "../../pages/Customer/CustomerProfile/CustomerNote";
import CustomerQoutationList from "../../pages/Customer/CustomerProfile/CustomerQoutationList";
import VehicleDetails from "../../pages/Customer/CustomerProfile/VehicleDetails";
// import SupplierPaymentList from "../../pages/Suppliers/SupplierPaymentList";
import ShowRoomAccount from "../../pages/ShowRoom/ShowRoomProfile/ShowRoomAccount";
import Message from "../../shared/Message/Message";

export const PROFILE_CONFIG = {
  customer: {
    queryHook: "useGetSingleCustomerQuery",
    idKey: "customerId",
    nameKey: "customer_name",
    phoneKey: "fullCustomerNum",
    localStorageKey: "customer-tab",
    accountComponent: CustomerAccount,
    tabs: [
      { label: "Account", component: CustomerAccount },
      { label: "Vehicle List", component: VehicleDetails },
      { label: "Jobs Card", component: CustomerJobCardList },
      { label: "Quotation", component: CustomerQoutationList },
      { label: "Invoice", component: CustomerInvoiceList },
      { label: "Money Receipt", component: CustomerMoneyList },
      { label: "Message", component: Message },
      { label: "Note", component: CustomerNote },
    ],
  },
  showroom: {
    queryHook: "useGetSingleShowRoomQuery",
    idKey: "showRoomId",
    nameKey: "showRoom_name",
    phoneKey: "fullCompanyNum",
    localStorageKey: "showroom-tab",
    accountComponent: ShowRoomAccount,
    tabs: [
      { label: "Account", component: ShowRoomAccount },
      { label: "Vehicle List", component: VehicleDetails },
      { label: "Job Card", component: CustomerJobCardList },
      { label: "Quotation", component: CustomerQoutationList },
      { label: "Invoice", component: CustomerInvoiceList },
      { label: "Money Receipt", component: CustomerMoneyList },
      { label: "Message", component: Message },
      { label: "Note", component: CustomerNote },
    ],
  },
  company: {
    queryHook: "useGetSingleCompanyQuery",
    idKey: "companyId",
    nameKey: "company_name",
    phoneKey: "fullCompanyNum",
    localStorageKey: "company-tab",
    accountComponent: CompanyAccount,
    tabs: [
      { label: "Account", component: CompanyAccount },
      { label: "Vehicle List", component: VehicleDetails },
      { label: "Jobs Card", component: CustomerJobCardList },
      { label: "Quotation", component: CustomerQoutationList },
      { label: "Invoice", component: CustomerInvoiceList },
      { label: "Money Receipt", component: CustomerMoneyList },
      // { label: "Payment", component: SupplierPaymentList },
      { label: "Message", component: Message },
      { label: "Note", component: CustomerNote },
    ],
  },
};
