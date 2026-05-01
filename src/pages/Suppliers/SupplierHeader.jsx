import { FaUsers } from "react-icons/fa";

const SupplierHeader = () => {
  return (
    <div className="mb-2 md:mb-4">
      <div className="flex   items-center   justify-center   mt-8   mb-10   p-4   rounded-md   text-white   [background:linear-gradient(135deg,_#42A1DA_0%,_#2980b9_100%)]">
        <FaUsers size={70} className="mr-4" />
        <div>
          <h1 className="text-2xl md:text-[33px] font-semibold">New Supplier</h1>
          <p className="text-sm md:text-base text-white">
            Add New Supplier to Your Network
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierHeader;
