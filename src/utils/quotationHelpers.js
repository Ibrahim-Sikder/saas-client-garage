/* eslint-disable no-unused-vars */
import { countries, cmDmOptions } from "@/constant";

export const formateNumber = (num) => {
  if (num === undefined || num === null || num === "") return "";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getDefaultDate = () => {
  const parsedDate = new Date();
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getUserData = (data, userType) => {
  if (userType === "customer") {
    return {
      company_name: data?.customer?.company_name,
      customer_name: data?.customer?.customer_name,
      customer_country_code: data?.customer?.customer_country_code,
      customer_contact: data?.customer?.customer_contact,
      customer_address: data?.customer?.customer_address,
    };
  } else if (userType === "company") {
    return {
      company_name: data?.company?.company_name,
      vehicle_username: data?.company?.vehicle_username,
      company_address: data?.company?.company_address,
      company_contact: data?.company?.company_contact,
      company_country_code: data?.company?.company_country_code,
      company_email: data?.company?.company_email,
    };
  } else if (userType === "showRoom") {
    return {
      showRoom_name: data?.showRoom?.showRoom_name,
      vehicle_username: data?.showRoom?.vehicle_username,
      company_name: data?.showRoom?.company_name,
      company_contact: data?.showRoom?.company_contact,
      company_country_code: data?.showRoom?.company_country_code,
      showRoom_address: data?.showRoom?.showRoom_address,
    };
  }
  return {};
};

export const getVehicleData = (vehicle) => ({
  carReg_no: vehicle?.carReg_no,
  car_registration_no: vehicle?.car_registration_no,
  chassis_no: vehicle?.chassis_no,
  engine_no: vehicle?.engine_no,
  vehicle_brand: vehicle?.vehicle_brand,
  vehicle_name: vehicle?.vehicle_name,
  mileage: vehicle?.mileage,
});

export const createQuotationPayload = (
  data,
  quotationData,
  items,
  serviceItems,
  calculations,
  mode = "create"
) => {
  const {
    partsTotal,
    serviceTotal,
    grandTotal,
    discount,
    vat,
    tax,
    calculateFinalTotal,
  } = calculations;

  const customer = {
    company_name: data.company_name,
    customer_name: data.customer_name,
    customer_contact: data.customer_contact,
    customer_country_code: data.company_country_code,
    customer_address: data.customer_address,
  };

  const company = {
    company_name: data.company_name,
    vehicle_username: data.vehicle_username,
    company_address: data.company_address,
    company_contact: data.company_contact,
    company_country_code: data.company_country_code,
    company_email: data.company_email,
  };

  const showRoom = {
    showRoom_name: data.showRoom_name,
    vehicle_username: data.vehicle_username,
    company_name: data.company_name,
    company_contact: data.company_contact,
    company_country_code: data.company_country_code,
    company_address: data.company_address,
  };

  const vehicle = {
    carReg_no: data.carReg_no,
    car_registration_no: data.car_registration_no,
    chassis_no: data.chassis_no,
    engine_no: data.engine_no,
    vehicle_brand: data.vehicle_brand,
    vehicle_name: data.vehicle_name,
    mileage: Number(data.mileage),
  };

  const quotation = {
    user_type: quotationData?.user_type,
    Id: quotationData?.Id,
    job_no: quotationData?.job_no,
    date: data.date || quotationData?.date,
    parts_total: partsTotal || quotationData?.parts_total,
    service_total: serviceTotal || quotationData?.service_total,
    total_amount: grandTotal || quotationData?.total_amount,
    discount: discount,
    vat: vat,
    tax: tax,
    net_total: calculateFinalTotal() || quotationData?.net_total,
    input_data: items,
    service_input_data: serviceItems,
  };

  return {
    tenantDomain: data.tenantDomain,
    customer,
    company,
    showRoom,
    vehicle,
    quotation,
  };
};

export { countries, cmDmOptions };
