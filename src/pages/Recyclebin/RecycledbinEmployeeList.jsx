import { FaUsers, FaTrash } from "react-icons/fa";
import { NotificationAdd } from "@mui/icons-material";
import { FaUserGear } from "react-icons/fa6";
import avatar from "../../../public/assets/avatar.jpg";
import { HiOutlineArrowNarrowRight, HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import swal from "sweetalert";
import { toast } from "react-toastify";
import {
  useGetAllEmployeesQuery,
  usePermenantlyDeleteEmployeeMutation,
  useRestoreFromRecycledEmployeeMutation,
} from "../../redux/api/employee";
import Loading from "../../components/Loading/Loading";
import { Pagination } from "@mui/material";
import { useAppOptions } from "../../hooks/useAppOptions";

const RecycledbinEmployeeList = () => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const textInputRef = useRef(null);
  const limit = 20;
  const { tenantDomain } = useAppOptions()

  const {
    data: employeeData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useGetAllEmployeesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
  });

  const [restoreFromRecycledEmployee] =
    useRestoreFromRecycledEmployeeMutation();
  const [permenantlyDeleteEmployee] = usePermenantlyDeleteEmployeeMutation();

  const handleDeleteOrRestore = async (id) => {
    const result = await swal({
      title: "Select Action",
      text: "Choose what you want to do with this Employee.",
      icon: "warning",
      buttons: {
        restore: {
          text: "Restore",
          value: "restore",
          visible: true,
          className: "btn-restore",
        },
        delete: {
          text: "Permanently Delete",
          value: "delete",
          visible: true,
          className: "btn-delete",
        },
      },
      className: "custom-swal",
    });

    if (result === "restore") {
      try {
        await restoreFromRecycledEmployee({ tenantDomain, id }).unwrap();
        swal({
          title: "Restored!",
          text: "Employee has been restored successfully.",
          icon: "success",
          button: "OK",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "An error occurred while restoring the card.",
          icon: "error",
          button: "OK",
        });
      }
    } else if (result === "delete") {
      try {
        await permenantlyDeleteEmployee(id).unwrap();
        swal({
          title: "Deleted!",
          text: "Employee has been permanently deleted.",
          icon: "error",
          button: "OK",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: "An error occurred while deleting the card.",
          icon: "error",
          button: "OK",
        });
      }
    }
  };
  const handleAllEmployee = () => {
    setFilterType("");
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  };

  if (employeesError) {
    toast.error(employeesError?.data?.message);
  }

  const recyclebinEmployeeList = employeeData?.data?.employees.filter(
    (employee) => employee.isRecycled === true
  );

  return (
    <div className="w-full mt-5 mb-24">
      <div className="flex justify-end pb-3 border-b-2">
        <div className="flex items-end justify-end">
          <NotificationAdd size={30} className="mr-2" />
          <FaUserGear size={30} />
        </div>
      </div>
      <div className="block md:flex items-center justify-between my-3 mb-8">
        <div className="flex items-center justify-center ">
          <FaUsers size={70} className="invoicIcon" />
          <div className="ml-2">
            <h3 className="text-2xl font-bold"> Employee </h3>
            <span> Manage Employees </span>
          </div>
        </div>
        <div className="productHome">
          <span> Home / </span> <span> Employee / </span>
          <span> Employee List </span>
        </div>
      </div>
      <div className="w-full mt-5 mb-24">
        <div className="flex flex-wrap items-center justify-between mb-5">
          <h3 className="txt-center tet-sm ml- sm:ml-0 ont-bold md:text-3xl">
            Employee List
          </h3>
          <div className="flex flex-wrap items-center">
            <button
              onClick={handleAllEmployee}
              className="bg-[#42A1DA] text-white px-4 py-2 rounded-md mr-1"
            >
              All
            </button>
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
                          onClick={() => handleDeleteOrRestore(employee._id)}
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

export default RecycledbinEmployeeList;
