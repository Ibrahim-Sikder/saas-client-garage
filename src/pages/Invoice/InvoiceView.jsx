/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Link, useLocation } from "react-router-dom";

import { Button, Divider } from "@mui/material";
import { usePDF } from "react-to-pdf";
import { formateNumber } from "../../utils/formateSemicolon";
import { useGetSingleInvoiceQuery } from "../../redux/api/invoice";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const InvoiceView = () => {
  const componentRef = useRef();
  const { targetRef } = usePDF({ filename: "page.pdf" });
  const { tenantDomain } = useTenantDomain();

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const companyProfileData = {
    companyName: CompanyInfoData?.data?.companyName,
    address: CompanyInfoData?.data?.address,
    website: CompanyInfoData?.data?.website,
    phone: CompanyInfoData?.data?.phone,
    email: CompanyInfoData?.data?.email,
    logo: CompanyInfoData?.data?.logo[0],
    companyNameBN: CompanyInfoData?.data?.companyNameBN,
  };
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
    @page {
      size: A4;
      margin: 0; 
    }

    body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .invoicePrintWrap {
      margin: 0 !important;
      padding: 0 !important;
    }
  `,
  });

  const [invoicePreview, setInvoicePreview] = useState({});
  console.log("invoice preview this ", invoicePreview);
  const net_total =
    invoicePreview?.net_total === invoicePreview?.advance
      ? invoicePreview?.net_total
      : invoicePreview?.due;

  const { data } = useGetSingleInvoiceQuery({
    tenantDomain,
    id,
  });

  useEffect(() => {
    if (data?.data) {
      setInvoicePreview(data.data);
    }
  }, [data]);

  const cleanNumber = (value) => {
    if (typeof value === "string") {
      return Number(value.replace(/[^0-9.-]+/g, ""));
    }
    return Number(value);
  };

  const totalAmountNumber = cleanNumber(invoicePreview?.net_total);
  const advanceAmountNumber = cleanNumber(invoicePreview?.advance);
  const isFullyPaid = totalAmountNumber === advanceAmountNumber;

  return (
    <div ref={componentRef} className="h-screen">
      <main ref={targetRef} className="invoicePrintWrap ">
        <div>
          <div className="pb-5 px-5 invoicePrint">
            <div>
              <div className=" mb-2 mx-auto text-center border-b-2 border-[#351E98] pb-2">
                <div className="flex items-center justify-between w-full mt-5 mb-2">
                  <img
                    className="w-[120px] "
                    src={CompanyInfoData?.data?.logo}
                    alt="logo"
                  />
                  <div>
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

                    <small className="block mt-3">
                      Office: {CompanyInfoData?.data?.address}
                    </small>
                  </div>
                  <div className="text-left">
                    <small className="block">
                      <small className="font-bold">Mobile:</small>
                      {CompanyInfoData?.data?.phone}
                    </small>
                    <small className="block">
                      <small className="font-bold">Email:</small>{" "}
                      {CompanyInfoData?.data?.email}
                    </small>
                    <small className="block font-bold ">
                      {CompanyInfoData?.data?.website}
                    </small>
                  </div>
                </div>
              </div>
              <div className="px-3">
                <div className="flex text-[12px] items-center justify-between border-b-2 pb-1 border-[#351E98]">
                  <span className="w-[200px] ">
                    {" "}
                    <b>ID:</b> {invoicePreview?.Id}
                  </span>
                  <b className="mr-[105px] uppercase">Invoice</b>
                  <b>
                    Date:
                    {invoicePreview?.date}
                  </b>
                </div>

                <div className="flex gap-x-2 items-center justify-between  mt-2 customerInfoWrapss">
                  <div className="flex items-center justify-between w-[50%]">
                    <div className="flex gap-x-2 justify-between overflow-hidden ">
                      <div className="invoiceCustomerInfo w-[87px]">
                        <b>Invoice No</b>
                        <>
                          {invoicePreview?.customer?.customer_name && (
                            <b>Customer Name</b>
                          )}

                          {invoicePreview?.company?.company_name && (
                            <b>Company Name</b>
                          )}

                          {invoicePreview?.showRoom?.showRoom_name && (
                            <b>Showroom Name</b>
                          )}
                        </>
                        <>
                          {invoicePreview?.customer?.company_name && (
                            <b>Company Name</b>
                          )}

                          {invoicePreview?.company?.vehicle_username && (
                            <b>Vehicle User Name</b>
                          )}

                          {invoicePreview?.showRoom?.vehicle_username && (
                            <b>Owner Name</b>
                          )}
                          {invoicePreview?.showRoom?.fullCompanyNum && (
                            <b>Phone</b>
                          )}
                          {invoicePreview?.customer?.fullCustomerNum && (
                            <b>Phone</b>
                          )}
                          {invoicePreview?.company?.fullCompanyNum && (
                            <b>Phone</b>
                          )}
                          {invoicePreview?.customer?.customer_address && (
                            <b>Address</b>
                          )}
                          {invoicePreview?.showRoom?.showRoom_address && (
                            <b>Address</b>
                          )}
                          {invoicePreview?.company?.company_address && (
                            <b>Address</b>
                          )}
                        </>
                      </div>
                      <div className="invoiceCustomerInfo">
                        <small>
                          <span className="mr-1">:</span>{" "}
                          {invoicePreview?.job_no}
                        </small>
                        <small>
                          {(invoicePreview?.customer?.customer_name ||
                            invoicePreview?.company?.company_name ||
                            invoicePreview?.showRoom?.showRoom_name) && (
                            <>
                              <span className="mr-1">:</span>
                              {invoicePreview?.customer?.customer_name ||
                                invoicePreview?.company?.company_name ||
                                invoicePreview?.showRoom?.showRoom_name}
                            </>
                          )}
                        </small>
                        {(invoicePreview?.customer?.company_name ||
                          invoicePreview?.company?.vehicle_username ||
                          invoicePreview?.showRoom?.vehicle_username) && (
                          <small>
                            <span className="mr-1">:</span>
                            {invoicePreview?.customer?.company_name ||
                              invoicePreview?.company?.vehicle_username ||
                              invoicePreview?.showRoom?.vehicle_username}
                          </small>
                        )}

                        {(invoicePreview?.customer?.fullCustomerNum ||
                          invoicePreview?.company?.fullCompanyNum ||
                          invoicePreview?.showRoom?.fullCompanyNum) && (
                          <small>
                            <span className="mr-1">:</span>
                            {invoicePreview?.customer?.fullCustomerNum ||
                              invoicePreview?.company?.fullCompanyNum ||
                              invoicePreview?.showRoom?.fullCompanyNum}
                          </small>
                        )}

                        {(invoicePreview?.customer?.customer_address ||
                          invoicePreview?.company?.company_address ||
                          invoicePreview?.showRoom?.showRoom_address) && (
                          <small>
                            <span className="mr-1">:</span>
                            {invoicePreview?.customer?.customer_address ||
                              invoicePreview?.company?.company_address ||
                              invoicePreview?.showRoom?.showRoom_address}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="invoiceLine"></div>
                  <div className="flex gap-x-2 w-[50%]    ">
                    <div className="invoiceCustomerInfo w-[87px] ">
                      <b>Registration No </b>
                      <b>Chassis No </b>
                      <b>Engine & CC </b>
                      <b>Vehicle Name </b>
                      <b>Mileage </b>
                    </div>
                    <div className="invoiceCustomerInfo">
                      <small>
                        {" "}
                        <span className="mr-1">:</span>{" "}
                        {invoicePreview?.vehicle?.carReg_no}
                        <span> {invoicePreview?.vehicle?.fullRegNum}</span>
                      </small>
                      <small>
                        {" "}
                        <span className="mr-1">:</span>{" "}
                        {invoicePreview?.vehicle?.chassis_no}
                      </small>
                      <small>
                        {" "}
                        <span className="mr-1">:</span>{" "}
                        {invoicePreview?.vehicle?.engine_no}
                      </small>
                      <small>
                        {" "}
                        <span className="mr-1">:</span>{" "}
                        {invoicePreview?.vehicle?.vehicle_name}
                      </small>
                      <small>
                        {" "}
                        <span className="mr-1">:</span>
                        {invoicePreview?.mileage}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <table className="mt-5 invoiceTable2 qutationTables ">
                  <thead className="tableWrap">
                    <tr>
                      <th className="serialNo">SL No</th>
                      <th>
                        Third Party Work, Materials, Repairs, diagnosis,
                        Service, Description
                      </th>
                      <th>Qty </th>
                      <th>Rate</th>
                      <th>Amount </th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {invoicePreview?.service_input_data?.map(
                        (data, index) => (
                          <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.description}</td>
                            <td>
                              {data.quantity} {data.unit}
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
                  <b className="ml-3 ">
                    {" "}
                    {invoicePreview?.service_total} &#2547;{" "}
                  </b>
                </div>

                <div className="flex  justify-end ">
                  <Divider sx={{ width: "200px", marginTop: "5px" }} />
                </div>
              </div>

              {invoicePreview?.input_data?.length > 0 && (
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
                        {invoicePreview?.input_data?.map((data, index) => (
                          <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.description}</td>
                            <td>
                              {data.quantity} {data.unit}
                            </td>
                            <td>{formateNumber(data.rate)}</td>
                            <td>{formateNumber(data.total)}</td>
                          </tr>
                        ))}
                      </>
                    </tbody>
                  </table>

                  <div className="flex items-center justify-end text-[12px] mt-2">
                    <span>Total Parts Amount :</span>
                    <b className="ml-3 ">
                      {" "}
                      {invoicePreview?.parts_total} &#2547;{" "}
                    </b>
                  </div>
                  <div className="flex  justify-end ">
                    <Divider sx={{ width: "200px", marginTop: "5px" }} />
                  </div>
                </div>
              )}

              <div className="flex justify-between items-end mt-3 border-b-[1px] pb-3 border-[#ddd]">
                <div className="mt-5 text-[12px] invisible"></div>
                <div className="flex netTotalAmounts">
                  <div>
                    <b>Sub Total </b>
                    {invoicePreview.discount !== 0 && <b> Discount </b>}
                    {invoicePreview.vat > 0 && <b> VAT </b>}
                    {invoicePreview.tax > 0 && <b> Tax included </b>}
                    <b> Grand Total </b>

                    {advanceAmountNumber !== 0 && (
                      <>
                        {isFullyPaid ? <b> Paid </b> : <b> Advance </b>}
                        {!isFullyPaid &&
                          invoicePreview.due &&
                          invoicePreview.due !== 0 && <b> Due </b>}
                      </>
                    )}
                  </div>
                  <div>
                    <small>
                      {" "}
                      : {formateNumber(invoicePreview?.total_amount)}{" "}
                      &#2547;{" "}
                    </small>
                    {invoicePreview.discount > 0 && (
                      <small>
                        : {formateNumber(invoicePreview.discount)} &#2547;
                      </small>
                    )}
                    {invoicePreview.vat !== 0 && (
                      <small> : {formateNumber(invoicePreview.vat)}%</small>
                    )}
                    {invoicePreview.tax > 0 && (
                      <small> : {formateNumber(invoicePreview.tax)}% </small>
                    )}
                    <small>
                      : {formateNumber(invoicePreview.net_total)} &#2547;
                    </small>
                    {advanceAmountNumber !== 0 && (
                      <>
                        <small>
                          : {formateNumber(advanceAmountNumber)} &#2547;
                        </small>
                        {!isFullyPaid && invoicePreview.due !== 0 && (
                          <small>
                            : {formateNumber(invoicePreview.due)} &#2547;
                          </small>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 text-[12px]">
                <b className="">In words:</b>{" "}
                {invoicePreview?.net_total_in_words}
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

        <div className="printInvoiceBtnGroup">
          <button onClick={handlePrint}>Print </button>

          <Link to={`/dashboard/update-invoice?id=${id}`}>
            <button> Edit </button>
          </Link>
          <Button sx={{ fontSize: "12px" }}>
            <a
              className="text-[10px]"
              href={`${import.meta.env.VITE_API_URL}/invoices/invoice/${
                invoicePreview._id
              }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
                JSON.stringify(companyProfileData),
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
          </Button>
          <Link
            to={`/dashboard/money-receive-create?order_no=${invoicePreview.job_no}&id=${invoicePreview?._id}&net_total=${net_total}`}
          >
            <button> Money </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default InvoiceView;
