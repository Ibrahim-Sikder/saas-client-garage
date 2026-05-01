/* eslint-disable react/prop-types */
import Select from "react-select";
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const leaves = [
  { value: "Select Month ", label: "Select Month " },
  { value: "Casual Leave", label: "Casual Leave " },
  { value: "Annual Leave ", label: "Annual Leave " },
];

const initialSelectedOption = leaves[0];
const AttendanceModal = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black/60 backdrop-blur-sm ">
      <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  w-[470px]  lg:max-w-[984px]  h-[800px] overflow-auto ">
        <div className="bg-white shadow-md dark:bg-[#12141D] rounded-xl  overflow-hidden p-10">
          <div className="flex justify-end ">
            <IoCloseSharp
              size={25}
              onClick={onClose}
              width={24}
              height={24}
              className="text-white rounded-full cursor-pointer top-10 right-10 bg-[#A0A0A0] p-1"
            />
          </div>
          <h2 className="text-xl font-semibold text-center ">
            Add Attendance{" "}
          </h2>
          <div>
            <div className="mt-4">
              <div className="flex">
                <label className="block mb-1">Employee Name </label>
                <span className="ml-1 text-red-600">*</span>
              </div>

              <input type="text" className="attendanceInput " />
            </div>
            <div className="mt-4">
            <div className="flex">
              <label className="block mb-1">Employee ID </label>
              <span className="ml-1 text-red-600">*</span>
            </div>

            <input type="text" className="attendanceInput " />
          </div>
            <div className='mt-4'>
            <div className="flex">
            <label className="block mb-1"> Select Year </label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={leaves}
            style={{
                height:'50px'
            }}
          />
            </div>
            <div className='mt-4'>
            <div className="flex">
            <label className="block mb-1"> Select Month </label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={leaves}
          />
            </div>
            <div className='mt-4'>
            <div className="flex">
            <label className="block mb-1"> Select Date </label>
            <span className="ml-1 text-red-600">*</span>
          </div>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={leaves}
          />
            </div>
            
            <div className="mt-4">
              <div className="flex">
                <label className="block mb-1">Date</label>
                <span className="ml-1 text-red-600">*</span>
              </div>

              <input
                type="date"
                className="w-full border-2-[#ddd] border p-2 rounded-sm "
              />
            </div>

          
           
           
            <div className="mt-5 text-center">
              <button className="border-2-[#ddd] border rounded-2xl w-52 h-12 mx-auto  bg-[#FF851A] text-white ">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
