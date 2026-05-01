/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';


const TASDateCalendar = ({ name, sx }) => {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        control={control}
        name={name}
        defaultValue={dayjs().format('YYYY-MM-DD')} 
        render={({ field: { onChange, value } }) => (
          <DateCalendar
            value={value ? dayjs(value) : dayjs()}
            onChange={(newValue) => {
              const formattedDate = newValue?.format('YYYY-MM-DD') || '';
              onChange(formattedDate);
            }}
            sx={{
              '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: '#1591A3',
                '&:hover': {
                  backgroundColor: '#1591A3',
                },
              },
              ...sx,
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default TASDateCalendar;

