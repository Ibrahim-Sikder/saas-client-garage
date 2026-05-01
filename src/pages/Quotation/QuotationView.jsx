/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Link, useLocation } from "react-router-dom";
import "../../pages/Invoice/Invoice.css";
import "./Quotation.css";
import { Divider } from "@mui/material";
import Loading from "../../components/Loading/Loading";
import { useGetSingleQuotationQuery } from "../../redux/api/quotation";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { formateNumber } from "../../utils/formateSemicolon";
import { useCompanyProfileData } from "../../hooks/useCompanyProfileData";

const Detail = () => {
  const componentRef = useRef();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain } = useTenantDomain();
  const { data: profileData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const { companyProfileData } = useCompanyProfileData();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [quotationPreview, setQuotationPreview] = useState({});
  const [loading, setLoading] = useState(false);
  const { data } = useGetSingleQuotationQuery({
    tenantDomain,
    id,
  });
  console.log("single quotation ", quotationPreview);
  useEffect(() => {
    if (data?.data) {
      setQuotationPreview(data.data);
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div ref={componentRef}>
      <main className="invoicePrintWrap">
        <div>
          <div className="pb-5 px-5 invoicePrint">
            <div>
              <div className=" mb-2 mx-auto text-center border-b-2 border-[#7493B8] pb-2">
                <div className="flex items-center justify-between w-full mt-5 mb-2">
                  <img
                    className="w-[120px] "
                    src={profileData?.data?.logo}
                    alt="logo"
                  />
                  <div>
                    <div className="flex-1 text-center">
                      {profileData?.data?.companyNameBN && (
                        <h2 className="trustAutoTitle">
                          {profileData.data.companyNameBN}
                        </h2>
                      )}

                      {profileData?.data?.companyName && (
                        <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
                          {profileData.data.companyName}
                        </h3>
                      )}
                    </div>
                    <small className="block mt-2">
                      Office: {profileData?.data?.address}
                    </small>
                  </div>
                  <div className="text-left">
                    <small className="block">
                      <small className="font-bold">Mobile:</small>{" "}
                      {profileData?.data?.phone}
                    </small>
                    <small className="block">
                      <small className="font-bold">Email:</small>{" "}
                      {profileData?.data?.email}
                    </small>
                    <small className="block font-bold ">
                      {profileData?.data?.website}
                    </small>
                  </div>
                </div>
              </div>

              <div className="px-3">
                <div className="flex text-[12px] items-center justify-between border-b-2 pb-1 border-[#7493B8]">
                  <span className="w-[200px] ">
                    <b>ID:</b> {quotationPreview?.Id}
                  </span>
                  <b className="mr-[105px] uppercase">Quotation</b>
                  <b>Date: {quotationPreview?.date}</b>
                </div>

                <div className="flex gap-x-2 items-center justify-between  mt-2 customerInfoWrapss">
                  <div className="flex   w-[50%]">
                    <div className="invoiceCustomerInfo w-[92px]">
                      <b>Quotation No</b>
                      <>
                        {quotationPreview?.customer?.customer_name && (
                          <b>Customer Name</b>
                        )}

                        {quotationPreview?.company?.company_name && (
                          <b>Company Name</b>
                        )}

                        {quotationPreview?.showRoom?.showRoom_name && (
                          <b>Showroom Name</b>
                        )}
                      </>
                      <>
                        {quotationPreview?.customer?.company_name && (
                          <b>Company Name</b>
                        )}

                        {quotationPreview?.company?.vehicle_username && (
                          <b>Vehicle User Name</b>
                        )}

                        {quotationPreview?.showRoom?.vehicle_username && (
                          <b> Owner Name</b>
                        )}

                        {quotationPreview?.showRoom?.fullCompanyNum && (
                          <b>Phone</b>
                        )}
                        {quotationPreview?.customer?.fullCustomerNum && (
                          <b>Phone</b>
                        )}
                        {quotationPreview?.company?.fullCompanyNum && (
                          <b>Phone</b>
                        )}
                        {quotationPreview?.customer?.customer_address && (
                          <b>Address</b>
                        )}
                        {quotationPreview?.showRoom?.showRoom_address && (
                          <b>Address</b>
                        )}
                        {quotationPreview?.company?.company_address && (
                          <b>Address</b>
                        )}
                      </>
                    </div>
                    <div className="invoiceCustomerInfo">
                      <small>
                        <span className="mr-1">:</span>{" "}
                        {quotationPreview?.job_no}
                      </small>
                      {(quotationPreview?.customer?.customer_name ||
                        quotationPreview?.company?.company_name ||
                        quotationPreview?.showRoom?.showRoom_name) && (
                        <small>
                          <span className="mr-1">:</span>
                          {quotationPreview?.customer?.customer_name ||
                            quotationPreview?.company?.company_name ||
                            quotationPreview?.showRoom?.showRoom_name}
                        </small>
                      )}

                      {(quotationPreview?.customer?.company_name ||
                        quotationPreview?.company?.vehicle_username ||
                        quotationPreview?.showRoom?.vehicle_username) && (
                        <small>
                          <span className="mr-1">:</span>
                          {quotationPreview?.customer?.company_name ||
                            quotationPreview?.company?.vehicle_username ||
                            quotationPreview?.showRoom?.vehicle_username}
                        </small>
                      )}

                      {(quotationPreview?.customer?.fullCustomerNum ||
                        quotationPreview?.company?.fullCompanyNum ||
                        quotationPreview?.showRoom?.fullCompanyNum) && (
                        <small>
                          <span className="mr-1">:</span>
                          {quotationPreview?.customer?.fullCustomerNum ||
                            quotationPreview?.company?.fullCompanyNum ||
                            quotationPreview?.showRoom?.fullCompanyNum}
                        </small>
                      )}

                      {(quotationPreview?.customer?.customer_address ||
                        quotationPreview?.company?.company_address ||
                        quotationPreview?.showRoom?.showRoom_address) && (
                        <small>
                          <span className="mr-1">:</span>
                          {quotationPreview?.customer?.customer_address ||
                            quotationPreview?.company?.company_address ||
                            quotationPreview?.showRoom?.showRoom_address}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="invoiceLine"></div>
                  <div className="flex  w-[50%]">
                    <div className="invoiceCustomerInfo w-[92px]">
                      <b>Registration No </b>
                      <b>Chassis No </b>
                      <b>Engine & CC </b>
                      <b>Vehicle Name </b>
                      <b>Mileage </b>
                    </div>
                    <div className="invoiceCustomerInfo">
                      <small>
                        <span className="mr-1">:</span>
                        {quotationPreview?.vehicle?.carReg_no}
                        <span> {quotationPreview?.vehicle?.fullRegNum}</span>
                      </small>
                      <small>
                        <span className="mr-1">:</span>{" "}
                        {quotationPreview?.vehicle?.chassis_no}
                      </small>
                      <small>
                        <span className="mr-1">:</span>{" "}
                        {quotationPreview?.vehicle?.engine_no}
                      </small>
                      <small>
                        <span className="mr-1">:</span>{" "}
                        {quotationPreview?.vehicle?.vehicle_name}
                      </small>
                      <small>
                        <span className="mr-1">:</span>{" "}
                        {quotationPreview?.mileage}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <table className="mt-5 invoiceTable2 qutationTables">
                <thead className="tableWrap">
                  <tr>
                    <th className="serialNo">SL No</th>
                    <th>
                      Third Party Work, Materials, Repairs, diagnosis, Service,
                      Description
                    </th>
                    <th>Qty </th>
                    <th>Rate</th>
                    <th>Amount </th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {quotationPreview?.service_input_data?.map(
                      (data, index) => (
                        <tr key={data?._id}>
                          <td>{index + 1}</td>
                          <td>{data.description}</td>
                          <td>
                            {data?.quantity} {data.unit}
                          </td>
                          <td>{formateNumber(data.rate)}</td>
                          <td>{formateNumber(data.total)}</td>
                        </tr>
                      ),
                    )}
                  </>
                </tbody>
              </table>
              <div className="flex items-center justify-end text-[12px] mt-2">
                <span>Total Services Amount :</span>
                <b className="ml-3 ">৳ {quotationPreview?.service_total}</b>
              </div>

              {quotationPreview.input_data?.length > 0 && (
                <>
                  <div>
                    <table className="mt-5 invoiceTable2 qutationTables">
                      <thead className="tableWrap">
                        <tr>
                          <th className="serialNo">SL No</th>
                          <th>Parts Description</th>
                          <th>Qty </th>
                          <th>Rate</th>
                          <th>Amount </th>
                        </tr>
                      </thead>
                      <tbody>
                        <>
                          {quotationPreview?.input_data?.map((data, index) => (
                            <tr key={data._id}>
                              <td>{index + 1}</td>
                              <td>{data.description}</td>
                              <td>
                                {data.quantity} {data.unit}{" "}
                              </td>
                              <td>{formateNumber(data.rate)}</td>
                              <td>{formateNumber(data.total)}</td>
                            </tr>
                          ))}
                        </>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <div className="flex items-center justify-end text-[12px] mt-2">
                      <span>Total Parts Amount :</span>
                      <b className="ml-3 ">৳ {quotationPreview?.parts_total}</b>
                    </div>
                    <div className="flex  justify-end ">
                      <Divider sx={{ width: "200px", marginTop: "5px" }} />
                    </div>
                  </div>
                </>
              )}
              <div>
                <div className="flex justify-between items-end mt-3 border-b-[1px] pb-3 border-[#ddd]">
                  <div className="mt-5 text-[12px] invisible"></div>
                  <div className="flex netTotalAmounts">
                    <div className="">
                      <b>Sub Total </b>
                      {quotationPreview?.discount !== 0 && <b> Discount </b>}
                      {quotationPreview?.vat !== 0 && <b> VAT </b>}
                      {quotationPreview?.tax !== 0 && <b> Tax included </b>}
                      <b> Grand Total </b>
                    </div>
                    <div>
                      <small> : ৳ {quotationPreview?.total_amount}</small>
                      {quotationPreview?.discount !== 0 && (
                        <small> : &#2547; {quotationPreview?.discount} </small>
                      )}
                      {quotationPreview?.vat !== 0 && (
                        <small> : {quotationPreview?.vat}%</small>
                      )}
                      {quotationPreview?.tax !== 0 && (
                        <small> : {quotationPreview?.tax}%</small>
                      )}
                      <small> : ৳ {quotationPreview?.net_total}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-[12px]">
                <b className="">In words:</b>{" "}
                {quotationPreview?.net_total_in_words}
              </div>
            </div>
            {/* Signature Section */}
            <div className="flex justify-between mt-16 mb-5 text-[12px]">
              <div className="text-center">
                <div className="border-t border-black pt-1 mx-auto w-48">
                  Client Signature
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-black pt-1 mx-auto w-48">
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="printInvoiceBtnGroup">
            <button onClick={handlePrint}>Print </button>

            <Link to={`/dashboard/update-quotation?id=${id}`}>
              <button> Edit </button>
            </Link>
            <a
              className="bg-[#42A0D9] text-white px-2 py-1  rounded-full "
              href={`${import.meta.env.VITE_API_URL}/quotations/quotation/${
                quotationPreview?._id
              }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
                JSON.stringify(companyProfileData),
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
            <Link
              to={`/dashboard/create-invoice?order_no=${quotationPreview?.job_no}&id=${id}`}
            >
              <button> Invoice </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
