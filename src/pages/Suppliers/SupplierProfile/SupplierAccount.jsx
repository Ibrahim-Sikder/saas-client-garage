import { FaInfo, FaRegEdit } from "react-icons/fa";
import Card from "../../../../components/Card/Card";
import invoice from "../../../../../public/assets/invoice.png";
import { Link } from "react-router-dom";
const SupplierAccount = () => {
  return (
    <div className="customerProfileWrap">
      <div>

        <div className="block md:flex justify-between mt-5">
          <Card>
            <h3 className="text-xl font-semibold mb-2">Supplier Contact Info </h3>
            <div className="flex items-center justify-between">
              <div>
                <div>
                  Supplier Name: <b>Mr. Rahat </b>
                </div>
                <div>
                  Phone Number: <b>0657899444</b>
                </div>
              </div>
              <div>
                <div>
                  Shop Name: <b>Auto Solution </b>
                </div>
                <span>
                  Email Address: <b>supplier@gmail.com</b>
                </span>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold mb-2">Address Details </h3>
            <div className="flex items-center justify-between">
              <div>
                <div>
                  Country: <b>Bangladesh</b>
                </div>
                <div>
                  City: <b>Dhaka</b>
                </div>
              </div>
              <div>
                <div>
                  State: <b>Dhaka</b>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="block md:flex justify-between  mt-5">
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Paid Bill </h3>
              <Link to='/dashboard/create-job-card'><FaRegEdit size={30} /></Link>
            </div>
            <div className=" mt-10 flex items-center justify-between">
              <div className="flex items-center my-3">
                <div className="cardIcon bg-[#03045E] ">
                  <b className="block">Feb</b>
                  <b>30</b>
                </div>
                <div className="ml-3">
                  <b>TSA056888</b>
                  <div className="flex items-center">
                    <p>Booked Vehicle </p>
                    <FaInfo
                      size={15}
                      className="bg-[#D9D9D9] rounded-full p-1 text-white ml-2"
                    />
                  </div>
                </div>
              </div>
              <b>BDT2400</b>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center my-3">
                <div className="cardIcon bg-[#48CAE4]">
                  <b className="block">Feb</b>
                  <b>30</b>
                </div>
                <div className="ml-3">
                  <b>TSA056888</b>
                  <div className="flex items-center">
                    <p>Booked Vehicle </p>
                    <FaInfo
                      size={15}
                      className="bg-[#D9D9D9] rounded-full p-1 text-white ml-2"
                    />
                  </div>
                </div>
              </div>
              <b>BDT2400</b>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Due Bill </h3>
              <Link to='/dashboard/create-job-card'><FaRegEdit size={30} /></Link>
            </div>
            <img className="w-64 mx-auto " src={invoice} alt="" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierAccount;
