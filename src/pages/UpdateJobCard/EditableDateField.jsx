/* eslint-disable react/prop-types */
import { useState } from "react";
import '../AddJobCard/AddJobCard.css'
const EditableDateField = ({ value, onChange, maxDate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDateChange = (e) => {
    const rawDate = e.target.value;
    const parsedDate = new Date(rawDate);
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    onChange(formattedDate);
  };

  return (
    <div>
      {isEditing ? (
        <input
          className="outline-none cursor-pointer border border-gray-600 rounded-md px-4 py-2"
          onChange={handleDateChange}
          autoComplete="off"
          type="date"
          max={maxDate}
          defaultValue={value}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="border border-gray-600 rounded-md px-4 py-2 cursor-pointer"
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default EditableDateField;