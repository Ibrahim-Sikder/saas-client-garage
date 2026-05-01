// /* eslint-disable react-hooks/exhaustive-deps */
// import "./AddJobCard.css";
// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useTenantDomain } from "../../hooks/useTenantDomain";
// import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
// import { useCreateJobCardMutation } from "../../redux/api/jobCard";
// import { useJobCardData } from "../../hooks/useJobCardData";
// import Loading from "../../components/Loading/Loading";
// import { useAppOptions } from "../../hooks/useAppOptions";
// import { getDefaultMileage, getFormattedDate } from "../../constant/jobCard";
// import { countries } from "../../constant/Vehicle.constant";
// import { useForm } from "react-hook-form";
// import { usePhoneHandlers } from "../../hooks/usePhoneHandlers";
// import { USER_TYPES } from "../../config/jobCardFormConfig";
// import FormHeader from "./FormHeader";
// import FormTopSection from "./FormTopSection";
// import UserInformationSection from "./UserInformationSection";
// import VehicleInformationSection from "./VehicleInformationSection";
// import VehicleReportSection from "./VehicleReportSection";
// import FormFooter from "./FormFooter";
// import JobCardTable from "./JobCardTable";

// const AddJobCard = () => {
//   const { tenantDomain } = useTenantDomain();
//   const { performActionWithPermission } = useAppOptions();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const formRef = useRef();
//   const id = new URLSearchParams(location.search).get("id");
//   const user = new URLSearchParams(location.search).get("user_type");

//   const [currentPage] = useState(1);
//   const [idType, setIdType] = useState(null);
//   const [showId, setShowId] = useState([]);
//   const [userId, setUserId] = useState(id);
//   const [newId, setNewId] = useState(user || USER_TYPES.CUSTOMER);

//   // Phone States
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
//   const [ownerPhoneNumber, setOwnerPhoneNumber] = useState("");

//   // Country Code States
//   const [countryCode, setCountryCode] = useState(countries[0]);
//   const [driverCountryCode, setDriverCountryCode] = useState(countries[0]);
//   const [customerOwnerCountryCode, setCustomerOwnerCountryCode] = useState(
//     countries[0]
//   );
//   const [companyOwnerCountryCode, setCompanyOwnerCountryCode] = useState(
//     countries[0]
//   );

//   // Vehicle States
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [filteredOptions, setFilteredOptions] = useState([]);
//   const [yearSelectInput, setYearSelectInput] = useState("");
//   const [currentMileage, setCurrentMileage] = useState("");
//   const [mileageChanged, setMileageChanged] = useState(false);
//   const [getDataWithChassisNo, setGetDataWithChassisNo] = useState("");

//   const [clickControl] = useState(null);
//   const [formattedDate] = useState(getFormattedDate());

//   // Form Handling
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue: setVModelValue,
//     formState: { errors },
//   } = useForm();

//   // API Calls
//   const { data: CompanyInfoData } = useGetCompanyProfileQuery({ tenantDomain });
//   const [createJobCard, { isLoading: createJobCardLoading }] =
//     useCreateJobCardMutation();

//   // Custom Hooks
//   const {
//     customerData,
//     companyData,
//     showroomData,
//     userDetails,
//     paddedJobNumber,
//     loading: dataLoading,
//   } = useJobCardData(userId, newId, currentPage);

//   const phoneHandlers = usePhoneHandlers({
//     setPhoneNumber,
//     setDriverPhoneNumber,
//     setOwnerPhoneNumber,
//   });

//   // Effects
//   useEffect(() => {
//     resetFormBasedOnUserType();
//   }, [
//     userDetails?.data,
//     newId,
//     phoneNumber,
//     driverPhoneNumber,
//     getDataWithChassisNo,
//   ]);

//   useEffect(() => {
//     if (!userDetails?.data) {
//       formRef.current?.reset();
//     }
//   }, [userDetails]);

//   useEffect(() => {
//     setCurrentMileage(getDefaultMileage(getDataWithChassisNo));
//   }, [getDataWithChassisNo]);

//   useEffect(() => {
//     if (getDataWithChassisNo?.vehicle_model) {
//       setYearSelectInput(getDataWithChassisNo.vehicle_model.toString());
//       setVModelValue("vehicle_model", getDataWithChassisNo.vehicle_model);
//     } else {
//       setYearSelectInput("");
//     }
//   }, [getDataWithChassisNo?.vehicle_model, setVModelValue]);

//   // Handler Functions
//   const handleIdChange = (_, newValue) => {
//     setUserId(newValue);
//   };

//   const handleChassisChange = (_, newValue) => {
//     if (userDetails?.data?.vehicles) {
//       const filtered = userDetails.data.vehicles.find(
//         (vehicle) => vehicle.chassis_no === newValue
//       );
//       setGetDataWithChassisNo(filtered);
//     }
//   };

//   const resetFormBasedOnUserType = () => {
//     if (!userDetails?.data) return;

//     const resetData = {
//       carReg_no: getDataWithChassisNo?.carReg_no,
//       car_registration_no: getDataWithChassisNo?.car_registration_no,
//       engine_no: getDataWithChassisNo?.engine_no,
//       vehicle_brand: getDataWithChassisNo?.vehicle_brand,
//       vehicle_name: getDataWithChassisNo?.vehicle_name,
//       vehicle_model: getDataWithChassisNo?.vehicle_model,
//       vehicle_category: getDataWithChassisNo?.vehicle_category,
//       color_code: getDataWithChassisNo?.color_code,
//       mileage: getDataWithChassisNo?.mileage,
//       fuel_type: getDataWithChassisNo?.fuel_type,
//     };

//     const userTypeData = {
//       [USER_TYPES.CUSTOMER]: {
//         company_name: userDetails.data.company_name,
//         vehicle_username: userDetails.data.vehicle_username,
//         company_address: userDetails.data.company_address,
//         customer_name: userDetails.data.customer_name,
//         customer_country_code: userDetails.data.customer_country_code,
//         customer_contact: phoneNumber || userDetails.data.customer_contact,
//         customer_email: userDetails.data.customer_email,
//         customer_address: userDetails.data.customer_address,
//         driver_name: userDetails.data.driver_name,
//         driver_country_code: userDetails.data.driver_country_code,
//         driver_contact: driverPhoneNumber || userDetails.data.driver_contact,
//         reference_name: userDetails.data.reference_name,
//         customerOwnerName: userDetails.data.customerOwnerName,
//         customerOwnerCountryCode: userDetails.data.customerOwnerCountryCode,
//         customerOwnerPhone:
//           driverPhoneNumber || userDetails.data.customerOwnerPhone,
//       },
//       [USER_TYPES.COMPANY]: {
//         company_name: userDetails.data.company_name,
//         vehicle_username: userDetails.data.vehicle_username,
//         company_address: userDetails.data.company_address,
//         company_contact: userDetails.data.company_contact,
//         company_country_code: userDetails.data.company_country_code,
//         company_email: userDetails.data.company_email,
//         customer_address: userDetails.data.customer_address,
//         driver_name: userDetails.data.driver_name,
//         driver_country_code: userDetails.data.driver_country_code,
//         driver_contact: driverPhoneNumber || userDetails.data.driver_contact,
//         companyOwnerName: userDetails.data.companyOwnerName,
//         companyOwnerCountryCode: userDetails.data.companyOwnerCountryCode,
//         companyOwnerPhone:
//           driverPhoneNumber || userDetails.data.companyOwnerPhone,
//         reference_name: userDetails.data.reference_name,
//       },
//       [USER_TYPES.SHOWROOM]: {
//         showRoom_name: userDetails.data.showRoom_name,
//         vehicle_username: userDetails.data.vehicle_username,
//         showRoom_address: userDetails.data.showRoom_address,
//         company_name: userDetails.data.company_name,
//         company_contact: phoneNumber || userDetails.data.company_contact,
//         company_country_code: userDetails.data.company_country_code,
//         company_email: userDetails.data.company_email,
//         company_address: userDetails.data.company_address,
//         driver_name: userDetails.data.driver_name,
//         driver_country_code: userDetails.data.driver_country_code,
//         driver_contact: driverPhoneNumber || userDetails.data.driver_contact,
//         reference_name: userDetails.data.reference_name,
//       },
//     };

//     reset({ ...resetData, ...userTypeData[newId] });
//   };

//   const onSubmit = async (data) => {
//     performActionWithPermission(
//       "/dashboard/create-job-card",
//       "create",
//       async () => {
//         const toastId = toast.loading("Creating Jobcard...");

//         if (!newId) {
//           toast.error("Please add your Id.");
//           return;
//         }

//         try {
//           const newCard = prepareJobCardData(data);
//           const res = await createJobCard(newCard).unwrap();

//           if (res.success) {
//             toast.success(res.message);
//             handleNavigation(res.data);
//           }
//         } catch (err) {
//           toast.error(err?.data?.message || "Something went wrong!");
//         } finally {
//           toast.dismiss(toastId);
//         }
//       },
//       "You don't have permission to create job card"
//     );
//   };

//   const prepareJobCardData = (data) => {
//     const userData = prepareUserData(data);
//     const vehicle = prepareVehicleData(data);
//     const jobCard = prepareJobCardPayload(data);

//     return {
//       tenantDomain,
//       ...userData,
//       vehicle,
//       jobCard,
//     };
//   };

//   const prepareUserData = (data) => {
//     const baseData = {
//       company_name: data.company_name,
//       vehicle_username: data.vehicle_username,
//       company_address: data.company_address,
//       driver_name: data.driver_name,
//       driver_contact: data.driver_contact,
//       driver_country_code: driverCountryCode?.code,
//       reference_name: data.reference_name,
//     };

//     const userTypeData = {
//       [USER_TYPES.CUSTOMER]: {
//         customer: {
//           ...baseData,
//           customer_name: data.customer_name,
//           customer_contact: data.customer_contact,
//           customer_country_code: countryCode?.code,
//           customer_email: data.customer_email,
//           customer_address: data.customer_address,
//           customerOwnerPhone: data.customerOwnerPhone,
//           customerOwnerName: data.customerOwnerName,
//           customerOwnerCountryCode: customerOwnerCountryCode?.code,
//         },
//       },
//       [USER_TYPES.COMPANY]: {
//         company: {
//           ...baseData,
//           company_contact: data.company_contact,
//           company_country_code: countryCode?.code,
//           company_email: data.company_email,
//           customer_address: data.customer_address,
//           companyOwnerPhone: data.companyOwnerPhone,
//           companyOwnerName: data.companyOwnerName,
//           companyOwnerCountryCode: companyOwnerCountryCode?.code,
//         },
//       },
//       [USER_TYPES.SHOWROOM]: {
//         showroom: {
//           showRoom_name: data.showRoom_name,
//           vehicle_username: data.vehicle_username,
//           showRoom_address: data.showRoom_address,
//           company_name: data.company_name,
//           company_contact: data.company_contact,
//           company_country_code: countryCode?.code,
//           company_email: data.company_email,
//           company_address: data.company_address,
//           driver_name: data.driver_name,
//           driver_contact: data.driver_contact,
//           driver_country_code: driverCountryCode?.code,
//           reference_name: data.reference_name,
//         },
//       },
//     };

//     return userTypeData[newId];
//   };

//   const prepareVehicleData = (data) => {
//     const existingMileageHistory = getDataWithChassisNo?.mileageHistory || [];
//     const updatedMileageHistory = [...existingMileageHistory];

//     if (mileageChanged && currentMileage) {
//       const newMileageEntry = {
//         mileage: Number(currentMileage),
//         date: new Date().toISOString(),
//       };

//       const mileageExists = updatedMileageHistory.some(
//         (entry) => entry.mileage === Number(currentMileage)
//       );

//       if (!mileageExists) {
//         updatedMileageHistory.push(newMileageEntry);
//       }
//     }

//     return {
//       carReg_no: data.carReg_no,
//       car_registration_no: data.car_registration_no,
//       chassis_no: data.chassis_no,
//       engine_no: data.engine_no,
//       vehicle_brand: data.vehicle_brand,
//       vehicle_name: data.vehicle_name,
//       vehicle_model: Number(data.vehicle_model),
//       vehicle_category: data.vehicle_category,
//       color_code: data.color_code,
//       mileageHistory: updatedMileageHistory,
//       fuel_type: data.fuel_type,
//     };
//   };

//   const prepareJobCardPayload = (data) => ({
//     Id: userId,
//     job_no: paddedJobNumber,
//     user_type: newId,
//     date: formattedDate,
//     vehicle_interior_parts: data.vehicle_interior_parts,
//     reported_defect: data.reported_defect,
//     reported_action: data.reported_action,
//     note: data.note,
//     vehicle_body_report: data.vehicle_body_report,
//     technician_name: data.technician_name,
//     technician_signature: data.technician_signature,
//     technician_date: data.technician_date,
//     vehicle_owner: data.vehicle_owner,
//     mileage: Number(data.mileage),
//   });

//   const handleNavigation = (data) => {
//     const navigationMap = {
//       preview: `/dashboard/preview?id=${data._id}`,
//       quotation: `/dashboard/create-quotation?order_no=${data.job_no}`,
//       invoice: `/dashboard/create-invoice?order_no=${data.job_no}`,
//       null: "/dashboard/jobcard-list",
//     };

//     navigate(navigationMap[clickControl] || navigationMap["null"]);
//   };

//   // Render loading state
//   if (dataLoading) {
//     return (
//       <div className="flex items-center justify-center text-xl">
//         <Loading />
//       </div>
//     );
//   }

//   return (
//     <div className="addJobCardWraps">
//       <FormHeader CompanyInfoData={CompanyInfoData} />

//       <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
//         <div>
//           <FormTopSection
//             idType={idType}
//             userId={userId}
//             paddedJobNumber={paddedJobNumber}
//             customerData={customerData}
//             companyData={companyData}
//             showroomData={showroomData}
//             setIdType={setIdType}
//             setNewId={setNewId}
//             setShowId={setShowId}
//             showId={showId}
//             handleIdChange={handleIdChange}
//             register={register}
//             errors={errors}
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <UserInformationSection
//               newId={newId}
//               userDetails={userDetails}
//               register={register}
//               errors={errors}
//               countries={countries}
//               countryCode={countryCode}
//               setCountryCode={setCountryCode}
//               phoneNumber={phoneNumber}
//               handlePhoneNumberChange={phoneHandlers.handlePhoneNumberChange}
//               customerOwnerCountryCode={customerOwnerCountryCode}
//               setCustomerOwnerCountryCode={setCustomerOwnerCountryCode}
//               companyOwnerCountryCode={companyOwnerCountryCode}
//               setCompanyOwnerCountryCode={setCompanyOwnerCountryCode}
//               ownerPhoneNumber={ownerPhoneNumber}
//               handleOwnerPhoneNumberChange={
//                 phoneHandlers.handleOwnerPhoneNumberChange
//               }
//             />

//             <VehicleInformationSection
//               userDetails={userDetails}
//               getDataWithChassisNo={getDataWithChassisNo}
//               register={register}
//               errors={errors}
//               handleChassisChange={handleChassisChange}
//               filteredVehicles={filteredVehicles}
//               setFilteredVehicles={setFilteredVehicles}
//               yearSelectInput={yearSelectInput}
//               setYearSelectInput={setYearSelectInput}
//               filteredOptions={filteredOptions}
//               setFilteredOptions={setFilteredOptions}
//               setVModelValue={setVModelValue}
//               currentMileage={currentMileage}
//               setCurrentMileage={setCurrentMileage}
//               mileageChanged={mileageChanged}
//               setMileageChanged={setMileageChanged}
//               driverCountryCode={driverCountryCode}
//               setDriverCountryCode={setDriverCountryCode}
//               driverPhoneNumber={driverPhoneNumber}
//               handleDriverPhoneNumberChange={
//                 phoneHandlers.handleDriverPhoneNumberChange
//               }
//             />
//           </div>

//           <VehicleReportSection register={register} />

//           <FormFooter
//             register={register}
//             errors={errors}
//             createJobCardLoading={createJobCardLoading}
//           />
//         </div>
//       </form>

//       <JobCardTable />
//     </div>
//   );
// };

// export default AddJobCard;
