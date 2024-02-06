import React, { useState } from "react";
// import { AiOutlineGift } from "react-icons/ai";
// import { MdOutlineLocalOffer } from "react-icons/md";
// import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { BiMessageSquareDetail } from "react-icons/bi";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import logo from "../../../Assests/img/logo.png";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = () => {
    axios
      .get(`${server}/shop/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img src={logo} alt="" className="h-[60px] w-[200px]" />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
        <div className="relative group">
                  <div className="flex items-center">
                    <button
                      onClick={() => setOpen(!open)}
                      className="mr-2 bg-transparent border-none cursor-pointer flex items-center"
                    >
                      <span className="text-[#f67009] text-sm font-semibold group-hover:underline">
                        {seller.name}
                      </span>
                      <IoIosArrowDown
                        size={20}
                        className="ml-1 text-black"
                      />
                    </button>
                  </div>
                  {/* Dropdown for profile actions */}
                  {open && (
                    <div className="absolute top-10 right-0 bg-white border border-gray-200 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-gray-800">
                        Profile
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="block px-4 py-2 text-gray-800 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
