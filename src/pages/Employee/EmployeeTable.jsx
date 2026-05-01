import { FaTrash } from "react-icons/fa";
import "./Employee.css";
import avatar from "../../../../public/assets/avatar.jpg";
import { HiOutlineArrowNarrowRight, HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import swal from "sweetalert";
import { toast } from "react-toastify";
import {
  useGetAllEmployeesQuery,
  useMoveRecycledEmployeeMutation,
} from "../../../redux/api/employee";
import Loading from "../../../components/Loading/Loading";
import { Pagination } from "@mui/material";

const EmployeeTable = () => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const textInputRef = useRef(null);
  const limit = 20;

  const {
    data: employeeData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useGetAllEmployeesQuery({
    limit,
    page: currentPage,
    searchTerm: filterType,
  });

  const [moveRecycledEmployee] = useMoveRecycledEmployeeMutation();

  const deleteEmployee = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this Employee to the Recycle Bin?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledEmployee(id).unwrap();
        swal(
          "Success!",
          "Employee moved to Recycle Bin successfully.",
          "success"
        );
      } catch (error) {
        swal(
          "Error!",
          "An error occurred while deleting the employee.",
          "error"
        );
      }
    }
  };

  if (employeesError) {
    toast.error(employeesError?.data?.message);
  }

  const recyclebinEmployeeList = employeeData?.data?.employees.filter(
    (employee) => employee.isRecycled === false
  );

  return (
    <div className="w-full mt-5 mb-24">
      <div className="w-full mt-5 mb-24">
        <div className="flex gap-2 flex-wrap items-center justify-between mb-5">
          <h3 className="txt-center text-xl font-bold md:text-3xl">
            Employee List
          </h3>
          <div className="flex flex-wrap items-center">
            <input
              onChange={(e) => setFilterType(e.target.value)}
              type="text"
              placeholder="Search"
              className="border py-2 px-3 rounded-md border-[#ddd]"
              ref={textInputRef}
            />
            <button
              className="bg-[#42A1DA] text-white px-2 py-2 rounded-md ml-1"
              disabled={filterType === ""}
            >
              <HiOutlineSearch size={25} />
            </button>
          </div>
        </div>
        {employeesLoading ? (
          <div className="flex items-center justify-center text-xl">
            <Loading />
          </div>
        ) : (
          <div>
            {recyclebinEmployeeList?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xl text-center">
                No matching employee found.
              </div>
            ) : (
              <section>
                <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-5">
                  {recyclebinEmployeeList?.map((employee) => (
                    <div key={employee._id} className="employeeCardWrapper">
                      <div className="employeeCard relative">
                        <Link
                          to={`/dashboard/employee-profile?id=${employee._id}`}
                        >
                          <img
                            className="employeeCardImg"
                            src={employee?.image || avatar}
                            alt="Employee"
                          />
                          <h3 className="text-xl font-semibold">
                            {employee?.full_name}
                          </h3>
                          <p>{employee?.designation}</p>
                          <div className="flex items-center justify-center">
                            <span>See More </span>
                            <HiOutlineArrowNarrowRight className="ml-1" />
                          </div>
                        </Link>
                        <button
                          onClick={() => deleteEmployee(employee._id)}
                          className="deleteButton absolute bottom-2 right-2"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
        {recyclebinEmployeeList?.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={employeeData?.data?.meta?.totalPages}
              page={currentPage}
              color="primary"
              onChange={(_, page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTable;
