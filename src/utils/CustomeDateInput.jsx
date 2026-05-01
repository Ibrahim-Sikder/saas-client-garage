/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import  { useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Importing flatpickr CSS

function DatePicker({ defaultValue }) {
    const datePickerRef = useRef(null);

    useEffect(() => {
        const fp = flatpickr(datePickerRef.current, {
            dateFormat: "d/m/Y", 
            defaultDate: defaultValue, 
            onChange: function(selectedDates, dateStr, instance) {
              
            },
        });

        // Cleanup function to destroy flatpickr instance
        return () => fp.destroy();
    }, [defaultValue]);

    return (
        <input ref={datePickerRef} />
    );
}

export default DatePicker;
