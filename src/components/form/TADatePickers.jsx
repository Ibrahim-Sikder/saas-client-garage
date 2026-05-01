/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./datePicker.css";
const TADatePickers = ({ date, handleDateChange, selectedDate }) => {
  const datePickerRef = useRef(null);

  

  useEffect(() => {
    flatpickr(datePickerRef.current, {
      dateFormat: "d-m-y",
      onChange: (dateStr) => {
        handleDateChange(dateStr); 
      },
    });
  }, [handleDateChange]);

  return (
    <>
      <div className="flex items-center">
        <input
          className="border-2 border-gray-500 w-40 h-10 text-center rounded px-2 py-4"
          ref={datePickerRef}
          type="text"
          value={selectedDate || date }
          placeholder="Select Date "
        />
      </div>
    </>
  );
};

export default TADatePickers;
