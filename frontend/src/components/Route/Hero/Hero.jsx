import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";

const Hero = () => {
  const { sellers } = useSelector((state) => state.seller);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === '') {
      setSearchData(null); // Reset search data when search term is empty
    } else {
      const filteredSuppliers =
        sellers &&
        sellers.filter((seller) =>
          seller.name.toLowerCase().includes(term.toLowerCase())
        );
      setSearchData(filteredSuppliers);
    }
  };
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          // "url(https://plus.unsplash.com/premium_photo-1682129768936-c5b7c3033cdc?auto=format&fit=crop&q=80&w=2532&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[30px] leading-[1.2] 800px:text-[60px] text-[#fff] font-[600] capitalize flex text-center`}
        >
         Access Genuine Wholesale  <br/> Suppliers in Nairobi - Kenya & Beyond
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[800] text-white flex text-center justify-center">
          Search and find your best supplier
        </p>
        <div className="w-[100%] relative mt-3 justify-items-center">
            <input
              type="text"
              placeholder="Type and click the search icon"
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#f67009] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute w-full min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/shop/preview/${i._id}`}>
                        <div className="w-full flex items-start-py-3 mb-2">
                          <img
                            src={`${i.avatar?.url}`}
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
      </div>
    </div>
  );
};

export default Hero;
