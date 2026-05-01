import { FaTrashAlt, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

const SupplierDueList = () => {
  return (
    <div className="mt-5 mb-24 w-full">
      <div className="overflow-x-auto ">
        <table className="table ">
          <thead className="tableWrap">
            <tr>
              <th>SL</th>
              <th>Total Pay </th>
              <th>Total Due </th>
              <th>Payable date</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01</td>
              <td>234576 </td>
              <td>3565</td>
              <td>22-03-2023</td>
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

export default SupplierDueList;
