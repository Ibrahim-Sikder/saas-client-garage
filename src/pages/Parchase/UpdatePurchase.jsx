import PurChaseForm from "./PurChaseForm";

const UpdatePurchase = () => {
  return (
    <div className="py-10">
      <div className="ml-5">
        <h2 className="mb-3">Update Purchase</h2>
        <span> Product &gt; Update Purchase</span>
      </div>
      <div className="  bg-[#F7F7F7] p-8 mt-5 ">
        <div className=" gap-x-8 bg-[#FFFFFF] p-8 rounded-md ">
          <PurChaseForm />
        </div>
      </div>
    </div>
  );
};

export default UpdatePurchase;
