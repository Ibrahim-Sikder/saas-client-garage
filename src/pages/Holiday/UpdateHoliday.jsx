
import HolidayForm from './HolidayForm';

const UpdateHoliday = () => {
      const holidayId = new URLSearchParams(location.search).get("holidayId");

      return <HolidayForm holidayId={holidayId}/>;
};

export default UpdateHoliday;