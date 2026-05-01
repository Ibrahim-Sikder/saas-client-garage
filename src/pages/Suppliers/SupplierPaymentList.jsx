import { FaTrashAlt, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

const SupplierPaymentList = () => {
  return (
    <div className="mt-5 mb-24 w-full">
      <div className="overflow-x-auto ">
        <table className="table ">
          <thead className="tableWrap">
            <tr>
              <th>SL</th>
              <th>Payment Method </th>
              <th>Payment Details </th>
              <th>Email</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>FSIB </td>
              <td>BMW2343</td>
              <td>BDT1005</td>
              <td>
                <div className="flex items-center justify-center ">
                  <Link to="/dashboard/supplier-profile">
                    <FaUserTie className="invoicIcon" />
                  </Link>
                </div>
              </td>
              <td>
                <div className="editIconWrap">
                  <FaTrashAlt className="deleteIcon text-red-500" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierPaymentList;
