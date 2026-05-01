/* eslint-disable react/prop-types */
import { useState } from 'react';
import dayjs from 'dayjs'; // Import Day.js library
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function AttendanceOutTimePicker({
  handleAttendanceOutTime,
  index,
}) {
  // Initialize state for the time value
  const [selectedTime, setSelectedTime] = useState(dayjs());

  // Handler for when the time changes
  const handleTimeChange = (time) => {
    setSelectedTime(time);
    handleAttendanceOutTime(index, time);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "DatePicker",
          "TimePicker",
          "DateTimePicker",
          "DateRangePicker",
        ]}
      >
        <DemoItem>
          <TimePicker
            value={selectedTime}
            onChange={handleTimeChange}
            renderInput={(props) => <input {...props} />}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
