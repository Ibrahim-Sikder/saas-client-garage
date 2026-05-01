/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import { useGetAllQuotationsQuery } from "../../redux/api/quotation";
  import { useGetAllJobCardsQuery } from "../../redux/api/jobCard";
  import { useGetAllInvoicesQuery } from "../../redux/api/invoice";
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "10px",
            border: "1px solid #cccccc",
          }}
        >
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Jobcard: ${payload[0].value}`}</p>
          <p className="intro">{`Invoice: ${payload[1].value}`}</p>
          <p className="intro">{`Quotation: ${payload[2].value}`}</p>
        </div>
      );
    }
  
    return null;
  };
  
  
  export default function ExpanseIncomeChart() {
    const { data: jobCardData } = useGetAllJobCardsQuery({
      limit: 10,
      page: 1,
    });
  
    const { data: qutationData } = useGetAllQuotationsQuery({
      limit: 10,
      page: 1,
    });
  
    const { data: invoiceData } = useGetAllInvoicesQuery({
      limit: 10,
      page: 1,
    });
  
    const data = [
      {
        name: "Jobcard",
        Jobcard: jobCardData?.data?.jobCards?.length || 0,
        Quotation: qutationData?.data?.quotations?.length || 0,
        Invoice: invoiceData?.data?.invoices?.length || 0,
      },
      {
        name: "Quotation",
        Jobcard: qutationData?.data?.quotations?.length || 0,
        Quotation: 0,
        Invoice: 0,
      },
      {
        name: "Invoice",
        Jobcard: jobCardData?.data?.jobCards?.length || 0,
        Quotation: qutationData?.data?.quotations?.length || 0,
        Invoice: invoiceData?.data?.invoices?.length || 0,
      },
    ];
  
    return (
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 5, right: 30, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="Jobcard" stroke="#8884d8" />
          <Line type="monotone" dataKey="Quotation" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Invoice" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  