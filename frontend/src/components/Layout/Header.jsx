import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {AiOutlineSearch} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import logo  from "../../Assests/img/logo.png";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };


  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === '') {
      setSearchData(null); // Reset search data when search term is empty
    } else {
      const filteredProducts =
        allProducts &&
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        );
      setSearchData(filteredProducts);
    }
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img src={logo} alt="" className="h-[60px] w-[200px]" />
            </Link>
          </div>
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#f67009] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`} key={index}>
                        <div className="w-full flex items-start-py-3">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div className={`${styles.button}`}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Supplier Dash" : "Become Supplier"}{" "}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#f67009] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              {/* Placeholder for other icons or buttons */}
            </div>
            <div className={`${styles.noramlFlex}`}>
              {/* Placeholder for other icons or buttons */}
            </div>
            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
              {isAuthenticated ? (
                <div className="relative group">
                  <div className="flex items-center">
                    <button
                      onClick={() => setOpen(!open)}
                      className="mr-2 bg-transparent border-none cursor-pointer flex items-center"
                    >
                      {/* Placeholder for user avatar if needed */}
                      <span className="text-white text-sm font-semibold group-hover:underline">
                        {user.name}
                      </span>
                      <IoIosArrowDown
                        size={20}
                        className="ml-1 text-white"
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
            ) : (
              <>
                <Link to="/login" className="text-white">
                  <button className="bg-black text-white px-3 py-1 rounded">
                    Login
                  </button>
                </Link>
                <Link to="/sign-up" className="text-white">
                  <button className="border border-white px-3 py-1 rounded ml-2">
                    Sign up
                  </button>
                </Link>
              </>
            )}
          </div>
      </div>
            </div>
          </div>
        </div>
      {/* </div> */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(!open)}
            />
          </div>
          <div>
            <Link to="/">
              <img src={logo} alt="" className="h-[60px] w-[200px]" />
            </Link>
          </div>
          <div>
            {/* Placeholder for other icons or buttons */}
          </div>
          {open && (
            <div className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}>
              <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
                <div className="w-full justify-between flex pr-3">
                  <RxCross1
                    size={30}
                    className="ml-4 mt-5"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <div className="my-8 w-[92%] m-auto h-[40px relative]">
                  <input
                    type="search"
                    placeholder="Search Product..."
                    className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  {searchData && (
                    <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                      {searchData.map((i) => {
                        const d = i.name;
                        const Product_name = d.replace(/\s+/g, "-");
                        return (
                          <Link to={`/product/${Product_name}`} key={i._id}>
                            <div className="flex items-center">
                              <img
                                src={i.image_Url[0]?.url}
                                alt=""
                                className="w-[50px] mr-2"
                              />
                              <h5>{i.name}</h5>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
                <Navbar active={activeHeading} />
                <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                  <Link to="/shop-create">
                    <h1 className="text-[#fff] flex items-center">
                      Become Wholesaler <IoIosArrowForward className="ml-1" />
                    </h1>
                  </Link>
                </div>
                <br />
                <br />
                <br />
                <div className="flex w-full justify-center">
                  {isAuthenticated ? (
                    <div>
                      <Link to="/profile">
                        <img
                          src={`${user.avatar?.url}`}
                          alt=""
                          className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                        />
                      </Link>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-[18px] pr-[10px] text-[#000000b7]"
                      >
                        Login /
                      </Link>
                      <Link
                        to="/sign-up"
                        className="text-[18px] text-[#000000b7]"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
