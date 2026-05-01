import PurChaseForm from "./PurChaseForm";

const AddAdjustment = () => {
  return (
    <div className="py-10">
      <div className="ml-5">
        <h2 className="mb-3">Add Purchase</h2>
        <span> Product &gt; Add Purchase</span>
      </div>
      <div className="  bg-[#F7F7F7] p-2 md:p-8 mt-5 ">
        <div className=" gap-x-8 bg-[#FFFFFF] p-2 md:p-8 rounded-md ">
          <PurChaseForm />
        </div>
      </div>
    </div>
  );
};


export default AddAdjustment;
