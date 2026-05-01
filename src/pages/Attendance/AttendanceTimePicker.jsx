/* eslint-disable react/prop-types */
import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function AttendanceInTimePicker({
  handleAttendanceInTime,
  index,
}) {
  // Initialize state for the time value
  const [selectedTime, setSelectedTime] = useState(dayjs());

  // Handler for when the time changes
  const handleTimeChange = (time) => {
    setSelectedTime(time);
    handleAttendanceInTime(index, time);
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
