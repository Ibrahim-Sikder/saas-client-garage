/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ExpanseIncomeChart = () => {
  // const { data: jobCardData } = useGetAllJobCardsQuery({
  //   limit: 10,
  //   page: 1,
  // });

  // const { data: qutationData } = useGetAllQuotationsQuery({
  //   limit: 10,
  //   page: 1,
  // });

  // const { data: invoiceData } = useGetAllInvoicesQuery({
  //   limit: 10,
  //   page: 1,
  // });
  const [chartData] = useState({
    series: [
      {
        name: "Jobcard",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Quotation",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ExpanseIncomeChart;





// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import necessary styles

// // Localizer for the calendar using moment.js
// const localizer = momentLocalizer(moment);

// // Sample events list
// const myEventsList = [
//   {
//     title: 'Team Meeting',
//     start: new Date(2025, 11, 11, 11, 11), 
//     end: new Date(2025, 11, 11, 11, 11),
//   },
//   {
//     title: 'Lunch Break',
//     start: new Date(2025, 0, 7, 13, 0),
//     end: new Date(2025, 0, 7, 14, 0),
//   },
//   {
//     title: 'Project Review',
//     start: new Date(2025, 0, 8, 15, 0),
//     end: new Date(2025, 0, 8, 16, 30),
//   },
// ];

// const App = () => {
//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>My Calendar</h1>
//       <Calendar
//         localizer={localizer}
//         events={myEventsList}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: 500 }}
//       />
//     </div>
//   );
// };

// export default App
