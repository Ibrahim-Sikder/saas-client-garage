/* eslint-disable react/prop-types */
import { IoCloseSharp } from "react-icons/io5";
import JobCardForm from "../../Customer/CustomerProfile/JobCardForm";

const ShowRoomAddVehicleModal = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black/60 backdrop-blur-sm ">
      <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full md:w-[470px]  lg:w-[870px]  h-[1000px] overflow-auto ">
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

          <JobCardForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ShowRoomAddVehicleModal;
