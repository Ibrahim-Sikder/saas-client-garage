import { useContext, useEffect, useState } from "react";
import "./PreviewJobCard.css";
import car from "../../../../public/assets/car3.jpeg";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button, Link } from "@mui/material";
import { WhatsApp } from "@mui/icons-material";
import { WhatsappShareButton } from "react-share";
import { useGetSingleJobCardQuery } from "../../../redux/api/jobCard";
import { useGetCompanyProfileQuery } from "../../../redux/api/companyProfile";
import Loading from "../../../components/Loading/Loading";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { PrintContext } from "../../../context/PrintProvider";
import { useCompanyProfileData } from "../../../hooks/useCompanyProfileData";
import { formatDate } from "../../../utils/formateDate";
const PreviewJobCard = () => {
  const { componentRef } = useContext(PrintContext);
  
  const [, setVehicleInterior] = useState("");
  const [, setReportedDefect] = useState("");
  const [, setReportedAction] = useState("");
  const { tenantDomain } = useTenantDomain();

  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const { data, isLoading } = useGetSingleJobCardQuery({ tenantDomain, id });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { companyProfileData } = useCompanyProfileData();

  const previewData = data?.data;

  const extractTextFromHTML = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  useEffect(() => {
    if (previewData && previewData?.vehicle_interior_parts) {
      const extractedText = extractTextFromHTML(
        previewData?.vehicle_interior_parts
      );
      setVehicleInterior(extractedText);
    }
    if (previewData && previewData?.reported_defect) {
      const extractedText = extractTextFromHTML(previewData?.reported_defect);
      setReportedDefect(extractedText);
    }
    if (previewData && previewData?.reported_action) {
      const extractedText = extractTextFromHTML(previewData?.reported_action);
      setReportedAction(extractedText);
    }
  }, [previewData]);

  if (isLoading) {
    return <Loading />;
  }

  const driverContact1 =
    previewData?.customer?.driver_country_code +
    previewData?.customer?.driver_contact;
  const driverContact2 =
    previewData?.company?.driver_country_code +
    previewData?.company?.driver_contact;

  const driverContact3 =
    previewData?.showRoom?.driver_country_code +
    previewData?.showRoom?.driver_contact;

  const urlToShare = window.location.href;

  return (
    <main className="jobCardViewWrap">
      <div ref={componentRef}>
        <div className="jobCardPrint flex flex-col justify-between px-2 md:px-8 py-2 md:py-10">
          <div className="headerContainer">
            <div className="mx-auto text-center border-b-[2px] ">
              <div className="mx-auto text-center border-b-[2px] border-[#110255] py-2">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <img
                    className="w-[110px] mb-2 md:mb-0"
                    src={CompanyInfoData?.data?.logo[0]}
                    alt="logo"
                  />

                  <div className="flex-1 text-center">
                    {CompanyInfoData?.data?.companyNameBN && (
                      <h2 className="trustAutoTitle">
                        {CompanyInfoData.data.companyNameBN}
                      </h2>
                    )}

                    {CompanyInfoData?.data?.companyName && (
                      <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
                        {CompanyInfoData.data.companyName}
                      </h3>
                    )}
                  </div>

                  {/* Spacer for flex alignment */}
                  <div className="w-[120px] md:w-[150px] hidden md:block"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="md:hidden flex justify-center items-center my-3">
                <div className="vehicleCard previwCard2">Vehicle Job Card </div>
              </div>
              <div className=" flex text-[12px] justify-between items-center my-2">
                <div>
                  <b>
                    Job No: <span>{previewData?.job_no}</span>
                  </b>
                  <div>
                    <b> ID:</b> {previewData?.Id}
                  </div>
                </div>
                <div className="hidden md:flex">
                  <div className="vehicleCard previwCard2">
                    Vehicle Job Card{" "}
                  </div>
                </div>
                <div>
                  <b>
                    Date: <span>{previewData?.date}</span>
                  </b>
                </div>
              </div>

              <div className="flex flex-col md:flex-row  justify-between">
                <div className="inputGroup">
                  <h6 className="mb-2 font-bold">Vehicle Information </h6>
                  <div className="grid grid-cols-2 md:grid-cols-3">
                    <div>
                      <div>
                        <label className="block">chassis_no</label>
                        <input
                          type="text"
                          placeholder="VIN No"
                          defaultValue={
                            previewData?.vehicle?.chassis_no || "N/A"
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Car Registration No</label>
                        <input
                          type="text"
                          defaultValue={`${
                            previewData?.vehicle?.carReg_no || "N/A"
                          } ${
                            previewData?.vehicle?.car_registration_no || "N/A"
                          }`}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Vehicle Model </label>
                        <input
                          type="text"
                          placeholder="Vehicle Model"
                          defaultValue={
                            previewData?.vehicle?.vehicle_model || "N/A"
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block">Engine No</label>
                        <input
                          type="text"
                          placeholder="Engine No"
                          defaultValue={
                            previewData?.vehicle?.engine_no || "N/A"
                          }
                          disabled
                        />
                      </div>

                      <div>
                        <label className="block">Vehicle Name </label>
                        <input
                          type="text"
                          placeholder="Company Name "
                          defaultValue={
                            previewData?.vehicle?.vehicle_name || "N/A"
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Vehicle Brand </label>
                        <input
                          type="text"
                          placeholder="Vehicle Brand "
                          defaultValue={
                            previewData?.vehicle?.vehicle_brand || "N/A"
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block">Mileage</label>
                        <input
                          type="text"
                          placeholder="Mileage"
                          defaultValue={previewData?.mileage || "N/A"}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Color</label>
                        <input
                          type="text"
                          placeholder="Color"
                          defaultValue={
                            previewData?.vehicle?.color_code || "N/A"
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Vehicle Category </label>
                        <input
                          type="text"
                          placeholder="Vehicle Category "
                          defaultValue={
                            previewData?.vehicle?.vehicle_category || "N/A"
                          }
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" inputGroup">
                  <h6 className=" mb-2 font-bold ">
                    {" "}
                    {previewData?.user_type?.charAt(0)?.toUpperCase() +
                      previewData?.user_type?.slice(1)}{" "}
                    Information{" "}
                  </h6>
                  <div className="flex">
                    <div>
                      <div>
                        <label className="block">Customer Name</label>
                        <input
                          type="text"
                          placeholder="Customer Name"
                          defaultValue={
                            previewData?.customer?.customer_name ||
                            previewData?.company?.vehicle_username ||
                            previewData?.showRoom?.vehicle_username ||
                            "N/A"
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Car Driver Name </label>
                        <input
                          type="text"
                          placeholder="Car Driver Name"
                          defaultValue={
                            previewData?.customer?.driver_name ||
                            previewData?.company?.driver_name ||
                            previewData?.showRoom?.driver_name ||
                            "N/A"
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">Reference Name </label>
                        <input
                          type="text"
                          placeholder="Reference Number"
                          defaultValue={
                            previewData?.customer?.reference_name ||
                            previewData?.company?.reference_name ||
                            previewData?.showRoom?.reference_name ||
                            "N/A"
                          }
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block">Phone Number </label>
                        <input
                          type="text"
                          placeholder="Phone"
                          defaultValue={
                            previewData?.customer?.fullCustomerNum ||
                            previewData?.company?.fullCompanyNum ||
                            previewData?.showRoom?.fullCompanyNum ||
                            "N/A"
                          }
                          disabled
                        />
                      </div>

                      <div>
                        <label className="block">Driver Contact No</label>
                        <input
                          type="text"
                          placeholder="Contact No"
                          defaultValue={
                            driverContact1 ||
                            driverContact2 ||
                            driverContact3 ||
                            "N/A"
                          }
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block">
                          {previewData?.user_type?.charAt(0).toUpperCase() +
                            previewData?.user_type?.slice(1)}{" "}
                          Email{" "}
                        </label>
                        <input
                          type="text"
                          placeholder="Customer Address "
                          defaultValue={
                            previewData?.customer?.customer_email ||
                            previewData?.company?.company_email ||
                            previewData?.showRoom?.company_email ||
                            "N/A"
                          }
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="fullTextArea mt-2">
                <label>
                  Vehicle Interior Parts, Papers, Tools, Meter Light & Others
                </label>
                <textarea
                  disabled
                  defaultValue={previewData?.vehicle_interior_parts || "N/A"}
                />
              </div>
              <div className="flex flex-col md:flex-row justify-between ">
                <div className="leftSide">
                  <div>
                    <label>Reported Defect</label>
                    <textarea
                      defaultValue={previewData?.reported_defect || "N/A"}
                      readOnly
                      className="w-full md:w-[445px]"
                    />
                  </div>
                  <div>
                    <label> Reported Action</label>
                    <textarea
                      defaultValue={previewData?.reported_action || "N/A"}
                      readOnly
                      className="w-full md:w-[445px]"
                    />
                  </div>

                  <div className="mt-">
                    <label>
                      {/* Vehicle Interior Parts, */}
                      Vehicle Body Report Comments
                    </label>
                    <textarea
                      defaultValue={previewData?.vehicle_body_report || "N/A"}
                      readOnly
                      className="w-full md:w-[445px]"
                    />
                  </div>
                </div>
                <div className="rightSide">
                  <div className="carImgWrap">
                    <img src={car} alt="car" />
                  </div>
                  <div className="mt-">
                    <label>Note</label>
                    <textarea
                      className="note"
                      defaultValue={previewData?.note || "N/A"}
                      readOnly
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between inputGroup2">
              <div>
                <label className="block ">Technician Name</label>
                <input
                  defaultValue={previewData?.technician_name || "N/A"}
                  disabled
                  type="text"
                  // placeholder="Technician Name"
                />
              </div>
              <div>
                <label className="block">Technician Signature </label>
                <input
                  // defaultValue={previewData.technician_signature}
                  disabled
                  type="text"
                  // placeholder="Technician Signature"
                />
              </div>
              <div>
                <label className="block">Date </label>
                <input
                  defaultValue={formatDate(
                    previewData?.technician_date || "N/A"
                  )}
                  readOnly
                  type="text"
                  placeholder="Date"
                />
              </div>
              <div>
                <label className="block">I explained the car </label>
                <input
                  // defaultValue={previewData.vehicle_owner}
                  disabled
                  type="text"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-center  mt-3">
              <p className="text-xs">
                <b>Office: </b>
                {CompanyInfoData?.data?.address || "N/A"}
              </p>
              <p className="text-xs">
                {" "}
                <b> Mobile:</b> {CompanyInfoData?.data?.phone || "N/A"} ,{" "}
                {CompanyInfoData?.data?.whatsapp || "N/A"}
                <b> Email: </b> {CompanyInfoData?.data?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="printBtnGroup md:ml-[500px] mt-5 space-y-3 md:space-y-0 ">
        <Button
          sx={{ color: "white", borderRadius: "20px", padding: "7px 20px" }}
          onClick={handlePrint}
        >
          Print{" "}
        </Button>
        <a
          className="bg-[#42A0D9] text-white px-3 py-2  rounded-full mx-2 "
          href={`${import.meta.env.VITE_API_URL}/jobCards/jobcard/${
            previewData?._id
          }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
            JSON.stringify(companyProfileData)
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          Download
        </a>

        <Button
          sx={{
            color: "white",
            borderRadius: "20px",
            padding: "7px 20px",
            marginRight: "5px",
          }}
          component={Link}
          href={`/dashboard/create-quotation?order_no=${previewData?.job_no}`}
        >
          Quotation
        </Button>
        <Button
          sx={{ color: "white", borderRadius: "20px", padding: "7px 20px" }}
          component={Link}
          href={`/dashboard/update-jobcard?id=${id}`}
        >
          Edit
        </Button>
        <Button
          sx={{
            color: "white",
            borderRadius: "20px",
            padding: "7px 20px",
            marginLeft: "5px",
          }}
        >
          <WhatsappShareButton url={urlToShare}>
            <WhatsApp />
          </WhatsappShareButton>
        </Button>
      </div>
    </main>
  );
};

export default PreviewJobCard;
