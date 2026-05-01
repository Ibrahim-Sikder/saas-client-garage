/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllUserQuery } from "../../redux/api/userApi";
import Loading from "../Loading/Loading";
import { useTenantLogoutMutation } from "../../redux/api/authApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../redux/feature/authSlice";
import { LogOut, Settings, User, X } from "lucide-react";

const UserProfile = ({ tenantDomain }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetAllUserQuery({ tenantDomain });
  const [tenantLogout] = useTenantLogoutMutation()

  const handleLogout = async () => {
    try {
      const res = await tenantLogout().unwrap();
      dispatch(logout());
      if (res.success) {
        toast.success("Logged out successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile button */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none p-2 md:p-[6px] lg:p-1 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300"
        onClick={toggleDropdown}
      >
        <img
          src={data?.data[0]?.image || "/images/user.jpg"}
          alt="User"
          className="w-5 xl:w-8 h-5 xl:h-8 rounded-full border-2 border-white shadow-sm"
        />
        <div className="text-white font-medium hidden md:flex items-center">
          <span>Admin</span>
          <HiOutlineChevronDown 
            size={20} 
            className={`ml-1 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Desktop Dropdown */}
      {dropdownOpen && !isMobile && (
        <div className="absolute right-0 mt-2 z-50 w-[250px] origin-top-right rounded-xl shadow-2xl bg-white/95 backdrop-blur-lg border border-white/30 transition-all animate-fade-in">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <img
                src={data?.data[0]?.image || "/images/user.jpg"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-2">
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">My Profile</p>
                  <p className="text-xs text-gray-500">View your profile</p>
                </div>
              </Link>
              
              <Link
                to="/dashboard/profile-update"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                  <Settings size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Update Info</p>
                  <p className="text-xs text-gray-500">Edit your details</p>
                </div>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100 w-full text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                  <LogOut size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-xs text-red-500">Sign out from account</p>
                </div>
              </button>
            </div>
        </div>
      )}

      {/* Mobile Modal */}
      {dropdownOpen && isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in"
            ref={dropdownRef}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={data?.data[0]?.image || "/images/user.jpg"}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-blue-200 shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-800">Admin</p>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>
              <button
                onClick={() => setDropdownOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Menu Items */}
            <div className="p-4 space-y-2">
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">My Profile</p>
                  <p className="text-xs text-gray-500">View your profile</p>
                </div>
              </Link>
              
              <Link
                to="/dashboard/profile-update"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                  <Settings size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Update Info</p>
                  <p className="text-xs text-gray-500">Edit your details</p>
                </div>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100 w-full text-left"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg">
                  <LogOut size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-xs text-red-500">Sign out from account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;