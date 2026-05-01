import { HiCheck, HiOutlineX } from "react-icons/hi";
import "../Employee.css";
import avatar from "../../../../public/assets/avatar.jpg";
const AttendanceTable = () => {
  const generateIcons = (totalCells, closePositions) => {
    const icons = [];
    let closeCounter = 0;
    for (let i = 0; i < totalCells; i++) {
      if (closePositions.includes(i + 1) && closeCounter < 7) {
        icons.push(
          <HiOutlineX
            key={`close_${i}`}
            size={20}
            className="text-[#F62D51] attendanceIcon"
          />
        );
        closeCounter++;
      } else {
        icons.push(
          <HiCheck
            key={`check_${i}`}
            className="text-[#4AB657] attendanceIcon "
            size={20}
          />
        );
      }
    }
    return icons;
  };

  // Define the positions where close icons should appear
  const closeIconPositions = [Math.floor(20 / 2), 1, 31];

  return (
    <div className="mt-10 table-container">
      <h3 className="mt-5 mb-8 text-2xl font-semibold">
        Employee Attendance Sheet : March 2024
      </h3>

      <table className="attendanceTable">
        <thead>
          <tr className="bg-[#42A1DA] text-white ">
            <th>Employee </th>
            <th>Employee ID </th>
            {[...Array(31).keys()].map((day) => (
              <th key={day}>
                <div>
                  <span>March </span>
                  {day + 1}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(6).keys()].map((row) => (
            <tr key={row} className={row % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                <div className="flex items-center">
                  <img
                    src={avatar}
                    className="object-cover w-8 h-8 mr-2 rounded-full"
                    alt=""
                  />
                  <span>Mr John</span>
                </div>
              </td>
              <td>0002024</td>
              {generateIcons(31, closeIconPositions).map((icon, index) => (
                <td key={index}>
                  <span className="block attendanceIcon">{icon}</span>
                  <div className="flex items-center justify-center">
                    <small className="block mt-3">12.30 - 5.00 </small>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
